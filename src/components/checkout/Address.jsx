"use client";
import Link from "next/link";
import { useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { countries } from "@/data/countries";
import { states } from "@/data/states";
import { cities } from "@/data/cities";
import { useSelector } from "react-redux";
import Modal from "../common/modal/ReusableModal";;
import SignInForm from "@/components/auth/SigninForm";
import SignUpForm from "@/components/auth/SignupForm";

export default function Address({ reference }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [filteredState, setFilteredState] = useState([]);
  const [filteredCity, setFilteredCity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setFocus,
    setValue,
    getValues,
  } = useForm();

  useImperativeHandle(reference, () => ({
    async submitForm() {
      const countryValue = getValues("country");
      console.log(
        "Country value before validation:",
        countryValue,
        typeof countryValue
      );
      console.log("Countries array:", countries);

      const isValid = await trigger();
      if (!isValid) {
        console.log("Form validation errors:", errors);
        const errorMessages =
          Object.values(errors)
            .filter((err) => err && err.message)
            .map((err) => err.message)
            .join(", ") || "Please fill in all required fields correctly";
        toast.error(`Please correct the following: ${errorMessages}`, {
          position: "top-center",
          autoClose: 3000,
        });
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          setFocus(firstErrorField);
        }
        return { isValid: false, formData: {} };
      }

      // Get form data after validation
      const data = getValues();
      console.log("Raw form data:", data);

      const selectedCountryData = countries.find(
        (country) => country.id == data.country
      );
      const selectedStateData = states.find((state) => state.id == data.state);
      const selectedCityData = cities.find((city) => city.id == data.city);
      const fullName = `${data.f_name}${
        data.l_name ? ` ${data.l_name}` : ""
      }`.trim();

      const formData = {
        email: data.email,
        country: selectedCountryData ? selectedCountryData.name : "",
        fullName,
        state: selectedStateData ? selectedStateData.name : "",
        city: selectedCityData ? selectedCityData.name : "",
        zipCode: data.zipCode,
        phone: data.phone,
        address: data.address,
        msg: data.msg || "",
      };

      console.log("Returning form data:", formData);
      return { isValid: true, formData };
    },
  }));

  useEffect(() => {
    console.log("Countries data:", countries);
    const filteredStates = states.filter(
      (state) => state.country_id == selectedCountry
    );
    console.log("Filtered states:", filteredStates);
    setFilteredState(filteredStates);
    setSelectedState("");
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  useEffect(() => {
    const filteredCities = cities.filter(
      (city) => city.state_id == selectedState
    );
    console.log("Filtered cities:", filteredCities);
    setFilteredCity(filteredCities);
    setValue("city", "");
  }, [selectedState, setValue]);

  const handleCountryChange = (e) => {
    const value = e.target.value;
    console.log("Country selected:", value, typeof value);
    if (!countries.some((country) => country.id == value)) {
      console.warn("Invalid country value:", value);
      setValue("country", "");
      setSelectedCountry("");
      toast.warn("Invalid country selected. Please choose a valid country.", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      setSelectedCountry(value);
      setValue("country", value);
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    console.log("State selected:", value, typeof value);
    if (
      !states.some(
        (state) => state.id == value && state.country_id == selectedCountry
      )
    ) {
      console.warn("Invalid state value:", value);
      setValue("state", "");
      setSelectedState("");
      toast.warn("Invalid state selected. Please choose a valid state.", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      setSelectedState(value);
      setValue("state", value);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    console.log("City selected:", value, typeof value);
    if (
      !cities.some((city) => city.id == value && city.state_id == selectedState)
    ) {
      console.warn("Invalid city value:", value);
      setValue("city", "");
      toast.warn("Invalid city selected. Please choose a valid city.", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      setValue("city", value);
    }
  };

  // Monitor form for Autofill changes
  useEffect(() => {
    const countryInput = document.getElementById("country");
    const stateInput = document.getElementById("state");
    const cityInput = document.getElementById("city");

    const handleAutofill = () => {
      const countryValue = getValues("country");
      const stateValue = getValues("state");
      const cityValue = getValues("city");

      console.log(
        "Autofill detected - Country:",
        countryValue,
        typeof countryValue
      );
      console.log("Autofill detected - State:", stateValue, typeof stateValue);
      console.log("Autofill detected - City:", cityValue, typeof cityValue);

      if (
        countryValue &&
        !countries.some((country) => country.id == countryValue)
      ) {
        setValue("country", "");
        setSelectedCountry("");
        toast.warn(
          "Invalid country autofilled. Please select a valid country.",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
      } else if (countryValue) {
        setSelectedCountry(countryValue);
      }

      if (
        stateValue &&
        !states.some(
          (state) =>
            state.id == stateValue && state.country_id == selectedCountry
        )
      ) {
        setValue("state", "");
        setSelectedState("");
        toast.warn("Invalid state autofilled. Please select a valid state.", {
          position: "top-center",
          autoClose: 2000,
        });
      } else if (stateValue) {
        setSelectedState(stateValue);
      }

      if (
        cityValue &&
        !cities.some(
          (city) => city.id == cityValue && city.state_id == selectedState
        )
      ) {
        setValue("city", "");
        toast.warn("Invalid city autofilled. Please select a valid city.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    };

    countryInput?.addEventListener("change", handleAutofill);
    stateInput?.addEventListener("change", handleAutofill);
    cityInput?.addEventListener("change", handleAutofill);

    return () => {
      countryInput?.removeEventListener("change", handleAutofill);
      stateInput?.removeEventListener("change", handleAutofill);
      cityInput?.removeEventListener("change", handleAutofill);
    };
  }, [getValues, setValue, selectedCountry, selectedState]);

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
                gridTemplateColumns: isAuthenticated ? "1fr" : "1fr 1fr",
              }}
            >
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  placeholder="Your email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                />
                {errors.email && (
                  <span className="warning_text" role="alert">
                    {errors.email.message}
                  </span>
                )}
              </div>
              {!isAuthenticated && (
                <div className="woocomerce__checkout-fieldright">
                  <p>
                    Already have an account? <br />
                    <span
                      style={{ color: "#007bff", cursor: "pointer" }}
                      onClick={() => setShowModal(true)}
                    >
                      Log in
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="woocomerce__checkout-frfieldwrapperc">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="country">Country / Region*</label>
                <select
                  id="country"
                  autoComplete="country"
                  {...register("country", {
                    required: "Country is required",
                    validate: (value) =>
                      countries.some((country) => country.id == value) ||
                      "Please select a valid country",
                  })}
                  onChange={handleCountryChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <span className="warning_text" role="alert">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapper2">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="f_name">First Name*</label>
                <input
                  id="f_name"
                  placeholder="First Name"
                  autoComplete="given-name"
                  {...register("f_name", {
                    required: "First name is required",
                  })}
                  type="text"
                />
                {errors.f_name && (
                  <span className="warning_text" role="alert">
                    {errors.f_name.message}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="l_name">Last Name</label>
                <input
                  id="l_name"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  {...register("l_name")}
                  type="text"
                />
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapper3">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="state">State*</label>
                <select
                  id="state"
                  autoComplete="address-level1"
                  {...register("state", {
                    required: "State is required",
                    validate: (value) =>
                      !selectedCountry ||
                      states.some(
                        (state) =>
                          state.id == value && state.country_id == selectedCountry
                      ) ||
                      "Please select a valid state",
                  })}
                  disabled={!selectedCountry}
                  onChange={handleStateChange}
                >
                  <option value="">Select a state</option>
                  {filteredState.length > 0 &&
                    filteredState.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                </select>
                {errors.state && (
                  <span className="warning_text" role="alert">
                    {errors.state.message}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="city">City / Town*</label>
                <select
                  id="city"
                  autoComplete="address-level2"
                  {...register("city", {
                    required: "City is required",
                    validate: (value) =>
                      !selectedState ||
                      cities.some(
                        (city) => city.id == value && city.state_id == selectedState
                      ) ||
                      "Please select a valid city",
                  })}
                  disabled={!selectedState}
                  onChange={handleCityChange}
                >
                  <option value="">Select a city</option>
                  {filteredCity.length > 0 &&
                    filteredCity.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                </select>
                {errors.city && (
                  <span className="warning_text" role="alert">
                    {errors.city.message}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="zipCode">Zip Code*</label>
                <input
                  id="zipCode"
                  placeholder="Zip Code"
                  autoComplete="postal-code"
                  {...register("zipCode", {
                    required: "Zip code is required",
                  })}
                  type="text"
                />
                {errors.zipCode && (
                  <span className="warning_text" role="alert">
                    {errors.zipCode.message}
                  </span>
                )}
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapper2">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="phone">Phone*</label>
                <input
                  id="phone"
                  placeholder="Phone"
                  autoComplete="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  type="text"
                />
                {errors.phone && (
                  <span className="warning_text" role="alert">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="address">Address*</label>
                <input
                  id="address"
                  placeholder="Address"
                  autoComplete="street-address"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  type="text"
                />
                {errors.address && (
                  <span className="warning_text" role="alert">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapperc">
              <div className="woocomerce__checkout-msg">
                <label htmlFor="msg">Order Notes (Optional)</label>
                <textarea
                  id="msg"
                  placeholder="Write your order note....."
                  {...register("msg")}
                  type="text"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
