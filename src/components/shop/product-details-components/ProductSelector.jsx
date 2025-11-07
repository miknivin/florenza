import React, { useState } from "react";
import { track } from "@vercel/analytics";
import Counter from "@/components/shared/Counter";

export default function ProductQuantity({
  initialQuantity = 1,
  onDecrease,
  onIncrease,
  onAddToCart,
  onBuyNow,
  productData,
}) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (onDecrease) onDecrease(newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (onIncrease) onIncrease(newQty);
  };

  const handleAddToCart = () => {
    if (
      typeof window !== "undefined" &&
      track &&
      typeof track === "function" &&
      productData
    ) {
      track("AddToCartIntent", {
        product_name: productData.name,
        quantity,
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
      <Counter
        count={quantity}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />

      {/* === GRID LAYOUT: 2 columns, buttons 100% width === */}
      <div className="glass-cta-grid">
        <button
          className="glass-btn"
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <span>Add to cart</span>
          <span className="shine" aria-hidden="true"></span>
        </button>

        <button
          className="solid-btn"
          onClick={handleBuyNow}
          aria-label="Buy now"
        >
          <span>Buy now</span>
        </button>
      </div>


    </div>
  );
}
