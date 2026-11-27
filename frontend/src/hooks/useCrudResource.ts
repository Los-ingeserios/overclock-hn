import { useCallback, useEffect, useMemo, useState } from "react";
import { parseApiError } from "../lib/apiError";
import type { CrudService } from "../services/createCrudService";

export interface CrudMessages {
	loadError: string;
	createSuccess: string;
	createError: string;
	updateSuccess: (id: number) => string;
	updateError: string;
	deleteConfirm: (id: number) => string;
	deleteSuccess: (id: number) => string;
	deleteError: string;
}

interface PageData<TItem> {
	items: TItem[];
	totalCount: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

interface UseCrudResourceOptions<TItem, TPayload> {
	service: Pick<CrudService<TItem, TPayload>, "getAll" | "create" | "update" | "remove">;
	filterItem: (item: TItem, query: string) => boolean;
	messages: CrudMessages;
}

async function requestPage<TItem, TPayload>(
	service: Pick<CrudService<TItem, TPayload>, "getAll">,
	targetPage: number,
): Promise<PageData<TItem>> {
	const res = await service.getAll(targetPage);
	return {
		items: res.results,
		totalCount: res.count,
		hasNext: Boolean(res.next),
		hasPrevious: Boolean(res.previous),
	};
}

export function useCrudResource<TItem, TPayload>({
	service,
	filterItem,
	messages,
}: UseCrudResourceOptions<TItem, TPayload>) {
	const [items, setItems] = useState<TItem[]>([]);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	// Paginación DRF
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrevious, setHasPrevious] = useState(false);

	// Estados de red y feedback
	const [loading, setLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const applyPageData = useCallback((data: PageData<TItem>) => {
		setItems(data.items);
		setTotalCount(data.totalCount);
		setHasNext(data.hasNext);
		setHasPrevious(data.hasPrevious);
	}, []);

	const fetchPage = useCallback(
		async (targetPage: number) => {
			setLoading(true);
			setError(null);

			try {
				const data = await requestPage(service, targetPage);
				applyPageData(data);
			} catch (err) {
				setError(parseApiError(err, messages.loadError));
			} finally {
				setLoading(false);
			}
		},
		[service, messages.loadError, applyPageData],
	);

	useEffect(() => {
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoading(true);
				setError(null);
				return requestPage(service, page);
			})
			.then((data) => {
				if (!active || !data) return;
				applyPageData(data);
			})
			.catch((err) => {
				if (!active) return;
				setError(parseApiError(err, messages.loadError));
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, [page, service, messages.loadError, applyPageData]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return items;
		return items.filter((item) => filterItem(item, q));
	}, [items, search, filterItem]);

	const clearMessages = useCallback(() => {
		setError(null);
		setSuccessMsg(null);
	}, []);

	const saveItem = useCallback(
		async (payload: TPayload): Promise<boolean> => {
			clearMessages();

			try {
				if (editingId !== null) {
					await service.update(editingId, payload);
					setSuccessMsg(messages.updateSuccess(editingId));
				} else {
					await service.create(payload);
					setSuccessMsg(messages.createSuccess);
				}

				await fetchPage(page);
				return true;
			} catch (err) {
				setError(parseApiError(err, editingId !== null ? messages.updateError : messages.createError));
				return false;
			}
		},
		[clearMessages, editingId, service, messages, fetchPage, page],
	);

	const deleteItem = useCallback(
		async (id: number, onDeletedEditing?: () => void) => {
			if (!window.confirm(messages.deleteConfirm(id))) return;

			setDeletingId(id);
			clearMessages();

			try {
				await service.remove(id);
				if (editingId === id) {
					setEditingId(null);
					onDeletedEditing?.();
				}
				setSuccessMsg(messages.deleteSuccess(id));

				if (items.length === 1 && page > 1) {
					setPage((p) => p - 1);
				} else {
					await fetchPage(page);
				}
			} catch (err) {
				setError(parseApiError(err, messages.deleteError));
			} finally {
				setDeletingId(null);
			}
		},
		[messages, clearMessages, service, editingId, items.length, page, fetchPage],
	);

	return {
		items,
		filtered,
		totalCount,
		search,
		setSearch,
		editingId,
		setEditingId,
		page,
		setPage,
		hasNext,
		hasPrevious,
		loading,
		deletingId,
		error,
		setError,
		successMsg,
		clearMessages,
		saveItem,
		deleteItem,
		recargar: () => fetchPage(page),
	};
}
