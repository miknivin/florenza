"use client";
import Link from "next/link";
import { useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { countries } from "@/data/countries";
import { states } from "@/data/states";
import { cities } from "@/data/cities";

export default function Address({ reference, updateFormData }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [filteredState, setFilteredState] = useState(null);
  const [filteredCity, setFilteredCity] = useState(null);
  useImperativeHandle(reference, () => ({
    submitForm() {
      return handleSubmit(onSubmit)();
    },
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Concatenate f_name and l_name into fullName
    const fullName = `${data.f_name}${
      data.l_name ? ` ${data.l_name}` : ""
    }`.trim();

    // Create updated data with renamed fields: zipCode and address
    const updatedData = {
      email: data.email,
      country: data.country,
      fullName,
      state: data.state,
      city: data.city,
      zipCode: data.zipCode,
      phone: data.phone,
      address: data.address,
      msg: data.msg,
    };

    updateFormData(updatedData);
  };
  useEffect(() => {
    const filteredStates = states.filter(
      (state) => state.country_id === selectedCountry
    );
    setFilteredState(filteredStates);
  }, [selectedCountry]);

  useEffect(() => {
    const filteredCities = cities.filter(
      (city) => city.state_id === selectedState
    );
    setFilteredCity(filteredCities);
  }, [selectedState]);

  return (
    <>
      <div className="woocomerce__cart-right checkout">
        <span className="woocomerce__checkout-rtitle">Shipping Address</span>
        <div className="woocomerce__checkout-rform">
          <form>
            <div className="woocomerce__checkout-frfieldwrapper">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  placeholder="Your email"
                  {...register("email", {
                    required: "required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
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
              <div className="woocomerce__checkout-fieldright">
                <p>
                  Already have an account? <br />
                  <Link href={"/sign-in"}>Log in</Link>
                </p>
              </div>
            </div>
            <div className="woocomerce__checkout-frfieldwrapperc">
              <div className="woocomerce__checkout-rformfield">
                <label htmlFor="country">Country / Region*</label>
                <select
                  id="country"
                  {...register("country", {
                    required: "required",
                  })}
                  onChange={(e) => setSelectedCountry(e.target.value)}
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
                  {...register("f_name", {
                    required: "required",
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
                  {...register("state", {
                    required: "required",
                  })}
                  disabled={!selectedCountry}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">Select a state</option>
                  {filteredState &&
                    filteredState?.length > 0 &&
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
                  {...register("city", {
                    required: "required",
                  })}
                  disabled={!selectedState}
                >
                  <option value="">Select a city</option>
                  {filteredCity &&
                    filteredCity?.length > 0 &&
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
                  {...register("zipCode", {
                    required: "required",
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
                  {...register("phone", {
                    required: "required",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Please enter number",
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
                  {...register("address", {
                    required: "required",
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
