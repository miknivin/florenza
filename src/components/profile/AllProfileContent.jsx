// AllProfileContent.jsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import Order from "./Order";
import ProfileInfo from "./ProfileInfo";
import WishList from "./WishList";

export default function AllProfileContent({ initialTab = "profile" }) {
  const router = useRouter();
  const { tab = initialTab } = router.query; // Use initialTab from props as fallback
  const [activeTab, setActiveTab] = useState(tab);

  // Sync activeTab with query parameter on client-side changes
  useEffect(() => {
    setActiveTab(tab || "profile");
  }, [tab]);

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
          {/* Vertical Navigation for Mobile */}
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
                <Link href="/logout" passHref legacyBehavior>
                  <Nav.Link eventKey="logout">Sign out</Nav.Link>
                </Link>
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
                <Link href="/logout" passHref legacyBehavior>
                  <Nav.Link eventKey="logout">Sign out</Nav.Link>
                </Link>
              </Nav.Item>
            </Nav>
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
