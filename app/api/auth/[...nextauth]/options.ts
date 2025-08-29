import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';
import User from '@/models/User';

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    debug: true, // Habilitar logging
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
            profile(profile) {
                console.log('Google profile:', profile); // Log del perfil
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
            console.log('SignIn callback started');
            console.log('User:', user);
            console.log('Account:', account);
            console.log('Profile:', profile);

            if (account?.provider === "google") {
                try {
                    // Verificar si el usuario ya existe
                    const existingUser = await User.findOne({ email: user.email });
                    console.log('Existing user:', existingUser);

                    if (!existingUser) {
                        console.log('Creating new user...');
                        // Crear un nuevo usuario con los datos de Google
                        const newUser = await User.create({
                            email: user.email,
                            nombreCompleto: user.name,
                            // Campos opcionales que podrías querer manejar de otra manera
                            celular: '',
                            dni: '',
                            password: '' // Podrías generar una contraseña aleatoria si es necesario
                        });
                        console.log('New user created:', newUser);
                    }
                    return true;
                } catch (error) {
                    console.error('Error during sign in:', error);
                    return false;
                }
            }
            console.log('SignIn callback completed');
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
