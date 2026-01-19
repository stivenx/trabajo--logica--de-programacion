import React, { useEffect, useState,useContext } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";
import ProductCard from "./productCard";
import { TitleContext } from "../context/titleContext";
import { CarContext } from "../context/carContext";

const ProductsSelect = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const productVisible = 5;
  const [activiPos, setActiviPos] = useState(1);
  const totalPages = Math.ceil(products.length / productVisible);
  const fianalPages = activiPos * productVisible;
  const inicioPages = fianalPages - productVisible;
  const [productsView, setProductsView] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const { setTitle } = useContext(TitleContext);
  const {carrito} = useContext(CarContext);

  useEffect(() => {
    

    fetchProductos();
     
  }, [carrito]);

   


   const fetchProductos = async () => {
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data);
        setProductsView(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
        return
      }
    };
    

    const fetchProductosSelected = async () => {
          try {
            const response = await apiClient.get(`/products/select`,{
                params:{
                  productsId:selectedProduct.join(',')
                }
            }
            );
            console.log("Respuesta de la API:", response.data);
            setProducts(response.data);
          } catch (error) {
            setError(error.response.data.mensaje );
          }
        };

  useEffect(() => {
         

    if(selectedProduct){
        

      fetchProductosSelected();
        
    }else{
       fetchProductos();
    }
      
        }, [carrito,selectedProduct]);


  useEffect (()=>{

  },[])     

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

 const ProductsSelect =(product)=>{
    setSelectedProduct((prev)=>
    prev.includes(product) ? prev.filter((id) => id !== product) : [...prev, product]
    )
 }
  return (
  <div className="p-8 max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Lista de Productos</h1>

    {error && (
      <p className="mb-4 text-red-500 font-medium">{error}</p>
    )}

    {/* Barra superior */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

      {/* Filtro */}
      {productsView.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            filtrar productos:
          </label>
          
        
            {productsView.map((producto) => (
              <label
                key={producto.id}
                htmlFor={producto.id}
                className="flex items-center gap-2 cursor-pointer select-none
                          px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  id={producto.id}
                  value={producto.id}
                  checked={selectedProduct.includes(producto.id)}
                  onChange={() => ProductsSelect(producto.id )}
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  {producto.nombre}
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
            
          />
        ))}
      </div>
    )}

    {/* Paginación */}
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        onClick={prePos}
        disabled={activiPos === 1 }
      >
        Anterior
      </button>

      {handlePost()}
     
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        onClick={nexPos}
        disabled={activiPos === totalPages }
      >
        Siguiente
      </button>
    </div>
  </div>
);

};

export default ProductsSelect;


/*

{ Barra superior 
<div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  
  {/* Filtros *
  {productsView.length > 0 && (
    <div className="flex flex-col gap-1 max-w-sm">
      <label className="text-sm font-semibold text-gray-700">
        Filtrar productos
      </label>

      <select
        multiple
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions, o => o.value);
          setSelectedProduct(values);
        }}
        className="h-32 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {productsView.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <span className="text-xs text-gray-400">
        Puedes seleccionar varios productos
      </span>
    </div>
  )}

  {/* Acción principal 
  <Link
    to="/products/create"
    className="self-start sm:self-end px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
  >
    + Agregar Producto
  </Link>

</div>



*/ 