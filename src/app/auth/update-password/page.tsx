'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));


            const token = params.get('access_token') || hashParams.get('access_token');
            const rToken = params.get('refresh_token') || hashParams.get('refresh_token');

            if (token && rToken) {
                setAccessToken(token);
                setRefreshToken(rToken);

            } else {
                toast.error('Não há tokens na URL')
            }
        }
    }, []);

    async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        
        if(newPassword.length < 6) {
            toast.error('A senha precisa conter mais de 6 caracteres');
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('senha não corresponde');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: newPassword,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }),
            });

            const result = await res.json();
            if (result.error) {
                toast.error(result.error);

            } else {
                toast.success('Senha redefinida com sucesso!');
                router.push('/auth/signin');
            }
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            toast.error('Um erro inesperado ocorreu.');

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
            <form onSubmit={handleUpdatePassword}>
            <h2>Atualizar senha</h2>
            <label htmlFor='newPassword'>Nova Senha</label>
            <input
                id='newPassword'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                />
            <label htmlFor='confirmPassword'>Confirmar senha</label>
            <input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
                <button type='submit' disabled={isSubmitting}>{isSubmitting? 'Atualizando...' : 'Atualizar senha'}</button>
            </form>
        )
};