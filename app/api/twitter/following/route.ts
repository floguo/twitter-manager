import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/config";
import { NextResponse } from "next/server";

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
}

interface TwitterSession {
  user: {
    id: string;
  };
  accessToken: string;
}

async function fetchTwitterFollowing(session: TwitterSession) {
  const response = await fetch(
    `https://api.twitter.com/2/users/${session.user.id}/following?user.fields=profile_image_url`, 
    {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch following: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data?.data || !Array.isArray(data.data)) {
    console.error('Unexpected API response:', data);
    return [];
  }

  return data.data.map((user: TwitterUser) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    profileImageUrl: user.profile_image_url,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20; // Adjust as needed

  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const following = await fetchTwitterFollowing(session as TwitterSession);
    return NextResponse.json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    );
  }
} 