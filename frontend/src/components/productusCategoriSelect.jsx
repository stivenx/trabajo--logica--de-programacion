import React, { useEffect, useState,useContext } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";
import ProductCard from "./productCard";
import { TitleContext } from "../context/titleContext";
import { CarContext } from "../context/carContext";

const ProductsSelectCategori = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const productVisible = 5;
  const [activiPos, setActiviPos] = useState(1);
  const totalPages = Math.ceil(products.length / productVisible);
  const fianalPages = activiPos * productVisible;
  const inicioPages = fianalPages - productVisible;
  const [categorias, setCategorias] = useState([]);
  const [selectedCategori, setSelectedCategori] = useState([]);
  const { setTitle } = useContext(TitleContext);
  const {carrito} = useContext(CarContext);
  

  useEffect(()=>{

    if(selectedCategori.length > 0){
       const categorisnombre = selectedCategori.map((categori)=>categorias.find((cat)=>cat._id === categori)?.nombre).join(',')
       setTitle(`Productos de ${categorisnombre}`)
    }else{
      setTitle("Productos categorias")
    }

  },[selectedCategori])

  useEffect(() => {
    

    fetchProductos();
     fetchCategorias();
  }, []);

 const fetchCategorias = async () => {
            try {
              const response = await apiClient.get("/categorias/");
              console.log("Respuesta de la API:", response.data); // Agrega un console.log aquí
              setCategorias(response.data);
            } catch (err) {
              console.error("Error al obtener las categorias:", err);
            }
          };

   const fetchProductos = async () => {
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
      }
    };

    const fetchProductosSelected = async () => {
          try {
            const response = await apiClient.get(`/products/select/categoris`,{
                params:{
                  categoris:selectedCategori.join(',')
            }}
            );
            console.log("Respuesta de la API:", response.data);
            setProducts(response.data);
          } catch (error) {
            setError(error.response.data.mensaje );
          }
        };

  useEffect(() => {
         

    if(selectedCategori.length > 0){
        

      fetchProductosSelected();
        
    }else{
       fetchProductos();
    }
      
        }, [selectedCategori, carrito]);

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

 const categoriesSelect =(categori)=>{
    setSelectedCategori((prev)=>
    prev.includes(categori) ? prev.filter((id) => id !== categori) : [...prev, categori]
    )
 }
  return (
  <div  className="p-8 max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Lista de Productos</h1>

    {error && (
      <p className="mb-4 text-red-500 font-medium">{error}</p>
    )}
    

    {/* Barra superior */}
    <div  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

      {/* Filtro */}
      {categorias.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Categoría:
          </label>
          
        
            {categorias.map((categoria) => (
              <label
                key={categoria._id}
                htmlFor={categoria._id}
                className="flex items-center gap-2 cursor-pointer select-none
                          px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  id={categoria._id}
                  value={categoria._id}
                  checked={selectedCategori.includes(categoria._id) }
                  onChange={() => categoriesSelect(categoria._id) }
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  {categoria.nombre}
                </span>
              </label>


            ))}
          
        </div>
      )}

      {/* Botón */}
      <Link
        to="/products/create"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
      >
        Agregar Producto
      </Link>
    </div>

    {/* Productos */}
    {mapProducts.length === 0 ? (
      <p className="text-gray-500 text-center mt-10">
        No hay productos disponibles
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mapProducts.map((producto) => (
          <ProductCard
            key={producto.id}
            product={producto}
            categorias={categorias}
          />
        ))}
      </div>
    )}

    {/* Paginación */}
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        onClick={prePos}
        disabled={activiPos === 1}
      >
        Anterior
      </button>

      {handlePost()}

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        onClick={nexPos}
        disabled={activiPos === totalPages}
      >
        Siguiente
      </button>
    </div>
  </div>
);

};

export default ProductsSelectCategori;