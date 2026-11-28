import { useCallback, useEffect, useState } from "react";
import { productDetailService } from "../services/productDetailService";
import { parseApiError } from "../lib/apiError";
import { isAxiosError } from "axios";
import type { ProductDetail } from "../types/products";

export function useProductDetail(rawId: string | undefined) {
	const numericId = Number(rawId);
	const isValidId = Boolean(rawId) && Number.isInteger(numericId) && numericId > 0;

	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(isValidId);
	const [notFound, setNotFound] = useState(!isValidId);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(async (id: number) => {
		setLoading(true);
		setError(null);
		setNotFound(false);

		try {
			const data = await productDetailService.getById(id);
			setProduct(data);
			setQuantity(data.stock > 0 ? 1 : 0);
		} catch (err) {
			if (isAxiosError(err) && err.response?.status === 404) {
				setNotFound(true);
				setProduct(null);
			} else {
				setError(parseApiError(err, "No se pudo cargar la ficha técnica del producto."));
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!isValidId) return;
		let active = true;

		Promise.resolve()
			.then(() => {
				if (!active) return null;
				setLoading(true);
				setError(null);
				setNotFound(false);
				return productDetailService.getById(numericId);
			})
			.then((data) => {
				if (!active || !data) return;
				setProduct(data);
				setQuantity(data.stock > 0 ? 1 : 0);
			})
			.catch((err) => {
				if (!active) return;
				if (isAxiosError(err) && err.response?.status === 404) {
					setNotFound(true);
					setProduct(null);
				} else {
					setError(parseApiError(err, "No se pudo cargar la ficha técnica del producto."));
				}
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, [isValidId, numericId]);

	const incrementQty = () => {
		if (!product) return;
		setQuantity((q) => Math.min(product.stock, q + 1));
	};

	const decrementQty = () => {
		setQuantity((q) => Math.max(1, q - 1));
	};

	return {
		product,
		quantity,
		incrementQty,
		decrementQty,
		loading,
		notFound,
		error,
		recargar: () => (isValidId ? fetchProduct(numericId) : Promise.resolve()),
	};
}
