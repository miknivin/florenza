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
    discount = "05% OFF",
  } = product;

  const imageUrl =
    mainImage ||
    "https://ik.imagekit.io/c1jhxlxiy/Group%2081.png?updatedAt=1761982915643";

  return (
    <Link href={`/shop/${_id}`} className="text-decoration-none d-block">
      <div className="product-card">
        <div
          style={{ backgroundColor: `${color?.primaryColor || "##f3f3f3"}` }}
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
            <div className="discount-badge">{discount}</div>
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
