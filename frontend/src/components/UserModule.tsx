import { ArrowLeft, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { User } from '../lib/api';

type UserModuleProps = {
  currentUser: User;
  users: User[];
  onBack: () => void;
  onLogout: () => void;
};

export function UserModule({ currentUser, users, onBack, onLogout }: UserModuleProps) {
  return (
    <main className="users-shell">
      <aside className="users-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark-small">
            <Users size={18} />
          </div>
          <div>
            <strong>AdOps Intelligence</strong>
            <span>User module</span>
          </div>
        </div>

        <button className="new-chat-button" onClick={onBack} type="button">
          <ArrowLeft size={17} />
          Back to AI chat
        </button>

        <div className="sidebar-user-card">
          <span>{currentUser.role}</span>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
        </div>

        <button className="sidebar-logout" onClick={onLogout} type="button">
          Logout
        </button>
      </aside>

      <section className="users-main">
        <header className="users-header">
          <div>
            <p>Workspace access</p>
            <h1>User Management</h1>
          </div>
          <button type="button">
            <UserPlus size={16} />
            Invite user
          </button>
        </header>

        <div className="user-summary-grid">
          <article>
            <ShieldCheck size={18} />
            <span>Active users</span>
            <strong>{users.filter((user) => user.status === 'Active').length}</strong>
          </article>
          <article>
            <Users size={18} />
            <span>Workspace roles</span>
            <strong>{new Set(users.map((user) => user.role)).size}</strong>
          </article>
          <article>
            <UserPlus size={18} />
            <span>Pending invites</span>
            <strong>{users.filter((user) => user.status === 'Invited').length}</strong>
          </article>
        </div>

        <section className="users-table-panel" aria-label="Workspace users">
          <div className="users-table-head">
            <div>
              <p>Access control</p>
              <h2>Team members</h2>
            </div>
            <span>{users.length} users</span>
          </div>

          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Project access</th>
                  <th>Last active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <em className={user.status === 'Active' ? 'status-active' : 'status-invited'}>{user.status}</em>
                    </td>
                    <td>
                      {user.projectAccess.length} {user.projectAccess.length === 1 ? 'project' : 'projects'}
                    </td>
                    <td>{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
