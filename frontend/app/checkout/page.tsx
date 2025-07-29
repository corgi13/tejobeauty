import React, { useContext } from "react";
import { CartContext } from "../../store/CartContext";
import { useToast } from "../../components/ToastProvider";

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { showToast } = useToast();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    // Ovdje bi išao POST na backend za narudžbu
    showToast("Narudžba je uspješno poslana!", "success");
    clearCart();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Pregled narudžbe</h2>
      {cart.length === 0 ? (
        <div>Košarica je prazna.</div>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <span className="font-semibold">{item.name}</span> x{" "}
                  {item.quantity}
                  <span className="ml-2 text-pink-600">{item.price} €</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="font-bold text-lg mb-4">Ukupno: {total} €</div>
          <button
            onClick={handleOrder}
            className="bg-pink-600 text-white px-4 py-2 rounded font-bold w-full"
          >
            Potvrdi narudžbu
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
