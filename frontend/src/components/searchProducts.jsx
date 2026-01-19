import { useState,useEffect,useContext } from "react";
import apiClient from "../api/axiosConfig";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "./productCard";
import { CarContext } from "../context/carContext";

const SearchProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
     const {carrito} = useContext(CarContext);

    useEffect(() => {
       const searchParams = new URLSearchParams(location.search)
       const params = searchParams.get("search")      
       setSearch(params);
       if(params.trim().length > 0){
        fetchProducts(params);
       } 
    }, [location]);

    useEffect(()=>{
       if(products.length > 0){
           fetchProducts(search);
       }
    },[carrito])

     const fetchProducts = async (params) => {
            try {
                const response = await apiClient.get(`/products/searchAll/${params}`);
                setProducts(response.data);
            } catch (err) {
                setError("Error al cargar los productos");
            }
        };



    return (
    <div className="max-w-7xl mx-auto px-6 py-10">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🔎 Buscar Productos
        </h1>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
            type="text"
            placeholder="Buscar productos..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
            onClick={() => fetchProducts(search)}
        >
            Buscar
        </button>
        </div>

        {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
        )}

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
            No se encontraron productos 😕
            </div>
        ) : (
            products.map((product) => (
            <ProductCard key={product._id} product={product} />
            ))
        )}
        </div>
    </div>
    );

}

export default SearchProducts