// components/ContactCard.js
import EyeIcon from "@/components/icons/EyeIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import Image from "next/image";
import Link from "next/link";

export default function ContactCard() {
  return (
    <div
      className="p-4 text-light font-roboto"
      style={{
        background: "#121212", // transparent dark overlay
        backdropFilter: "blur(8px)", // optional glass‑morphism
      }}
    >
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-3">
            {/* ---- LOGO ---- */}
            <Image
              src="/assets/imgs/logo/logo.png" // replace with your actual logo path
              alt="Florenza logo"
              width={110}
              height={48}
              className="me-2"
              style={{ objectFit: "contain" }}
            />
            {/* ---- BRAND NAME ---- */}
          </div>

          {/* ---- COMPANY & ADDRESS ---- */}
          <p style={{ maxWidth: "80%" }} className="mb-2 small text-content">
            <strong>JJ Perfumes International</strong> SDF 16, Ground Floor,
            Cochin Special Economic Zone, Kakkanad – Cochin 682037
          </p>
        </div>

        <div className="small">
          <div className="d-flex flex-column ">
            <a
              href="tel:+918848101280"
              className="text-decoration-none text-content"
            >
              +91 884 810 1280
            </a>
            <a
              href="tel:+917012909452"
              className="text-decoration-none text-content"
            >
              +91 701 290 9452
            </a>
          </div>
          <a
            href="mailto:info@florenzaitaliya.com"
            className="text-decoration-none d-block text-content"
          >
            info@florenzaitaliya.com
          </a>
        </div>
      </div>
      {/* ---- SOCIAL ICONS ---- */}
      <div className="mt-3 d-flex justify-content-center gap-3">
        <Link
          href="https://www.facebook.com/p/Florenza-Italiya-61555166902132/"
          target="_blank"
          className="text-light"
          aria-label="Facebook"
        >
          <FacebookIcon />
        </Link>
        <Link
          href="https://www.instagram.com/florenza_italiya"
          target="_blank"
          className="text-light"
          aria-label="Instagram"
        >
          <InstagramIcon />
        </Link>
      </div>
    </div>
  );
}
