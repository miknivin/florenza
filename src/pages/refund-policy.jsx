import Head from "next/head";
import ProductLayout from "@/components/common/layout/ProductLayout";

const RefundPolicy = () => (
  <div>
    <Head>
      <title>Return, Cancellation & Refund Policy</title>
      <meta name="description" content="Return, Cancellation & Refund Policy" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>
      <ProductLayout>
        <section className="refund-policy" style={{padding: "60px 0"}}>
          <div className="container" style={{maxWidth: "800px", margin: "0 auto"}}>
            <h1 className="hero-title title-anim" style={{marginBottom: "2.5rem", textAlign: "center"}}>Return, Cancellation & Refund Policy</h1>
            <div className="refund-policy-content" style={{fontSize: "1.1rem", lineHeight: "2", color: "#222"}}>
              <p style={{marginBottom: "2rem"}}>Welcome to FlorenzaItaliya.com, owned and operated by OWNSHOPI LLP. This Return, Cancellation, and Refund Policy outlines the procedures for returning products, cancelling orders, and requesting refunds.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>1. Return Policy:</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}>Once items are delivered, they cannot be returned as opened or used products cannot be reused or resold.</li>
                <li style={{marginBottom: "1rem"}}>Damages caused by neglect, improper use, or incorrect application will not be covered under this policy.</li>
                <li style={{marginBottom: "1rem"}}>We do not assume responsibility for adverse reactions or sensitivities caused by specific product ingredients. Patch tests are recommended as advised on each product packaging.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>2. Refund Policy:</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}>Florenza Italiya is not responsible for any damage that occurs after the product has been delivered.</li>
                <li style={{marginBottom: "1rem"}}>Claims for missing items, leakage, breakage, damage, or incorrect product require an unboxing video showing the original packaging.</li>
                <li style={{marginBottom: "1rem"}}>To claim a refund, contact customer care at +918848101280 or email info@florenzaitaliya.com with the subject “Refund for [Order ID]” and relevant images/videos.</li>
                <li style={{marginBottom: "1rem"}}>If a package is tampered with, damaged, or defective, refuse to accept it and contact us immediately.</li>
                <li style={{marginBottom: "1rem"}}>If your order is marked as delivered but not received, report this within 3 days of delivery status. No refunds after this period.</li>
                <li style={{marginBottom: "1rem"}}>Delivery charges are non-refundable.</li>
                <li style={{marginBottom: "1rem"}}>Claims for refunds must be made within 24 hours of delivery.</li>
                <li style={{marginBottom: "1rem"}}>Once accepted, refunds may take up to 10 days to be credited. Transaction ID and details will be provided.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>3. Return Policy (Damaged in Transit):</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}>Refund or exchange can be initiated for products damaged during transit (leakage, broken, or missing items) after claim verification.</li>
                <li style={{marginBottom: "1rem"}}>Contact customer care within 24-48 hours of receiving the damaged product for claims.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>4. Cancellation Policy:</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}>Orders can be cancelled before dispatch. A processing fee of 2.5% will be deducted from the refund amount for cancellations.</li>
                <li style={{marginBottom: "1rem"}}>Refunds for paid orders will be credited to the original payment account within 10 days of cancellation acceptance.</li>
                <li style={{marginBottom: "1rem"}}>Orders already shipped cannot be cancelled. If a prepaid order is returned after shipment, ₹90 will be deducted from the refund.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>5. Contact Us:</h2>
              <p style={{marginBottom: "2rem"}}>For any queries, you can reach us at:</p>
              <p style={{marginBottom: "1rem"}}>Customer Care: +918848101280</p>
              <p>Email: <a href="mailto:info@florenzaitaliya.com">info@florenzaitaliya.com</a></p>
            </div>
          </div>
        </section>
      </ProductLayout>
    </main>
  </div>
);

export default RefundPolicy;
