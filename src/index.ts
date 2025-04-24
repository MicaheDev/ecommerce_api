import { Elysia } from "elysia";
import { PaymentController } from "./payments/payment";
import { UserController } from "./user/user";
import { ProductController } from "./products/product";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { jwt } from '@elysiajs/jwt'
import { env } from './config/env'

const app = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET
    })
  )
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .use(UserController)
  .use(ProductController)
  .use(PaymentController)
  .use(cors({
    origin: true
  }))
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
