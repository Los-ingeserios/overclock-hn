import { z } from "zod";

export const brandSchema = z.object({
    nombre: z
            .string()
            .trim()
            .min(2, "El nombre de la marca debe tener al menos 2 caracteres")
            .max(100, "El nombre no puede exceder los 100 caracteres"),
    id_pais: z
            .number({ message: "Debe seleccionar un país de origen" })
            .min(1, "Debe seleccionar un país de origen"),
});

export type BrandFormValues = z.infer<typeof brandSchema>;