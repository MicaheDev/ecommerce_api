import { t } from "elysia";

export const ReportDTO = t.Object({
  file: t.File({ format: "image/*" }),
  reference: t.String(),
  phone: t.String()
})