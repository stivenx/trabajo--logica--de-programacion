import React, { useState, useEffect,useRef,useContext, } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { CarContext } from "../context/carContext";
import { UserContext } from "../context/useContext";

const ProductCard = ({ product }) => {
  const [activeImage, setActiveImage] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [postActive, setPostActive] = useState(null);
  const modalref = useRef(null);
  const {createCart,handleCart,visibleActive} = useContext(CarContext);
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  console.log("product:", product.stock);
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
          }, [product.stock]);
   
        useEffect(()=>{
           const hanledImage =(e)=>{
            if(modalref.current && !modalref.current.contains(e.target)){
                setProductDetail(null);
            }
           }

           document.addEventListener("mousedown",hanledImage);
           return ()=>{
            document.removeEventListener("mousedown",hanledImage);
           }
        },[])
   
   if (!product || !product.id) return null;

   const currentIndex = activeImage[product.id] ?? 0;
   
    const handleCartNow =async()=>{
      if(!user){
        navigate("/login");
        alert("Debes iniciar sesion para comprar");
        return;
      }
       try{
        await createCart(product,user,1);
        await handleCart(user);
        visibleActive();
       }catch(error){
        console.error(error);
       }
     }
  
   
   const categoria = categorias.find((cat) => cat._id === product.categoria)?.nombre || "Sin categoría";
  return (
    <div  className="group w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
      {/* Vista ampliada */}
      {productDetail && (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        
        <div ref={modalref} className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-6 overflow-hidden">
          
          {/* Botón cerrar */}
          <button
            onClick={() => setProductDetail(null)}
            className="absolute top-3 right-3 text-2xl text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
          >
            ✕
          </button>

          {/* Imagen grande */}
          <img
            src={`http://localhost:5000/${productDetail.imagenes[postActive].replace(/\\/g, "/")}`}
            alt="Vista ampliada"
            className="w-full max-h-[80vh] object-contain bg-black"
          />

          {/* Controles */}
          {productDetail.imagenes.length > 1 && (
            <div className="flex justify-center gap-3 p-4 bg-gray-100">
              {productDetail.imagenes.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image.replace(/\\/g, "/")}`}
                  alt={`Imagen ${index + 1}`}
                  onClick={()=>setPostActive(index)}
                  className={`w-20 h-20 object-contain cursor-pointer ${
                    index === postActive ? "border-2 border-blue-500" : ""
                  }`}/*
                  onMouseEnter={()=>setPostActive(index)}
                  onMouseLeave={()=>setPostActive(postActive)}*/
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )}

      {/* Imagen */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {product.imagenes?.length > 0 ? (
            product.imagenes.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                alt={`Imagen ${index + 1}`}
                /*
                onClick={(e) => {
                  e.preventDefault();
                  const  indexPost = activeImage[product.id] ?? 0; 
                  setProductDetail(() => product);
                  setPostActive(() =>indexPost );
                }}*/

               /*
                onMouseEnter={()=>{
                  product.imagenes.length >1 &&(
                    setActiveImage((prev)=>({
                      ...prev,
                      [product.id]:1
                    }))
                  )
                }}
                onMouseLeave={()=>{
                  product.imagenes.length >1 &&(
                    setActiveImage((prev)=>({
                      ...prev,
                      [product.id]:0
                    }))
                  )
                }}*/
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  currentIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <img
              src="/placeholder.jpg"
              alt="Sin imagen"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Dots */}
        {product.imagenes?.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {product.imagenes.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveImage((prev) => ({
                    ...prev,
                    [product.id]: index,
                  }));
                }}
                onMouseEnter={()=>setActiveImage((prev)=>({
                  ...prev,
                  [product.id]:index
                })
                )}
                onMouseLeave={()=>setActiveImage((prev)=>({
                  ...prev,
                  [product.id]:currentIndex
                }))}
                className={`w-2.5 h-2.5 rounded-full ${
                  currentIndex === index
                    ? "bg-gray-800"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.nombre}
          </h3>
        </Link>

        {/* Precio */}
        <div className="text-xl font-bold text-gray-900">
          ${product.precio} <span className="text-sm font-medium">COL</span>
        </div>

        {/* Categoría */}
        <div className="text-sm font-medium text-gray-600">
          {categoria} 
        </div>

        {/* Acciones */}
        <div  className="flex items-center justify-between gap-2 pt-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center bg-gray-800 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Ver detalles
          </Link>

          {product.stock > 0 ? (
            <button
              onClick={handleCartNow}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg opacity-70 cursorpointer hover:opacity-100"
            >
              🛒 Agregar
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg cursor-not-allowed"
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
