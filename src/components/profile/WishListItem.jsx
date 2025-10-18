"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WishlistProductModal from "../common/modal/WishListProductModal";
import { track } from "@vercel/analytics";

export default function WishListItem({ el, removeWishlist }) {
  const [modalShow, setModalShow] = useState(false);
  const handleAddToCartClick = () => {
    // Track "Add to Cart" intent when clicking the cart button
    if (typeof window !== "undefined" && track && typeof track === "function") {
      console.log("Add to Cart intent tracked");
      track("AddToCartIntent", {
        product_name: el.title,
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }
    setModalShow(true);
  };
  return (
    <>
      <div className="wishlist wc_slide_btm">
        <div className="wishlist__thumb">
          <Image
            className="wishlist__mainImg"
            width={225}
            height={305}
            src={`${el.img}`}
            alt="wishlist"
          />
          <div className="wishlist__hover">
            <div
              className="wishlist__hbtn pointer_cursor"
              onClick={() => removeWishlist(el)}
            >
              <Image
                width={17}
                height={18}
                src="/assets/imgs/woocomerce/products/delete.png"
                alt="delete"
              />{" "}
              Delete{" "}
            </div>
            <div
              className="wishlist__hbtn pointer_cursor"
              onClick={() => setModalShow(true)}
            >
              <Image
                width={17}
                height={18}
                src="/assets/imgs/woocomerce/products/white-cart.png"
                alt="delete"
              />
              Cart
            </div>
          </div>
        </div>
        <div className="woocomerce__feature-hover position-static d-block d-md-none">
         <div
    className="woocomerce__feature-carttext pointer_cursor mx-auto"
    onClick={() => setModalShow(true)}
    style={{
      display: 'flex',
      gap: '10px',
      padding: '19px 0',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '-60px',
    }}
  >
    <Image
      width={25}
      height={22}
      src="/assets/imgs/woocomerce/cart.png"
      alt="cart"
    />
    <p
      style={{
        fontFamily: '$PlusJakarta', // Replace 'YourFontFamily' with the actual value of $font_primary
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'var(--white)',
        transition: 'color 0.5s', // Specify the property to transition (e.g., color)
      }}
    >
      Add to cart
    </p>
  </div>
        </div>
        <div className="wishlist__content">
          <h3 className="wishlist__title">
            <Link href={`/shop/${el.id}`}>{el.title}</Link>
          </h3>
          <p className="wishlist__price">₹{el.dis_price ?? el.price}</p>
        </div>
        {modalShow ? (
          <WishlistProductModal wishlistItem={el} setModalShow={setModalShow} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
