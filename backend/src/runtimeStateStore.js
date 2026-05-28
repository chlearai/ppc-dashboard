import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const RUNTIME_STATE_KEY = 'runtime_state';

function serializeState(state) {
  return JSON.stringify(state, null, 2);
}

function readFileState(filePath) {
  if (!filePath || !existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function normalizeState(value) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return value;
}

async function ensureDbClient(databaseUrl, db) {
  if (db) {
    return db;
  }

  if (!databaseUrl) {
    return null;
  }

  const { Pool } = await import('pg');
  return new Pool({ connectionString: databaseUrl });
}

export function createRuntimeStateStore({ databaseUrl = null, db = null, filePath = null } = {}) {
  let clientPromise = ensureDbClient(databaseUrl, db);
  let schemaReady = false;

  async function getDbClient() {
    return clientPromise;
  }

  async function ensureSchema() {
    const client = await getDbClient();

    if (!client || schemaReady) {
      return;
    }

    await client.query(`
      create table if not exists runtime_state (
        key text primary key,
        state jsonb not null,
        updated_at timestamptz not null default now()
      )
    `);

    schemaReady = true;
  }

  async function load() {
    const client = await getDbClient();

    if (client) {
      await ensureSchema();

      const result = await client.query('select state from runtime_state where key = $1 limit 1', [
        RUNTIME_STATE_KEY,
      ]);

      if (result.rows[0]?.state) {
        return normalizeState(result.rows[0].state);
      }

      const fallbackState = readFileState(filePath);

      if (fallbackState) {
        await save(fallbackState);
        return fallbackState;
      }

      return null;
    }

    return readFileState(filePath);
  }

  async function save(state) {
    const client = await getDbClient();

    if (client) {
      await ensureSchema();
      await client.query(
        'insert into runtime_state (key, state, updated_at) values ($1, $2::jsonb, now()) on conflict (key) do update set state = excluded.state, updated_at = now()',
        [RUNTIME_STATE_KEY, JSON.stringify(state)],
      );
      return state;
    }

    if (filePath) {
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, serializeState(state));
    }

    return state;
  }

  async function close() {
    const client = await clientPromise;

    if (client?.end) {
      await client.end();
    }
  }

  return {
    ensureSchema,
    load,
    save,
    close,
  };
}
