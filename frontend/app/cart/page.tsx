import React, { useContext } from "react";
import { CartContext } from "../../store/CartContext";
import { useToast } from "../../components/ToastProvider";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { showToast } = useToast();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Košarica</h2>
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
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    showToast("Proizvod uklonjen iz košarice.", "success");
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Ukloni
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              clearCart();
              showToast("Košarica je ispražnjena.", "success");
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded font-bold"
          >
            Isprazni košaricu
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
