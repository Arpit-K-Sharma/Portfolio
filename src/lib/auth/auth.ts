import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Extend the session type to include the Google sub ID
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            sub: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            isAdmin: boolean;
        };
    }
}

export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // On first sign in, store the Google sub ID
            if (account && profile?.sub) {
                token.sub = profile.sub;
            }
            return token;
        },
        async session({ session, token }) {
            // Add sub ID and admin status to session
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.sub = token.sub as string;
                // Check if user is admin by comparing sub ID
                session.user.isAdmin = token.sub === process.env.ADMIN_GOOGLE_SUB;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    // Secret admin path - only you know this
    // Admin routes are at /shadow/admin/*
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
