// AllProfileContent.jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import Order from "./Order";
import ProfileInfo from "./ProfileInfo";
import WishList from "./WishList";
import { useLogoutMutation } from "@/store/api/authApi";

export default function AllProfileContent({ initialTab = "profile" }) {
  const router = useRouter();
  const { tab = initialTab } = router.query; // Use initialTab from props as fallback
  const [activeTab, setActiveTab] = useState(tab);

  // Sync activeTab with query parameter on client-side changes
  useEffect(() => {
    setActiveTab(tab || "profile");
  }, [tab]);

  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Optionally clear client-side auth state here
      router.push("/"); // Redirect to login or home
    } catch (error) {
      // Handle error (show message, etc.)
    }
  };

  const handleTabChange = (key) => {
    if (key && key !== "logout") {
      setActiveTab(key);
      router.push(
        {
          pathname: router.pathname,
          query: { tab: key },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <div className="woocomerce__account">
      <Tab.Container
        id="left-tabs-example"
        activeKey={activeTab}
        onSelect={handleTabChange}
      >
        <div className="container">
          <div className="woocomerce__account-wrapper">
            <div>
              <div className="woocomerce__account-left d-none d-md-block">
                <div className="woocomerce__account-titlewrapper">
                  <span className="woocomerce__account-title">My Account</span>
                </div>
                <Nav
                  className="woocomerce__account-menus flex-column"
                  variant="underline"
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="profile"
                      as="button"
                      className={activeTab === "profile" ? "active" : ""}
                    >
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="order"
                      as="button"
                      className={activeTab === "order" ? "active" : ""}
                    >
                      Order
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="logout"
                      as="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      Sign out
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              {/* Horizontal Navigation for Tablet and Above */}
              <div className="woocomerce__account-horizontal-nav d-block d-md-none">
                <Nav
                  className="woocomerce__account-menus-horizontal"
                  variant="tabs"
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="profile"
                      as="button"
                      className={activeTab === "profile" ? "active" : ""}
                    >
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="wishlist"
                      as="button"
                      className={activeTab === "wishlist" ? "active" : ""}
                    >
                      Wishlist
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="order"
                      as="button"
                      className={activeTab === "order" ? "active" : ""}
                    >
                      Order
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="logout"
                      as="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      Sign out
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            {/* Tab Content */}
            <div className="woocomerce__account-right">
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <ProfileInfo />
                </Tab.Pane>
                <Tab.Pane eventKey="wishlist">
                  <WishList />
                </Tab.Pane>
                <Tab.Pane eventKey="order">
                  <Order />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
          {/* Vertical Navigation for Mobile */}
        </div>
      </Tab.Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { tab = "profile" } = context.query;
  return {
    props: {
      initialTab: tab,
    },
  };
}
