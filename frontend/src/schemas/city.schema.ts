import z from "zod";

export const citySchema = z.object({
	id_departamento: z
		.string()
		.min(1, "Debes seleccionar un departamento")
		.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Departamento invalido")
		.transform(Number),
	nombre: z
		.string()
		.trim()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede superar los 100 caracteres"),
	codigo_postal: z.string().trim().length(5, "El código postal debe tener exactamente 5 caracteres"),
	estado: z.boolean(),
});

export type CityFormInput = z.input<typeof citySchema>;
export type CityPayload = z.output<typeof citySchema>;
