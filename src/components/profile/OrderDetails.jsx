"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router"; // Use useRouter for Pages Router
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useOrderDetailsQuery } from "@/store/api/orderApi";
import { Preloader } from "..";

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query; // Extract orderId from dynamic route
  const { data, isLoading, error } = useOrderDetailsQuery(orderId, {
    skip: !orderId,
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Order History");

  // Debug logs
  useEffect(() => {
    console.log("Order ID:", orderId);
    console.log("API Data:", data);
  }, [orderId, data]);

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
    setOrderDetails(data?.order || null);
  }, [orderId, data]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  if (isLoading) return <Preloader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!orderDetails && !isLoading) {
    return <div>No order details found for Order #{orderId}</div>;
  }

  return (
    <div style={{ minHeight: "90vh" }}>
      {orderDetails && (
        <div className="wd-form-order mt-5">
          <div className="d-flex justify-content-between">
            <div className="order-head">
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
              <div className="content-order">
                <div className="badge">{orderDetails.orderStatus}</div>
                <h6 className="mt-8 fw-5">
                  Order #{orderDetails?._id?.slice(-6)}
                </h6>
                <p>Payment method: {orderDetails?.paymentMethod}</p>
              </div>
            </div>
            <div>
              <Link
                href="/profile?tab=order"
                className="btn btn-dark d-flex align-items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="d-none d-sm-inline">Go Back</span>
              </Link>
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
                <span className="inner">Order History</span>
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
                  <ul className="timeline">
                    {["Processing", "Shipped", "Delivered"].includes(
                      orderDetails.orderStatus
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
                    {["Shipped", "Delivered"].includes(
                      orderDetails.orderStatus
                    ) && (
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
                    {["Delivered"].includes(orderDetails.orderStatus) && (
                      <li>
                        <div className="timeline-badge success" />
                        <div className="timeline-box">
                          <a className="timeline-panel" href="#">
                            <div className="text-2 text-dark fw-6">
                              Product Delivered
                            </div>
                            <span>{formatDate(orderDetails.deliveredAt)}</span>
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
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
                        {`₹${item.price}${
                          item.quantity > 1 ? ` * ${item.quantity}` : ""
                        }`}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Variant: </span>
                        {item.variant || "N/A"} {/* Fallback for undefined variant */}
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
                    <span>Items Price</span>
                    <span className="fw-6">
                      ₹{orderDetails?.itemsPrice.toFixed(2)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4">
                    <span>Tax Amount</span>
                    <span className="fw-6">
                      ₹{orderDetails?.taxAmount.toFixed(2)}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4">
                    <span>Shipping Amount</span>
                    <span className="fw-6">
                      ₹{orderDetails?.shippingAmount.toFixed(2)}
                    </span>
                  </li>
                  {orderDetails?.couponApplied !== "No" && (
                    <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                      <span>Total Discounts</span>
                      <span className="fw-6">
                        - ₹
                        {(
                          orderDetails?.itemsPrice +
                          orderDetails?.taxAmount +
                          orderDetails?.shippingAmount -
                          orderDetails?.totalAmount
                        ).toFixed(2)}
                      </span>
                    </li>
                  )}
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Order Total</span>
                    <span className="fw-6">
                      ₹{orderDetails?.totalAmount.toFixed(2)}
                    </span>
                  </li>
                </ul>
                {orderDetails?.orderNotes && (
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