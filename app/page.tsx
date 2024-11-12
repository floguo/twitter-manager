import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import SignInButton from './components/SignInButton';
import FollowingList from './components/FollowingList';

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <main className="p-4">
      {!session ? (
        <SignInButton />
      ) : (
        <FollowingList />
      )}
    </main>
  );
} 