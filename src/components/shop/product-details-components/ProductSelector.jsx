import React, { useState } from "react";
import { track } from "@vercel/analytics";

export default function ProductQuantity({
  initialQuantity = 1,
  onDecrease,
  onIncrease,
  onAddToCart,
  onBuyNow,
  productData,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (onDecrease) onDecrease(newQuantity);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (onIncrease) onIncrease(newQuantity);
  };

  const handleAddToCart = () => {
    // Track "Add to Cart" intent
    if (
      typeof window !== "undefined" &&
      track &&
      typeof track === "function" &&
      productData
    ) {
      console.log("Add to Cart intent tracked");
      track("AddToCartIntent", {
        product_name: productData.name,
        quantity: quantity,

      });
    } else {
      console.warn("Vercel Analytics or product data is not available.");
    }
    if (onAddToCart) onAddToCart(quantity);
  };

  const handleBuyNow = () => {
    
    if (onBuyNow) onBuyNow(quantity);
  };

  return (
    <div className="container mt-4 p-0">
      <div className="row align-items-center g-2 p-0 m-0">
        <div className="col-12 col-md-4 d-flex flex-column">
          <div className="d-flex  justify-content-between align-items-center">
            <div className="d-sm-none form-label text-uppercase small me-3 mb-0">
              Quantity
            </div>
            <div className="input-group w-auto">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={decreaseQuantity}
              >
                −
              </button>
              <input
                type="text"
                name="quantity"
                id="quantity"
                className="form-control text-center"
                style={{ width: "60px", padding: "17px 0" }}
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="d-flex flex-column">
            <button
              className="btn btn-outline-dark woocomerce__checkout-submitbtn bg-transparent text-black border-black  w-100"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="col-12">
          <button
            className="btn btn-dark woocomerce__checkout-submitbtn w-100"
            onClick={handleBuyNow}
          >
            Buy it Now
          </button>
        </div>
      </div>
    </div>
  );
}
