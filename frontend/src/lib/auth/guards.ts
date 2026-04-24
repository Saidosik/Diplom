import 'server-only';

import { redirect } from 'next/navigation';
import { getServerUser } from './server-user';

export async function requireUser() {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth?mode=login');
  }

  return user;
}

export async function redirectIfAuthenticated(to = '/me') {
  const user = await getServerUser();

  if (user) {
    redirect(to);
  }

  return null;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user.meta?.isAdmin) {
    redirect('/me');
  }

  return user;
}