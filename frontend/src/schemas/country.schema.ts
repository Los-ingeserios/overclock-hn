import { z } from "zod";

export const countrySchema = z.object({
    nombre: z
            .string()
            .trim()
            .min(2, "El nombre del pais debe tener al menos 2 caracteres")
            .max(100, "El nombre no puede exceder los 100 caracteres"),
    estado: z.boolean().default(true),
});

export type CountryFormValues = z.infer<typeof countrySchema>;