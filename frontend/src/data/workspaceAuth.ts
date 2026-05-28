import { User } from '../lib/api';

export const WORKSPACE_EMAIL = 'admin@adops.test';
export const WORKSPACE_PASSWORD = 'adops123!';
export const WORKSPACE_TOKEN = 'workspace-session-user_admin';

export const workspaceUsers: User[] = [
  {
    id: 'user_admin',
    name: 'Shailesh Kumar',
    email: WORKSPACE_EMAIL,
    role: 'Workspace Admin',
    status: 'Active',
    lastActive: 'Today',
    projectAccess: ['Crystal Hues PPC', 'Ecommerce Growth', 'Lead Gen Test'],
  },
  {
    id: 'user_media_buyer',
    name: 'Aarav Mehta',
    email: 'buyer@adops.test',
    role: 'Media Buyer',
    status: 'Active',
    lastActive: 'Yesterday',
    projectAccess: ['Crystal Hues PPC', 'Ecommerce Growth'],
  },
  {
    id: 'user_analyst',
    name: 'Nisha Rao',
    email: 'analyst@adops.test',
    role: 'Analyst',
    status: 'Invited',
    lastActive: 'Invitation pending',
    projectAccess: ['Crystal Hues PPC'],
  },
];

export const workspaceCurrentUser = workspaceUsers[0];
