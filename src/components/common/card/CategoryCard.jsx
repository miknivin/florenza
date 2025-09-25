import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard = ({ el }) => {
  return (
    <>
      <div className="woocomerce__category-item mb-4">
        <div className="woocomerce__category-thumb">
          <Image
            priority
            width={210}
            height={280}
            style={{ height: "auto" }}
            src={`/assets/imgs/${el.img}`}
            alt="product-img"
          />
          <Link
            className="woocomerce__category-hover"
            href={`/category/${el.name.toLowerCase()}`}
          >
            Explore
          </Link>
        </div>
        <div className="woocomerce__category-content">
          <h2 className="woocomerce__category-title">
            <Link href={`/category/${el.name.toLowerCase()}`}>{el.name}</Link>
          </h2>
        </div>
      </div>
    </>
  );
};

export default CategoryCard;
