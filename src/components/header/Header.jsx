"use client"; // Mark this as a client component

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Canvas from "../canvas/Canvas";
import Modal from "../common/modal/ReusableModal"; // Adjust the import path
import HeaderSearch from "../search/HeaderSearch";
import useSWR from "swr";
import { Preloader } from "..";

import Logo from "../../../public/assets/imgs/woocomerce/logo.png";
import LogoBlack from "../../../public/assets/imgs/logo/logo-black.png";
import Bar from "../../../public/assets/imgs/woocomerce/bar.png";
import BarBlack from "../../../public/assets/imgs/woocomerce/bar-b.png";
import SignUpForm from "../auth/SignupForm";
import SignInForm from "../auth/SigninForm";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Header = ({ option }) => {
  const cartData = useSelector((state) => state.cart.cartData);
  const { isAuthenticated } = useSelector((state) => state.user); // Get isAuthenticated from Redux store
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between SignIn and SignUp
  const ofCanvasArea = useRef();
  const menuAnim = useRef();
  const router = useRouter(); // Initialize router for navigation

  const handleOpenSignInModal = () => {
    setIsSignUp(false);
    setShowModal(true);
  };

  const handleOpenSignUpModal = () => {
    setIsSignUp(true);
    setShowModal(true);
  };

  // Handle user icon click: redirect to /profile if authenticated, else open modal
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      handleOpenSignInModal();
    }
  };

  const menuAnimation = () => {
    if (!menuAnim.current) {
      console.warn("menuAnim ref is not assigned to an element.");
      return;
    }

    const rootParent = menuAnim.current.children;
    if (!rootParent || rootParent.length === 0) {
      console.warn("No children found in menuAnim ref.");
      return;
    }

    for (let i = 0; i < rootParent.length; i++) {
      const firstParent = rootParent[i].children;
      if (firstParent.length > 0) {
        firstParent[0].innerHTML =
          '<div class="menu-text"><span>' +
          firstParent[0].textContent.split("").join("</span><span>") +
          "</span></div>";
      }
    }
  };

  useEffect(() => {
    // Only call menuAnimation if the ref is assigned
    if (menuAnim.current) {
      menuAnimation();
    } else {
      // Retry after a delay only if the component is still mounted
      const timer = setTimeout(() => {
        if (menuAnim.current) {
          menuAnimation();
        }
      }, 1000);

      // Cleanup the timeout to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, []);

  const openCanvas = () => {
    if (ofCanvasArea.current) {
      ofCanvasArea.current.style.opacity = "1";
      ofCanvasArea.current.style.visibility = "visible";
    }
  };

  const { data: allProducts, error } = useSWR(
    "../assets/json/allProducts.json",
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!allProducts)
    return (
      <div>
        <Preloader />
      </div>
    );

  const allData = allProducts.products;

  return (
    <>
      <header
        className={`${
          option === "black"
            ? "woocomerce__header"
            : "woocomerce__header absolute-header"
        }`}
      >
        <div className="woocomerce__header-inner shopfull">
          <div className="woocomerce__header-center">
              <div className="woocomerce__header-logo">
              <Link href={"/"}>
                <Image
                  priority
                  width={option === "black" ? 136 : 94}
                  height={option === "black" ? 45 : 31}
                  style={{ height: "auto" }}
                  src={option === "black" ? LogoBlack : Logo}
                  alt="Logo"
                />
              </Link>
            </div> 
          </div>
          <div className="woocomerce__header-left">
            <div className="header__nav-2">
              <ul
                className={`${
                  option === "black"
                    ? "main-menu-3 menu-anim woocomerce-menu"
                    : "main-menu-3 menu-anim"
                }`}
                ref={menuAnim}
              >
                <li>
                  <Link href={"/"}>Home</Link>
                </li>
                <li>
                  <Link href={"/about"}>About</Link>
                </li>
                <li>
                  <Link href={"/shop/full"}>Products</Link>
                </li>
                <li>
                  <Link href={"/contact"}>Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${
              option === "black"
                ? "woocomerce__header-right"
                : "woocomerce__header-right home"
            }`}
          >
            <div className="woocomerce__header-cart">
              <div className="woocomerce__header-cartwrapper">
                <Link href={"/cart"}>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <p>Cart</p>
                  <span>({cartData.length})</span>
                </Link>
              </div>
              <div className="woocomerce__header-user">
                <i
                  className={`fa-regular fa-user ${
                    option === "black" ? `text-black` : `text-white`
                  }`}
                  onClick={handleUserIconClick} // Updated to use new handler
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
              <div className="woocomerce__header-search">
                <HeaderSearch allData={allData} />
              </div>
              <div onClick={openCanvas} className="woocomerce__header-search">
                <Image
                  priority
                  width={45}
                  style={{ height: "auto" }}
                  src={option === "black" ? BarBlack : Bar}
                  alt="Menu"
                  className="woocomerce__offcanvas"
                  id="open_offcanvas"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={isSignUp ? "Sign Up" : "Sign In"}
        size="md"
      >
        {isSignUp ? (
          <SignUpForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onOpenSignInModal={handleOpenSignInModal}
          />
        ) : (
          <SignInForm
            className="m-0"
            isHeading={false}
            isModal={true}
            onHide={() => setShowModal(false)}
            onOpenSignUpModal={handleOpenSignUpModal}
          />
        )}
      </Modal>
      <Canvas ofCanvasArea={ofCanvasArea} />
    </>
  );
};

export default Header;
