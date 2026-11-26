import PromosSection from "../components/PromosSection";
import { ProductCarousel } from "../components/ProductCarousel";
import { FEATURED_PRODUCTS, HERO_PRODUCTS, NEW_PRODUCTS, PROMO_PRODUCTS } from "../data/mockProducts";
import { HeroSlider } from "../components/HeroSlider";

export function HomePage() {
	return (
		<>
			<HeroSlider products={HERO_PRODUCTS} />
			<hr className="border-brand-divider" />
			<PromosSection products={PROMO_PRODUCTS} />
			<hr className="border-brand-divider" />

			<ProductCarousel title="Nuevos productos" products={NEW_PRODUCTS} />
			<hr className="border-brand-divider" />
			<ProductCarousel title="Productos Destacados" products={FEATURED_PRODUCTS} />
		</>
	);
}
