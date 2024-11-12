import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_OAUTH_CLIENT_ID!,
      clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  debug: true,
})

console.log('TWITTER_OAUTH_CLIENT_ID:', process.env.TWITTER_OAUTH_CLIENT_ID);
console.log('TWITTER_OAUTH_CLIENT_SECRET:', process.env.TWITTER_OAUTH_CLIENT_SECRET);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

export { handler as GET, handler as POST }

export const authOptions = {
  // your auth configuration
}; 