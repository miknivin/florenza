import "bootstrap/dist/css/bootstrap.min.css";
import "../../public/assets/scss/master.scss";
import "@/styles/extra.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/bundle";
import "react-toastify/dist/ReactToastify.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "@/store/store";
import UserProfile from "@/components/auth/UserProfile";
import { Analytics } from "@vercel/analytics/next";
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <UserProfile />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Analytics />
    </Provider>
  );
}
