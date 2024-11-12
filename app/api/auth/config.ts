import type { AuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import TwitterProvider from 'next-auth/providers/twitter';

interface ExtendedToken extends JWT {
  accessToken?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession, token: ExtendedToken }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub!;
      return session;
    },
  },
}; 