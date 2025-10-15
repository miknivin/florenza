"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  validateOrder,
  clearErrors,
  clearShippingInfo,
} from "@/store/features/orderValidationSlice";
import {
  setBuyProduct,
  clearBuyProduct,
  setOrderProduct,
  clearCart,
} from "@/store/features/cartSlice";
import {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
} from "@/store/api/orderApi";
import Modal from "@/components/common/modal/ReusableModal";
import Autocomplete from "@/components/shared/AutoComplete";
import { countries } from "@/data/countries";
import { states } from "@/data/states";
import { handleRazorpayPayment } from "@/helpers/razorpayHelper";
import {
  validateShippingForm,
  validatePaymentForm,
} from "@/helpers/buyProductValidation";
import BackIcon from "@/components/icons/BackIcon";
import { Preloader } from "@/components";

const ShippingAddressModal = ({
  show,
  onHide,
  product,
  selectedVariant,
  count,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartData } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user) || {};
  const [createNewOrder, { isLoading: createOrderLoading }] =
    useCreateNewOrderMutation();
  const [razorpayCheckoutSession, { isLoading: sessionLoading }] =
    useRazorpayCheckoutSessionMutation();
  const [razorpayWebhook] = useRazorpayWebhookMutation();
  const [formData, setFormData] = useState({
    pincode: "",
    fullName: user.name || "",
    email: user.email || "",
    phoneNo: user.phone || "",
    houseNoBuilding: "",
    streetArea: "",
    orderNotes: "",
    state: "",
    city: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});
  const [fetched, setFetched] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("");
  const [step, setStep] = useState("shipping");
  const [paymentError, setPaymentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePayment, setActivePayment] = useState(1);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false); // Added for Preloader

  // Calculate total cost
  const totalCost = selectedVariant?.discountPrice
    ? selectedVariant.discountPrice * count
    : selectedVariant?.price * count;

  // Load Razorpay script when payment step is reached
  useEffect(() => {
    if (step === "payment") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [step]);

  // Filter states based on selected country
  useEffect(() => {
    const country = countries.find((c) => c.name === selectedCountry);
    const countryId = country ? country.id : "";
    const filtered = states.filter((state) => state.country_id == countryId);
    setFilteredStates(filtered);
    if (!filtered.some((state) => state.name === formData.state)) {
      setFormData((prev) => ({ ...prev, state: "" }));
      setSelectedState("");
    }
  }, [selectedCountry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFetchError("");
    setPaymentError("");
  };

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setActivePayment(value === "Online" ? 1 : 2);
    setPaymentError("");
  };

  const handleFetchLocation = async () => {
    if (!formData.pincode) {
      setFetchError("Please enter a PIN code");
      return;
    }
    setFetchError("");

    const timeout = setTimeout(() => {
      setFetched(true);
    }, 3000);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${formData.pincode}`
      );
      if (!response.ok) {
        throw new Error("Invalid PIN code");
      }

      const data = await response.json();

      if (
        !data ||
        !Array.isArray(data) ||
        data[0].Status !== "Success" ||
        !data[0].PostOffice ||
        data[0].PostOffice.length === 0
      ) {
        throw new Error("Invalid or unknown PIN code");
      }

      const place = data[0].PostOffice[0];

      setFormData((prev) => ({
        ...prev,
        state: place.State,
        country: place.Country || "India",
        houseNoBuilding: "",
        streetArea: `${place.Name}, ${place.District}`,
      }));

      setSelectedCountry(place.Country || "India");
      setSelectedState(place.State);

      clearTimeout(timeout);
      setFetched(true);
    } catch (err) {
      setFetchError(
        err.message || "Failed to fetch location. Please check the PIN code."
      );
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateShippingForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setStep("payment");
    setActivePayment(1);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentForm(activePayment, setPaymentError)) {
      return;
    }
    setIsLoading(true);

    if (!user.id) {
      toast.error("Please sign in to place an order", {
        position: "top-center",
        autoClose: 2000,
      });
      router.push("/auth/signin");
      setIsLoading(false);
      return;
    }

    const cartItems = [
      {
        id: product._id,
        name: product.name,
        price: selectedVariant?.discountPrice || selectedVariant?.price,
        quantity: count,
        img: {
          url:
            selectedVariant?.imageUrl?.[0] ||
            product.images[0]?.url ||
            "/assets/imgs/placeholder.jpg",
        },
        sku: product.sku || "",
        variant: selectedVariant?.size || "",
      },
    ];

    const orderData = {
      cartItems,
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: `${formData.houseNoBuilding}, ${formData.streetArea}`,
        houseNoBuilding: formData.houseNoBuilding,
        streetArea: formData.streetArea,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.pincode,
      },
      paymentMethod: activePayment === 1 ? "Online" : "COD",
      itemsPrice: cartItems[0].price * cartItems[0].quantity,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: cartItems[0].price * cartItems[0].quantity,
      orderNotes: formData.orderNotes,
      couponApplied: "No",
    };

    try {
      dispatch(validateOrder({ orderData, showToast: true }));

      if (activePayment === 1) {
        // Razorpay payment
        setIsOrderProcessing(true); // Show loader
        await handleRazorpayPayment({
          orderData,
          razorpayCheckoutSession,
          razorpayWebhook,
          dispatch,
          router,
          shippingInfo: orderData.shippingInfo,
          onHide,
          setLoading: setIsOrderProcessing, // Pass loader callback
        });
      } else {
        // COD payment
        setIsOrderProcessing(true); // Show loader
        await createNewOrder({
          cartItems,
          shippingInfo: orderData.shippingInfo,
          paymentMethod: orderData.paymentMethod,
          taxAmount: orderData.taxAmount,
          shippingAmount: orderData.shippingAmount,
          orderNotes: orderData.orderNotes,
          couponApplied: orderData.couponApplied,
        }).unwrap();
        dispatch(setOrderProduct(cartItems));
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
        onHide(); // Close modal for COD
        setIsOrderProcessing(false); // Hide loader
      }

      dispatch(setBuyProduct(cartItems[0]));
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error(
        err?.data?.message || "Failed to create order. Please try again.",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      setIsOrderProcessing(false); // Hide loader on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(clearBuyProduct());
    setStep("shipping");
    setActivePayment(1);
    setIsLoading(false);
    setIsOrderProcessing(false); // Hide loader
    onHide();
  };

  const handleBackToShipping = () => {
    setStep("shipping");
    setPaymentError("");
    setActivePayment(1);
  };

  return (
    <>
      {isOrderProcessing && <Preloader />} {/* Render Preloader */}
      <Modal
        show={show}
        onHide={handleClose}
        title={step === "shipping" ? "Shipping Address" : "Payment Method"}
        size="md"
      >
        <div
          style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "80vh" }}
          className="woocomerce__auth-form"
        >
          {step === "shipping" ? (
            <form onSubmit={handleShippingSubmit}>
              {!fetched ? (
                <>
                  <div className="woocomerce__checkout-rformfield form-floating mb-3">
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your PIN code"
                    />
                    <label htmlFor="pincode" className="form-label">
                      PIN Code
                    </label>
                  </div>
                  {fetchError && (
                    <p className="text-danger text-sm mb-3">{fetchError}</p>
                  )}
                  <div className="woocomerce__checkout-btnwrapper text-center">
                    <button
                      onClick={handleFetchLocation}
                      className="woocomerce__checkout-submitbtn btn btn-primary"
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="row g-3">
                    <div className="col-md-6 form-floating">
                      <Autocomplete
                        id="country"
                        options={countries}
                        value={selectedCountry}
                        label="Country*"
                        isFloating={true}
                        onChange={(value) => {
                          setSelectedCountry(value);
                          setFormData((prev) => ({ ...prev, country: value }));
                          setErrors((prev) => ({ ...prev, country: "" }));
                        }}
                        placeholder="Select a country"
                        autoComplete="country"
                        error={errors?.country}
                        disabled={false}
                        getOptionValue={(option) => option.name || ""}
                        getOptionLabel={(option) => option.name || ""}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 form-floating">
                      <Autocomplete
                        id="state"
                        label="State*"
                        isFloating={true}
                        options={filteredStates}
                        value={selectedState}
                        onChange={(value) => {
                          setSelectedState(value);
                          setFormData((prev) => ({ ...prev, state: value }));
                          setErrors((prev) => ({ ...prev, state: "" }));
                        }}
                        placeholder="Select a state"
                        autoComplete="address-level1"
                        error={errors?.state}
                        disabled={!selectedCountry}
                        getOptionValue={(option) => option.name || ""}
                        getOptionLabel={(option) => option.name || ""}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 form-floating">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your city"
                      />
                      <label htmlFor="city" className="form-label">
                        City*
                      </label>
                      {errors.city && (
                        <p className="text-danger text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 form-floating">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                      <label htmlFor="fullName" className="form-label">
                        Full Name*
                      </label>
                      {errors.fullName && (
                        <p className="text-danger text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 form-floating">
                      <input
                        type="tel"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your pincode"
                      />
                      <label htmlFor="phoneNo" className="form-label">
                        Pin code*
                      </label>
                      {errors?.pincode && (
                        <p className="text-danger text-sm mt-1">
                          {errors?.pincode}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6 form-floating">
                      <input
                        type="tel"
                        id="phoneNo"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                      <label htmlFor="phoneNo" className="form-label">
                        Phone Number*
                      </label>
                      {errors.phoneNo && (
                        <p className="text-danger text-sm mt-1">
                          {errors.phoneNo}
                        </p>
                      )}
                    </div>
                    <div className="col-12 form-floating">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your email"
                      />
                      <label htmlFor="email" className="form-label">
                        Email*
                      </label>
                      {errors.email && (
                        <p className="text-danger text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="col-12 form-floating">
                      <input
                        type="text"
                        id="houseNoBuilding"
                        name="houseNoBuilding"
                        value={formData.houseNoBuilding}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter house number, building name"
                        autoComplete="address-line1"
                      />
                      <label htmlFor="houseNoBuilding" className="form-label">
                        House No, Building Name*
                      </label>
                      {errors.houseNoBuilding && (
                        <p className="text-danger text-sm mt-1">
                          {errors.houseNoBuilding}
                        </p>
                      )}
                    </div>
                    <div className="col-12 form-floating">
                      <input
                        type="text"
                        id="streetArea"
                        name="streetArea"
                        value={formData.streetArea}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter street name, area"
                        autoComplete="address-line2"
                      />
                      <label htmlFor="streetArea" className="form-label">
                        Street Name, Area*
                      </label>
                      {errors.streetArea && (
                        <p className="text-danger text-sm mt-1">
                          {errors.streetArea}
                        </p>
                      )}
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="woocomerce__checkout-submitbtn btn btn-primary w-100"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              <div className="woocomerce__cart-left checkout p-1">
                <button
                  type="button"
                  role="button"
                  className="btn btn-dark rounded-circle p-1"
                  onClick={handleBackToShipping}
                >
                  <BackIcon />
                </button>
                <div
                  style={{ maxWidth: "100%" }}
                  className="woocomerce__cart-paymentmenu pt-1"
                >
                  <div className="woocomerce__cart-paymentoptions w-100">
                    <label
                      htmlFor="razorpay"
                      className="woocomerce__cart-paymentoption w-100"
                    >
                      <div className="woocomerce__cart-payheader px-0 w-100">
                        <div className="woocomerce__cart-payleft">
                          <input
                            type="radio"
                            name="paymentMethod"
                            id="razorpay"
                            value="Online"
                            checked={activePayment === 1}
                            onChange={handlePaymentMethodChange}
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
                      <div className="woocomerce__cart-payheader px-0">
                        <div className="woocomerce__cart-payleft">
                          <input
                            type="radio"
                            name="paymentMethod"
                            id="cash"
                            value="COD"
                            checked={activePayment === 2}
                            onChange={handlePaymentMethodChange}
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
                      {activePayment === 2 && (
                        <p className="cash-text">
                          You can pay cash on delivery.
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="woocomerce__cart-paymentoptions w-100">
                    <label htmlFor="orderNotes" className="form-label">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Any special instructions?"
                      rows="3"
                    />
                  </div>
                  <div className="woocomerce__checkout-btnwrapper">
                    <button
                      type="submit"
                      className="woocomerce__checkout-submitbtn"
                      disabled={
                        isLoading || createOrderLoading || sessionLoading
                      }
                    >
                      {isLoading || createOrderLoading || sessionLoading
                        ? "Processing..."
                        : `Place Order ₹${totalCost ? totalCost : ""}`}
                    </button>
                  </div>
                </div>
                {paymentError && (
                  <p className="text-danger text-sm mb-3">{paymentError}</p>
                )}
                <p className="woocomerce__cart-checkdis small">
                  * All transactions are secure and encrypted.
                </p>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ShippingAddressModal;
