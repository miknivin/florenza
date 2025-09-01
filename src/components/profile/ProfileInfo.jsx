"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/store/api/userApi";

export default function ProfileInfo() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Prepopulate form with user data when available
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "" };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
      isValid = false;
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    // Email or phone required
    if (!formData.email && !formData.phone) {
      newErrors.email = "Email or phone is required";
      newErrors.phone = "Email or phone is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      };
      console.log("user",user)
      // Call the updateProfile mutation
      const response = await updateProfile({
        id: user.id,
        body: updateData,
      }).unwrap();

      // Update form data with response values
      setFormData({
        name: response.name,
        email: response.email,
        phone: response.phone,
      });

      // Show success toast
      toast.success("Profile Updated Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.message || "Failed to update profile", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <div className="woocomerce__account-rtitlewrap">
        <span className="woocomerce__account-rtitle">
          Welcome, {user?.name || "Guest"}
        </span>
      </div>
      <div className="woocomerce__checkout-rform">
        <form onSubmit={onSubmit}>
          <div className="woocomerce__checkout-frfieldwrapperc">
            <div
              className="woocomerce__checkout-rformfield"
              style={{ marginBottom: "25px" }}
            >
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                type="text"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div
              className="woocomerce__checkout-rformfield"
              style={{ marginBottom: "25px" }}
            >
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div
              className="woocomerce__checkout-rformfield"
              style={{ marginBottom: "25px" }}
            >
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="woocomerce__checkout-rformfield">
              <input
                type="submit"
                style={{ lineHeight: "1" }}
                value="Update Profile"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}