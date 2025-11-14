// app/shop/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { track } from "@vercel/analytics";

import { Feature, Preloader } from "@/components";
import { addToCart, setBuyProduct } from "@/store/features/cartSlice";

import {
  useGetProductDetailsQuery,
  useGetProductsQuery,
} from "@/store/api/productApi";

import ProductImageSwiper from "./ProductImageSwiper";
import ProductTabs from "./ProductTabs";
import ProductInfo from "./ProductInfo";

import Modal from "@/components/common/modal/ReusableModal";
import SignUpForm from "@/components/auth/SignupForm";
import SignInForm from "@/components/auth/SigninForm";
import ShippingAddressModal from "../product-details-components/ShippingAddressModal";
import Link from "next/link";
import ComboSwiper from "@/components/common/card/product-card-newui/combo/ComboSwiper";

export default function ProductDetailsNewUi({ id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cartData } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.user);

  const [count, setCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { data, isLoading, error } = useGetProductDetailsQuery(id, {
    retry: 3,
  });
  const product = data?.product;

  // === FETCH ALL PRODUCTS (for related) ===
  // const {
  //   data: allProductsData,
  //   isLoading: allLoading,
  //   error: allError,
  // } = useGetProductsQuery({
  //   page: 1,
  //   resPerPage: 100, // adjust if needed
  // });

  // const relatedProducts =
  //   allProductsData?.filteredProducts?.filter((p) => p._id !== id) || [];

  // === EFFECTS ===
  useEffect(() => {
    if (searchParams.get("toBuyNow") === "true" && isAuthenticated) {
      onBuyNowHandler();
    }
  }, [isAuthenticated, searchParams]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);

      // Track Facebook Pixel ViewContent event
      if (typeof window !== "undefined" && window.fbq) {
        const variant = product.variants[0];
        window.fbq("track", "ViewContent", {
          value: variant?.discountPrice || variant?.price || 0,
          currency: "INR",
          content_ids: [product._id],
          content_name: product.name,
          content_type: "product",
          content_category: product.category || "fragrance",
        });
      }
    }
  }, [product]);

  if (isLoading) return <Preloader />;
  if (error || !product)
    return <div className="text-center py-5">Product not found.</div>;

  // === HELPERS ===
  const warningTost = (msg) =>
    toast.warn(msg, { position: "top-center", autoClose: 2000 });
  const successTost = (msg) =>
    toast.success(msg, { position: "top-center", autoClose: 1000 });

  const percentage = (disc, orig) =>
    Number((100 - (100 * disc) / orig).toFixed(2));

  const star = (reviews) => {
    const avg = Math.round(
      reviews.reduce((a, r) => a + r.star, 0) / reviews.length
    );
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className="fa-solid fa-star"
        style={{ color: i < avg ? "#FFAE4F" : "gray" }}
      />
    ));
  };

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);

    // Remove toBuyNow query param

    const params = new URLSearchParams(searchParams);

    params.delete("toBuyNow");

    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const addToCartHandler = () => {
    if (!selectedVariant) return warningTost("Select a variant");

    const firstImg = selectedVariant.imageUrl?.[0] ?? product.images[0]?.url;
    const imgUrl = firstImg || "/assets/imgs/placeholder.jpg";
    const item = {
      id: product._id,
      name: product.name,
      price: selectedVariant.discountPrice || selectedVariant.price,
      quantity: count,
      img: { url: imgUrl },
      sku: product.sku,
      variant: selectedVariant.size,
    };
    if (cartData.some((c) => c.id === item.id && c.variant === item.variant)) {
      warningTost("Already in cart");
    } else {
      // Track Vercel Analytics AddToCart event
      if (track && typeof track === "function") {
        track("AddToCart", {
          product_name: item.name,
          product_id: item.id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
        });
        console.log("Vercel Analytics AddToCart tracked");
      }

      // Track Facebook Pixel AddToCart event
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddToCart", {
          value: selectedVariant?.discountPrice || selectedVariant?.price || 0,
          currency: "INR",
          content_ids: [item.id],
          content_name: item.name,
          content_type: "product",
          contents: [
            {
              id: item.id,
              quantity: item.quantity,
              item_price:
                selectedVariant?.discountPrice || selectedVariant?.price || 0,
            },
          ],
        });
      }

      dispatch(addToCart(item));
      successTost("Added to cart");
    }
  };

  const onBuyNowHandler = () => {
    if (!selectedVariant) return warningTost("Select a variant");
    if (!isAuthenticated) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("toBuyNow", "true");
      router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
      setIsSignUp(false);
      setShowModal(true);
      return;
    }

    const firstImg = selectedVariant.imageUrl?.[0] ?? product.images[0]?.url;
    const imgUrl = firstImg || "/assets/imgs/placeholder.jpg";
    const item = {
      id: product._id,
      name: product.name,
      price: selectedVariant.discountPrice || selectedVariant.price,
      quantity: count,
      img: { url: imgUrl },
      sku: product.sku,
      variant: selectedVariant.size,
    };

    // Track Vercel Analytics BuyNow event
    if (track && typeof track === "function") {
      track("BuyNow", {
        product_name: item.name,
        product_id: item.id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
      });
      console.log("Vercel Analytics BuyNow tracked");
    }

    dispatch(setBuyProduct(item));
    successTost("Proceeding to checkout");
    setShowAddressModal(true);
  };

  const images = selectedVariant?.imageUrl?.length
    ? selectedVariant.imageUrl.map((url) => ({ url }))
    : product.images;

  return (
    <>
      {/* === MAIN PRODUCT GRID === */}
      <section className="py-4">
        <div className="sec-plr-50">
          <div className="row g-4">
            {/* LE FT COLUMN: Image + Tabs */}
            <div className="col-lg-6">
              <nav className="d-block d-lg-none" aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-muted" href="/">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link className="text-muted" href="/shop/full">
                      Shop
                    </Link>
                  </li>
                  <li
                    className="text-black breadcrumb-item active"
                    aria-current="page"
                  >
                    {product.name}
                  </li>
                </ol>
              </nav>
              <ProductImageSwiper images={images} />
            </div>

            {/* RIGHT COLUMN: Info */}
            <div className="col-lg-6">
              {/* Breadcrumb */}
              <nav
                className="d-none text-black d-lg-block"
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-muted" href="/">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item ">
                    <Link className="text-muted" href="/shop/full">
                      Shop
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active text-black"
                    aria-current="page"
                  >
                    {product.name}
                  </li>
                </ol>
              </nav>

              <ProductInfo
                name={product.name}
                product={product}
                sku={product.sku}
                shortDescription={product.shortDescription}
                selectedVariant={selectedVariant}
                variants={product.variants}
                fragranceNotes={product.fragranceNotes}
                count={count}
                onVariantSelect={setSelectedVariant}
                onIncrease={() => setCount((c) => c + 1)}
                onDecrease={() => setCount((c) => (c > 1 ? c - 1 : 1))}
                onAddToCart={addToCartHandler}
                onBuyNow={onBuyNowHandler}
                percentage={percentage}
                star={star}
                reviews={product.reviews}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ProductTabs
                description={product.description}
                reviews={product.reviews}
                features={product.features || []}
              />
            </div>
          </div>
        </div>
      </section>

      <ComboSwiper />

      {/* {allLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading related products…</span>
          </div>
        </div>
      ) : allError ? (
        <p className="text-center text-danger">
          Failed to load related products.
        </p>
      ) : relatedProducts.length > 0 ? (
        <Feature featured={relatedProducts} headerTitle="Related" />
      ) : null} */}

      <Modal
        show={showModal}
        size="md"
        onHide={() => setShowModal(false)}
        title={isSignUp ? "Sign Up" : "Sign In"}
      >
        {isSignUp ? (
          <SignUpForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onOpenSignInModal={handleOpenSignInModal}
          />
        ) : (
          <SignInForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onHide={handleModalClose}
            onOpenSignUpModal={handleOpenSignUpModal}
          />
        )}
      </Modal>

      <ShippingAddressModal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        product={product}
        selectedVariant={selectedVariant}
        count={count}
      />
    </>
  );
}
