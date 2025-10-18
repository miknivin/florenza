"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { addToCart, setAllWishList } from "@/store/features/cartSlice";
import { track } from "@vercel/analytics";

export default function ProductModal({
  setModalShow,
  product,
  selectedVariant: initialVariant,
}) {
  const dispatch = useDispatch();
  const { cartData, allWishList } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [warning, setWarning] = useState(false);

  // Debug logging
  console.log("ProductModal - Product:", product);
  console.log("ProductModal - Initial variant:", initialVariant);
  console.log("ProductModal - Selected variant:", selectedVariant);

  // Map product data to match desired cart data structure
  const mappedProduct = {
    id: product._id,
    title: product.name,
    description: product?.shortDescription || "",
    img: {
      url: product.images[0]?.url || "/assets/imgs/placeholder.jpg",
      alt: product.images[0]?.alt || "",
      _id: product.images[0]?._id || null,
    },
    variants: product.variants || [],
    sku: product.sku || "N/A",
  };

  // Auto-select first variant and reset count/warning when modal opens
  useEffect(() => {
    setCount(1);
    setWarning(false);
    if (mappedProduct.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(mappedProduct.variants[0]);
    }
  }, [product, selectedVariant]);

  // Determine images to display
  const hasVariantImages =
    selectedVariant?.imageUrl?.length > 0 || selectedVariant?.imageUrl;
  const mainImage = hasVariantImages
    ? selectedVariant?.imageUrl?.length > 0
      ? selectedVariant.imageUrl[0]
      : selectedVariant.imageUrl
    : product.images?.length > 0
    ? product.images[0]?.url
    : "/assets/imgs/placeholder.jpg";
  const hoverImage = hasVariantImages
    ? selectedVariant?.imageUrl?.length > 1
      ? selectedVariant.imageUrl[1]
      : selectedVariant?.imageUrl?.length > 0
      ? selectedVariant.imageUrl[0]
      : selectedVariant.imageUrl
    : product.images?.length > 1
    ? product.images[1]?.url
    : mainImage;

  console.log("ProductModal - Has variant images:", hasVariantImages); // Debug log
  console.log("ProductModal - Main image:", mainImage); // Debug log
  console.log("ProductModal - Hover image:", hoverImage); // Debug log

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.warn("Please select a variant", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setWarning(true);
      return;
    }

    const cartItem = {
      id: mappedProduct.id,
      name: mappedProduct.title,
      price: selectedVariant.discountPrice || selectedVariant.price,
      quantity: count,
      img: {
        url: mainImage, // Use variant image if available
        alt:
          selectedVariant?.imageUrl?.length > 0
            ? `Variant Image`
            : mappedProduct.img.alt,
        _id:
          selectedVariant?.imageUrl?.length > 0 ? null : mappedProduct.img._id,
      },
      sku: mappedProduct.sku,
      variant: selectedVariant.size,
    };

    console.log("ProductModal - Cart item:", cartItem); // Debug log

    // Check if item already exists in cart
    const existingItem = cartData.find(
      (item) => item.id === cartItem.id && item.variant === cartItem.variant
    );
    if (existingItem) {
      toast.warn("This product variant is already in your cart", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

// Track "Add to Cart" event with product name
    if (typeof window !== "undefined" && track && typeof track === "function") {
      console.log("Add to Cart tracked");
      track("AddToCart", {
        product_name: mappedProduct.title,
       quantity: count,
        
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }

    dispatch(addToCart(cartItem));
    removeFromWishlist(mappedProduct);
    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setModalShow(false);
  };

  const removeFromWishlist = (data) => {
    let itemInWishlist;
    if (allWishList && allWishList.length > 0) {
      itemInWishlist = allWishList.find((item) => item.id === data.id);
    }

    if (itemInWishlist) {
      const updatedWishlist = allWishList.filter((item) => item.id !== data.id);
      dispatch(setAllWishList(updatedWishlist));
    }
  };

  const percentage = (partialValue, totalValue) => {
    return Number((100 - (100 * partialValue) / totalValue).toFixed(2));
  };

  return (
    <Modal
      show={true}
      onHide={() => setModalShow(false)}
      size="xl"
      style={{ paddingLeft: "0px" }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <section className="woocomerce__single woocomerce_single2 sec-plr-50">
          <div className="woocomerce__single-wrapper2">
            <div className="woocomerce__single-left" style={{ order: "1" }}>
              <div className="img-box">
                <Image
                  priority
                  width={400}
                  height={560}
                  style={{
                    height: "auto",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="image-box__item"
                  src={hoverImage}
                  alt={
                    hasVariantImages
                      ? "Variant Thumbnail"
                      : mappedProduct.img.alt || "Product Thumbnail"
                  }
                  onError={(e) => {
                    console.error(
                      "ProductModal - Image load error (hover):",
                      hoverImage
                    ); // Debug log
                    e.currentTarget.src = "/assets/imgs/placeholder.jpg";
                  }}
                />
                <Image
                  priority
                  width={400}
                  height={560}
                  style={{
                    height: "auto",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="woocomerce__feature-mainImg"
                  src={mainImage}
                  alt={
                    hasVariantImages
                      ? "Variant Image"
                      : mappedProduct.img.alt || "Product Image"
                  }
                  onError={(e) => {
                    console.error(
                      "ProductModal - Image load error (main):",
                      mainImage
                    ); // Debug log
                    e.currentTarget.src = "/assets/imgs/placeholder.jpg";
                  }}
                />
              </div>
            </div>
            <div
              className="woocomerce__single-right wc_slide_btm"
              style={{ order: "1" }}
            >
              <div className="woocomerce__single-content">
                <h2 className="woocomerce__single-title2">
                  {mappedProduct.title}
                </h2>
                <p className="woocomerce__single-discription pt-0 pb-3">
                  {mappedProduct.description}
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
                <div className="woocomerce__single-variations">
                  <div className="woocomerce__single-stitle">
                    Available Variants*
                  </div>
                  <ul
                    className="woocomerce__single-sizelist"
                    style={{ marginTop: "20px" }}
                  >
                    {mappedProduct.variants.map((variant, i) => (
                      <li
                        className={
                          selectedVariant?.size === variant.size
                            ? "selected_background"
                            : ""
                        }
                        onClick={() => setSelectedVariant(variant)}
                        key={i + "variant"}
                      >
                        {variant.size}
                      </li>
                    ))}
                  </ul>
                  {warning && !selectedVariant && (
                    <small className="warning_text">
                      Please select a variant
                    </small>
                  )}
                </div>
                <div className="woocomerce__single-buttons">
                  <div className="woocomerce__single-incrementwrap2">
                    <div className="woocomerce__single-counter-next">
                      <p
                        onClick={() => setCount(count > 1 ? count - 1 : 1)}
                        className="counter__decrement pointer_cursor"
                      >
                        &ndash;
                      </p>
                      <input
                        className="counter__input"
                        type="text"
                        value={count}
                        name="counter"
                        size="5"
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
                <div className="woocomerce__single-buttons">
                  <div className="woocomerce__single-incrementwrap2">
                    <button
                      className="woocomerce__single-cart2 pointer_cursor"
                      onClick={handleAddToCart}
                    >
                      <Image
                        width={25}
                        height={22}
                        src="/assets/imgs/woocomerce/cart.png"
                        alt="cart"
                      />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}
