import { z } from "zod";

export const departmentSchema = z.object({
        id_pais: z
                .string()
                .min(1, "Debes seleccionar un país")
                .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "País inválido")
                .transform(Number),
        nombre: z
                .string()
                .trim()
                .min(2, "El nombre del departamento debe tener al menos 2 caracteres")
                .max(100, "El nombre no puede superar los 100 caracteres"),
        estado: z.boolean().default(true),
});


export type DepartmentFormInput = z.input<typeof departmentSchema>;
export type DepartmentPayload = z.output<typeof departmentSchema>;