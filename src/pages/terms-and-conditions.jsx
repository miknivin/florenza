import Head from "next/head";
import ProductLayout from "@/components/common/layout/ProductLayout";

const TermsAndConditions = () => (
  <div>
    <Head>
      <title>Terms & Conditions</title>
      <meta name="description" content="Terms & Conditions" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>
      <ProductLayout>
        <section className="terms-policy" style={{padding: "60px 0"}}>
          <div className="container" style={{maxWidth: "800px", margin: "0 auto"}}>
            <h1 className="hero-title title-anim" style={{marginBottom: "2.5rem", textAlign: "center"}}>Terms & Conditions</h1>
            <div className="terms-policy-content" style={{fontSize: "1.1rem", lineHeight: "2", color: "#222"}}>
              <p style={{marginBottom: "2rem"}}>Welcome to FlorenzaItaliya.com, a website owned and operated by OWNSHOPI LLP. By using this website, you accept and agree to comply with these Terms and Conditions. Please read the following terms carefully.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>1. Intellectual Property:</h2>
              <p style={{marginBottom: "2rem"}}>The content, design, and intellectual property of this website are owned by OWNSHOPI LLP. Reproduction, distribution, or any other use of the materials on this website is prohibited without the express written consent of OWNSHOPI LLP.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>2. Accuracy of Information:</h2>
              <p style={{marginBottom: "2rem"}}>While we strive to provide accurate and up-to-date information on this website, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>3. Product Availability:</h2>
              <p style={{marginBottom: "2rem"}}>Product availability on the website is subject to change without notice. We do not guarantee the availability of any product listed on the website.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>4. External Links:</h2>
              <p style={{marginBottom: "2rem"}}>This website may contain links to external websites. These links are provided for your convenience, and we do not endorse the content of third-party websites.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>5. User Responsibilities:</h2>
              <p style={{marginBottom: "2rem"}}>You are responsible for ensuring that all information you provide on this website is accurate, current, and complete. You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this site by any third party.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>6. Order Acceptance:</h2>
              <p style={{marginBottom: "2rem"}}>All orders placed on FlorenzaItaliya.com are subject to acceptance. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product or pricing information, or suspicion of fraudulent activity.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>7. Pricing and Payment:</h2>
              <p style={{marginBottom: "2rem"}}>Prices for products are subject to change without notice. We reserve the right to modify or discontinue products at any time. Payments are processed through secure payment gateways. We do not store credit card details.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>8. Shipping:</h2>
              <p style={{marginBottom: "2rem"}}>Shipping costs and delivery times are provided during the checkout process. We are not responsible for delays or issues caused by shipping carriers.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>9. Returns and Refunds:</h2>
              <p style={{marginBottom: "2rem"}}>Our returns and refunds policy is outlined in detail on the Returns and Refunds page. Please review this information before making a purchase.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>10. User Accounts:</h2>
              <p style={{marginBottom: "2rem"}}>You may be required to create a user account to access certain features of the website. You are responsible for maintaining the confidentiality of your account information and for restricting access to your account.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>11. Changes to Terms and Conditions:</h2>
              <p style={{marginBottom: "2rem"}}>OWNSHOPI LLP reserves the right to change these terms and conditions at any time without notice. By using this website, you agree to be bound by the current version of these terms and conditions.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>12. Governing Law:</h2>
              <p style={{marginBottom: "2rem"}}>These terms and conditions are governed by and construed in accordance with the laws of Kerala, India, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Kerala, India, specifically the High Court of Kerala.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>13. Contacting Us:</h2>
              <p style={{marginBottom: "2rem"}}>If you have any questions about these Terms and Conditions, please contact us at:</p>
              <p>Email: <a href="mailto:info@florenzaitaliya.com">info@florenzaitaliya.com</a></p>
            </div>
          </div>
        </section>
      </ProductLayout>
    </main>
  </div>
);

export default TermsAndConditions;
