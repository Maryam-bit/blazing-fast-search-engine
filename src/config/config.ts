import dotenv from 'dotenv';
dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER || "user123",
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE_DEVELOPMENT || "db123",
        dialect: 'postgres'
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
}
