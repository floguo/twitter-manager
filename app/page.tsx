'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import FollowingList from './components/FollowingList';

export default function FollowingPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <FollowingList />;
}