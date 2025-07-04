const env = process.env;

export const config = {
    nextUrl: env.NEXTAUTH_URL,
    nextSecret: env.NEXTAUTH_SECRET,
};