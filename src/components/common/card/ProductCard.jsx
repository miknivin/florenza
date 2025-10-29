"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import {
  setAllWishList,
  setActiveWishList,
  addToCart,
  removeFromCart,
  setBuyProduct,
} from "@/store/features/cartSlice";

import SignUpForm from "@/components/auth/SignupForm";
import SignInForm from "@/components/auth/SigninForm";
import { toast } from "react-toastify";

import CartWithoutStroke from "@/components/icons/CartWithoutStroke";
import CartStrokeIcon from "@/components/icons/CartStrokeIcon";
import ProductModal from "../modal/ProductModal";
import ShippingAddressModal from "@/components/shop/product-details-components/ShippingAddressModal";
import Modal from "../modal/ReusableModal";
import LightingIcon from "@/components/icons/LightingIcon";

const ProductCard = ({ el, isShopFull = false }) => {
  // ---------- STATE ----------
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    el.variants?.[0] || null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cartData, allWishList, activeWishList } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  // ---------- TOAST ----------
  const warningTost = (msg) =>
    toast.warn(msg, {
      position: "top-center",
      autoClose: 1000,
      theme: "light",
    });
  const successTost = (msg) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 1000,
      theme: "light",
    });

  // ---------- AUTH MODAL ----------
  const openSignIn = () => {
    setIsSignUp(false);
    setShowAuthModal(true);
  };
  const openSignUp = () => {
    setIsSignUp(true);
    setShowAuthModal(true);
  };
  const closeAuth = () => setShowAuthModal(false);

  // ---------- URL PARAM HELPERS ----------
  const setQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const deleteQueryParam = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    const newPath = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newPath, { scroll: false });
  };

  // ---------- BUY NOW ----------
  const handleBuyNow = () => {
    if (!selectedVariant) {
      warningTost("Please select a size");
      return;
    }

    // Set param with THIS product's ID
    setQueryParam("showProductModal", el._id);

    if (!isAuthenticated) {
      openSignIn();
      return;
    }

    setShowProductModal(true);
  };

  // ---------- AUTO‑OPEN ONLY THIS CARD ----------
  useEffect(() => {
    const modalProductId = searchParams.get("showProductModal");
    if (modalProductId === el._id && isAuthenticated && selectedVariant) {
      setShowProductModal(true);
    } else if (modalProductId !== el._id) {
      setShowProductModal(false); // Ensure others stay closed
    }
  }, [searchParams, el._id, isAuthenticated, selectedVariant]);

  // ---------- CLOSE MODAL → REMOVE PARAM ----------
  const closeProductModal = () => {
    setShowProductModal(false);
    deleteQueryParam("showProductModal");
  };

  // ---------- CART TOGGLE ----------
  const toggleCart = () => {
    if (!selectedVariant) {
      warningTost("Please select a size");
      return;
    }

    const cartItem = {
      id: el._id,
      name: el.name,
      price: selectedVariant?.discountPrice || selectedVariant?.price,
      quantity: 1,
      img: {
        url:
          selectedVariant?.imageUrl?.[0] ||
          el.images?.[0]?.url ||
          "/assets/imgs/placeholder.jpg",
      },
      sku: el.sku,
      variant: selectedVariant?.size,
    };

    const isInCart = cartData?.some(
      (i) => i.id === cartItem.id && i.variant === cartItem.variant
    );

    if (isInCart) {
      dispatch(removeFromCart({ id: cartItem.id, variant: cartItem.variant }));
      successTost("Removed from cart");
    } else {
      dispatch(addToCart(cartItem));
      successTost("Added to cart");
      if (typeof window !== "undefined" && window.track) {
        window.track("AddToCart", { product_name: cartItem.name, quantity: 1 });
      }
    }
  };

  // ---------- WISHLIST ----------
  const addWishList = (data) => {
    const hasVariantImages = selectedVariant?.imageUrl?.length > 0;
    const img = hasVariantImages
      ? selectedVariant.imageUrl[0]
      : el.images?.[0]?.url || "/assets/imgs/placeholder.jpg";
    const hover_img = hasVariantImages
      ? selectedVariant.imageUrl[1] || selectedVariant.imageUrl[0]
      : el.images?.[1]?.url || img;

    const customDetails = {
      parent_id: data._id,
      title: data.name,
      img,
      hover_img,
      price: selectedVariant?.price || 0,
      dis_price: selectedVariant?.discountPrice || selectedVariant?.price || 0,
      pro_code: data.sku,
      size: selectedVariant?.size || null,
    };

    const existing = allWishList?.find(
      (i) =>
        i.parent_id === customDetails.parent_id && i.size === customDetails.size
    );

    if (existing) {
      const updated = allWishList.filter(
        (i) =>
          !(
            i.parent_id === customDetails.parent_id &&
            i.size === customDetails.size
          )
      );
      const updatedActive = activeWishList.filter(
        (id) => id !== customDetails.parent_id
      );
      dispatch(setAllWishList(updated));
      dispatch(setActiveWishList(updatedActive));
      successTost("Removed from wishlist");
    } else {
      dispatch(setAllWishList([...(allWishList || []), customDetails]));
      dispatch(
        setActiveWishList([...(activeWishList || []), customDetails.parent_id])
      );
      successTost("Added to wishlist");
    }
  };

  // ---------- VARIANT ----------
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => setIsDropdownOpen((p) => !p);

  // ---------- IMAGE ----------
  const hasVariantImages = selectedVariant?.imageUrl?.length > 0;
  const mainImage = hasVariantImages
    ? selectedVariant.imageUrl[0]
    : el.images?.[0]?.url || "/assets/imgs/placeholder.jpg";
  const hoverImage = hasVariantImages
    ? selectedVariant.imageUrl[1] || selectedVariant.imageUrl[0]
    : el.images?.[1]?.url || mainImage;

  const isInCart = cartData?.some(
    (i) => i.id === el._id && i.variant === selectedVariant?.size
  );

  return (
    <>
      {/* ---------------- CARD ---------------- */}
      <div className="woocomerce__feature-product">
        <div className="woocomerce__feature-thumb">
          <Link href={`/shop/${el._id}`}>
            <div className="img-box">
              <Image
                priority
                width={440}
                height={560}
                style={{ width: "100%", height: "auto" }}
                className="image-box__item"
                src={hoverImage}
                alt="Hover"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/imgs/placeholder.jpg")
                }
              />
              <Image
                priority
                width={440}
                height={560}
                style={{ width: "100%", height: "auto" }}
                className="woocomerce__feature-mainImg"
                src={mainImage}
                alt="Main"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/imgs/placeholder.jpg")
                }
              />
            </div>
          </Link>

          <div className="woocomerce__feature-hover">
            {/* BUY NOW */}
            <div
              className="woocomerce__feature-carttext pointer_cursor"
              onClick={handleBuyNow}
            >
              <div style={{ color: "#FDCB58" }}>
                <LightingIcon />
              </div>

              <p>Buy Now</p>
            </div>

            {/* HEART → cart */}
            <button
              className="woocomerce__feature-heart pointer_cursor"
              onClick={toggleCart}
            >
              {isInCart ? (
                <div style={{ color: "red" }}>
                  <CartWithoutStroke />
                </div>
              ) : (
                <CartStrokeIcon />
              )}
            </button>
          </div>
        </div>

        <div
          className={`woocomerce__feature-content bg-black ${
            isShopFull ? "px-2 px-md-3 pb-2" : ""
          }`}
        >
          {/* WISHLIST */}
          <div className="woocomerce__feature-category woocomerce__feature-categorytitle">
            <button onClick={() => addWishList(el)}>
              <i
                className={
                  activeWishList?.includes(el._id)
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
                style={{ color: activeWishList?.includes(el._id) ? "red" : "" }}
              />
            </button>
          </div>

          <div className="woocomerce__feature-titlewraper">
            <Link
              href={`/shop/${el._id}`}
              className="woocomerce__feature-producttitle"
            >
              {el.name}
            </Link>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="price-container d-flex flex-column flex-md-row">
              <span className="woocomerce__feature-newprice">
                ₹
                {selectedVariant?.discountPrice ||
                  selectedVariant?.price ||
                  "N/A"}
              </span>
              {selectedVariant?.discountPrice && (
                <span className="woocomerce__feature-oldprice">
                  <span className="mrp-text">MRP</span>
                  <s className="price-value p-1">₹{selectedVariant.price}</s>
                </span>
              )}
            </div>

            <div className="dropdown">
              <button
                className="dropdown-toggle text-decoration-underline"
                type="button"
                onClick={toggleDropdown}
                style={{ color: "#fff" }}
              >
                {selectedVariant?.size || "Select Size"}
              </button>
              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                {el.variants?.map((variant) => (
                  <li key={variant._id}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => handleVariantChange(variant)}
                    >
                      {variant.size}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- PRODUCT MODAL (only for this product) ---------- */}
      <ProductModal
        show={showProductModal}
        onHide={closeProductModal}
        product={el}
        selectedVariant={selectedVariant}
        onProceedToCheckout={(data) => {
          console.log(data, "from product modal");
          if (data && data.quantity && data.quantity > 1) {
            setQuantity(data.quantity || 1);
          }

          dispatch(setBuyProduct(data));
          if (data && data.variant) {
            setSelectedVariant(data.variant);
          }
          closeProductModal();
          setShowAddressModal(true);
        }}
      />

      {/* ---------- SHIPPING ADDRESS MODAL ---------- */}
      {showAddressModal && (
        <ShippingAddressModal
          show={showAddressModal}
          onHide={() => {
            setShowAddressModal(false);
            dispatch(setBuyProduct(null));
          }}
          product={el}
          selectedVariant={selectedVariant}
          count={quantity}
        />
      )}

      {/* ---------- AUTH MODAL ---------- */}
      <Modal
        show={showAuthModal}
        onHide={closeAuth}
        title={isSignUp ? "Sign Up" : "Sign In"}
        size="md"
      >
        {isSignUp ? (
          <SignUpForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onOpenSignInModal={openSignIn}
          />
        ) : (
          <SignInForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onHide={closeAuth}
            onOpenSignUpModal={openSignUp}
          />
        )}
      </Modal>
    </>
  );
};

export default ProductCard;
