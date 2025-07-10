import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(request: Request) {
    try {
        const {password, access_token, refresh_token} = await request.json();

        if(!password || password.trim().length < 6) {
            return NextResponse.json(
                {error: 'A senha precisa conter mais de 6 caracteres.'},
                { status: 400 }
            );
        }

        if(!access_token || !refresh_token) {
            return NextResponse.json(
                 {error: 'Token não existe.'},
                { status: 401 }
            );
        }

        const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });

        if(sessionError) {
            console.error('[API] setSession erro:', sessionError);
            return NextResponse.json(
                {error: 'Sessão inválida. Por favor, solicite um novo link de redefinição.'},
                { status: 401 }
            );
        }

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if(error) {
            console.error('[API] updateUser erro:', error);
            return NextResponse.json(
                {error: error.message},
                { status: 500 });
        }

        return NextResponse.json({ success: true});
    } catch(err) {
        console.error('Erro em update-password API:', err);
        return NextResponse.json(
            {error: 'Um erro inesperado ocorreu...'},
            { status: 500 }
        );
    }
};
