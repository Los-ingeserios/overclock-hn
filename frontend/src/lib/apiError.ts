import { isAxiosError } from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractFirstMessage(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) {
		return value;
	}

	if (Array.isArray(value) && value.length > 0) {
		return extractFirstMessage(value[0]);
	}

	return null;
}

export function parseApiError(err: unknown, fallback: string): string {
	if (!isAxiosError(err)) return err instanceof Error && err.message ? err.message : fallback;

	const data: unknown = err.response?.data;

	if (!isRecord(data)) return fallback;

	if (typeof data.detail === "string" && data.detail.trim().length > 0) return data.detail;

	for (const [field, rawMessage] of Object.entries(data)) {
		const firstMsg = extractFirstMessage(rawMessage);
		if (firstMsg) return `${field}: ${firstMsg}`;
	}

	return fallback;
}
