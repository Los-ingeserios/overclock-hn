import { z } from "zod";

const requiredPositiveInt = (label: string) =>
	z
		.string()
		.min(1, `Debes seleccionar ${label}`)
		.refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, `${label} inválido`)
		.transform(Number);

const nonNegativeDecimal = (label: string, allowZero = false) =>
	z
		.string()
		.trim()
		.min(1, `${label} es obligatorio`)
		.refine(
			(val) => {
				const n = Number(val);
				return Number.isFinite(n) && (allowZero ? n >= 0 : n > 0);
			},
			allowZero ? `${label} debe ser mayor o igual a 0` : `${label} debe ser mayor a 0`,
		)
		.transform(Number);

export const productSchema = z
	.object({
		id_categoria: requiredPositiveInt("una categoría"),
		id_marca: requiredPositiveInt("una marca"),
		codigo_sku: z
			.string()
			.trim()
			.min(2, "El SKU debe tener al menos 2 caracteres")
			.max(8, "El SKU no puede superar los 8 caracteres"),
		numero_lote: z
			.string()
			.trim()
			.min(2, "El número de lote debe tener al menos 2 caracteres")
			.max(20, "El número de lote no puede superar los 20 caracteres"),
		modelo: z
			.string()
			.trim()
			.min(2, "El modelo debe tener al menos 2 caracteres")
			.max(100, "El modelo no puede superar los 100 caracteres"),
		descripcion: z
			.string()
			.trim()
			.max(200, "La descripción no puede superar los 200 caracteres")
			.nullable()
			.optional()
			.transform((val) => val ?? ""),
		precio_costo: nonNegativeDecimal("El precio de costo", true),
		precio_venta: nonNegativeDecimal("El precio de venta", false),
		stock: z
			.string()
			.trim()
			.min(1, "El stock es obligatorio")
			.refine(
				(val) => Number.isInteger(Number(val)) && Number(val) >= 0,
				"El stock debe ser un entero mayor o igual a 0",
			)
			.transform(Number),
		url_img: z
			.string()
			.trim()
			.max(500, "La URL no puede superar los 500 caracteres")
			.nullable()
			.optional()
			.transform((val) => (val && val.length > 0 ? val : null)),
		estado: z.boolean(),
	})
	.refine((data) => data.precio_venta >= data.precio_costo, {
		message: "El precio de venta no puede ser menor al precio de costo",
		path: ["precio_venta"],
	});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductPayload = z.output<typeof productSchema>;
