import Elysia from "elysia";

export const reportRoutes = (app:Elysia) => 
    app.group("/payment", (app) => 
    app
.get("/", () => "Hellow"))