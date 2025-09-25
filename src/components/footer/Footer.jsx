import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="woocomerce__footer">
        <div className="woocomerce__footer-wrapper">
          <span className="woocomerce__hero-line line1"></span>
          <span className="woocomerce__hero-line line2"></span>
          <span className="woocomerce__hero-line line3"></span>
          <span className="woocomerce__hero-line line4"></span>
          <div className="woocomerce__footer-about">
            <Image
              className="woocomerce__footer-logo"
              width={138}
              height={46}
              style={{ height: "auto" }}
              src="/assets/imgs/logo/logo.png"
              alt="logo-img"
            />
<p className="woocomerce__footer-dis">
  JJ PERFUMES INTERNATIONAL,<br />
  <span className="woocomerce__footer-address">
    SDF 16, Ground Floor,<br />
    Cochin Special Economic Zone, Kakkanad,<br />
    Cochin – 682037
  </span>
</p>

            <a
              className="woocomerce__footer-mail"
              href="mailTo:info@florenzaitaliya.com"
            >
              info@florenzaitaliya.com
            </a>
            <a href="tel:+918848101280">+91 8848101280</a> |{" "}
            <br />
            <a href="tel:+917012909452">+91 7012909452</a>
          </div>
          <div className="woocomerce__footer-category category1">
            <span className="woocomerce__footer-title">Top Products</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href={"/shop/68b02956db84a40a8a443151"}>Oud white</Link>
              </li>
              <li>
                <Link href={"/shop/68aec7caf045b00bcb36693d"}>Rumba</Link>
              </li>
              <li>
                <Link href={"/shop/68aec5d2f045b00bcb366913"}>Cool water</Link>
              </li>
              <li>
                <Link href={"/shop/68b02aa6db84a40a8a443195"}>One</Link>
              </li>
            </ul>
          </div>
          <div className="woocomerce__footer-category">
            <span className="woocomerce__footer-title">Quick Links</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="/about">About us</Link>
              </li>
              <li>
                <Link href="/contact">Get in touch</Link>
              </li>
              {/* <li>
                <Link href="/faq">FAQ</Link>
              </li> */}
            </ul>
          </div>
          <div className="woocomerce__footer-category">
            <span className="woocomerce__footer-title">Informations</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>

              <li>
                <Link href="/refund-policy">Refund Policy</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Shipping policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          <div className="woocomerce__footer-category form-pt">
            <span className="woocomerce__footer-title">Newsletter</span>
            <p className="woocomerce__footer-dis">
              Sign up to our newsletter and receive daily offer <br /> and news
              updates!
            </p>
            <form className="woocomerce__footer-form" action="#">
              <input type="email" name="email" placeholder="Enter your email" />
              <button className="woocomerce__footer-submit">
                <Image
                  width={17}
                  height={14}
                  src="/assets/imgs/woocomerce/arrow-email.png"
                  alt="email"
                />
              </button>
            </form>
          </div>
        </div>
        <div className="woocomerce__footer-bottom">
          <p className="woocomerce__footer-copytext">
            © 2025 | Alrights reserved <br />
          </p>
          <ul className="woocomerce__footer-social">
            <li>
              <a href="https://www.facebook.com/p/Florenza-Italiya-61555166902132/">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </li>
            {/* <li>
              <a href="#">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </li> */}
            <li>
              <a href="https://www.instagram.com/florenza_italiya?utm_source=ig_web_button_share_sheet&igsh=MXZ5eDBpaGZ6ejBmZQ==">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            {/* <li>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </li> */}
          </ul>
          <ul className="woocomerce__footer-payment">
            <li>
              Payment <br />
              Gateway
            </li>
            <li>
              <Image
                width={40}
                height={30}
                src="/assets/imgs/woocomerce/payment/payment-1.png"
                alt="payment"
              />
            </li>
            {/* <li>
              <Image
                width={40}
                height={30}
                src="/assets/imgs/woocomerce/payment/payment-2.png"
                alt="payment"
              />
            </li> */}
            <li>
              <Image
                width={40}
                height={30}
                src="/assets/imgs/woocomerce/payment/payment-3.png"
                alt="payment"
              />
            </li>
            <li>
              <Image
                width={40}
                height={30}
                src="/assets/imgs/woocomerce/payment/payment-4.png"
                alt="payment"
              />
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
