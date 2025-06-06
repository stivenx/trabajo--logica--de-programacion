import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import  apiClient from "../api/axiosConfig";


const DetaillProduct = () => {
    const [nombre, setName] = useState('');
    const [descripcion, setDescription] = useState('');
    const [precio, setPrice] = useState(0);
    const [stock, setStock] = useState();
    const [imagenUrl, setImageUrl] = useState('');
    const [categoria, setCategoria] = useState('');
  
    const navigate = useNavigate();
    const { id } = useParams();
  
    useEffect(() => {
      handleGetProduct();
    }, []);
  
    const handleGetProduct = async () => {
      try {
        const response = await apiClient.get(`/productos/${id}`);
        const producto = response.data;
        const categoria = producto.categoria.nombre; // Aquí se obtiene el nombre de la categoría
  
        setName(producto.nombre);
        setDescription(producto.descripcion);
        setPrice(producto.precio);
        setStock(producto.stock);
        setImageUrl(producto.imagenUrl);
        setCategoria(categoria);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
  
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[600px] w-full rounded-lg bg-white dark:bg-black mb-4 flex items-center justify-center">
                <img className="w-full h-full object-contain" src={imagenUrl} alt="Product Image" />
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-full px-2">
                  <Link to={`/carrito/${id}`}>
                    <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700 text-2xl">Add to Cart</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:flex-1 px-4">
              <h2 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">{nombre}</h2>
              <div className="flex flex-col mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                  <span className="text-gray-600 dark:text-gray-300">${precio}</span>
                </div>
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-2xl">Description:</p>
              <p className="text-gray-600 dark:text-gray-300 text-2xl">{descripcion}</p>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-2xl">Categoría:</p>
              <p className="text-gray-600 dark:text-gray-300 text-2xl">{categoria}</p>
              <input 
                type="number"
                min={1}
                placeholder= "1"
                max={stock}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                

              />

            </div>
          </div>
        </div>
      </section>
    );
  };
  
  



export default DetaillProduct;


