// components/product/ProductInfo.js
import ProductQuantity from "../product-details-components/ProductSelector";
import Image from "next/image";

export default function ProductInfo({
  name,
  sku,
  product,
  shortDescription,
  selectedVariant,
  variants = [],
  fragranceNotes,
  count,
  onVariantSelect,
  onIncrease,
  onDecrease,
  onAddToCart,
  onBuyNow,
  percentage,
  star,
  reviews = [],
}) {
  // Check if stock is limited (≤ 90)
  const isLimitedStock = product?.stockQuantity <= 90 && product?.stockQuantity > 0;

  return (
    <div className="woocomerce__single-content">
      <h2 className="woocomerce__single-title font-roboto-serif">{name}</h2>

      {/* Price */}
      <div className="woocomerce__single-pricelist">
        <span className="woocomerce__single-discountprice fw-semibold">
          ₹
          {(
            (selectedVariant?.discountPrice || selectedVariant?.price) * count
          ).toFixed(2)}
        </span>
        {selectedVariant?.discountPrice && (
          <>
            <div className="discount-badge-prod-page">
              {selectedVariant?.discountPrice
                ? percentage(
                    selectedVariant.discountPrice,
                    selectedVariant.price
                  ) + "% OFF"
                : product.dis_price
                ? percentage(product.dis_price, product.price) + "% OFF"
                : ""}
            </div>
          </>
        )}
        <p style={{ color: "#6d6868ff", fontSize: "13px", marginTop: "4px" }}>
          Inc.TAX
        </p>
      </div>
      <div className="text-muted pt-1">
        MRP{" "}
        <s>
          {" "}
          {selectedVariant?.discountPrice
            ? " ₹" + (selectedVariant.price * count).toFixed(2)
            : product?.dis_price
            ? " ₹" + (product?.price * count).toFixed(2)
            : ""}
        </s>
      </div>

      {/* Rating */}
      {reviews.length > 0 && (
        <div className="woocomerce__single-review">
          <div className="woocomerce__single-star">{star(reviews)}</div>
          <span className="woocomerce__single-reviewcount">
            ({reviews.length} Reviews)
          </span>
        </div>
      )}

      {/* Short Description */}
      <p className="woocomerce__single-discription py-4">{shortDescription}</p>

      {/* Limited Stock Badge */}
      {isLimitedStock && (
        <div 
          style={{
            display: 'inline-block',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '6px 16px',
            borderRadius: '16px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
          }}
        >
          Limited Stock Only !
        </div>
      )}

      {/* === PILL BUTTONS FOR VARIANTS === */}
      <div className="woocomerce__single-variations mt-3">
        <div className="d-flex flex-wrap gap-2">
          {variants.map((v, i) => (
            <button
              key={i}
              onClick={() => onVariantSelect(v)}
              className={`
                btn btn-sm rounded-pill px-3 py-2
                transition-all duration-200
                ${
                  selectedVariant?.size === v.size
                    ? "bg-black text-white"
                    : "bg-off-white text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {v.size} - ₹{v.discountPrice || v.price}
            </button>
          ))}
        </div>

        {/* <p className="woocomerce__single-sku mt-3">SKU: {sku}</p> */}
      </div>

      {/* Quantity + CTA */}
      <ProductQuantity
        onBuyNow={onBuyNow}
        onAddToCart={onAddToCart}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        count={count}
      />
    </div>
  );
}
