import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider  from 'next-auth/providers/credentials';
import { config } from '@/utils/env';
import { supabase } from '@/utils/supabase';

interface CustomUser {
    id: string;
    email: string;
}

interface CustomSession {
    user: {
        id: string;
        email: string;
    };
    expires: string;
}

const authHandlers = {
    async handleSignup(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${config.nextUrl}`,
            },
        });

        if (error) {
            console.error('[AUTH] Signup error:', error);
            throw new Error(error.message);
        }

        if(!data.user?.id) {
            throw new Error(
                'Confirme seu cadastro pelo email'
            );
        }

        return data.user;
    },

    async handleSignIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('[AUTH] Erro ao entrar...', error);
            throw new Error(error.message);
        }

        if(!data.user?.id) {
            throw new Error('Credenciais inválidas!');
        }

        return data.user;
    }

    //async handleResetPassword(email: string) {},
};

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60,
        updateAge: 30 * 60,
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {label: 'Email', type: "email", placeholder: 'Entre com o seu email'},
                password: {label: 'Password', type: 'password', placeholder: 'Entre com a sua senha'},
                mode: {label: 'Mode', type: 'text', placeholder: 'Entre, faça login ou crie uma nova a senha'},
            },

            async authorize(credentials): Promise<CustomUser | null> {
                try {

                    if(!credentials) {
                        throw new Error('Credenciais não fornecidas!');
                    }
                    const { email, password, mode } = credentials;
                    const lowerMode = mode?.toLowerCase();

                    if(!email || !password) {
                        throw new Error('email e senha são obrigatórios!');
                    }
                    const user = 
                    lowerMode === 'signup'
                        ? await authHandlers.handleSignup(email, password)
                        : await authHandlers.handleSignIn(email, password);

                    return {
                        id: user.id,
                        email: user.email ?? email,
                    };
                } catch(error) {
                    console.error('[AUTH] erro de autorização:', {
                        error,
                        email: credentials?.email,
                        mode: credentials?.mode,
                        timestamp: new Date().toISOString(),
                    });
                    throw error;
                }  
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.userId = user.id;
                token.email = user.email;
                token.lastUpdated = new Date().toISOString();
            }
            return token;
        },
        async session({ session, token }): Promise<CustomSession> {
            return {
                ...session,
                user: {
                    id: token.userId as string,
                    email: token.email as string,
                },
            };
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error'
    },
    events: {
        async signIn({ user }) {
            console.log('[AUTH] Sucesso ao entrar:', {
                userId: user.id,
                email: user.email,
                timestamp: new Date().toISOString(),
            });
        },
        async signOut({ token }) {
            if (token?.userId) {
                await supabase.auth.signOut();
            }
        },
    },
    secret: config.nextSecret,
    debug: process.env.NODE_ENV === 'development',

};


const handler = async (req: Request, res: Response) => {
    try {
        return await NextAuth(authOptions)(req, res);

    } catch(error) {
        console.error('[AUTH] Erro inesperado:', error);
        throw error;
    }
};

export const GET = handler;
export const POST = handler;