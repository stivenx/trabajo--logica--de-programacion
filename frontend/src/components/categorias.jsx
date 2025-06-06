import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";
<link rel="stylesheet" href="./styles/categorias.css" />

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
  
    useEffect(() => {
      const fetchCategorias = async () => {
        try {
          const response = await apiClient.get("/categorias/");
          console.log("Respuesta de la API:", response.data); // Agrega un console.log aquí
          setCategorias(response.data);
        } catch (err) {
          console.error("Error al obtener las categorias:", err);
        }
      };
  
      console.log("Ejecutando fetchCategorias"); // Agrega un console.log aquí
      fetchCategorias();
    }, []);
  
    console.log("Renderizando componente Categorias"); // Agrega un console.log aquí
  
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Categorias</h1>
        <ul className="categorias list-none p-0 m-0 bg-white shadow-md rounded-lg p-4 flex flex-wrap justify-center">
          {categorias.map((categoria) => (
            <li key={categoria._id} className="w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-lg transition duration-300 ease-in-out mb-4">
              <div className="p-4">
                <div className="w-4 h-4 bg-gray-400 rounded-full mb-2"></div>
                <Link to={`/categorias/${categoria._id}`} className="text-gray-600 hover:text-gray-900 transition duration-200 ease-in-out">
                  <span className="font-semibold">{categoria.nombre}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

    );
  };
export default Categorias;

