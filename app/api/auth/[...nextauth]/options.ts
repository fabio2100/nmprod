import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';
import User from '@/models/User';

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: any) {
            try {
                if (account?.provider === "google") {
                    console.log('Google sign in attempt:', { user, profile });
                    
                    // Buscar usuario existente
                    const existingUser = await User.findOne({ email: user.email });
                    
                    if (!existingUser) {
                        console.log('Creating new user...');
                        // Crear nuevo usuario con googleValidado en true
                        const userData = {
                            email: user.email,
                            nombreCompleto: profile.name,
                            googleValidado: true,
                            // Establecer campos opcionales como undefined
                            celular: undefined,
                            dni: undefined,
                            password: undefined
                        };
                        
                        const newUser = await User.create(userData);
                        console.log('New user created:', newUser);
                    } else {
                        console.log('Existing user found:', user.email);
                    }
                    return true;
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async jwt({ token, user, account }: any) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    userId: user.id,
                };
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.userId;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
};

export default authOptions;
