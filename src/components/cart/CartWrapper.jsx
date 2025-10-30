"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { Preloader, CartContent } from "@/components";
import {
  setOrderProduct,
  updateQuantity,
  removeFromCart,
} from "@/store/features/cartSlice";
import { track } from "@vercel/analytics";

export default function CartWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartData, totalCost } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion once cartData is available
    if (cartData !== null) {
      setLoading(false);
    }
  }, [cartData]);

  const texCount = () => {
    return 0; // Tax rate set to 0%
  };

  const countTotal = (subTotal) => {
    return subTotal + texCount();
  };

  const goToCheckout = (total) => {
    if (typeof window !== "undefined" && track && typeof track === "function") {
      console.log("tracked");
      track("InitiateCheckout", {
        total: total,
        currency: "INR",
        items: cartData?.length || 0,
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }
    dispatch(setOrderProduct(cartData));
    router.push("/checkout");
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <div className="woocomerce__cart">
          <div className="woocomerce__cart-wrapper cartwrapper">
            <div className="woocomerce__cart-left cartleft">
              <div className="woocomerce__cart-content">
                <ul className="woocomerce__cart-header">
                  <li>Order Summary</li>
                </ul>
                <div className="woocomerce__cart-body">
                  <ul className="woocomerce__cart-amountlist">
                    <li>Subtotal</li>
                    <li>₹{cartData && cartData.length ? totalCost : "0"}</li>
                    <li>Shipping</li>
                    <li>FREE *</li>
                    <li>Estimated Tax (0%)</li>
                    <li>₹{texCount()}</li>
                    <li>Total</li>
                    <li>₹{countTotal(totalCost)}</li>
                  </ul>
                  <p className="woocomerce__cart-info">
                    You can pay our payment by <strong>Cash</strong> or{" "}
                    <strong>Online</strong> <br />
                    gateway system
                  </p>
                  <p className="woocomerce__cart-info">*Free delivery applicable only for prepaid orders</p>
                  
                  <button
                    onClick={() => goToCheckout(countTotal(totalCost))}
                    className="woocomerce__cart-btn"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
            <div className="woocomerce__cart-right cart-right1">
              <div className="woocomerce__cart-cartdata">
                <span className="woocomerce__cart-title">Your Product</span>
              </div>
              {cartData && cartData.length ? (
                cartData.map((el, i) => (
                  <div key={i + "cart"}>
                    <CartContent
                      el={el}
                      dispatch={dispatch}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  </div>
                ))
              ) : (
                <div>
                  <p>No Cart Available</p>
                  <Button className="mt-3" size="sm" variant="dark">
                    <Link className="text-white" href={"/shop/full"}>
                      View All Product
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
