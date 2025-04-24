import { z } from "zod";

export const specialtiesCreationSchema = z.object({
    title: z.string({
        required_error: "Title is required"
    })
})