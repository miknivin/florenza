import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAllWishList, setActiveWishList } from "@/store/features/cartSlice";
import ProductModal from "../modal/ProductModal";
import { toast } from "react-toastify";

const ProductCard = ({ el }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    el.variants[0] || null
  ); // Auto-select first variant
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
  const dispatch = useDispatch();
  const allWishList = useSelector((state) => state.cart.allWishList);
  const activeWishList = useSelector((state) => state.cart.activeWishList);

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

  const addWishList = (data) => {
    const customDetails = {
      parent_id: data._id,
      title: data.name,
      img:
        data.images.length > 0
          ? data?.images[0]?.url
          : "/assets/imgs/placeholder.jpg",
      hover_img:
        data.images.length > 1
          ? data?.images[1]?.url
          : "/assets/imgs/placeholder.jpg",
      price: selectedVariant?.price || 0,
      dis_price: selectedVariant?.discountPrice || selectedVariant?.price || 0,
      color: null,
      pro_code: data.sku,
      size: selectedVariant?.size || null,
    };

    if (allWishList && allWishList.length) {
      let result = allWishList.find(
        (el) =>
          el.parent_id === customDetails.parent_id &&
          el.size === customDetails.size
      );
      if (result) {
        warningTost("Already added");
      } else {
        dispatch(setAllWishList([...allWishList, customDetails]));
        dispatch(
          setActiveWishList([...activeWishList, customDetails.parent_id])
        );
        successTost("Successfully added to wishlist");
      }
    } else {
      dispatch(setAllWishList([customDetails]));
      dispatch(setActiveWishList([customDetails.parent_id]));
      successTost("Successfully added to wishlist");
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setIsDropdownOpen(false); // Close dropdown after selecting a variant
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
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
              src={
                el.images.length > 1
                  ? el.images[1]?.url
                  : "/assets/imgs/placeholder.jpg"
              }
              alt="Product Thumbnail"
            />
            <Image
              priority
              width={440}
              height={560}
              style={{ width: "100%", height: "auto" }}
              className="woocomerce__feature-mainImg"
              src={
                el.images.length > 0
                  ? el.images[0]?.url
                  : "/assets/imgs/placeholder.jpg"
              }
              alt="Product Image"
            />
          </div>
        </Link>

        <div className="woocomerce__feature-hover">
          <div
            className="woocomerce__feature-carttext pointer_cursor"
            onClick={() => setModalShow(true)}
          >
            <Image
              width={25}
              height={22}
              src="/assets/imgs/woocomerce/cart.png"
              alt="cart"
            />
            <p>Quick Select</p>
          </div>
          <p
            className="woocomerce__feature-heart pointer_cursor"
            onClick={() => addWishList(el)}
          >
            <i
              className={
                activeWishList?.includes(el._id)
                  ? "fa-solid fa-heart"
                  : "fa-regular fa-heart"
              }
              style={{
                color: activeWishList?.includes(el._id) ? "red" : "",
              }}
            ></i>
          </p>
        </div>
      </div>
      <div className="woocomerce__feature-content">
        <div className="woocomerce__feature-category">
          <Link
            className="woocomerce__feature-categorytitle"
            href={`/category/${el.category}`}
          >
            {el.category}
          </Link>
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
          <div>
            <span className="woocomerce__feature-newprice">
              ₹
              {selectedVariant?.discountPrice ||
                selectedVariant?.price ||
                "N/A"}
            </span>
            <span className="woocomerce__feature-oldprice">
              {selectedVariant?.discountPrice
                ? `₹${selectedVariant.price}`
                : ""}
            </span>
          </div>
          <div className="dropdown" >
            <button
              className="dropdown-toggle text-decoration-underline"
              type="button"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
                style={{ color: '#fff' }}
            >
              {selectedVariant?.size || "Select Size"}
            </button>
            <ul
              className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
              aria-labelledby={`dropdownMenu-${el._id}`}
            >
              {el.variants && el.variants.length > 0 ? (
                el.variants.map((variant) => (
                  <li key={variant._id}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => handleVariantChange(variant)}
                    >
                      {variant.size}
                      
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button className="dropdown-item" type="button" disabled>
                    No variants available
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {modalShow ? (
        <ProductModal product={el} setModalShow={setModalShow} />
      ) : null}
    </div>
  );
};

export default ProductCard;
