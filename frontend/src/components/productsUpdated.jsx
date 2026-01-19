import { useState, useEffect, } from "react";
import apiClient from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const ProductsUpdate = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState(1);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imagenesActuales, setImagenesActuales] = useState([]);
  const [imagenesConservar, setImagenesConservar] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const {id} = useParams();

  const fetchCategorias = async () => {
    try {
      const response = await apiClient.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
  useEffect(() => {
    fetchCategorias();
    handleProducts();
  }, []);

  const handleProducts = async()=>{
    try{
        const response = await apiClient.get(`/products/${id}`);
        setNombre(response.data.nombre);
        setPrecio(response.data.precio);
        setCategoria(response.data.categoria);
        setStock(response.data.stock);
        setImagenesActuales(response.data.imagenes);
        setImagenesConservar(response.data.imagenes);

    }catch(error){
      console.log(error);
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagesRecomenrd = 3 -newImages.length;
    if(imagesRecomenrd <= 0 ) return alert("Solo puedes subir hasta 3 imagenes")
    const imagesUse = files.slice(0, imagesRecomenrd);
    const images=[...newImages,...imagesUse];
    setNewImages(images);
    setPreviews(images.map((file) => URL.createObjectURL(file)));
    if(images.length < files.length){
      alert("Solo puedes subir hasta 3 imagenes el resto fueron descartados")
      return
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("categoria", categoria);
    formData.append("stock", stock);
    for(const image of newImages) {
      formData.append("imagenes", image);
    }

    for(const image of imagenesConservar) {
      formData.append("imagenesConservar", image);
    }

    try {
      await apiClient.put(`/products/${id}`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/products");
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const removePreview = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  

  const handleConservar =(image)=>{
    setImagenesConservar((prev)=>
        prev.includes(image) ? prev.filter((img)=>img !== image) : [...prev,image]
    )
  }
console.log(imagenesActuales);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Actualizar Producto
        </h1>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nombre del producto"
            required
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) =>{
               const value = parseInt(e.target.value)
               setStock(isNaN(value) ? 1:Math.max(1,Math.min(100,value)))
              
               }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

       
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes actuales
        </label>


        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imagenesActuales.map((src, index) => (
            <div
                key={index}
                className="relative rounded-lg overflow-hidden border shadow-sm"
            >
                {/* Imagen */}
                <img
                src={`http://localhost:5000/${src}`}
                alt="preview"
                className="h-32 w-full object-cover"
                />

                {/* Checkbox */}
                <label className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow cursor-pointer">
                <input
                    type="checkbox"
                    value={src}
                    checked={imagenesConservar.includes(src)}
                    onChange={() => 
                     handleConservar(src)
                    }
                    className="accent-blue-600"
                />
                </label>
            </div>
            ))}
        </div>
        </div>
    


        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes nuevas
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600"
          />
        </div>

        {/* Previews */}
       {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border shadow-sm"
              >
                {/* Imagen */}
                <img
                  src={src}
                  alt="preview"
                  className="h-24 w-full object-cover"
                />

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="
                    absolute top-1 right-1 
                    bg-red-500 text-white text-xs 
                    w-6 h-6 rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100
                    transition
                    hover:bg-red-600
                  "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}


        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default ProductsUpdate;
