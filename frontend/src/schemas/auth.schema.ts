import { z } from "zod";

export const loginSchema = z.object({
	identificador: z.string().trim().min(3, "Ingrese su usuario o correo electronico"),
	contrasena: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
});

export const registerSchema = z
	.object({
		primer_nombre: z.string().trim().min(2, "Ingresa tu primer nombre"),
		primer_apellido: z.string().trim().min(2, "Ingresa tu primer apellido"),
		nombre_usuario: z
			.string()
			.trim()
			.min(3, "Minimo 3 caracteres")
			.max(30, "Maximo 30 caracteres")
			.regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo"),
		correo: z.string().trim().email("Ingrese un correo valido"),
		rtn: z
			.string()
			.trim()
			.optional()
			.refine((val) => !val || /^\d{14}$/.test(val), "El RTN debe contener exactamente 14 digitos numericos"),
		contrasena: z
			.string()
			.min(8, "Minimo 8 caracteres")
			.regex(/[A-Z]/, "Debe contener almenos una letra Mayuscula")
			.regex(/[0-9]/, "Debe contener almenos un numero"),
		confirmar_contrasena: z.string(),
	})
	.refine((data) => data.contrasena === data.confirmar_contrasena, {
		message: "La contrasenas no coinciden",
		path: ["confirmar_contrasena"],
	});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
