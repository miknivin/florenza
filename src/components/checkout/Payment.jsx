"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { validateOrder } from "@/store/features/orderValidationSlice";
import { calculateOrderTotals } from "@/helpers/checkOutTotals";
import InfoIcon from "../icons/InfoIcon";
import { toast } from "react-toastify";
import PriceBreakdownPopover from "../common/popovers/PriceBreakDownPopover";

export default function Payment({
  paymentSubmit,
  totalCost,
  setPaymentMethod,
  isLoading,
}) {
  const [active, setActive] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();
  const { cartData } = useSelector((state) => state.cart);
  const { shippingInfo } = useSelector((state) => state.orderValidation);

  useEffect(() => {
    setIsClient(true);
    setPaymentMethod(1); // Default to Razorpay
  }, [setPaymentMethod]);

  // ── NEW: live totals based on selected payment method ──
  const { totalAmount: liveTotal, shippingAmount } = calculateOrderTotals(
    cartData,
    active // 1 = Online, 2 = COD
  );
  const itemsTotal = cartData.reduce((t, i) => t + i.price * i.quantity, 0);

  const handlePaymentChange = (value) => {
    setActive(value);
    setPaymentMethod(value);
    // Validate payment method with shippingInfo from orderValidation
    const { itemsPrice, shippingAmount, totalAmount } = calculateOrderTotals(
      cartData,
      value
    );
    dispatch(
      validateOrder({
        orderData: {
          cartItems: cartData,
          shippingInfo,
          paymentMethod: value === 1 ? "Online" : "COD",
          itemsPrice: itemsPrice,
          taxAmount: 0,
          shippingAmount: shippingAmount,
          totalAmount: totalAmount,
          orderNotes: shippingInfo?.msg || "",
          couponApplied: "No",
        },
        showToast: false,
      })
    );
  };

  return (
    <div className="woocomerce__cart-left checkout">
      <ul className="woocomerce__cart-payheaderup">
        <li className="woocomerce__cart-topamount">
          Amount: ₹{isClient ? liveTotal : "Loading..."}{" "}
          <PriceBreakdownPopover
            itemsTotal={itemsTotal}
            shippingAmount={shippingAmount}
            total={liveTotal}
          />
        </li>
        <li style={{ zIndex: 0 }} className="woocomerce__cart-upcart">
          <Link href="/cart">Update Cart</Link>
        </li>
      </ul>

      <span className="woocomerce__cart-checktitle">Payment</span>
      <p className="woocomerce__cart-checkdis">
        * All transactions are secure and encrypted.
      </p>
      <div className="woocomerce__cart-paymentmenu">
        <div className="woocomerce__cart-paymentoptions w-100">
          <label
            htmlFor="razorpay"
            className="woocomerce__cart-paymentoption w-100"
          >
            <div className="woocomerce__cart-payheader px-0 w-100">
              <div className="woocomerce__cart-payleft">
                <input
                  type="radio"
                  name="payment"
                  id="razorpay"
                  checked={active === 1}
                  onChange={() => handlePaymentChange(1)}
                />
                <p>Prepaid (Razorpay)</p>
              </div>
              <div className="woocomerce__cart-checkright">
                <ul className="woocomerce__cart-cardlist">
                  <li>
                    <Image
                      width={113}
                      height={45.5}
                      src="/assets/imgs/woocomerce/payment/payment_methods.png"
                      alt="razorpay"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </label>

          <label
            htmlFor="cash"
            className="woocomerce__cart-paymentoption w-100"
          >
            <div className="woocomerce__cart-payheader px-0 pb-1">
              <div className="woocomerce__cart-payleft">
                <input
                  type="radio"
                  name="payment"
                  id="cash"
                  checked={active === 2}
                  onChange={() => handlePaymentChange(2)}
                />
                <p>Cash on Delivery</p>
              </div>
              <div className="woocomerce__cart-checkright">
                <ul className="woocomerce__cart-cardlist">
                  <li>
                    <Image
                      width={113}
                      height={45.5}
                      src="/assets/imgs/woocomerce/payment/cod.png"
                      alt="cash"
                    />
                  </li>
                </ul>
              </div>
            </div>
            {active === 2 && (
              <p
                style={{ color: "#D97706" }}
                className="woocomerce__cart-checkdis"
              >
                Extra ₹100 shipping charge will be applied for Cash on Delivery
                orders.
              </p>
            )}
          </label>
        </div>
        <div className="woocomerce__checkout-btnwrapper">
          <button
            onClick={paymentSubmit}
            className="woocomerce__checkout-submitbtn"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
