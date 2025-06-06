import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await apiClient.get("/productos");
        setProductos(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((producto) => (
          <Link to={`/productos/${producto._id}`} key={producto._id}>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <img src={producto.imagen} alt={`Imagen de ${producto.nombre}`} className="w-20 h-20 object-cover" />
              <h2 className="text-lg font-semibold">{producto.nombre}</h2>
              <p className="text-gray-600">Precio: ${producto.precio}</p>
              <p className="text-gray-600">Categoría: {producto.categoria.nombre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Productos;