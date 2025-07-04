'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleReset(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                mode: 'resetpassword',
            });

            if(result?.error) {
                toast.error(result.error);

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
    //UI component....
}