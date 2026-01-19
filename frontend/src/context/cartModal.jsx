import { useContext, useEffect, useState,useRef } from "react";

import { UserContext } from "../context/useContext";
import { CarContext } from "../context/carContext";

const CartModal = () => {
  const { user } = useContext(UserContext);
  const { carrito, handleCart,visibleActive,handleEliminarProducto,vaciarCarrito,actualizarCarrito,visible,setVisible } = useContext(CarContext);
  const modalRef = useRef(null);

  useEffect(()=>{
   const modalsen =(e)=>{
    if(modalRef.current && !modalRef.current.contains(e.target)){
        setVisible(false);
    }
   }
   document.addEventListener("mousedown",modalsen);
   return ()=>{
    document.removeEventListener("mousedown",modalsen);
   }
  },[])

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


   if (!visible) return null //si no esta activo no se muestra;

   return (
    <div ref={modalRef} className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-2xl z-50 flex flex-col">

    {/* 🔝 Header */}
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-lg font-bold">🛒 Tu carrito</h1>
      <button
        onClick={() => setVisible(false)}
        className="text-xl text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </div>

    {/* 📦 Contenido */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {carrito.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Tu carrito está vacío
        </p>
      ) : (
        carrito.map((item) => (
          <div
            key={`${item.producto_id}-${item.quantity}`}
            className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
          >
            {/* 🖼️ Imagen */}
            <img
              src={`http://localhost:5000/${item.imagen}`}
              alt={item.nombre}
              className="w-14 h-14 object-cover rounded-lg border"
            />
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.nombre}</p>

              {/* Cantidad */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  disabled={item.quantity === 1}
                  onClick={() =>
                    actualizarCarrito(item.cart_id, item.producto_id, item.quantity - 1)
                  }
                  className="w-6 h-6 flex items-center justify-center border rounded text-sm disabled:opacity-40"
                >
                  −
                </button>

                <span key={item.quantity} className="text-sm font-semibold w-6 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    actualizarCarrito(item.cart_id, item.producto_id, item.quantity + 1)
                  }
                  className="w-6 h-6 flex items-center justify-center border rounded text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Precio + eliminar */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-bold text-blue-600">
                ${(item.precio * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => handleEliminarProducto(item.cart_id, item.producto_id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* 🧾 Footer */}
    {carrito.length > 0 && (
      <div className="p-4 border-t bg-white space-y-3">

        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span className="text-green-600">${total}</span>
        </div>

        <button
          onClick={() => vaciarCarrito(carrito[0].cart_id)}
          className="w-full py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Vaciar carrito
        </button>

        <button
          className="w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Finalizar compra
        </button>
      </div>
    )}

  </div>
);

};

export default CartModal;
