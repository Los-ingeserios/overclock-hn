import { z } from "zod";

export const departmentSchema = z.object({
    id_pais: z
            .number({ message: "Debe seleccionar un pais valido" })
            .min(1, "Debe seleccionar un país"),
    nombre: z
            .string()
            .trim()
            .min(2, "El nombre del departamento debe tener al menos 2 caracteres")
            .max(100, "El nombre no puede exceder los 100 caracteres"),
    estado: z.boolean().default(true),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;