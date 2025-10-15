"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const CartButton = () => {
  const { cartData, totalCost, buyProduct } = useSelector(
    (state) => state.cart
  );
  // Calculate total number of items
  const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
  const currentPath = usePathname() || "/";

  // Return null if buyProduct is not null, cart is empty, or on cart/checkout pages
  if (
    buyProduct !== null ||
    totalItems === 0 ||
    currentPath?.includes("/cart") ||
    currentPath?.includes("/checkout")
  ) {
    return null;
  }

  return (
    <div className="cart-button-container">
      <button className="cart-btn">
        <div className="cart-content">
          <div className="cart-icon">
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>

          <div className="cart-info">
            <div className="cart-items">
              <span className="item-count">{totalItems}</span>
              <span className="item-text">Item(s)</span>
            </div>
            <div className="cart-savings">Total: ₹{totalCost.toFixed(2)}</div>
          </div>

          <Link
            href="/cart"
            className="view-cart-text text-white text-decoration-underline"
          >
            View Cart
          </Link>
        </div>
      </button>
    </div>
  );
};

export default CartButton;
