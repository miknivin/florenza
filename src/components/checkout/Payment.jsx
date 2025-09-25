"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Payment({
  paymentSubmit,
  totalCost,
  setPaymentMethod,
  isLoading,
}) {
  const [active, setActive] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPaymentMethod(1); // Default to Razorpay
  }, [setPaymentMethod]);

  const handlePaymentChange = (value) => {
    setActive(value);
    setPaymentMethod(value);
  };

  return (
    <div className="woocomerce__cart-left checkout">
      <ul className="woocomerce__cart-payheaderup">
        <li className="woocomerce__cart-topamount">
          Amount: ₹{isClient ? totalCost : "Loading..."}
        </li>
        <li className="woocomerce__cart-upcart">
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
            {active === 1 && (
              <p className="razorpay-text">
                You will be redirected to Razorpay to complete the payment.
              </p>
            )}
          </label>

          <label
            htmlFor="cash"
            className="woocomerce__cart-paymentoption w-100"
          >
            <div className="woocomerce__cart-payheader px-0">
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
              <p className="cash-text">You can pay cash on delivery.</p>
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
