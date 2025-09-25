import Head from "next/head";
import ProductLayout from "@/components/common/layout/ProductLayout";

const ShippingPolicy = () => (
  <div>
    <Head>
      <title>Shipping Policy</title>
      <meta name="description" content="Shipping Policy" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>
      <ProductLayout>
        <section className="shipping-policy" style={{padding: "60px 0"}}>
          <div className="container" style={{maxWidth: "800px", margin: "0 auto"}}>
            <h1 className="hero-title title-anim" style={{marginBottom: "2.5rem", textAlign: "center"}}>Shipping Policy</h1>
            <div className="shipping-policy-content" style={{fontSize: "1.1rem", lineHeight: "2", color: "#222"}}>
              <p style={{marginBottom: "2rem"}}>Welcome to FlorenzaItaliya.com, owned and operated by OWNSHOPI LLP. This Shipping Policy outlines the details regarding shipping, delivery, and courier services for products purchased on our website.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>1. Free Shipping:</h2>
              <p style={{marginBottom: "2rem"}}>FlorenzaItaliya.com is pleased to offer free shipping on all orders delivered within India.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>2. Delivery Time:</h2>
              <p style={{marginBottom: "2rem"}}>The estimated delivery time for orders is 3-5 days from the date of purchase. Please note that delivery times may vary based on factors such as product availability, destination location, and any unforeseen circumstances.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>3. Delivery Locations:</h2>
              <p style={{marginBottom: "2rem"}}>We provide shipping services to locations across India. We regret to inform you that we currently do not offer international shipping.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>4. Courier Service:</h2>
              <p style={{marginBottom: "2rem"}}>FlorenzaItaliya.com utilizes the services of Delhivery, a leading logistics and supply chain company based in Gurgaon, for the dispatch and delivery of orders. Delhivery is well known for its efficiency, reliability, and nationwide delivery coverage, ensuring your orders reach you safely and on time.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>5. Order Tracking:</h2>
              <p style={{marginBottom: "2rem"}}>Once your order has been dispatched, you will receive a tracking number and a link to track the progress of your shipment. This information will be sent to the email address provided during the checkout process.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>6. Shipment Confirmation:</h2>
              <p style={{marginBottom: "2rem"}}>Upon shipment of your order, you will receive a confirmation email containing details about your purchase, including the items ordered, the total cost, and the shipping information.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>7. Shipping Charges:</h2>
              <p style={{marginBottom: "2rem"}}>We offer free shipping on all orders delivered within India. There are no additional shipping charges for standard delivery.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>8. Shipping (dispatch) timeline:</h2>
              <p style={{marginBottom: "2rem"}}>Orders are typically dispatch within 1-2 business days from the date of purchase. Please note that orders placed on weekends or holidays will be processed on the next business day.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>9. Delayed or Unsuccessful Delivery:</h2>
              <p style={{marginBottom: "2rem"}}>While we strive to ensure timely and successful deliveries, delays may occur due to unforeseen circumstances or issues with the courier service. In the event of a delayed or unsuccessful delivery, we will make every effort to communicate with you and provide updates on the status of your shipment.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>10. Contact Information:</h2>
              <p style={{marginBottom: "2rem"}}>For any inquiries or concerns related to shipping, please contact us at:</p>
              <p>Email: <a href="mailto:info@florenzaitaliya.com">info@florenzaitaliya.com</a></p>
            </div>
          </div>
        </section>
      </ProductLayout>
    </main>
  </div>
);

export default ShippingPolicy;
