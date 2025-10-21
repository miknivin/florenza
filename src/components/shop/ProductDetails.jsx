"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Accordion } from "react-bootstrap";
import { Feature } from "..";
import { Preloader } from "@/components";
import { toast } from "react-toastify";
import ReviewSection from "../review/ReviewSection";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  setAllWishList,
  setActiveWishList,
  removeFromWishList,
  setBuyProduct,
} from "@/store/features/cartSlice";
import { useState, useEffect } from "react";
import { useGetProductDetailsQuery } from "@/store/api/productApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Grid } from "swiper";
import "swiper/css/grid";
import ProductQuantity from "./product-details-components/ProductSelector";
import Modal from "../common/modal/ReusableModal";
import SignUpForm from "../auth/SignupForm";
import SignInForm from "../auth/SigninForm";
import ShippingAddressModal from "./product-details-components/ShippingAddressModal";

import { track } from "@vercel/analytics";

export default function ProductDetails({ id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartData, allWishList, activeWishList } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const [tab, setTab] = useState(1);
  const [count, setCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { data, isLoading, error } = useGetProductDetailsQuery(id, {
    retry: 3,
  });
  const product = data?.product;

  // Check for buyNow query param on mount
  useEffect(() => {
    if (searchParams.get("toBuyNow") === "true" && isAuthenticated) {
      onBuyNowHandler();
    }
  }, [isAuthenticated, searchParams]);

  const handleOpenSignInModal = () => {
    setIsSignUp(false);
    setShowModal(true);
  };

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
    setShowModal(true);
  };

  const handleOpenAddressModal = () => {
    setShowAddressModal(true);
  };

  // Handle modal close and remove query params
  const handleModalClose = () => {
    setShowModal(false);
    // Remove toBuyNow query param
    const params = new URLSearchParams(searchParams);
    params.delete("toBuyNow");
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    // Remove toBuyNow query param
    const params = new URLSearchParams(searchParams);
    params.delete("toBuyNow");
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  // Auto-select first variant when product data is loaded
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product, id]);

  if (isLoading) {
    return <Preloader />;
  }
  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading product details or product not found.</p>
      </div>
    );
  }

  const warningTost = (data) => {
    toast.warn(data, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const successTost = (data) => {
    toast.success(data, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const percentage = (partialValue, totalValue) => {
    return Number((100 - (100 * partialValue) / totalValue).toFixed(2));
  };

  const star = (data) => {
    let totalStar = 0;
    data.map((el) => {
      totalStar += parseInt(el.star);
    });
    const averageStar = Math.round(totalStar / data.length);
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i + "star"}
          className="fa-solid fa-star"
          style={{ color: i <= averageStar ? "#FFAE4F" : "gray" }}
        />
      );
    }
    return stars;
  };

  const addToCartHandler = () => {
    if (!selectedVariant) {
      warningTost("Please select a variant");
      return;
    }
    const fullData = {
      id: product._id,
      name: product.name,
      price: selectedVariant?.discountPrice || selectedVariant?.price,
      quantity: count,
      img: {
        url:
          selectedVariant?.imageUrl?.[0] ||
          product.images[0]?.url ||
          "/assets/imgs/placeholder.jpg",
        alt: selectedVariant?.imageUrl
          ? "Variant Image"
          : product.images[0]?.alt || "Product Image",
        _id: selectedVariant?.imageUrl ? null : product.images[0]?._id,
      },
      sku: product.sku,
      variant: selectedVariant?.size,
    };
    const existingItem = cartData.find(
      (item) => item.id === fullData.id && item.variant === fullData.variant
    );
    if (existingItem) {
      warningTost("Already added to cart");
    } else {
      // Track "Add to Cart" event
      if (
        typeof window !== "undefined" &&
        track &&
        typeof track === "function"
      ) {
        console.log("Add to Cart tracked");
        track("AddToCart", {
          product_name: fullData.name,
          quantity: fullData.quantity,
        });
      } else {
        console.warn("Vercel Analytics is not available.");
      }
      dispatch(addToCart(fullData));
      successTost("Successfully added to cart");
    }
  };

  const onBuyNowHandler = () => {
    if (typeof window !== "undefined") {
      // Delay ensures Safari completes reflows before scroll
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 50);
      });
    }
    if (!selectedVariant) {
      warningTost("Please select a variant");
      return;
    }

    if (!isAuthenticated) {
      // Add toBuyNow query param
      const params = new URLSearchParams(searchParams);
      params.set("toBuyNow", "true");
      router.push(`${window.location.pathname}?${params.toString()}`);
      handleOpenSignInModal();
      return;
    }

    const fullData = {
      id: product._id,
      name: product.name,
      price: selectedVariant?.discountPrice || selectedVariant?.price,
      quantity: count,
      img: {
        url:
          selectedVariant?.imageUrl?.[0] ||
          product.images[0]?.url ||
          "/assets/imgs/placeholder.jpg",
        alt: selectedVariant?.imageUrl
          ? "Variant Image"
          : product.images[0]?.alt || "Product Image",
        _id: selectedVariant?.imageUrl ? null : product.images[0]?._id,
      },
      sku: product.sku,
      variant: selectedVariant?.size,
    };
    if (typeof window !== "undefined" && track && typeof track === "function") {
      console.log("Buy Now tracked");
      track("BuyNow", {
        product_name: fullData.name,
        quantity: fullData.quantity,
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }

    dispatch(setBuyProduct(fullData));
    successTost("Proceeding to checkout");
    handleOpenAddressModal();
  };

  const addWishListHandler = () => {
    if (!selectedVariant?.size) {
      warningTost("Please select a variant to add to wishlist");
      return;
    }

    const customDetails = {
      parent_id: product._id,
      title: product.name,
      img:
        selectedVariant?.imageUrl?.[0] ||
        product.images[0]?.url ||
        "/assets/imgs/placeholder.jpg",
      price: selectedVariant?.price || product.price,
      dis_price: selectedVariant?.discountPrice || product.dis_price,
      sku: product.sku,
      variant: selectedVariant?.size,
    };

    const wishListArray = Array.isArray(allWishList) ? allWishList : [];

    const existingWishListItem = wishListArray.find(
      (item) =>
        item.parent_id === customDetails.parent_id &&
        item.variant === customDetails.variant
    );

    if (existingWishListItem) {
      dispatch(
        removeFromWishList({
          parent_id: customDetails.parent_id,
          variant: customDetails.variant,
        })
      );
      successTost("Removed from wishlist");
    } else {
      dispatch(setAllWishList([...wishListArray, customDetails]));
      dispatch(
        setActiveWishList([
          ...(Array.isArray(activeWishList) ? activeWishList : []),
          customDetails.parent_id,
        ])
      );
      successTost("Successfully added to wishlist");
    }
  };

  return (
    <>
      {product && Object.keys(product).length ? (
        <div>
          <section className="woocomerce__single sec-plr-50">
            <div className="woocomerce__single-wrapper">
              <div className="woocomerce__single-left">
                <div className="woocomerce__single-productview product_imgs position-relative">
                  <Swiper
                    modules={[Pagination, Grid]}
                    pagination={{
                      clickable: true,
                      el: ".custom-pagination",
                      renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                      },
                    }}
                    grid={{
                      rows: 2,
                      fill: "row",
                    }}
                    spaceBetween={10}
                    slidesPerView={2}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                        grid: {
                          rows: 1,
                        },
                      },
                      1024: {
                        slidesPerView: 2,
                        grid: {
                          rows: 2,
                        },
                      },
                    }}
                    style={{ maxWidth: "100%", height: "auto" }}
                    className="product-swiper"
                  >
                    {(selectedVariant?.imageUrl?.length > 0
                      ? selectedVariant.imageUrl
                      : product.images
                    ).map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="card h-100">
                          <Image
                            priority
                            width={520}
                            height={685}
                            style={{
                              height: "auto",
                              width: "100%",
                              objectFit: "contain",
                            }}
                            src={
                              selectedVariant?.imageUrl?.length > 0
                                ? img
                                : img.url
                            }
                            alt={
                              selectedVariant?.imageUrl?.length > 0
                                ? `Variant Image ${index + 1}`
                                : img.alt || `Product Image ${index + 1}`
                            }
                            onError={(e) => {
                              console.error(
                                "ProductDetails - Image load error:",
                                selectedVariant?.imageUrl?.length > 0
                                  ? img
                                  : img.url
                              );
                              e.currentTarget.src =
                                "/assets/imgs/placeholder.jpg";
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="custom-pagination d-flex justify-content-center mt-3"></div>
                </div>
                <div className="woocomerce__single-productMore fade_bottom">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setTab(1)}
                        type="button"
                        role="tab"
                        className={tab === 1 ? "nav-link active" : "nav-link"}
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={tab === 3 ? "nav-link active" : "nav-link"}
                        onClick={() => setTab(3)}
                        type="button"
                        role="tab"
                      >
                        Reviews
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    {tab === 1 ? (
                      <div>
                        <p className="woocomerce__single-discription2">
                          {product.description || ""}
                        </p>
                        <ul className="woocomerce__single-features">
                          {product?.features?.map((el, i) => (
                            <li key={i + "details"}>
                              <Image
                                width={25}
                                height={14}
                                src="/assets/imgs/woocomerce/check.png"
                                alt="check"
                              />
                              {el}
                            </li>
                          )) || ""}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                    {tab === 3 ? (
                      <div>
                        <ReviewSection reviews={product.reviews || []} />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="woocomerce__single-right wc_slide_btm">
                <ul className="woocomerce__single-breadcrumb">
                  <li>
                    <Link href={"/"}>
                      Home <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/shop/full"}>
                      Shop <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href={"#"}>
                      {product.category}{" "}
                      <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href={"#"}>{product.name}</Link>
                  </li>
                </ul>
                <div className="woocomerce__single-content">
                  <h2 className="woocomerce__single-title">{product.name}</h2>
                  <div className="woocomerce__single-pricelist">
                    <span className="woocomerce__single-discountprice">
                      ₹
                      {(
                        (selectedVariant?.discountPrice ||
                          selectedVariant?.price ||
                          product.dis_price ||
                          product.price ||
                          0) * count
                      ).toFixed(2)}
                    </span>
                    <span className="woocomerce__single-originalprice">
                      {selectedVariant?.discountPrice
                        ? " ₹" + (selectedVariant.price * count).toFixed(2)
                        : product.dis_price
                        ? " ₹" + (product.price * count).toFixed(2)
                        : ""}
                    </span>
                    <span className="woocomerce__single-discount">
                      {selectedVariant?.discountPrice
                        ? percentage(
                            selectedVariant.discountPrice,
                            selectedVariant.price
                          ) + "% OFF"
                        : product.dis_price
                        ? percentage(product.dis_price, product.price) + "% OFF"
                        : ""}
                    </span>

                    <p
                      style={{
                        color: "#6d6868ff",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Inc.TAX
                    </p>
                  </div>
                  {product.reviews && product.reviews.length ? (
                    <div className="woocomerce__single-review">
                      <div className="woocomerce__single-star" id="rating_star">
                        {star(product.reviews)}
                      </div>
                      <span className="woocomerce__single-reviewcount">
                        ({product.reviews.length} Reviews)
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <p className="woocomerce__single-discription">
                      {product.shortDescription || ""}
                    </p>
                    <ul className="woocomerce__single-features">
                      {product?.features?.map((el, i) => (
                        <li key={i + "details"}>
                          <Image
                            width={25}
                            height={14}
                            src="/assets/imgs/woocomerce/check.png"
                            alt="check"
                          />
                          {el}
                        </li>
                      )) || ""}
                    </ul>
                  </div>
                  <div className="woocomerce__single-variations">
                    <Accordion className="accordion" id="accordionExample">
                      <Accordion.Item eventKey="0" className="accordion-item">
                        <Accordion.Header
                          className="accordion-header"
                          id="headingOne"
                        >
                          <div className="woocomerce__single-stitle">
                            Variants
                          </div>
                          <ul className="woocomerce__single-sizelist">
                            <li>
                              {selectedVariant?.size || "Select a variant"}
                            </li>
                          </ul>
                        </Accordion.Header>
                        <Accordion.Body className="accordion-body">
                          <ul className="woocomerce__single-sizelist">
                            {product.variants?.map((variant, i) => (
                              <li
                                key={i + "variant"}
                                className={`cursor-pointer ${
                                  selectedVariant?.size === variant.size
                                    ? "bg-black text-white"
                                    : "text-gray-600"
                                }`}
                                onClick={() => setSelectedVariant(variant)}
                              >
                                {variant.size} - ₹
                                {variant.discountPrice || variant.price}
                                {variant.discountPrice && (
                                  <span className="text-red-500 ml-2">
                                    (Save ₹
                                    {variant.price - variant.discountPrice})
                                  </span>
                                )}
                              </li>
                            )) || <li>No variants available</li>}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                      {product.fragranceNotes &&
                        (product.fragranceNotes.top?.length > 0 ||
                          product.fragranceNotes.heart?.length > 0 ||
                          product.fragranceNotes.base?.length > 0) && (
                          <Accordion.Item
                            eventKey="1"
                            className="accordion-item"
                          >
                            <Accordion.Header
                              className="accordion-header"
                              id="headingTwo"
                            >
                              <div className="woocomerce__single-stitle">
                                Fragrance Notes
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="accordion-body p-0 pb-2">
                              <ul className="d-flex flex-column justify-content-center align-items-start">
                                {product.fragranceNotes.top?.length > 0 && (
                                  <li className="d-flex flex-column align-items-start justify-content-start">
                                    <b className="woocomerce__single-features">
                                      Top
                                    </b>
                                    <p className="woocomerce__single-features mt-2 pt-0">
                                      {product.fragranceNotes.top.join(", ")}
                                    </p>
                                  </li>
                                )}
                                {product.fragranceNotes.heart?.length > 0 && (
                                  <li className="d-flex flex-column align-items-start justify-content-start">
                                    <b className="woocomerce__single-features">
                                      Heart
                                    </b>
                                    <p className="woocomerce__single-features mt-2 pt-0">
                                      {product.fragranceNotes.heart.join(", ")}
                                    </p>
                                  </li>
                                )}
                                {product.fragranceNotes.base?.length > 0 && (
                                  <li className="d-flex flex-column align-items-start justify-content-start">
                                    <b className="woocomerce__single-features">
                                      Base
                                    </b>
                                    <p className="woocomerce__single-features mt-2 pt-0">
                                      {product.fragranceNotes.base.join(", ")}
                                    </p>
                                  </li>
                                )}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                    </Accordion>
                    <p className="woocomerce__single-sku">SKU: {product.sku}</p>
                  </div>

                  <ProductQuantity
                    onBuyNow={onBuyNowHandler}
                    onAddToCart={addToCartHandler}
                    onIncrease={() => setCount(count + 1)}
                    onDecrease={() => setCount(count > 1 ? count - 1 : 1)}
                  />
                </div>
              </div>
            </div>
          </section>
          {product.related_product && product.related_product.length ? (
            <Feature
              featured={product.related_product}
              headerTitle={"Related"}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        title={isSignUp ? "Sign Up" : "Sign In"}
        size="md"
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
        onHide={handleAddressModalClose}
        product={product}
        selectedVariant={selectedVariant}
        count={count}
      />
    </>
  );
}
