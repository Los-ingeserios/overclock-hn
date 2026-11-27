import { z } from "zod";
export const countrySchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre del país debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),
    estado: z.boolean().default(true),
});
export type CountryFormInput = z.input<typeof countrySchema>;
export type CountryPayload = z.output<typeof countrySchema>;
