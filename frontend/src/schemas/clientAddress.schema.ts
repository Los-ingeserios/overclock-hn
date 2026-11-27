import { z } from "zod";

export const clientAddressSchema = z.object({
  id_cliente: z
    .string()
    .min(1, "Debes seleccionar un cliente")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Cliente inválido")
    .transform(Number),

  id_direccion: z
    .string()
    .min(1, "Debes seleccionar una dirección")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, "Dirección inválida")
    .transform(Number),

  predeterminada: z.boolean().default(false),
});

export type ClientAddressFormInput = z.input<typeof clientAddressSchema>;
export type ClientAddressPayload = z.output<typeof clientAddressSchema>;