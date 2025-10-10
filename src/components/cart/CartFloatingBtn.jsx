import React from "react";

const CartButton = () => {
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
              <span className="item-count">1</span>
              <span className="item-text">Item(s)</span>
              {/* <div className="collapse-icon">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div> */}
            </div>
            <div className="cart-savings">You save 49</div>
          </div>

          <div className="view-cart-text">View Cart</div>
        </div>
      </button>
    </div>
  );
};

export default CartButton;
