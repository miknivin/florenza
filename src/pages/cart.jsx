"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Preloader, CartContent } from "@/components";
import ProductLayout from "@/components/common/layout/ProductLayout";
import {
  updateQuantity,
  removeFromCart,
  setOrderProduct,
} from "@/store/features/cartSlice";
import { analytics } from "@vercel/analytics/next";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartData, totalCost } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion once cartData is available
    if (cartData) {
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
    console.log("Vercel Analytics:", analytics);

    if (analytics && typeof analytics.track === "function") {
      analytics.track("InitiateCheckout", {
        total: total,
        currency: "INR",
        items: cartData.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } else {
      console.warn("Vercel Analytics is not available.");
    }
    dispatch(setOrderProduct(cartData));
    router.push("/checkout");
  };

  return (
    <>
      {!loading ? (
        <ProductLayout>
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
                      <li>FREE</li>
                      <li>Estimated Tax (0%)</li>
                      <li>₹{texCount()}</li>
                      <li>Total</li>
                      <li>₹{countTotal(totalCost)}</li>
                    </ul>
                    <p className="woocomerce__cart-info">
                      You can pay our payment by <strong>Cash</strong> or{" "}
                      <strong>Online</strong> <br />
                      gateway system{" "}
                      {/* <Image
                        width={15}
                        height={15}
                        src="/assets/imgs/woocomerce/info.png"
                        alt="info"
                      /> */}
                    </p>
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
                      {/* <ul className="woocomerce__cart-menuitems">
                        <li>Item</li>
                        <li>Unit Price</li>
                        <li>Quantity</li>
                        <li>Total</li>
                        <li>Action</li>
                      </ul> */}
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
        </ProductLayout>
      ) : (
        <Preloader />
      )}
    </>
  );
}
