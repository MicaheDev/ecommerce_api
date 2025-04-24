import Elysia, { t } from "elysia";
import { ReportDTO } from "./report.model";

new Elysia()
    .post("/report", ({ body }) => {

        const { file, reference, phone } = body

        return {
            "file": `${Date.now}-${file.name}`,
            "reference": reference,
            "phone": phone
        }
    }, {
        body: ReportDTO
    })
