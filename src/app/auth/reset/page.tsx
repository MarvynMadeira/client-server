'use client';

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleReset(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(!email.includes('@')) {
            toast.error('Digite um email válido');
            return;
        }
        
        setIsSubmitting(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'http://localhost:3000/auth/update-password',

            });

            if(error) {
                toast.error(error.message);

            } else {
                toast.success('Cheque o seu email para redefinir a senha');
                router.push('/');
            }
        } catch(e) {
            console.error('Erro ao redefinir senha:', e);
            toast.error('Um erro inesperado ocorreu!');

        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <form onSubmit={handleReset}>
            <h2>Redefinir senha</h2>
            <label htmlFor='email'>Email</label>
            <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <button type='submit' disabled={isSubmitting}>{isSubmitting? 'Enviando...' : 'Enviar link de redefinição'}</button>
            </form>
    )
};