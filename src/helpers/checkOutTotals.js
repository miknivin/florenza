export const calculateOrderTotals = (cartItems, paymentMethod) => {
  const itemsPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isCOD = paymentMethod === 2;
  const shippingAmount = isCOD ? 100 : 0;
  const totalAmount = itemsPrice + shippingAmount;

  return { itemsPrice, shippingAmount, totalAmount };
};
