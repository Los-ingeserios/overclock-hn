import type { ParsedSpecification, Specification } from "../types/specification";

export const FALLBACK_PRODUCT_IMAGE = "https://placehold.co/400x400/2e2e3e/7270ec?text=Overclock+HN";

export function getProductImage(url?: string | null): string {
	return url?.trim() ? url : FALLBACK_PRODUCT_IMAGE;
}

export function formatLempira(value: string | number): string {
	const amount = Number(value);
	const safe = Number.isFinite(amount) ? amount : 0;
	return `L. ${safe.toLocaleString("es-HN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

export function parseSpecification(spec: Specification): ParsedSpecification {
	const raw = spec.especificacion.trim();
	const colonIdx = raw.indexOf(":");

	if (colonIdx > 0 && colonIdx < raw.length - 1) {
		return {
			id: spec.id_especificacion,
			raw,
			label: raw.slice(0, colonIdx).trim(),
			value: raw.slice(colonIdx + 1).trim(),
		};
	}

	return { id: spec.id_especificacion, raw, label: null, value: raw };
}

export function formatClientName(client: {
	primer_nombre: string;
	segundo_nombre?: string | null;
	primer_apellido: string;
	segundo_apellido?: string | null;
}): string {
	return [client.primer_nombre, client.segundo_nombre, client.primer_apellido, client.segundo_apellido]
		.filter(Boolean)
		.join(" ");
}
