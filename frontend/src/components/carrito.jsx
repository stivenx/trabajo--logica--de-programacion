import React, { useState, useEffect } from 'react';
import apiClient from "../api/axiosConfig";

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [usuarioId, setUsuarioId] = useState(''); // Debes obtener el ID del usuario de alguna forma

  useEffect(() => {
    const obtenerCarrito = async () => {
      try {
        const response = await apiClient.get(`/api/carrito/${usuarioId}`);
        setCarrito(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerCarrito();
  }, [usuarioId]);

  const handleEliminarProducto = async (productoId) => {
    try {
      await apiClient.delete(`/api/carrito/${usuarioId}/productos/${productoId}`);
      setCarrito(carrito.filter((producto) => producto.id !== productoId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleActualizarCantidad = async (productoId, cantidad) => {
    try {
      await apiClient.patch(`/api/carrito/${usuarioId}/productos/${productoId}`, { cantidad });
      setCarrito(carrito.map((producto) => producto.id === productoId ? { ...producto, cantidad } : producto));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Carrito</h1>
      <ul>
        {carrito.map((producto) => (
          <li key={producto.id}>
            <span>{producto.nombre}</span>
            <span>Cantidad: {producto.cantidad}</span>
            <button onClick={() => handleEliminarProducto(producto.id)}>Eliminar</button>
            <input
              type="number"
              value={producto.cantidad}
              onChange={(e) => handleActualizarCantidad(producto.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarritoPage;