import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'

export const authMiddleware = new Elysia()
    .use(jwt({
        secret: env.JWT_SECRET
    }))
    .onRequest(async ({ request, jwt, set }) => {
        // Excluir rutas de autenticación
        if (request.url.includes('/auth/sign-in') || request.url.includes('/auth/sign-up') || request.url.includes('/swagger')) {
            return
        }

        const token = request.headers.get('authorization')?.split(' ')[1]
        if (!token) {
            set.status = 401
            throw new Error('No autorizado - Token no proporcionado')
        }

        const profile = await jwt.verify(token)
        if (!profile) {
            set.status = 401
            throw new Error('No autorizado - Token inválido')
        }

        return {
            user: profile
        }
    })