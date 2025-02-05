import { signOut } from 'next-auth/react';

export default async function ButtonLogout() {
  return <button onClick={() => signOut()}>Logout</button>;
}
