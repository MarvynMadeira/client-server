'use client';

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
                mode: 'signup',
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
            <h2>Crie sua conta no Meu Vigia</h2>
            <input
                type='email'
                placeholder='Escreva seu melhor e-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type='password'
                placeholder='Crie uma senha'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type='submit'>Inscreva-se</button>
                <p className='user-exists'>Já possui conta?<a href='http://localhost:3000/auth/signin'>Clique aqui!</a></p>      
        </form>
    )
}
