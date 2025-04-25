import { Elysia } from 'elysia'

const requiredEnvVars = [
    'JWT_SECRET',
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
] as const

type EnvVars = {
    [K in typeof requiredEnvVars[number]]: string
}

export const validateEnv = () => {
    const missingVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    )

    if (missingVars.length > 0) {
        throw new Error(
            `Faltan las siguientes variables de entorno: ${missingVars.join(', ')}`
        )
    }

    return {
        JWT_SECRET: process.env.JWT_SECRET!,
        PORT: process.env.PORT!,
        NODE_ENV: process.env.NODE_ENV!,
        DATABASE_URL: process.env.DATABASE_URL!,
        DB_HOST: process.env.DB_HOST!,
        DB_PORT: process.env.DB_PORT!,
        DB_NAME: process.env.DB_NAME!,
        DB_USER: process.env.DB_USER!,
        DB_PASSWORD: process.env.DB_PASSWORD!
    } as EnvVars
}

export const env = validateEnv() 