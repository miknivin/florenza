"use client";

import { useState, useEffect } from "react";

export default function Modal({
  show,
  onHide,
  title,
  children,
  size = "lg",
  footer,
}) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    // Prevent body scrolling when modal is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (onHide) onHide();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div
        className="modal show custom-modal d-block"
        id={`modal-${title?.replace(/\s+/g, "-") || "generic"}`}
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="false"
        style={{ display: "block" }}
      >
        <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                {title || "Modal Title"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
