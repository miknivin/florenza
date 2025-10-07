"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector, useStore } from "react-redux";
import { toast } from "react-toastify";
import Payment from "@/components/checkout/Payment";
import Address from "@/components/checkout/Address";
import Modal from "../common/modal/ReusableModal";
import SignInForm from "@/components/auth/SigninForm";
import SignUpForm from "@/components/auth/SignupForm";
import { setOrderProduct, clearCart } from "@/store/features/cartSlice";
import {
  validateOrder,
  clearErrors,
  clearShippingInfo,
} from "@/store/features/orderValidationSlice";
import {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
} from "@/store/api/orderApi";
import { Preloader } from "..";

export default function CheckoutContent() {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const store = useStore();
  const dispatch = useDispatch();
  const { cartData, totalCost } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isValid, errors, shippingInfo } = useSelector(
    (state) => state.orderValidation
  );
  const [createNewOrder, { isLoading, error }] = useCreateNewOrderMutation();
  const [razorpayCheckoutSession, { isLoading: sessionLoading }] =
    useRazorpayCheckoutSessionMutation();
  const [razorpayWebhook] = useRazorpayWebhookMutation();

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
  };

  const handleOpenSignInModal = () => {
    setIsSignUp(false);
  };

  const handleOrderSubmission = async () => {
    console.log("executed");

    if (!isAuthenticated) {
      window.scrollTo(0, 0);
      toast.error("You need to log in to place an order.", {
        position: "top-center",
        autoClose: 2000,
      });
      setShowModal(true);
      return;
    }

    const orderData = {
      cartItems: cartData,
      shippingInfo,
      paymentMethod: paymentMethod === 1 ? "Online" : "COD",
      itemsPrice: cartData.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: totalCost,
      orderNotes: shippingInfo.msg || "",
      couponApplied: "No",
    };

    dispatch(validateOrder({ orderData, showToast: true }));
    const { isValid: updatedIsValid } = store.getState().orderValidation;

    const isOrderValid =
      cartData.length > 0 &&
      shippingInfo.fullName &&
      shippingInfo.email &&
      shippingInfo.phoneNo &&
      shippingInfo.address &&
      paymentMethod !== null;

    if (!updatedIsValid || !isOrderValid) {
      return;
    }

    try {
      if (paymentMethod === 1) {
        // Razorpay payment
        const response = await razorpayCheckoutSession(orderData).unwrap();
        const { orderId: razorpayOrderId } = response;

        // Initialize Razorpay payment modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          order_id: razorpayOrderId,
          amount: totalCost * 100,
          currency: "INR",
          name: "Florenza",
          description: "Order Payment",
          handler: async (response) => {
            try {
              setIsWebhookLoading(true);
              const webhookResponse = await razorpayWebhook({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartData,
                shippingInfo,
                taxAmount: orderData.taxAmount,
                shippingAmount: orderData.shippingAmount,
                orderNotes: orderData.orderNotes,
                couponApplied: orderData.couponApplied,
              }).unwrap();

              if (webhookResponse.success) {
                dispatch(setOrderProduct(cartData));
                dispatch(clearCart());
                dispatch(clearErrors());
                dispatch(clearShippingInfo());
                toast.success("Order created successfully!", {
                  position: "top-center",
                  autoClose: 1000,
                });
                router.push({
                  pathname: "/profile",
                  query: { tab: "order" },
                });
              }
            } catch (err) {
              console.error("Webhook error:", err);
              toast.error("Payment verification failed. Please try again.", {
                position: "top-center",
                autoClose: 2000,
              });
            } finally {
              setIsWebhookLoading(false);
            }
          },
          prefill: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            contact: shippingInfo.phoneNo,
          },
          notes: {
            address: shippingInfo.address,
          },
          theme: {
            color: "#6c757d", // Use neutral gray instead of primary color
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // COD payment
        const response = await createNewOrder(orderData).unwrap();
        dispatch(setOrderProduct(cartData));
        dispatch(clearCart());
        dispatch(clearErrors());
        dispatch(clearShippingInfo());
        toast.success("Order created successfully!", {
          position: "top-center",
          autoClose: 1000,
        });
        router.push({
          pathname: "/profile",
          query: { tab: "order" },
        });
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error(
        err?.data?.message || "Failed to create order. Please try again.",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
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
            onHide={() => setShowModal(false)}
            onOpenSignUpModal={handleOpenSignUpModal}
          />
        )}
      </Modal>
      {(isLoading || sessionLoading || isWebhookLoading) && <Preloader />}
      <div
        className="woocomerce__cart checkout-page"
        style={{
          display:
            isLoading || sessionLoading || isWebhookLoading ? "none" : "block",
        }}
      >
        <div className="woocomerce__cart-wrapper">
          <Payment
            paymentSubmit={handleOrderSubmission}
            totalCost={totalCost}
            setPaymentMethod={setPaymentMethod}
            isLoading={isLoading}
          />
          <Address />
        </div>
      </div>
    </>
  );
}
