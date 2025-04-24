import { Elysia } from 'elysia'

const requiredEnvVars = [
    'JWT_SECRET',
    'PORT',
    'NODE_ENV'
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
        NODE_ENV: process.env.NODE_ENV!
    } as EnvVars
}

export const env = validateEnv() 