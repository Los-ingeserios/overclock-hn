export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export interface ApiErrorResponse {
	code?: string;
	detail?: string;
	[field: string]: unknown;
}
