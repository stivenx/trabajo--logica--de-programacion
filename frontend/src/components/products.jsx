import React, { useEffect, useState,useContext } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";
import ProductCard from "./productCard";
import { CarContext } from "../context/carContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const productVisible = 5;
  const [activiPos, setActiviPos] = useState(1);
  const totalPages = Math.ceil(products.length / productVisible);
  const fianalPages = activiPos * productVisible;
  const inicioPages = fianalPages - productVisible;
  const [categorias, setCategorias] = useState([]);
  const {carrito} = useContext(CarContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
      }
    };

    fetchProductos();
  }, [carrito]);

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
        }, [carrito, products]);

  const mapProducts = products.slice(inicioPages, fianalPages);

  const nexPos =()=>{
    setActiviPos((prev)=>
    Math.min(prev+1, totalPages))
  }
 const prePos =()=>{
  setActiviPos((prev)=>
  Math.max(prev-1, 1))
 }

 const handlePost =()=>{
    const visibleBotons =3
    const butonsMap =[]
    const indices ="..."
    if(totalPages <= visibleBotons+2){
        for(let i=1;i<=totalPages;i++){
            butonsMap.push(i)
        }
        
    }else if(activiPos <= visibleBotons){
        for(let i=1;i<=visibleBotons+1;i++){
            butonsMap.push(i)
        }
        butonsMap.push(indices)
        butonsMap.push(totalPages) 
    }else if(activiPos >= totalPages - visibleBotons){
        butonsMap.push(1)
        butonsMap.push(indices)
        for(let i=totalPages-visibleBotons;i<=totalPages;i++){
            butonsMap.push(i)
        }
    }else{
        butonsMap.push(1)
        butonsMap.push(indices)
        for(let i=activiPos-1;i<=activiPos+1;i++){
            butonsMap.push(i)
        }
        butonsMap.push(indices)
        butonsMap.push(totalPages)
    }

    return butonsMap.map((index)=>
    
       index ===indices?(
        <span className="mx-2 font-bold text-gray-500">{index}</span>
       ):(<button className={`mx-2 font-bold text-gray-500 hover:text-blue-500${activiPos === index ? " text-blue-500" : ""}`} onClick={() => setActiviPos(index)}>{index}</button>)
    
    
    
    )
 }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <Link
          to="/products/create"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Agregar Producto
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {mapProducts.map((producto) => (
           <ProductCard key={producto._id} product={producto} categorias={categorias} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
          onClick={prePos}
          disabled={activiPos === 1}
        >
          Anterior
        </button>
        {handlePost()}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={nexPos}
          disabled={activiPos === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Products;