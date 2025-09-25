import ProductLayout from "@/components/common/layout/ProductLayout";
import Head from "next/head";

const Reset = () => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Reset Password Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ProductLayout>
          <div className="woocomerce__signin password-reset sec-plr-50">
            <div className="woocomerce__signin-wrapper">
              <div className="woocomerce__signin-titlewrap">
                <span className="woocomerce__signin-title">Reset password</span>
                <p className="woocomerce__signin-dis">
                  <span>Enter the email</span> that you used when register to
                  recover your password. You will receive a{" "}
                  <span>password reset link.</span>
                </p>
              </div>
              <form action="#">
                <div className="woocomerce__signin-field">
                  <label htmlFor="email">Email</label>
                  <div className="woocomerce__signin-emailfield">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="woocomerce__signin-resetbuton">
                  <button className="woocomerce__checkout-submitbtn">
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ProductLayout>
      </main>
    </>
  );
};

export default Reset;
