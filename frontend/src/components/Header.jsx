import React, { useEffect, useState, useRef,useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../api/axiosConfig";
import{UserContext} from "../context/useContext"
import{LogoutContext } from "../context/logoutContext"
import { CarContext } from "../context/carContext";
const Header = () => {
  const [usuario, setUsuario] = useState(null);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(false);
  const [productsPreview, setProductsPreview] = useState([]);
  const [visivlePreview, setVisiblePreview] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef(null);
  const modalRef2 = useRef(null);
  const {handleLogoutVisible} = useContext(LogoutContext);
 const {user} = useContext(UserContext);
  const token = localStorage.getItem("token");  
  const {visibleActive} =useContext(CarContext)
  console.log("el token: ",token);
  useEffect(()=>{
    const handletClick=(e)=>{
      if(modalRef.current && !modalRef.current.contains(e.target)){
        setVisibleProducts(false);
      }
    }

    document.addEventListener("mousedown", handletClick);
    return ()=>{
      document.removeEventListener("mousedown", handletClick);
    }
  },[])
 console.log("el user: ",user);
  useEffect(()=>{
     const handleBotons=(e)=>{
    if(modalRef2.current && !modalRef2.current.contains(e.target)){
      setVisiblePreview(false);
      setProductsPreview([]);
      return
    }
    }
   document.addEventListener("mousedown", handleBotons);

   return ()=>{
    document.removeEventListener("mousedown", handleBotons);
   }
    
     
  },[visivlePreview])

  useEffect(() => {
    
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };
 
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
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    
    window.dispatchEvent(new Event("authChange")); 
    navigate("/login");
  };

  useEffect(()=>{
    const handleGetProductsSearch = async () => {
      if(search.length <=0){
        setVisiblePreview(false);
        setProductsPreview([]);
        return
        
      }
    try {
      const response = await apiClient.get(`/products/searchLimit/${search}`);
      setProductsPreview(response.data);
      setVisiblePreview(true);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const tiomeout = setTimeout(() => {
    handleGetProductsSearch();
  }, 1000);

  return () => {
    clearTimeout(tiomeout);
  };
  

  },[search])

  useEffect(()=>{
    if(!visibleProducts){return}
    const timeoimeout = setTimeout(() => {
      handleGetProducts()
    },300);

    return () => clearTimeout(timeoimeout);
  },[visibleProducts])

  const searchProductsBotton =()=>{
    navigate(`/products/search?search=${search}`);
    setVisiblePreview(false);
    setProductsPreview([]);
    setSearch("");
  }
 
  const searchActive =()=>{
    setVisiblePreview(false);
    setProductsPreview([]);
    setSearch("");
  }

  const totalProducts = 3;
  const totalPages =Math.ceil(products.length / totalProducts);
  const [currentPages, setCurrentPages] = useState(1);

  const lastPage = currentPages * totalProducts;
  const firtstPage = lastPage - totalProducts;
const currentProducts = products.slice(firtstPage, lastPage);
  const prevPage =()=>{ 
    setCurrentPages((prev)=>
    Math.max(prev-1, 1))
  }
  const nextPage =()=>{
    setCurrentPages((prev)=>
    Math.min(prev+1, totalPages))
  }
   return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold tracking-wide">Mi Proyecto</h1>

         {/* Buscador */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Buscar productos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-xl py-2.5 pl-4 pr-24 
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        placeholder-gray-400"
            />

            <button
              onClick={searchProductsBotton}
              className="absolute top-1/2 right-1.5 -translate-y-1/2
                        bg-blue-600 hover:bg-blue-700 active:scale-95
                        text-white text-sm font-medium
                        px-4 py-1.5 rounded-lg
                        shadow-md transition-all duration-200"
            >
              Buscar
            </button>



            {/* Preview de resultados */}
            {visivlePreview && (
              <div ref={modalRef2} className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl z-50 overflow-hidden">
                {productsPreview.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {productsPreview.map((product) => {
                      const categoria = categorias.find((cat) => cat._id === product.categoria)?.nombre || "Sin categoría";
                      return(
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={searchActive}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
                      >
                        <img
                          src={`http://localhost:5000/${product.imagen}`}
                          alt={product.nombre}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        
                        <span className="text-gray-800 font-medium">
                          {product.nombre}
 
                        </span>
                        <span className="text-xs text-gray-500">
                          {categoria}
                        </span>
                      </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="p-4 text-gray-500 text-sm text-center">
                    No se encontraron productos que tengan el texto:{search}
                  </p>
                )}
              </div>
            )}
          </div>

         <div className="flex space-x-4 items-center">
          <Link to="/cart" className="text-gray-300 hover:text-white transition-colors duration-300 ease-in-out">
            carrito
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
           <button onClick={visibleActive} className="text-gray-300 hover:text-white transition-colors duration-300 ease-in-out">
            Carrito rapido
          </button>
          </div>
        <div className="flex space-x-6 items-center">
          {/* Menú de productos */}
          <div ref={modalRef} className="relative">
            <button
              onClick={() => setVisibleProducts(!visibleProducts)}
              className="text-gray-300 hover:text-white transition-colors duration-300 ease-in-out"
            >
              Productos
            </button>

           {visibleProducts && (
              <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl z-20 w-96 border overflow-hidden">

                {/* Título */}
                <div className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                  Productos encontrados
                </div>

                {/* Resultados */}
                <div className="max-h-80 overflow-y-auto divide-y">

                  {currentProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={()=>setVisibleProducts(false)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition"
                    >
                      {/* Imagen */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 shadow">
                        <img
                          src={`http://localhost:5000/${product.imagenes[0]}`}
                          alt={product.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {product.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.precio}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Paginación */}
                  <div className="relative flex items-center px-4 py-2 bg-gray-50 border-t text-sm">

                    {/* Botón izquierdo */}
                    <div className="flex-1">
                      {currentPages > 1 && (
                        <button
                          onClick={prevPage}
                          className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold shadow 
                                    hover:bg-blue-700 transition"
                        >
                          ◀
                        </button>
                      )}
                    </div>

                    {/* Número centrado */}
                    <span className="absolute left-1/2 -translate-x-1/2 text-gray-700 font-medium">
                      {currentPages} / {totalPages}
                    </span>

                    {/* Botón derecho */}
                    <div className="flex-1 flex justify-end">
                      {currentPages < totalPages && (
                        <button
                          onClick={nextPage}
                          className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold shadow 
                                    hover:bg-blue-700 transition"
                        >
                          ▶
                        </button>
                      )}
                    </div>

                  </div>



              </div>
            )}
          </div>
          {/* Información de usuario o links de navegación */}
          {token ? (
            <>
           
              <button
                onClick={handleLogoutVisible}
                className="text-red-500 hover:text-red-300 ml-4"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-gray-300 transition duration-200 ease-in-out">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition duration-200 ease-in-out">
                Registrarse
              </Link>
              <Link to="/categorias" className="hover:text-gray-300 transition duration-200 ease-in-out">
                Categorías
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;