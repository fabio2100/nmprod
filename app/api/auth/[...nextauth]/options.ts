import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';
import User from '@/models/User';

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    nombreCompleto: profile.name,
                    image: profile.picture,
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Verificar si el usuario ya existe
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        // Crear un nuevo usuario con los datos de Google
                        await User.create({
                            email: user.email,
                            nombreCompleto: user.name,
                            // Campos opcionales que podrías querer manejar de otra manera
                            celular: '',
                            dni: '',
                            password: '' // Podrías generar una contraseña aleatoria si es necesario
                        });
                    }
                } catch (error) {
                    console.error('Error during sign in:', error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, user }) {
            // Añadir datos adicionales a la sesión si es necesario
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
