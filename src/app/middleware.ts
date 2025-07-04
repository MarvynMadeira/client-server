import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/auth/signin',
    },     
});

export const config = {
    matcher: [
        '/protected/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],       
};