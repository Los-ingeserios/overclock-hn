import { z } from "zod";

const positiveIntField = (label: string) =>
	z
		.string()
		.trim()
		.min(1, `${label} es obligatoria`)
		.refine(
			(val) => Number.isInteger(Number(val)) && Number(val) >= 1,
			`${label} debe ser un número entero mayor o igual a 1`,
		)
		.transform(Number);

export const promotionSchema = z
	.object({
		id_tipo_promocion: z
			.string()
			.min(1, "Debes seleccionar un tipo de promoción")
			.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Tipo de promoción inválido")
			.transform(Number),
		fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
		fecha_vencimiento: z
			.string()
			.trim()
			.nullable()
			.optional()
			.transform((val) => (val && val.length > 0 ? val : null)),
		porcentaje_descuento: z
			.string()
			.trim()
			.min(1, "El porcentaje de descuento es obligatorio")
			.refine((val) => {
				const n = Number(val);
				return Number.isFinite(n) && n > 0 && n <= 100;
			}, "El descuento debe ser mayor a 0 y máximo 100%")
			.transform((val) => Number(Number(val).toFixed(2))),
		cantidad_requerida: positiveIntField("La cantidad requerida"),
		cantidad_beneficio: positiveIntField("La cantidad beneficio"),
		estado: z.boolean(),
	})
	.refine((data) => !data.fecha_vencimiento || data.fecha_vencimiento > data.fecha_inicio, {
		message: "La fecha de vencimiento debe ser posterior a la fecha de inicio",
		path: ["fecha_vencimiento"],
	});

export type PromotionFormInput = z.input<typeof promotionSchema>;
export type PromotionPayload = z.output<typeof promotionSchema>;
