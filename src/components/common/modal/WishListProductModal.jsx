"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { addToCart, setAllWishList } from "@/store/features/cartSlice";
import { useGetProductDetailsQuery } from "@/store/api/productApi";
import { track } from "@vercel/analytics";

export default function WishlistProductModal({ setModalShow, wishlistItem }) {
  const dispatch = useDispatch();
  const { cartData, allWishList } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [warning, setWarning] = useState(false);

  // Fetch product data using RTK Query
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(wishlistItem.parent_id);

  // Map product data to match desired cart data structure
  const mappedProduct = product?.product
    ? {
        id: product.product._id,
        title: product.product.name,
        description: product.product?.shortDescription || "",
        img: {
          url:
            product.product?.images?.length > 0
              ? product.product.images[0].url
              : "/assets/imgs/placeholder.jpg",
          alt:
            product.product?.images?.length > 0
              ? product.product.images[0].alt
              : "",
          _id:
            product.product?.images?.length > 0
              ? product.product.images[0]._id
              : null,
        },
        variants: product.product.variants || [],
        sku: product.product.sku || "N/A",
        stockQuantity: product.product.stockQuantity || 0,
      }
    : null;
  if (mappedProduct) {
    console.log(mappedProduct);
  }
  // Auto-select variant matching wishlistItem.size and reset count/warning only on initial load
  useEffect(() => {
    if (mappedProduct?.variants?.length > 0 && !selectedVariant) {
      const matchingVariant =
        mappedProduct.variants.find(
          (variant) => variant.size === wishlistItem.size
        ) || mappedProduct.variants[0];
      setSelectedVariant(matchingVariant);
      setCount(1);
      setWarning(false);
    }
  }, [mappedProduct, wishlistItem.size]);

  // Determine images to display
  const hasVariantImages =
    selectedVariant?.imageUrl?.length > 0 || selectedVariant?.imageUrl;
  const mainImage = hasVariantImages
    ? selectedVariant?.imageUrl?.length > 0
      ? selectedVariant.imageUrl[0]
      : selectedVariant.imageUrl
    : wishlistItem.img ||
      (product?.product?.images?.length > 0
        ? product.product.images[0].url
        : "/assets/imgs/placeholder.jpg");
  const hoverImage = hasVariantImages
    ? selectedVariant?.imageUrl?.length > 1
      ? selectedVariant.imageUrl[1]
      : selectedVariant?.imageUrl?.length > 0
      ? selectedVariant.imageUrl[0]
      : selectedVariant.imageUrl
    : wishlistItem.hover_img ||
      (product?.product?.images?.length > 1
        ? product.product.images[1].url
        : mainImage);

  const handleAddToCart = () => {
    console.log("add to cart called");

    if (!selectedVariant) {
      console.log("WishlistProductModal - No variant selected");
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

    if (mappedProduct.stockQuantity === 0) {
      console.log("WishlistProductModal - Out of stock");
      toast.warn("This product is out of stock", {
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

    const cartItem = {
      id: mappedProduct.id,
      name: mappedProduct.title,
      price: selectedVariant.discountPrice || selectedVariant.price,
      quantity: count,
      img: {
        url: mainImage,
        alt: hasVariantImages ? "Variant Image" : mappedProduct.img.alt,
        _id: hasVariantImages ? null : mappedProduct.img._id,
      },
      sku: mappedProduct.sku,
      variant: selectedVariant.size,
    };

    console.log("WishlistProductModal - Cart Item:", cartItem);

    // Check if item already exists in cart
    const existingItem = cartData.find(
      (item) => item.id === cartItem.id && item.variant === cartItem.variant
    );
    if (existingItem) {
      console.log("WishlistProductModal - Item already in cart");
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
if (typeof window !== "undefined" && track && typeof track === "function") {
      console.log("Add to Cart tracked");
      track("AddToCart", {
        product_name: cartItem.name,
       quantity: cartItem.quantity,
       
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }
    console.log("WishlistProductModal - Dispatching addToCart");
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
    if (allWishList && allWishList.length > 0) {
      const updatedWishlist = allWishList.filter(
        (item) => item.parent_id !== data.id
      );
      dispatch(setAllWishList(updatedWishlist));
    }
  };

  const percentage = (partialValue, totalValue) => {
    return Math.round((100 * partialValue) / totalValue);
  };

  // Handle loading and error states
  if (isLoading) {
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
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading product details...</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (error || !mappedProduct) {
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
          <div>Error loading product details. Please try again.</div>
        </Modal.Body>
      </Modal>
    );
  }

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
                {mappedProduct.stockQuantity === 0 ? (
                  <span className="badge bg-danger my-3">Out of Stock</span>
                ) : (
                  <span className="badge bg-success my-3">In Stock</span>
                )}

                {selectedVariant && (
                  <div className="woocomerce__single-pricelist">
                    <span className="woocomerce__single-discountprice">
                      ₹
                      {(Number(selectedVariant.discountPrice) ||
                        Number(selectedVariant.price)) * (Number(count) || 1)}
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
                        onClick={() => {
                          setSelectedVariant(variant);
                          setCount(1); // Reset count when variant changes
                        }}
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
                      disabled={mappedProduct.stockQuantity === 0}
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
