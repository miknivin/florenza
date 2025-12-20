"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  useCancelOrderMutation,
  useOrderDetailsQuery,
  useRequestReturnMutation,
} from "@/store/api/orderApi";
import { Preloader } from "..";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;
  const { data, isLoading, error } = useOrderDetailsQuery(orderId, {
    skip: !orderId,
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Order History");
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Unknown");

  // Cancel order mutation
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [requestReturn, { isLoading: isReturning }] =
    useRequestReturnMutation();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const addDate = (dateString, daysToAdd = 0) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`/api/order/invoice/${orderId}`);
      const { invoiceURL } = response.data;
      const link = document.createElement("a");
      link.href = invoiceURL;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const tabs = () => {
      document.querySelectorAll(".widget-tabs").forEach((widgetTab) => {
        const titles = widgetTab.querySelectorAll(
          ".widget-menu-tab .item-title"
        );
        titles.forEach((title, index) => {
          title.addEventListener("click", () => {
            titles.forEach((item) => item.classList.remove("active"));
            title.classList.add("active");
            const contentItems = widgetTab.querySelectorAll(
              ".widget-content-tab > *"
            );
            contentItems.forEach((content) =>
              content.classList.remove("active")
            );
            const contentActive = contentItems[index];
            contentActive.classList.add("active");
            contentActive.style.display = "block";
            contentActive.style.opacity = 0;
            setTimeout(() => (contentActive.style.opacity = 1), 0);
            contentItems.forEach((content, idx) => {
              if (idx !== index) {
                content.style.display = "none";
              }
            });
          });
        });
      });
    };
    tabs();
    return () => {
      document
        .querySelectorAll(".widget-menu-tab .item-title")
        .forEach((title) => {
          title.removeEventListener("click", () => {});
        });
    };
  }, []);

  useEffect(() => {
    if (data?.order) {
      const taxRate = isNaN(Number(process.env.TAX))
        ? 0.18
        : Number(process.env.TAX);
      const originalItemsPrice = Number(data.order.itemsPrice);
      const basePrice = (originalItemsPrice * 100) / (100 + taxRate * 100);
      const taxAmount = originalItemsPrice - basePrice;
      setOrderDetails({
        ...data.order,
        itemsPrice: Number(basePrice.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
      });
    }
  }, [orderId, data]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Use orderTracking array from DB (same format as before)
  const scans = orderDetails?.orderTracking || [];
  const uniqueScans = [];
  const seenScans = new Set();
  [...scans]
    ?.sort((a, b) => new Date(b.StatusDateTime) - new Date(a.StatusDateTime))
    ?.forEach((scan) => {
      if (!seenScans.has(scan.Status)) {
        seenScans.add(scan.Status);
        uniqueScans.push(scan);
      }
    });
  const reversedUniqueScans = uniqueScans?.reverse();

  // Update currentStatus with proper priority
  useEffect(() => {
    if (!orderDetails) {
      setCurrentStatus("Unknown");
      return;
    }

    const overrideTrackingStatuses = [
      "Cancelled",
      "Return Requested",
      "Return Approved",
      "Return Rejected",
      "Returned",
      "Refunded",
    ];

    if (overrideTrackingStatuses.includes(orderDetails.orderStatus)) {
      setCurrentStatus(orderDetails.orderStatus);
      return;
    }

    // Use delhiveryCurrentOrderStatus if available (from courier sync)
    if (orderDetails.delhiveryCurrentOrderStatus) {
      setCurrentStatus(orderDetails.delhiveryCurrentOrderStatus);
      return;
    }

    // Fallback to latest scan from orderTracking
    if (reversedUniqueScans.length > 0 && reversedUniqueScans[0]?.Status) {
      setCurrentStatus(reversedUniqueScans[0].Status);
    } else {
      setCurrentStatus(orderDetails.orderStatus || "Unknown");
    }
  }, [orderDetails, reversedUniqueScans]);

  if (isLoading) return <Preloader />;
  if (error)
    return (
      <div
        style={{ minHeight: "60vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        Error: {error.message}
      </div>
    );
  if (!orderDetails && !isLoading) {
    return (
      <div className="text-center">
        No order details found for Order #{orderId}
      </div>
    );
  }

  // Check if order was created within last 24 hours
  const isWithin24Hours = (createdAt) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60) <= 24;
  };

  // Check if delivered less than 2 days ago
  const isWithin2DaysOfDelivery = (deliveredAt) => {
    if (!deliveredAt) return false;
    const delivered = new Date(deliveredAt);
    const now = new Date();
    return (now - delivered) / (1000 * 60 * 60 * 24) < 2;
  };

  // Cancel button visibility
  const canCancel =
    orderDetails &&
    ![
      "Cancelled",
      "Refunded",
      "Delivered",
      "Returned",
      "Return Requested",
      "Return Approved",
      "Return Rejected",
    ].includes(orderDetails.orderStatus) &&
    (orderDetails.orderStatus === "Processing" ||
      (orderDetails.orderStatus === "Shipped" &&
        orderDetails.waybill &&
        isWithin24Hours(orderDetails.createdAt)));

  // Return button visibility
  const canReturn =
    orderDetails?.orderStatus === "Delivered" &&
    isWithin2DaysOfDelivery(orderDetails.deliveredAt);

  // Handle cancel
  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "Cancel Order",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      input: "textarea",
      inputLabel: "Reason for cancellation (optional)",
      inputPlaceholder:
        "Enter reason if you want (e.g., changed mind, wrong item)...",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Order",
      cancelButtonText: "No, Keep Order",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;
    const reason = result.value?.trim() || "No reason provided";
    try {
      await cancelOrder({
        orderId: orderDetails._id,
        reason,
      }).unwrap();
      toast.success(
        orderDetails.paymentMethod === "Online"
          ? "Order cancelled and refund initiated successfully!"
          : "Order cancelled successfully!"
      );
    } catch (err) {
      toast.error(
        err?.data?.error || "Failed to cancel order. Please try again."
      );
    }
  };

  const handleRequestReturn = async () => {
    const result = await Swal.fire({
      title: "Request Return",
      text: "Do you want to request a return for this order?",
      icon: "question",
      input: "textarea",
      inputLabel: "Reason for return (optional)",
      inputPlaceholder: "e.g., Wrong item, defective item...",
      showCancelButton: true,
      confirmButtonText: "Submit Return Request",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    const reason = result.value?.trim() || "No reason provided";
    try {
      await requestReturn({
        orderId: orderDetails._id,
        reason,
      }).unwrap();
      toast.success(
        "Return request submitted successfully! Admin will review it soon."
      );
    } catch (err) {
      toast.error(err?.data?.error || "Failed to submit return request.");
    }
  };

  return (
    <div style={{ minHeight: "90vh" }}>
      {orderDetails && (
        <div className="wd-form-order mt-5">
          <div className="d-flex justify-content-between">
            <div>
              <div className="order-head">
                <div className="d-flex justify-content-start flex-column gap-2">
                  <Link
                    style={{ width: "fit-content", marginLeft: "8px" }}
                    href="/profile?tab=order"
                    className="btn btn-dark d-flex align-items-center "
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Link>
                  <figure className="img-product">
                    {orderDetails.orderItems?.[0]?.image && (
                      <Image
                        alt="product"
                        src={orderDetails.orderItems[0].image}
                        width={720}
                        height={1005}
                      />
                    )}
                  </figure>
                </div>
                <div className="content-order">
                  <div className="badge">{currentStatus}</div>
                  <h6 className="mt-8 fw-5">
                    Order #{orderDetails?._id?.toString().slice(-6)}
                  </h6>
                  <p>Payment method: {orderDetails?.paymentMethod}</p>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end align-items-start">
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="btn btn-outline-danger"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
              {canReturn && (
                <button
                  onClick={handleRequestReturn}
                  disabled={isReturning}
                  className="btn btn-outline-danger"
                >
                  {isReturning ? "Submitting..." : "Request Return"}
                </button>
              )}
              <button
                onClick={handleDownloadInvoice}
                className="btn btn-dark d-flex align-items-center gap-2"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="d-none d-sm-inline">Downloading...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faDownload} />
                    <span className="d-none d-sm-inline">Download Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="tf-grid-layout md-col-2 gap-15">
            <div className="item">
              <div className="text-2 text_black-2">Start Time</div>
              <div className="text-2 mt_4 fw-6">
                {formatDate(orderDetails.createdAt)}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Address</div>
              <div className="text-2 mt_4 fw-6">
                {orderDetails.shippingInfo?.address},{" "}
                {orderDetails.shippingInfo?.city},{" "}
                {orderDetails.shippingInfo?.state},{" "}
                {orderDetails.shippingInfo?.zipCode},{" "}
                {orderDetails.shippingInfo?.country}
              </div>
            </div>
          </div>
          <div className="widget-tabs style-has-border widget-order-tab">
            <ul className="widget-menu-tab">
              <li
                className={`item-title ${
                  activeTab === "Order History" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Order History")}
              >
                <span className="inner">Order Status</span>
              </li>
              <li
                className={`item-title ${
                  activeTab === "Item Details" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Item Details")}
              >
                <span className="inner">Item Details</span>
              </li>
            </ul>
            <div className="widget-content-tab">
              <div
                className={`widget-content-inner ${
                  activeTab === "Order History" ? "active" : ""
                }`}
              >
                <div className="widget-timeline">
                  {orderDetails?.waybill && reversedUniqueScans.length > 0 ? (
                    <ul className="timeline">
                      {reversedUniqueScans.map((scan, index) => (
                        <li key={index}>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 text-dark fw-6">
                                {scan.Status}
                              </div>
                              <span>{formatDate(scan.StatusDateTime)}</span>
                              <p className="mt-2">
                                <strong>Location: </strong>
                                {scan.StatusLocation || "N/A"}
                              </p>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="timeline">
                      {["Processing", "Shipped", "Delivered"].includes(
                        currentStatus
                      ) && (
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 text-dark fw-6">
                                Product Processing
                              </div>
                            </a>
                            <p>
                              <strong>Estimated Delivery Date: </strong>
                              {addDate(orderDetails.createdAt, 7)}
                            </p>
                          </div>
                        </li>
                      )}
                      {["Shipped", "Delivered"].includes(currentStatus) && (
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 text-dark fw-6">
                                Product Shipped
                              </div>
                              <span>{formatDate(orderDetails.updatedAt)}</span>
                            </a>
                          </div>
                        </li>
                      )}
                      {["Delivered"].includes(currentStatus) && (
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 text-dark fw-6">
                                Product Delivered
                              </div>
                              <span>
                                {formatDate(orderDetails.deliveredAt)}
                              </span>
                            </a>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div
                className={`widget-content-inner ${
                  activeTab === "Item Details" ? "active" : ""
                }`}
              >
                {orderDetails.orderItems.map((item, i) => (
                  <div className="order-head" key={i}>
                    <figure className="img-product">
                      <Image
                        alt="product"
                        src={item.image}
                        width={720}
                        height={1005}
                      />
                    </figure>
                    <div className="content-orders">
                      <div className="text-2 fw-6">{item.name}</div>
                      <div className="mt_4">
                        <span className="fw-6">Price: </span>
                        {`₹${Number(item.price).toFixed(2)}${
                          item.quantity > 1 ? ` * ${item.quantity}` : ""
                        }`}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Variant: </span>
                        {item.variant || "N/A"}
                      </div>
                      {item.sku && (
                        <div className="mt_4">
                          <span className="fw-6">SKU: </span>
                          {item.sku}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Subtotal</span>
                    <span className="fw-6">
                      ₹{Number(orderDetails.itemsPrice).toFixed(2)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4">
                    <span>Tax Amount (18%)</span>
                    <span className="fw-6">
                      ₹{Number(orderDetails.taxAmount).toFixed(2)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4">
                    <span>Shipping Amount</span>
                    <span className="fw-6">
                      ₹{Number(orderDetails.shippingAmount).toFixed(2)}
                    </span>
                  </li>
                  {orderDetails.couponApplied !== "No" && (
                    <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                      <span>Total Discounts</span>
                      <span className="fw-6">
                        - ₹
                        {Number(
                          orderDetails.itemsPrice +
                            orderDetails.taxAmount +
                            orderDetails.shippingAmount -
                            orderDetails.totalAmount
                        ).toFixed(2)}
                      </span>
                    </li>
                  )}
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Order Total</span>
                    <span className="fw-6">
                      ₹{Number(orderDetails.totalAmount).toFixed(2)}
                    </span>
                  </li>
                </ul>
                {orderDetails.orderNotes && (
                  <div className="mt_8">
                    <span className="fw-6">Order Notes: </span>
                    {orderDetails.orderNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
