import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'
import { sql } from 'bun'

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

// Crear la tabla de usuarios si no existe
await sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`

export const UserController = new Elysia({ prefix: '/auth' })
    .use(jwt({
        secret: env.JWT_SECRET
    }))
    .use(AuthModel)
    .post('/sign-in', async ({ body, jwt, cookie: { auth }, set }) => {
        const { username, password } = body
        
        // Buscar usuario por username o email
        const user = await sql`
            SELECT * FROM users 
            WHERE username = ${username} OR email = ${username}
        `

        if (!user || user.length === 0 || user[0].password !== password) {
            set.status = 401
            throw new Error('Credenciales inválidas')
        }

        // Generamos el token JWT
        const token = await jwt.sign({
            username: user[0].username,
            email: user[0].email
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
        const existingUser = await sql`
            SELECT * FROM users 
            WHERE username = ${username} OR email = ${email}
        `

        if (existingUser && existingUser.length > 0) {
            set.status = 400
            throw new Error('El usuario o email ya existe')
        }

        // En producción, deberías hashear la contraseña
        await sql`
            INSERT INTO users (username, email, password)
            VALUES (${username}, ${email}, ${password})
        `

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

        // Obtener información actualizada del usuario
        const user = await sql`
            SELECT id, username, email, created_at 
            FROM users 
            WHERE username = ${profile.username}
        `

        if (!user || user.length === 0) {
            set.status = 404
            throw new Error('Usuario no encontrado')
        }

        return user[0]
    })
    .post('/sign-out', ({ cookie: { auth } }) => {
        auth.remove()
        return { message: 'Sesión cerrada exitosamente' }
    })