import z from "zod";

export const specificationSchema = z.object({
	id_producto: z
		.string()
		.min(1, "Debe seleccionar un producto")
		.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Producto invalido")
		.transform(Number),
	especificacion: z
		.string()
		.trim()
		.min(2, "La especificacion debe tener al menos 2 caracteres")
		.max(100, "La especificacion no puede superar los 100 caracteres"),
});

export type SpecificationFromInput = z.input<typeof specificationSchema>;
export type SpecificationPayload = z.output<typeof specificationSchema>;
