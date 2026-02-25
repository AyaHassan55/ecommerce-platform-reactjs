import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../features/products/services/productService";
import useCartStore from "../features/cart/hooks/useCartStore";
import useWishlistStore from "../features/wishlist/hooks/useWishlistStore";
import useCompareStore from "../features/compare/hooks/useCompareStore";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const addToCart = useCartStore((s) => s.addToCart);
    const addToWishlist = useWishlistStore((s) => s.addToWishlist);
    const isInWishlist = useWishlistStore((s) => s.isInWishlist(Number(id)));
     const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
    const addToCompare = useCompareStore((s) => s.addToCompare);
    const isInCompare = useCompareStore((s) => s.isInCompare(Number(id)));
    useEffect(() => {
        async function load() {
            setLoading(true);
            const p = await getProductById(id);
            setProduct(p);
            setLoading(false);
        }
        load();
    }, [id]);

    useEffect(() => {
        // Initialize countdown in seconds
        const now = Date.now();
        const offerEndsAt = now + 2 * 24 * 60 * 60 * 1000; // 2 days from now
        let remainingSeconds = Math.floor(
            (offerEndsAt - now) / 1000
        );

        // Set initial value via setTimeout to avoid synchronous setState in effect
        const initTimeout = setTimeout(() => setCountdown(remainingSeconds), 0);

        const interval = setInterval(() => {
            remainingSeconds -= 1;
            if (remainingSeconds <= 0) {
                setCountdown(0);
                clearInterval(interval);
            } else {
                setCountdown(remainingSeconds);
            }
        }, 1000);

        return () => {
            clearTimeout(initTimeout);
            clearInterval(interval);
        };
    }, []);

    const formatCountdown = (totalSeconds) => {
        if (totalSeconds === null || totalSeconds <= 0) return null;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { days, hours, minutes, seconds };
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-300 fill-current"
                        }`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Not Found
                </h2>
                <Link
                    to="/products"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const time = formatCountdown(countdown);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-primary-600 transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link
                    to="/products"
                    className="hover:text-primary-600 transition-colors"
                >
                    Products
                </Link>
                <span>/</span>
                <span className="text-gray-800 font-medium truncate">
                    {product.title}
                </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full aspect-square object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-500">
                            ({product.rating} rating)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold text-gray-900 mb-6">
                        ${product.price.toFixed(2)}
                    </div>

                    {/* Offer Countdown */}
                    {time && (
                        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
                            <p className="text-sm font-medium text-amber-800 mb-3">
                                🔥 Limited Time Offer — Ends In:
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { value: time.days, label: "Days" },
                                    { value: time.hours, label: "Hours" },
                                    { value: time.minutes, label: "Min" },
                                    { value: time.seconds, label: "Sec" },
                                ].map((unit) => (
                                    <div
                                        key={unit.label}
                                        className="text-center bg-white rounded-xl px-3 py-2 shadow-sm min-w-[60px]"
                                    >
                                        <div className="text-xl font-bold text-gray-900">
                                            {String(unit.value).padStart(2, "0")}
                                        </div>
                                        <div className="text-xs text-gray-500">{unit.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {product.description}
                    </p>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-6">
                        <div
                            className={`w-2.5 h-2.5 rounded-full ${product.stock > 10
                                ? "bg-emerald-500"
                                : product.stock > 0
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                        />
                        <span className="text-sm text-gray-600">
                            {product.stock > 10
                                ? "In Stock"
                                : product.stock > 0
                                    ? `Only ${product.stock} left`
                                    : "Out of Stock"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => addToCompare(product)}
                            className={`px-4 py-3.5 rounded-xl border-2 transition-all ${isInCompare
                                ? "border-blue-500 bg-blue-50 text-blue-500"
                                : "border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500"
                                }`}
                            title="Compare"
                        >
                            <svg
                                viewBox="0 0 640 640"
                                className="w-5 h-5"
                                fill="currentColor"
                            >
                                <path d="M255 71C264.4 61.6 279.6 61.6 288.9 71L344.9 127C354.3 136.4 354.3 151.6 344.9 160.9L288.9 216.9C279.5 226.3 264.3 226.3 255 216.9C245.7 207.5 245.6 192.3 255 183L270 168L223.9 168C201.8 168 183.9 185.9 183.9 208L183.9 419.7C216.4 429.9 239.9 460.2 239.9 496C239.9 540.2 204.1 576 159.9 576C115.7 576 79.9 540.2 79.9 496C79.9 460.2 103.4 429.9 135.9 419.7L136 208C136 159.4 175.4 120 224 120L270.1 120L255.1 105C245.7 95.6 245.7 80.4 255.1 71.1zM448 144C448 161.7 462.3 176 480 176C497.7 176 512 161.7 512 144C512 126.3 497.7 112 480 112C462.3 112 448 126.3 448 144zM456 220.3C423.5 210.1 400 179.8 400 144C400 99.8 435.8 64 480 64C524.2 64 560 99.8 560 144C560 179.8 536.5 210.1 504 220.3L504 432C504 480.6 464.6 520 416 520L369.9 520L384.9 535C394.3 544.4 394.3 559.6 384.9 568.9C375.5 578.2 360.3 578.3 351 568.9L295 512.9C285.6 503.5 285.6 488.3 295 479L351 423C360.4 413.6 375.6 413.6 384.9 423C394.2 432.4 394.3 447.6 384.9 456.9L369.9 471.9L416 471.9C438.1 471.9 456 454 456 431.9L456 220.2zM128 496C128 513.7 142.3 528 160 528C177.7 528 192 513.7 192 496C192 478.3 177.7 464 160 464C142.3 464 128 478.3 128 496z" />
                            </svg>
                        </button>
                        <button
                            onClick={() =>{
                                    isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                            } 
                            className={`px-4 py-3.5 rounded-xl border-2 transition-all ${isInWishlist
                                ? "border-accent-500 bg-accent-50 text-accent-500"
                                : "border-gray-200 text-gray-400 hover:border-accent-300 hover:text-accent-500"
                                }`}
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Reviews Placeholder — Student task to implement */}
                    <div className="mt-10 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Customer Reviews
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Reviews will be displayed here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
