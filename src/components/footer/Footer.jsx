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
              src="/assets/imgs/logo/footer-logo-white.png"
              alt="logo-img"
            />
            <p className="woocomerce__footer-dis">
              175122 Halk Spark, New York, <br /> USA - 67452
            </p>
            <a
              className="woocomerce__footer-mail"
              href="mailTo:info@example.com"
            >
              info@example.com
            </a>
            <a className="woocomerce__footer-phone" href="callTo:25487567744">
              +2 574 - 328 - 301
            </a>
          </div>
          <div className="woocomerce__footer-category category1">
            <span className="woocomerce__footer-title">Category</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href={"category/woman"}>Woman</Link>
              </li>
              <li>
                <Link href={"category/man"}>Man</Link>
              </li>
              <li>
                <Link href={"category/kids & baby"}>Kids & Baby</Link>
              </li>
              <li>
                <Link href={"category/jewellery"}>Jewellery</Link>
              </li>
              <li>
                <Link href={"category/beauty"}>Beauty</Link>
              </li>
            </ul>
          </div>
          <div className="woocomerce__footer-category">
            <span className="woocomerce__footer-title">Information</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href="#">Company</Link>
              </li>
              <li>
                <Link href="#">Career</Link>
              </li>
              <li>
                <Link href="#">Brand Partner</Link>
              </li>
              <li>
                <Link href="#">Products</Link>
              </li>
              <li>
                <Link href="#">Newsletter</Link>
              </li>
            </ul>
          </div>
          <div className="woocomerce__footer-category">
            <span className="woocomerce__footer-title">Help</span>
            <ul className="woocomerce__footer-list">
              <li>
                <Link href="#">Dealer & Agent</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="#">Refund Policy</Link>
              </li>
              <li>
                <Link href="#">Delivery</Link>
              </li>
              <li>
                <Link href="#">Order Tanking</Link>
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
            © 2022 - 2025 | Alrights reserved <br />
            by{" "}
            <a href="https://wealcoder.com/" target="_blank">
              Wealcoder
            </a>
          </p>
          <ul className="woocomerce__footer-social">
            <li>
              <a href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </li>
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
            <li>
              <Image
                width={40}
                height={30}
                src="/assets/imgs/woocomerce/payment/payment-2.png"
                alt="payment"
              />
            </li>
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
