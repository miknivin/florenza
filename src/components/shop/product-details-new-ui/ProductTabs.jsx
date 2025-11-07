// components/product/ProductTabs.jsx
import { useState } from "react";
import ReviewSection from "@/components/review/ReviewSection";

export default function ProductTabs({
  description,
  features = [],
  reviews = [],
}) {
  const [activeTab, setActiveTab] = useState("description");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="woocomerce__single-productMore fade_bottom pt-3">
      {/* Nav Tabs */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "description" ? "active" : ""
            }`}
            type="button"
            role="tab"
            onClick={() => handleTabClick("description")}
          >
            Description
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => handleTabClick("reviews")}
          >
            Reviews
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Description + Features Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "description" ? "show active" : ""
          }`}
          role="tabpanel"
        >
          <div className="row gap-3">
            {/* Left: Product Description */}
            <div className="col-lg-12">
              <p className="woocomerce__single-discription2">{description}</p>
            </div>

            {/* Right: Features List */}
            <div className="col-lg-12">
              {features.length > 0 ? (
                <ul className="list-unstyled woocomerce__features-list">
                  {features.map((feature, index) => (
                    <li key={index} className="d-flex align-items-center mb-2">
                      <span className="me-2 text-black">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small">No features listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "reviews" ? "show active" : ""
          }`}
          role="tabpanel"
        >
          <ReviewSection reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
