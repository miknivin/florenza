"use client";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import DeleteIcon from "../icons/DeleteIcon";

export default function CartContent({
  i,
  length,
  el,
  dispatch,
  updateQuantity,
  removeFromCart,
}) {
  const router = useRouter();

  const updateCount = (data, selector) => {
    let newQuantity = data.quantity;
    if (selector === "minus" && data.quantity > 1) {
      newQuantity -= 1;
    } else if (selector === "plus") {
      newQuantity += 1;
    }
    dispatch(
      updateQuantity({
        id: data.id,
        variant: data.variant,
        quantity: newQuantity,
      })
    );
  };

  const deleteCart = (data) => {
    dispatch(removeFromCart({ id: data.id, variant: data.variant }));
    toast.success("Delete Successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <div
        className={`woocomerce__cart-productlist pt-0 ${
          i + 1 === length ? "border-0" : ""
        }`}
      >
        <div className="woocomerce__cart-product">
          <div
            className="woocomerce__cart-thumb pointer_cursor"
            onClick={() => router.push(`/shop/${el.id}`)}
          >
            <Image
              width={90}
              height={140}
              style={{
                height: "auto",
                maxHeight: "100px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
              src={el?.img?.url}
              alt="cart"
            />
          </div>
          <div
            className="woocomerce__cart-rcontent pointer_cursor"
            onClick={() => router.push(`/shop/${el.id}`)}
          >
            <span className="woocomerce__cart-rtitle">
              <p>{el.name}</p>
            </span>
            <ul className="woocomerce__cart-pinfo">
              <li>Variant: {el.variant || "N/A"}</li>
              <li>SKU: {el.sku}</li>
            </ul>
          </div>
        </div>
        <div className="woocomerce__cart-price">₹{el.price}</div>
        <div className="woocomerce__cart-quantity">
          <div
            style={{ maxWidth: "fit-content" }}
            className="woocomerce__single-counter counter2"
          >
            <p
              className="counter__decrement decrement2 pointer_cursor"
              onClick={() => updateCount(el, "minus")}
            >
              <i className="fa-solid fa-minus" />
            </p>
            <input
              className="counter__input"
              type="text"
              value={el.quantity}
              name="counter"
              size="5"
              readOnly
            />
            <p
              className="counter__increment increment2 pointer_cursor"
              onClick={() => updateCount(el, "plus")}
            >
              <i style={{ fontSize: "15px" }} className="fa-solid fa-plus" />
            </p>
          </div>
        </div>
        <div className="woocomerce__cart-total">
          ₹{parseFloat(el.price) * parseInt(el.quantity)}
        </div>
        <button
          style={{ height: 0 }}
          className="woocomerce__cart-close pointer_cursor text-danger "
          onClick={() => deleteCart(el)}
        >
          <DeleteIcon />
        </button>
      </div>
    </>
  );
}
