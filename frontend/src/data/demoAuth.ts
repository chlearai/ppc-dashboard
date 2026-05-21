import { User } from '../lib/api';

export const DEMO_EMAIL = 'admin@adops.test';
export const DEMO_PASSWORD = 'demo123';
export const DEMO_TOKEN = 'demo-session-user_admin';

export const fallbackUsers: User[] = [
  {
    id: 'user_admin',
    name: 'Shailesh Kumar',
    email: DEMO_EMAIL,
    role: 'Workspace Admin',
    status: 'Active',
    lastActive: 'Today',
    projectAccess: ['Crystal Hues PPC', 'Demo Ecommerce', 'Lead Gen Test'],
  },
  {
    id: 'user_media_buyer',
    name: 'Aarav Mehta',
    email: 'buyer@adops.test',
    role: 'Media Buyer',
    status: 'Active',
    lastActive: 'Yesterday',
    projectAccess: ['Crystal Hues PPC', 'Demo Ecommerce'],
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

export const fallbackCurrentUser = fallbackUsers[0];
