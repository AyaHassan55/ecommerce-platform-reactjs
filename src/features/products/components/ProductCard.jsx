import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../cart/hooks/useCartStore";
import useWishlistStore from "../../wishlist/hooks/useWishlistStore";
import useCompareStore from "../../compare/hooks/useCompareStore";
export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const addToCart = useCartStore((s) => s.addToCart);
    const addToWishlist = useWishlistStore((s) => s.addToWishlist);
    const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
    const removeFromWishList = useWishlistStore((s) => s.removeFromWishlist);
    const addToCompare = useCompareStore((s) => s.addToCompare);
    const isInCompare = useCompareStore((s) => s.isInCompare(product.id));

    const renderStars = (rating) => {
        const stars = [];
        const full = Math.floor(rating);
        const hasHalf = rating - full >= 0.5;
        for (let i = 0; i < 5; i++) {
            if (i < full) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i === full && hasHalf) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${product.id}`}>
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#d1d5db" />
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${product.id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col">
            {/* Image */}
            <Link to={`/products/${product.id}`} className="relative overflow-hidden aspect-square bg-gray-50">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {product.stock <= 10 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Only {product.stock} left
                    </span>
                )}
                {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Out of Stock
                    </span>
                )}
                {/* Compare button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCompare(product);
                        navigate('/compare');
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-200 ${isInCompare
                        ? "bg-blue-500 text-white"
                        : "bg-white/90 text-gray-400 hover:text-blue-500"
                        }`}
                >
                    <svg
                        viewBox="0 0 640 640"
                        className="w-6 h-6"
                        fill="currentColor"
                    >
                        <path d="M255 71C264.4 61.6 279.6 61.6 288.9 71L344.9 127C354.3 136.4 354.3 151.6 344.9 160.9L288.9 216.9C279.5 226.3 264.3 226.3 255 216.9C245.7 207.5 245.6 192.3 255 183L270 168L223.9 168C201.8 168 183.9 185.9 183.9 208L183.9 419.7C216.4 429.9 239.9 460.2 239.9 496C239.9 540.2 204.1 576 159.9 576C115.7 576 79.9 540.2 79.9 496C79.9 460.2 103.4 429.9 135.9 419.7L136 208C136 159.4 175.4 120 224 120L270.1 120L255.1 105C245.7 95.6 245.7 80.4 255.1 71.1zM448 144C448 161.7 462.3 176 480 176C497.7 176 512 161.7 512 144C512 126.3 497.7 112 480 112C462.3 112 448 126.3 448 144zM456 220.3C423.5 210.1 400 179.8 400 144C400 99.8 435.8 64 480 64C524.2 64 560 99.8 560 144C560 179.8 536.5 210.1 504 220.3L504 432C504 480.6 464.6 520 416 520L369.9 520L384.9 535C394.3 544.4 394.3 559.6 384.9 568.9C375.5 578.2 360.3 578.3 351 568.9L295 512.9C285.6 503.5 285.6 488.3 295 479L351 423C360.4 413.6 375.6 413.6 384.9 423C394.2 432.4 394.3 447.6 384.9 456.9L369.9 471.9L416 471.9C438.1 471.9 456 454 456 431.9L456 220.2zM128 496C128 513.7 142.3 528 160 528C177.7 528 192 513.7 192 496C192 478.3 177.7 464 160 464C142.3 464 128 478.3 128 496z" />
                    </svg>
                </button>
                {/* Wishlist button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        (isInWishlist ? removeFromWishList(product.id) : addToWishlist(product));

                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${isInWishlist
                        ? "bg-accent-500 text-white"
                        : "bg-white/90 text-gray-400 hover:text-accent-500"
                        }`}
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
                    {product.category}
                </span>
                <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2"
                >
                    {product.title}
                </Link>

                <div className="flex items-center gap-1 mb-3">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
