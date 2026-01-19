import { useEffect, useState,useRef, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { TitleContext } from "../context/titleContext";
import { CarContext } from "../context/carContext";
import { UserContext } from "../context/useContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category,setCategory] = useState(null);
  const [bigImage, setBigImage] = useState(null);
  const refModal =useRef(null);
  const {setTitle} = useContext(TitleContext);
  const {carrito,createCart,handleCart,visibleActive} = useContext(CarContext);
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  const Navigate = useNavigate();
  useEffect(() => {
    
    fetchProduct();
  }, [id, carrito]);

  const handleCartNow =async()=>{
    if(!user){
      navigate("/login");
      alert("Debes iniciar sesion para comprar");
      return;
    }
     
      await createCart(product,user,quantity);
     const response = await apiClient.get(`/products/${id}`);
      setProduct(response.data);
     await handleCart(user);
     const time = setTimeout(() => {
      visibleActive();
     } , 1000);
     return () => clearTimeout(time);

     
   }

  useEffect(()=>{
    const handletClick=(e)=>{
      if(refModal.current && !refModal.current.contains(e.target)){
        setBigImage(null);
      }
    }

      document.addEventListener("mousedown", handletClick);
      return ()=>{
       document.removeEventListener("mousedown", handletClick);
      }

  },[bigImage])

  const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`/products/${id}`);
        setProduct(res.data);
        setTitle(res.data.nombre);
      } catch (error) {
        console.error("Error al obtener el producto", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(()=>{
    const  handleCategoria = async () => {
      try {
        const response = await apiClient.get(`/categorias/${product.categoria}`);
        setCategory(response.data);
      } catch (error) {
        console.error("Error al obtener el producto", error);
      } finally {
        setLoading(false);
      }
    }

    handleCategoria();

  },[product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Producto no encontrado</p>
      </div>
    );
  }

  const handledelete = async () => {
    try {
      await apiClient.delete(`/products/${id}`);
      Navigate("/products");

    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const prevImg = () => {
    setBigImage((prev)=>(prev ===0 ? product.imagenes.length-1 : prev-1));
  };
  const nexImg = () => {
    setBigImage((prev)=>(prev === product.imagenes.length-1 ? 0 : prev+1));
  };

  const stockPorducts = Math.min(5, product.stock);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div key={product.id +product.stock} className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Galería */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.imagenes?.length > 0 ? (
              <img
                src={`http://localhost:5000/${product.imagenes[activeImage].replace(
                  /\\/g,
                  "/"
                )}`}
                alt="Producto"
                className={`w-full h-full object-cover ${product.stock === 0 && "grayscale" }`}
                onClick={()=>setBigImage(activeImage)}
              />
            ) : (
              <img
                src="/placeholder.jpg"
                alt="Sin imagen"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Miniaturas */}
          {product.imagenes?.length > 1 && (
            <div className="flex gap-3">
              {product.imagenes.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border ${
                    activeImage === index
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onMouseEnter={()=>setActiveImage(index)}
                    onMouseLeave={()=>setActiveImage(activeImage)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.nombre}
          </h1>

          <p className="text-gray-600">
            Categoría:{" "}
            <span className="font-medium text-gray-800">
              {category?.nombre}
            </span>
          </p>
          
          <p key={product.stock} className="text-gray-600">
            stock:{" "}
            <span className="font-medium text-gray-800">
              {product.stock}
            </span>
          </p>

          <div className="text-3xl font-bold text-gray-900">
            ${product.precio}{" "}
            <span className="text-base font-medium text-gray-600">COL</span>
          </div>

          <input
            type="number"
            min="1"
            max={stockPorducts}
            value={product.stock === 0 ? 0 : quantity}
            disabled ={product.stock === 0}
            onChange={(e) =>{ 
              const value = parseInt(e.target.value);
              setQuantity(isNaN(value) ? 1 : Math.min(value, stockPorducts));}}
            className="w-20 p-2 border border-gray-300 rounded-lg"
          />

           {product.stock > 0 ? (
            <button
              onClick={handleCartNow}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Agregar al carrito
            </button>
          ) : (
            <div className="w-full py-3 rounded-lg bg-red-100 text-red-600 text-center font-semibold border border-red-300">
              ❌ Producto sin stock
            </div>
          )}

          
            <button
            onClick={handledelete}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg opacity-70 cursorpointer"
          >
          Eliminar
          </button>
          <div className="space-y-2">
            <Link to={`/products/update/${product.id}`} className="text-gray-600 hover:text-gray-900 transition duration-200 ease-in-out">
              Editar
            </Link>
          </div>
        </div>
      </div>
      {bigImage !== null && (
        <div ref={refModal} className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center">
              <div  className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 space-y-4">
                
                {/* Botón cerrar */}
                <button
                  type="button"
                  className="absolute top-4 right-4 text-white text-3xl"
                  onClick={() => setBigImage(null)}
                >
                  &times;
                </button>

                {/* Botón anterior */}
                {product.imagenes.length > 1 && (
                  <button
                    type="button"
                    className="absolute left-4 text-white text-4xl"
                    onClick={prevImg}
                  >
                    &lt;
                  </button>
                )}

                {/* Imagen grande */}
                <img
                  src={`http://localhost:5000/${product.imagenes[bigImage]}`}
                  className="max-w-[90%] max-h-[80%] rounded-lg shadow-2xl"
                  alt="Imagen ampliada"
                />

                {/* Botón siguiente */}
                {product.imagenes.length > 1 && (
                  <button
                    type="button"
                    className="absolute right-4 text-white text-4xl"
                    onClick={nexImg}
                  >
                    &gt;
                  </button>
                )}

                {/* Miniaturas debajo */}
                {product.imagenes.length > 1 && (
                  <div className="flex gap-3 mt-4 p-2 bg-black bg-opacity-40 rounded-lg">
                    {product.imagenes.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                        alt={`Miniatura ${index}`}
                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 
                          ${index === bigImage ? "border-blue-600" : "border-transparent"}`}
                        onClick={() => setBigImage(index)}
                      />
                    ))}
                  </div>
                )}

              </div>
              </div>
            )}
    </div>
   
   



  );
};

export default ProductDetail;
