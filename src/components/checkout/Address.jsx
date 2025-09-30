"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  updateShippingInfo,
  validateOrder,
} from "@/store/features/orderValidationSlice";
import { countries } from "@/data/countries";
import { states } from "@/data/states";
import { cities } from "@/data/cities";
import Modal from "../common/modal/ReusableModal";
import SignInForm from "@/components/auth/SigninForm";
import SignUpForm from "@/components/auth/SignupForm";
import Autocomplete from "../shared/AutoComplete";

export default function Address() {
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("");
  const [filteredState, setFilteredState] = useState([]);
  const [filteredCity, setFilteredCity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { cartData, totalCost } = useSelector((state) => state.cart);
  const { shippingInfo, errors } = useSelector(
    (state) => state.orderValidation
  );

  useEffect(() => {
    // Find the country ID based on selectedCountry name
    const country = countries.find((c) => c.name === selectedCountry);
    const countryId = country ? country.id : "";
    const filteredStates = states.filter(
      (state) => state.country_id == countryId
    );
    setFilteredState(filteredStates);
    if (!filteredStates.some((state) => state.name === selectedState)) {
      setSelectedState("");
      dispatch(updateShippingInfo({ state: "" }));
    }
    dispatch(updateShippingInfo({ city: "" }));
  }, [selectedCountry, dispatch]);

  useEffect(() => {
    // Find the state ID based on selectedState name
    const state = filteredState.find((s) => s.name === selectedState);
    const stateId = state ? state.id : "";
    const filteredCities = cities.filter((city) => city.state_id == stateId);
    setFilteredCity(filteredCities);
    dispatch(updateShippingInfo({ city: "" }));
  }, [selectedState, filteredState, dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(updateShippingInfo({ [field]: value }));
    dispatch(
      validateOrder({
        orderData: {
          cartItems: cartData,
          shippingInfo: { ...shippingInfo, [field]: value },
          itemsPrice: cartData.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          taxAmount: 0,
          shippingAmount: 0,
          totalAmount: totalCost,
        },
        showToast: false,
      })
    );
  };

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
  };

  const handleOpenSignInModal = () => {
    setIsSignUp(false);
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
      <div className="woocomerce__cart-right checkout">
        <span className="woocomerce__checkout-rtitle">Shipping Address</span>
        <div className="woocomerce__checkout-rform">
          <form>
            <div
              className="woocomerce__checkout-frfieldwrapper"
              style={{
                display: "grid",
                gridTemplateColumns: isAuthenticated ? "1fr" : "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{ order: 1 }}
                className="woocomerce__checkout-rformfield"
              >
                <label htmlFor="fullName" className="form-label">
                  Full Name*
                </label>
                <input
                  id="fullName"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={shippingInfo.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  type="text"
                  className="form-control"
                />
                {errors?.fullName && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.fullName}
                  </span>
                )}
              </div>
              {!isAuthenticated && (
                <div
                  style={{ order: 2 }}
                  className="woocomerce__checkout-fieldright"
                >
                  <p>
                    Already have an account? <br />
                    <span
                      className="text-info"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setShowModal(true)}
                    >
                      Log in
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="woocomerce__checkout-frfieldwrapperc">
              <Autocomplete
                id="country"
                label="Country / Region*"
                options={countries}
                value={selectedCountry}
                onChange={(value) => {
                  setSelectedCountry(value);
                  handleInputChange("country", value);
                }}
                placeholder="Select a country"
                autoComplete="country"
                error={errors?.country}
                disabled={false}
                getOptionValue={(option) => option.name || ""}
                getOptionLabel={(option) => option.name || ""}
              />
            </div>
            {/* <div
              className="woocomerce__checkout-frfieldwrapper2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem",
              }}
            >
              
            </div> */}

            <div className="woocomerce__checkout-frfieldwrapper2">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="phoneNo" className="form-label">
                  Phone*
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {selectedCountry && (
                    <input
                      id="countryCode"
                      value={
                        countries.find((c) => c.name === selectedCountry)
                          ?.phoneCode
                          ? `+${
                              countries.find((c) => c.name === selectedCountry)
                                .phoneCode
                            }`
                          : ""
                      }
                      readOnly
                      style={{
                        width: "70px",
                        padding: "0.5rem",
                        backgroundColor: "#f1f1f1",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                      }}
                      className="form-control d-flex justify-content-center"
                    />
                  )}
                  <input
                    id="phoneNo"
                    placeholder="Phone"
                    autoComplete="tel"
                    value={shippingInfo.phoneNo}
                    onChange={(e) =>
                      handleInputChange("phoneNo", e.target.value)
                    }
                    type="tel"
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                </div>
                {errors?.phoneNo && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.phoneNo}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="email" className="form-label">
                  Email*
                </label>
                <input
                  id="email"
                  placeholder="Your email"
                  autoComplete="email"
                  value={shippingInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                  className="form-control"
                />
                {errors?.email && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapper3">
              <Autocomplete
                id="state"
                label="State*"
                options={filteredState}
                value={selectedState}
                onChange={(value) => {
                  setSelectedState(value);
                  handleInputChange("state", value);
                }}
                placeholder="Select a state"
                autoComplete="address-level1"
                error={errors?.state}
                disabled={!selectedCountry}
                getOptionValue={(option) => option.name || ""}
                getOptionLabel={(option) => option.name || ""}
              />
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="city" className="form-label">
                  City / Town*
                </label>
                <input
                  id="city"
                  placeholder="City"
                  autoComplete="address-level2"
                  value={shippingInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  type="text"
                  className="form-control"
                />
                {errors?.city && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.city}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="zipCode" className="form-label">
                  Zip Code*
                </label>
                <input
                  id="zipCode"
                  placeholder="Zip Code"
                  autoComplete="postal-code"
                  value={shippingInfo.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  type="text"
                  className="form-control"
                />
                {errors?.zipCode && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.zipCode}
                  </span>
                )}
              </div>
            </div>

            <div className="woocomerce__checkout-frfieldwrapperc">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="houseNoBuilding" className="form-label">
                  House No, Building Name*
                </label>
                <input
                  id="houseNoBuilding"
                  placeholder="House No, Building Name"
                  autoComplete="address-line1" // Updated
                  value={shippingInfo.houseNoBuilding}
                  onChange={(e) =>
                    handleInputChange("houseNoBuilding", e.target.value)
                  }
                  type="text"
                  className="form-control"
                />
                {errors?.houseNoBuilding && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.houseNoBuilding}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="streetArea" className="form-label">
                  Street Name, Area*
                </label>
                <input
                  id="streetArea"
                  placeholder="Street Name, Area"
                  autoComplete="address-line2" // Updated
                  value={shippingInfo.streetArea}
                  onChange={(e) =>
                    handleInputChange("streetArea", e.target.value)
                  }
                  type="text"
                  className="form-control"
                />
                {errors?.streetArea && (
                  <span className="warning_text text-danger" role="alert">
                    {errors.streetArea}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-msg">
                <label htmlFor="msg" className="form-label">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="msg"
                  placeholder="Write your order note....."
                  value={shippingInfo.msg}
                  onChange={(e) => handleInputChange("msg", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
