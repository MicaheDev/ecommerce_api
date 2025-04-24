import { Elysia, t } from 'elysia'
import { authMiddleware } from '../middleware/auth'

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
    .use(authMiddleware)
    .use(PaymentModel)
    .get("/", () => "Payment")
    .post('/report', ({ body }) => {

        const {file, reference, phone} = body

        return {
            "file": `${Date.now()}-${file.name}`,
            "reference": reference,
            "phone": phone
        }
    }, {
        body: 'payment.mobilePay'
    })