import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthorizeProps {
    email: string;
    password: string;
}

interface User {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: Record<string, unknown>;
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            id: "credentials",
            credentials: {
                email: {
                    label: "E-mail",
                    type: "email",
                    placeholder: "email@example.com",
                },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                const res = await fetch(`${process.env.API_URL || "http://localhost:8000"}/users/login`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });

                const data = await res.json();
                
                if (data.detail === "Invalid credentials") {
                    return null;
                }  

                const getUser = await fetch(`${process.env.API_URL || "http://localhost:8000"}/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.access_token}`,
                    },
                });

                
                
                const user = await getUser.json();

                if (getUser.ok && data.access_token && user && user.id) {
                    return {
                        accessToken: data.access_token,
                        tokenType: data.token_type,
                        expiresIn: data.expires_in,
                        user: user,
                    };
                }

                return null;  
            },
        } as any),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account && user) {
                token.accessToken = user.accessToken;
                token.expiresIn = Date.now() + user.expiresIn * 1000;
                token.user = user.user;
            }

            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.accessToken = token.accessToken;
                session.user = { ...session.user, ...token.user };

                return session;
            } else {
                return null;
            } 
        },  
    },
    secret: process.env.NEXTAUTH_SECRET || "U2FsdGVkX19wkrl+da4f651v8e4a12xc184da61800vDS1Y=",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };