import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'

const mobilePayDTO = t.Object({
    file: t.File(),
    reference: t.String(),
    phone: t.String()
})

const PaymentModel = new Elysia()
    .model({
        'payment.mobilePay': mobilePayDTO
    })

export const PaymentController = new Elysia({ prefix: '/payment' })
    .use(jwt({
        secret: env.JWT_SECRET
    }))
    .get("/", () => "Payment")
    .use(PaymentModel)
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
        (app) => app.post('/report', ({ body }) => {
            const { file, reference, phone } = body

            return {
                "file": `${Date.now()}-${file.name}`,
                "reference": reference,
                "phone": phone
            }
        }, {
            body: 'payment.mobilePay'
        })
    )