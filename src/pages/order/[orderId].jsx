import ProductLayout from "@/components/common/layout/ProductLayout";
import OrderDetails from "@/components/profile/OrderDetails";
import React from "react";


export default function Details() {
  return (
    <>
      <ProductLayout>
        <div className="container">
          <div>
            <div>
              <OrderDetails />
            </div>
          </div>
        </div>
      </ProductLayout>
    </>
  );
}
