import { useContext, useEffect, useState } from "react";
import{Link} from "react-router-dom"
import { UserContext } from "../context/useContext";
import { CarContext } from "../context/carContext";

const CartPage = () => {
  const { user } = useContext(UserContext);
  const { carrito, handleCart,visibleActive,handleEliminarProducto,vaciarCarrito,actualizarCarrito } = useContext(CarContext);

  const [loading, setLoading] = useState(true);

  const total = carrito.reduce((total, item) => {
    
   const totalIndividual = item.quantity * item.precio;
    return total +   totalIndividual;
      
   },0);
  useEffect(() => {
        if (user) {
            handleCart(user).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

  if (loading) {
    return <p className="p-4">Cargando los productos...</p>;
  }

    return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛒 Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="space-y-4">
            {carrito.map((item) => (
             <div
                key={`${item.producto_id}-${item.quantity}`}
                className="flex gap-4 items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* 🖼️ Imagen */}
                <Link to={`/product/${item.producto_id}`}>
                <img
                  src={`http://localhost:5000/${item.imagen}`}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
                </Link>

                {/* 🧾 Info producto */}
                <div className="flex-1">
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-sm text-gray-500">${item.precio}</p>

                  {/* ➕➖ Control cantidad */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() =>
                        actualizarCarrito(
                          item.cart_id,
                          item.producto_id,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      disabled={item.quantity === item.stock}
                      onClick={() =>
                        actualizarCarrito(
                          item.cart_id,
                          item.producto_id,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 💰 Precio + eliminar */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-blue-600">
                    ${(item.precio * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() =>
                      handleEliminarProducto(item.cart_id, item.producto_id)
                    }
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

          </div>

          {/* 🧮 Resumen */}
          {visibleActive && (
            <div className="mt-6 p-4 border rounded-lg shadow-sm bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total:</p>
                <p className="font-bold text-xl text-green-600">${total}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => vaciarCarrito(carrito[0].cart_id)}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Vaciar carrito
                </button>

                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

};

export default CartPage;
