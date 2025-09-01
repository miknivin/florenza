"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { addToCart, setAllWishList } from "@/store/features/cartSlice";

export default function ProductModal({ setModalShow, product }) {
  const dispatch = useDispatch();
  const { cartData, allWishList } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [warning, setWarning] = useState(false);

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
    if (mappedProduct.variants.length > 0) {
      setSelectedVariant(mappedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

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
        url: mappedProduct.img.url,
        alt: mappedProduct.img.alt,
        _id: mappedProduct.img._id,
      },
      sku: mappedProduct.sku,
      variant: selectedVariant.size,
    };

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
    return Math.round((100 * partialValue) / totalValue);
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
                  src={mappedProduct.img.url}
                  alt={mappedProduct.img.alt || "Product Thumbnail"}
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
                  src={mappedProduct.img.url}
                  alt={mappedProduct.img.alt || "Product Image"}
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
