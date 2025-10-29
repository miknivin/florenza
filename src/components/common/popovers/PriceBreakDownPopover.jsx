// components/common/PriceBreakdownPopover.jsx
import { useState, useRef, useEffect } from "react";
import InfoIcon from "@/components/icons/InfoIcon"; // ← adjust path if needed

export default function PriceBreakdownPopover({
  itemsTotal,
  shippingAmount,
  total,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      const clickedInsideButton = buttonRef.current?.contains(e.target);
      const clickedInsidePopover = popoverRef.current?.contains(e.target);

      if (!clickedInsideButton && !clickedInsidePopover) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
    }

    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  return (
    <div className="position-relative d-inline-block">
      {/* Static InfoIcon as trigger */}
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-link p-0 ms-1 text-decoration-none text-muted"
        aria-label="View price breakdown"
      >
        <InfoIcon width={16} height={16} />
      </button>

      {/* Popover – Bootstrap utility classes */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            minWidth: "180px",
            left: "25px",
            zIndex: 999999,
            fontSize: "14px",
          }}
          className="
            position-absolute top-0 right-0 mt-2 
            w-auto 
            bg-white border rounded shadow-lg 
            p-3 
          "
        >
          <div className="d-flex justify-content-between">
            <span>Items total</span>
            <span>₹{itemsTotal}</span>
          </div>

          {shippingAmount > 0 && (
            <div className="d-flex justify-content-between text-warning mt-1">
              <span>Shipping fee</span>
              <span>₹{shippingAmount}</span>
            </div>
          )}

          <div className="d-flex justify-content-between fw-bold mt-2 pt-2 border-top">
            <span>Total to pay</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
