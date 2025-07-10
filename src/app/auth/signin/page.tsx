'use client';

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await signIn('credentials', {
                email,
                password,
                mode: 'signin',
                redirect: false,
            });

            if(result?.error) {
                setError(result.error);

            } else {
                router.push('/');
            }
            
        } catch(err) {
            setError('Um erro inesperado ocorreu 😥');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Faça login no Meu Vigia</h2>
            <input
                type='email'
                placeholder='Digite seu e-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type='password'
                placeholder='Digite sua senha'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type='submit'>Entrar</button>
                <a href='http://localhost:3000/auth/reset' className='btn'>Esqueci minha senha</a>
                <p className='user-not-exists'>Não possui conta?<a href='http://localhost:3000/auth/signup'>Clique aqui!</a></p>
        </form>
    )
}
