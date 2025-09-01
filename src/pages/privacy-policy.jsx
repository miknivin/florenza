import Head from "next/head";
import ProductLayout from "@/components/common/layout/ProductLayout";

const PrivacyPolicy = () => (
  <div>
    <Head>
      <title>Privacy Policy</title>
      <meta name="description" content="Privacy Policy" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>
      <ProductLayout>
        <section className="privacy-policy" style={{padding: "60px 0"}}>
          <div className="container" style={{maxWidth: "800px", margin: "0 auto"}}>
            <h1 className="hero-title title-anim" style={{marginBottom: "2.5rem", textAlign: "center"}}>Privacy Policy</h1>
            <div className="privacy-policy-content" style={{fontSize: "1.1rem", lineHeight: "2", color: "#222"}}>
              <p style={{marginBottom: "2rem"}}>Welcome to FlorenzaItaliya.com, owned and operated by OWNSHOPI LLP. This Privacy Policy outlines how we collect, use, maintain, and disclose information obtained from users of the FlorenzaItaliya.com website.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>1. Information We Collect:</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}><strong>Personal Identification Information:</strong> We may collect personal identification information when users visit our site, register, place an order, subscribe to the newsletter, or engage in other activities.</li>
                <li><strong>Non-personal Identification Information:</strong> We may collect non-personal identification information such as browser type, operating system, and other technical details.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>2. How We Use Collected Information:</h2>
              <ul style={{marginBottom: "2rem"}}>
                <li style={{marginBottom: "1rem"}}><strong>Order Processing:</strong> Personal information may be used to process orders and provide a personalized user experience.</li>
                <li><strong>Communication:</strong> We may use the email address provided for order processing to send periodic emails related to orders and updates. The email address may also be used for responding to inquiries and other requests.</li>
              </ul>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>3. How We Protect Your Information:</h2>
              <p style={{marginBottom: "2rem"}}>We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our site.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>4. Sharing Your Personal Information:</h2>
              <p style={{marginBottom: "2rem"}}>We do not sell, trade, or rent users’ personal identification information to others. Generic aggregated demographic information may be shared with trusted affiliates for statistical purposes.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>5. Third-party Websites:</h2>
              <p style={{marginBottom: "2rem"}}>FlorenzaItaliya.com may contain links to external websites for your convenience. We do not endorse the content or practices of third-party sites. Users are advised to read the privacy policies of these external sites.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>6. Cookies:</h2>
              <p style={{marginBottom: "2rem"}}>Our site may use “cookies” to enhance user experience. Users may choose to set their web browser to refuse cookies or to alert them when cookies are being sent. Note that some parts of the site may not function properly if cookies are disabled.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>7. Changes to this Privacy Policy:</h2>
              <p style={{marginBottom: "2rem"}}>OWNSHOPI LLP has the discretion to update this privacy policy at any time. Users are encouraged to check this page for any changes. The last updated date will be revised accordingly.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>8. Your Acceptance of These Terms:</h2>
              <p style={{marginBottom: "2rem"}}>By using FlorenzaItaliya.com, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our site.</p>
              <h2 style={{marginTop: "2rem", marginBottom: "1rem"}}>9. Contacting Us:</h2>
              <p style={{marginBottom: "2rem"}}>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:</p>
              <p>Email: <a href="mailto:info@florenzaitaliya.com">info@florenzaitaliya.com</a></p>
            </div>
          </div>
        </section>
      </ProductLayout>
    </main>
  </div>
);

export default PrivacyPolicy;