import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ProfileInfo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    toast.success("Profile Update Successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log(data);
  };
  return (
    <>
      <div>
        <div className="woocomerce__account-rtitlewrap">
          <span className="woocomerce__account-rtitle">Welcome, Joseph</span>
        </div>
        <div className="woocomerce__checkout-rform">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="woocomerce__checkout-frfieldwrapperc">
              <div
                className="woocomerce__checkout-rformfield"
                style={{ marginBottom: "25px" }}
              >
                <label htmlFor="f_name">First Name</label>
                <input
                  id="f_name"
                  placeholder="First Name"
                  {...register("f_name")}
                  type="text"
                />
              </div>
              <div
                className="woocomerce__checkout-rformfield"
                style={{ marginBottom: "25px" }}
              >
                <label htmlFor="l_name">Last Name</label>
                <input
                  id="l_name"
                  placeholder="Last Name"
                  {...register("l_name")}
                  type="text"
                />
              </div>
              <div
                className="woocomerce__checkout-rformfield"
                style={{ marginBottom: "25px" }}
              >
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder="Password"
                  {...register("password")}
                  type="text"
                />
              </div>
              <div
                className="woocomerce__checkout-rformfield"
                style={{ marginBottom: "25px" }}
              >
                <label htmlFor="new_password">New Password</label>
                <input
                  id="new_password"
                  placeholder="New Password"
                  {...register("new_password")}
                  type="text"
                />
              </div>
              <div
                className="woocomerce__checkout-rformfield"
                style={{ marginBottom: "25px" }}
              >
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  id="confirm_password"
                  placeholder="Confirm Password"
                  {...register("confirm_password")}
                  type="text"
                />
              </div>
              <div className="woocomerce__checkout-rformfield">
                <input type="submit" style={{ lineHeight: "1" }} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
