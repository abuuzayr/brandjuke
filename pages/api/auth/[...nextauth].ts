import NextAuth, { NextAuthOptions } from "next-auth";
import { D1Adapter } from "@auth/d1-adapter"
import GoogleProvider from "next-auth/providers/google";

export const runtime = "edge";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: D1Adapter(process.env.db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
