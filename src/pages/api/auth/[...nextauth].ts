import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "@/lib/firebase/service";
import { compare } from "bcrypt";
import NextAuth from "next-auth";

const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			type: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials as {
					email: string;
					password: string;
				};
				const user: any = await signIn(email, password);
				if (user) {
					const passwordConfirm = await compare(password, user.password);
					if (passwordConfirm) {
						return user;
					}
					return null;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, account, profile, user }: any) {
			if (account?.provider === "credentials") {
				token.email = user.email;
				token.fullname = user.fullname;
				token.phone = user.phone;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }: any) {
			if ("email" in token) {
                session.user.email = token.email;
			}
			if ("fullname" in token) {
                session.user.email = token.fullname;
			}
			if ("phone" in token) {
                session.user.email = token.phone;
			}
			if ("role" in token) {
                session.user.email = token.role;
			}

			return session;
		},
	},
    pages: {
        signIn: "/auth/login",
    }
};

export default NextAuth(authOptions);