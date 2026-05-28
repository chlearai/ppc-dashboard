import test from 'node:test';
import assert from 'node:assert/strict';

import { createRuntimeStateStore } from '../src/runtimeStateStore.js';

test('persists and reloads the runtime snapshot through the configured database', async () => {
  const statements = [];
  const stored = new Map();

  const db = {
    async query(text, params = []) {
      statements.push({ text, params });

      if (text.includes('create table if not exists runtime_state')) {
        return { rows: [] };
      }

      if (text.startsWith('select state from runtime_state')) {
        return { rows: stored.has('runtime_state') ? [{ state: stored.get('runtime_state') }] : [] };
      }

      if (text.startsWith('insert into runtime_state')) {
        stored.set('runtime_state', params[1]);
        return { rows: [] };
      }

      throw new Error(`Unexpected query: ${text}`);
    },
  };

  const store = createRuntimeStateStore({ db });
  const nextState = {
    users: [{ id: 'u1', name: 'User 1' }],
    projects: [{ id: 'p1', name: 'Project 1' }],
    chats: [],
    messages: [],
    approvals: [],
    aiAgentBrainStateByProject: { p1: { selectedProvider: 'Claude' } },
    auditLogsByProject: { p1: [{ id: 'audit_1' }] },
    campaignBooksByProject: { p1: [{ id: 'book_1' }] },
  };

  await store.ensureSchema();
  await store.save(nextState);

  const loaded = await store.load();

  assert.deepEqual(loaded, nextState);
  assert.ok(statements.some((statement) => statement.text.includes('create table if not exists runtime_state')));
  assert.ok(statements.some((statement) => statement.text.startsWith('insert into runtime_state')));
});
