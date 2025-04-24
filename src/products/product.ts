import { Elysia, t } from 'elysia'
import { authMiddleware } from '../middleware/auth'

const customBody = t.Object({
    image_preview: t.File({type: "image/*"}),
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
    .use(authMiddleware)
    .get("/", () => [])
    .use(ProductModel)
    .post('/', ({ body }) => {
        const {image_preview } = body

        const image_name = `${Date.now()}-${image_preview.name}`
        return {...body, "image_preview": image_name}
    }, {
        body: 'product'
    })