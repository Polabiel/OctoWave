"use client";

import { signIn } from 'next-auth/react';

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Fazer Login
      </button>
    </main>
  );
}
