import jwt from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'
import { env } from '../config/env'

const customBody = t.Object({
    image_preview: t.File({ type: "image/*" }),
    title: t.String(),
    price: t.String(),
    stock: t.Number(),
    categories: t.ArrayString()
})

const ProductModel = new Elysia()
    .model({
        'product': customBody
    })

const models = ProductModel.models

export const ProductController = new Elysia({ prefix: '/products' })
    .use(jwt({
        secret: env.JWT_SECRET
    }))
    .get("/", () => [])
    .use(ProductModel)
    .guard(
        {
            beforeHandle: async ({ jwt, cookie: { auth }, set }) => {
                const token = auth.value
                if (!token) {
                    set.status = 401
                    throw new Error('No autorizado - Token no proporcionado')
                }

                const profile = await jwt.verify(token)
                if (!profile) {
                    set.status = 401
                    throw new Error('No autorizado - Token inválido')
                }

            }
        },
        (app) => app.post('/', ({ body }) => {
            const { image_preview } = body

            const image_name = `${Date.now()}-${image_preview.name}`
            return { ...body, "image_preview": image_name }
        }, {
            body: 'product'
        })
    )