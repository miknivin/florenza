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
    stockQuantity = 0,
  } = product;

  // 1. Auto-select first variant
  const firstVariant = variants[0] || {};
  const { price = 0, discountPrice = null } = firstVariant;

  // 2. Discount badge removed

  // 3. Check if stock is limited (≤ 90)
  const isLimitedStock = stockQuantity <= 90 && stockQuantity > 0;

  // 4. Image fallback
  const imageUrl =
    mainImage ||
    "https://ik.imagekit.io/c1jhxlxiy/Group%2081.png?updatedAt=1761982915643";

  return (
    <Link href={`/shop/${_id}`} className="text-decoration-none d-block">
      <div className="product-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{ 
            backgroundColor: color?.primaryColor || "#f3f3f3",
            paddingBottom: isLimitedStock ? '45px' : '0'
          }}
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
            <h1 className="product-title line-clamp-1">{name}</h1>
            <p className={`product-description line-clamp-2 ${!isLimitedStock ? 'no-badge' : ''}`}>
              {shortDescription}
            </p>
          </div>
        </div>
        {isLimitedStock && (
          <div 
            className="limited-stock-badge"
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              width: '100%',
              height: '33.03px',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0px 0px 15px 15px',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundImage: "url('/assets/imgs/shape/Group 145.png')",
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <p 
              style={{
                position: 'relative',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: '500',
                fontSize: '15px',
                lineHeight: '18px',
                color: '#FFFFFF',
                margin: '0',
                padding: '0',
                textAlign: 'center',
                zIndex: 2
              }}
              className="limited-stock-text"
            >
              Limited Stock Only !
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCardNewUi;
