// components/FooterLinks.js
"use client";

import { useGetProductsQuery } from "@/store/api/productApi";
import Accordion from "@/components/shared/Accordion";
import Link from "next/link";

export default function FooterLinks() {
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    resPerPage: 4,
  });

  const products = data?.filteredProducts?.slice(0, 4) || [];

  const accordionData = [
    {
      title: "Top Products",
      content: isLoading ? (
        <p className="mb-0 text-muted small">Loading products...</p>
      ) : error ? (
        <p className="mb-0 text-danger small">Error loading products</p>
      ) : products.length > 0 ? (
        <ul className="list-unstyled mb-0">
          {products.map((product) => (
            <li key={product._id} className="mb-2">
              <Link
                href={`/shop/${product._id}`}
                style={{ color: "#fff", opacity: 0.5 }}
                className="text-decoration-none d-block"
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-0 text-muted small">No products available</p>
      ),
    },
    {
      title: "Quick Links",
      content: (
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/"
              className="text-decoration-none"
            >
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/about"
              className="text-decoration-none"
            >
              About us
            </Link>
          </li>
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/contact"
              className="text-decoration-none"
            >
              Get in touch
            </Link>
          </li>
        </ul>
      ),
    },
    {
      title: "Informations",
      content: (
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/privacy-policy"
              className="text-decoration-none"
            >
              Privacy Policy
            </Link>
          </li>
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/refund-policy"
              className="text-decoration-none"
            >
              Refund Policy
            </Link>
          </li>
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/shipping-policy"
              className="text-decoration-none"
            >
              Shipping policy
            </Link>
          </li>
          <li className="mb-2">
            <Link
              style={{ color: "#fff", opacity: 0.5 }}
              href="/terms-and-conditions"
              className="text-decoration-none"
            >
              Terms & Conditions
            </Link>
          </li>
        </ul>
      ),
    },
  ];

  return <Accordion items={accordionData} />;
}
