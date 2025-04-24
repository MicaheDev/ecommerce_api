import { Elysia } from "elysia";
import { reportRoutes } from "./reports/report.routes";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(reportRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
