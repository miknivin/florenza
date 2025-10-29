"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { addToCart, setAllWishList } from "@/store/features/cartSlice";
import { track } from "@vercel/analytics";
import CartStrokeIcon from "@/components/icons/CartStrokeIcon";
import RedirectIcon from "@/components/icons/RedirectIcon";
import Link from "next/link";

export default function ProductModal({
  show,
  onHide,
  product,
  selectedVariant: initialVariant,
  onProceedToCheckout, // ← NEW CALLBACK
}) {
  const dispatch = useDispatch();
  const { cartData, allWishList } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [warning, setWarning] = useState(false);

  // Reset on open
  useEffect(() => {
    if (show) {
      setCount(1);
      setWarning(false);
      if (product.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [show, product, selectedVariant]);

  // Images
  const hasVariantImages = selectedVariant?.imageUrl?.length > 0;
  const mainImage = hasVariantImages
    ? selectedVariant.imageUrl[0]
    : product.images?.[0]?.url || "/assets/imgs/placeholder.jpg";
  const hoverImage = hasVariantImages
    ? selectedVariant.imageUrl[1] || selectedVariant.imageUrl[0]
    : product.images?.[1]?.url || mainImage;

  // ---------- BUY NOW IN MODAL ----------
  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.warn("Please select a variant", {
        position: "top-center",
        autoClose: 1000,
      });
      setWarning(true);
      return;
    }

    const fullData = {
      id: product._id,
      name: product.name,
      price: selectedVariant.discountPrice || selectedVariant.price,
      quantity: count,
      img: { url: mainImage, alt: "Product Image" },
      sku: product.sku,
      variant: selectedVariant,
    };

    // Track
    if (typeof window !== "undefined" && track) {
      track("BuyNow", { product_name: fullData.name, quantity: count });
    }

    // Pass to parent → close modal → open shipping
    onProceedToCheckout(fullData);
  };

  // ---------- ADD TO CART ----------
  // const handleAddToCart = () => {
  //   if (!selectedVariant) {
  //     toast.warn("Please select a variant", {
  //       position: "top-center",
  //       autoClose: 1000,
  //     });
  //     setWarning(true);
  //     return;
  //   }

  //   const cartItem = {
  //     id: product._id,
  //     name: product.name,
  //     price: selectedVariant.discountPrice || selectedVariant.price,
  //     quantity: count,
  //     img: { url: mainImage },
  //     sku: product.sku,
  //     variant: selectedVariant.size,
  //   };

  //   const exists = cartData.find(
  //     (i) => i.id === cartItem.id && i.variant === cartItem.variant
  //   );
  //   if (exists) {
  //     toast.warn("Already in cart", {
  //       position: "top-center",
  //       autoClose: 1000,
  //     });
  //     return;
  //   }

  //   dispatch(addToCart(cartItem));
  //   toast.success("Added to cart!", {
  //     position: "top-center",
  //     autoClose: 1000,
  //   });
  //   onHide();
  // };

  const percentage = (p, t) => Number((100 - (100 * p) / t).toFixed(2));

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton />
      <Modal.Body className="py-0">
        <section className="woocomerce__single woocomerce_single2 sec-plr-50 py-0">
          <div className="woocomerce__single-wrapper2">
            {/* IMAGE */}
            <div className="woocomerce__single-left">
              <div className="img-box">
                <Image
                  priority
                  width={400}
                  height={560}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="image-box__item"
                  src={hoverImage}
                  alt="Hover"
                  onError={(e) =>
                    (e.currentTarget.src = "/assets/imgs/placeholder.jpg")
                  }
                />
                <Image
                  priority
                  width={400}
                  height={560}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="woocomerce__feature-mainImg"
                  src={mainImage}
                  alt="Main"
                  onError={(e) =>
                    (e.currentTarget.src = "/assets/imgs/placeholder.jpg")
                  }
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="woocomerce__single-right wc_slide_btm">
              <h2 className="woocomerce__single-title2">{product.name}</h2>
              <p className="woocomerce__single-discription pt-0 pb-3">
                {product.shortDescription || ""}
              </p>

              {selectedVariant && (
                <div className="woocomerce__single-pricelist">
                  <span className="woocomerce__single-discountprice">
                    ₹{selectedVariant.discountPrice || selectedVariant.price}
                  </span>
                  {selectedVariant.discountPrice && (
                    <>
                      <span className="woocomerce__single-originalprice">
                        ₹{selectedVariant.price}
                      </span>
                      <span className="woocomerce__single-discount">
                        (
                        {percentage(
                          selectedVariant.discountPrice,
                          selectedVariant.price
                        )}
                        % OFF)
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* VARIANTS */}
              <div className="woocomerce__single-variations">
                <div className="woocomerce__single-stitle">
                  Available Variants*
                </div>
                <ul
                  className="woocomerce__single-sizelist"
                  style={{ marginTop: "20px" }}
                >
                  {product.variants?.map((v) => (
                    <li
                      key={v._id}
                      className={
                        selectedVariant?.size === v.size
                          ? "selected_background"
                          : ""
                      }
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size}
                    </li>
                  ))}
                </ul>
                {warning && !selectedVariant && (
                  <small className="warning_text">
                    Please select a variant
                  </small>
                )}
              </div>

              {/* QUANTITY */}
              <div className="woocomerce__single-buttons">
                <div className="woocomerce__single-incrementwrap2">
                  <div
                    style={{ maxWidth: "200px" }}
                    className="woocomerce__single-counter-next"
                  >
                    <p
                      onClick={() => setCount(count > 1 ? count - 1 : 1)}
                      className="counter__decrement pointer_cursor"
                    >
                      –
                    </p>
                    <input
                      style={{ maxWidth: "100px" }}
                      className="counter__input"
                      type="text"
                      value={count}
                      readOnly
                    />
                    <p
                      onClick={() => setCount(count + 1)}
                      className="counter__increment pointer_cursor"
                    >
                      +
                    </p>
                  </div>
                </div>
              </div>

              {/* BUY NOW BUTTON */}
              <div
                style={{ bottom: "10px" }}
                className="woocomerce__single-buttons mt-3 d-flex position-sticky z-3"
              >
                <button
                  className="woocomerce__single-cart2 pointer_cursor"
                  onClick={handleBuyNow}
                >
                  <CartStrokeIcon width={30} height={30} />
                  Buy it now
                </button>
                {product && product._id && (
                  <Link
                    href={`/shop/${product._id}`}
                    className="bg-transparent border text-black border-2 border-black p-4"
                  >
                    <RedirectIcon />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}
