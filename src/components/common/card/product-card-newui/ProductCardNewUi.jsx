import React from "react";
import Link from "next/link";
import Image from "next/image";

const ProductCardNewUi = ({ product }) => {
  const {
    _id,
    name = "Unnamed Product",
    shortDescription = "A luxurious fragrance with captivating notes.",
    mainImage,
    color,
    variants = [],
  } = product;

  // 1. Auto-select first variant
  const firstVariant = variants[0] || {};
  const { price = 0, discountPrice = null } = firstVariant;

  // 2. Calculate discount % → only if valid
  let discountBadge = null;
  if (discountPrice && discountPrice < price) {
    const discountPercent = Math.round(((price - discountPrice) / price) * 100);
    const formatted = String(discountPercent).padStart(2, "0");
    discountBadge = `${formatted}% OFF`; // e.g. "05% OFF"
  }

  // 3. Image fallback
  const imageUrl =
    mainImage ||
    "https://ik.imagekit.io/c1jhxlxiy/Group%2081.png?updatedAt=1761982915643";

  return (
    <Link href={`/shop/${_id}`} className="text-decoration-none d-block">
      <div className="product-card">
        <div
          style={{ backgroundColor: color?.primaryColor || "#f3f3f3" }}
          className="product-content"
        >
          <Image
            src={imageUrl}
            alt={name}
            width={100}
            height={100}
            className="product-image-absolute"
            style={{ objectFit: "contain" }}
          />
          <div className="position-relative">
            {/* Only render badge if discount exists */}
            {discountBadge && (
              <div className="discount-badge">{discountBadge}</div>
            )}
            <h1 className="product-title line-clamp-1">{name}</h1>
            <p className="product-description line-clamp-2">
              {shortDescription}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardNewUi;
