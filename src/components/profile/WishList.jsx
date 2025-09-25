"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import WishListItem from "./WishListItem";
import { setAllWishList } from "@/store/features/cartSlice";

export default function WishList() {
  const dispatch = useDispatch();
  const { allWishList } = useSelector((state) => state.cart);
  const [wishlistData, setWishlistData] = useState([]);

  const removeWishlist = (data) => {
    let oldData = [...wishlistData];
    let result = oldData.find((el) => el.parent_id === data.parent_id);
    if (result) {
      let activeIndex = oldData.indexOf(result);
      oldData.splice(activeIndex, 1);
      dispatch(setAllWishList(oldData));
      setWishlistData(oldData);
    }
  };

  useEffect(() => {
    setWishlistData(allWishList);
  }, [allWishList]);

  return (
    <>
      <div className="tab-pane fade show">
        <div className="woocomerce__account-rtitlewrap">
          <span className="woocomerce__account-rtitle">your wishlist: </span>
        </div>

        <div className="wishlist__items">
          {wishlistData && wishlistData.length ? (
            wishlistData.map((el, i) => (
              <WishListItem
                key={i + "wishlist"}
                el={el}
                removeWishlist={removeWishlist}
              />
            ))
          ) : (
            <p>No Wishlist Found</p>
          )}
        </div>
      </div>
    </>
  );
}
