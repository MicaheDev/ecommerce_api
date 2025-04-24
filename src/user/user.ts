import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'

const SignInDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const SignUpDTO = t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
})

const AuthModel = new Elysia()
    .model({
        'auth.sign': SignInDTO,
        'auth.register': SignUpDTO
    })

const models = AuthModel.models

// Simulamos una base de datos de usuarios (en producción usarías una base de datos real)
const users = new Map()

export const UserController = new Elysia({ prefix: '/auth' })
    .use(jwt({
        secret: env.JWT_SECRET
    }))
    .use(AuthModel)
    .post('/sign-in', async ({ body, jwt, cookie: { auth }, set }) => {
        const { username, password } = body
        
        // Aquí deberías verificar contra tu base de datos
        const user = users.get(username)
        if (!user || user.password !== password) {
            set.status = 401
            throw new Error('Credenciales inválidas')
        }

        // Generamos el token JWT
        const token = await jwt.sign({
            username: user.username,
            email: user.email
        })

        // Configuramos la cookie
        auth.set({
            value: token,
            httpOnly: true,
            maxAge: 7 * 86400, // 7 días
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        return { message: 'Inicio de sesión exitoso' }
    }, {
        body: 'auth.sign'
    })
    .post('/sign-up', async ({ body, set }) => {
        const { username, email, password } = body

        // Verificar si el usuario ya existe
        if (users.has(username)) {
            set.status = 400
            throw new Error('El usuario ya existe')
        }

        // En producción, deberías hashear la contraseña
        users.set(username, { username, email, password })

        return { message: 'Usuario registrado exitosamente' }
    }, {
        body: 'auth.register'
    })
    .get('/profile', async ({ jwt, cookie: { auth }, set }) => {
        const token = auth.value
        if (!token) {
            set.status = 401
            throw new Error('No autorizado')
        }

        const profile = await jwt.verify(token)
        if (!profile) {
            set.status = 401
            throw new Error('Token inválido')
        }

        return profile
    })
    .post('/sign-out', ({ cookie: { auth } }) => {
        auth.remove()
        return { message: 'Sesión cerrada exitosamente' }
    })