import { z } from "zod";

export const brandSchema = z.object({
        id_pais: z
                .string()
                .min(1, "Debes seleccionar un país de origen")
                .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "País inválido")
                .transform(Number),
        nombre: z
                .string()
                .trim()
                .min(2, "El nombre de la marca debe tener al menos 2 caracteres")
                .max(100, "El nombre no puede superar los 100 caracteres"),
});

export type BrandFormInput = z.input<typeof brandSchema>;
export type BrandPayload = z.output<typeof brandSchema>;