import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ButtonLogout from '~/components/ButtonLogout';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name ?? 'visitor'}!</p>
      <ButtonLogout />
    </div>
  );
}
