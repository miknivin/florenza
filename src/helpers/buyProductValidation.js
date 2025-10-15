export const validateShippingForm = (formData) => {
  const newErrors = {};
  if (!formData.fullName) newErrors.fullName = "Full name is required";
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }
  if (!formData.phoneNo) {
    newErrors.phoneNo = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.phoneNo)) {
    newErrors.phoneNo = "Phone number must be 10 digits";
  }
  if (!formData.houseNoBuilding)
    newErrors.houseNoBuilding = "House No, Building Name is required";
  if (!formData.streetArea)
    newErrors.streetArea = "Street Name, Area is required";
  if (!formData.country) newErrors.country = "Country is required";
  if (!formData.state) newErrors.state = "State is required";
  if (!formData.pincode) newErrors.pincode = "PIN code is required";
  return newErrors;
};

export const validatePaymentForm = (activePayment, setPaymentError) => {
  if (!activePayment) {
    setPaymentError("Please select a payment method");
    return false;
  }
  return true;
};
