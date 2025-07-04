'use client';

import { signOut } from 'next-auth/react';

export function signOutButton() {
    const handlesignOut = async () => {
        await signOut({ callbackUrl: '/auth/signin'});
    };

    return <button onClick={handlesignOut}>Sair</button>;
}

