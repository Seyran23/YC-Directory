import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { User, Profile, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

declare module "next-auth" {
  interface Session {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      profile,
    }: {
      user:
        | User
        | {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
          };
      account: Account | null;
      profile?: Profile & { id?: string; login?: string; bio?: string };
    }) {
      if (!profile?.id) return false;

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile.id,
        });

      if (!existingUser) {
        if (!user.name || !user.email) return false;

        await writeClient.create({
          _type: "author",
          id: profile.id,
          name: user.name,
          username: profile.login || "",
          email: user.email,
          image: user.image || "",
          bio: profile?.bio || "",
        });
      }
      return true;
    },
    async jwt({
      token,
      profile,
      account,
    }: {
      token: JWT;
      account: Account | null;
      profile?: Profile & { id?: string };
    }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile.id,
          });

          if (user) {

            token.id = user?._id;
          }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: { id?: string };
      token: JWT;
    }) {
      Object.assign(session, { id: token.id });

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
