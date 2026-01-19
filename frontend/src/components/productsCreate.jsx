import { useState, useEffect, useRef } from "react";
import apiClient from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const ProductsCreate = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const modalRef = useRef(null);
  const refModal = useRef(null);
  const navigate = useNavigate();

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
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImage = 3- newImages.length;
    if(totalImage <= 0 ) return alert("Solo puedes subir hasta 3 imagenes")
    const imagesUse = files.slice(0, totalImage);
    const images=[...newImages,...imagesUse];
    setNewImages(images);
    setPreviews(images.map((file) => URL.createObjectURL(file)));
    if(files.length >imagesUse.length){
      alert("Solo puedes subir hasta 3 imagenes el resto fueron descartados")
      
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

    try {
      await apiClient.post("/products", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/products");
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const deleteNewImage =(index)=>{
    setNewImages((prev)=>prev.filter((_,image)=> image !== index));
    setPreviews((prev)=>prev.filter((_,image)=> image !== index));
  }

  const nexImg = () => {
    setPostImage((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  };

  const prevImg = () => {
    setPostImage((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Crear Producto
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

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes{newImages.length > 0 && <span key={newImages.length} className="text-xs text-gray-500">({newImages.length}/3)</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            ref={modalRef}
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600"
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 flex flex-wrap">
            {previews.map((src, index) => (
              <div key={index} className="w-full p-1">
                <img
                  src={src}
                  alt="preview"
                  className="h-24 w-full object-cover rounded-lg border"
                  onClick={() => setPostImage(index)}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() =>{ deleteNewImage(index); modalRef.current.value=""}}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

         {postImage !== null && (
        <div ref={refModal} className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center">
              <div  className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 space-y-4">
                
                {/* Botón cerrar */}
                <button
                  type="button"
                  className="absolute top-4 right-4 text-white text-3xl"
                  onClick={() => setPostImage(null)}
                >
                  &times;
                </button>

                {/* Botón anterior */}
                {previews.length > 1 && (
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
                  src={previews[postImage]}
                  className="max-w-[90%] max-h-[80%] rounded-lg shadow-2xl"
                  alt="Imagen ampliada"
                />

                {/* Botón siguiente */}
                {previews.length > 1 && (
                  <button
                    type="button"
                    className="absolute right-4 text-white text-4xl"
                    onClick={nexImg}
                  >
                    &gt;
                  </button>
                )}

                {/* Miniaturas debajo */}
                {previews.length > 1 && (
                  <div className="flex gap-3 mt-4 p-2 bg-black bg-opacity-40 rounded-lg">
                    {previews.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Miniatura ${index}`}
                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 
                          ${index === postImage ? "border-blue-600" : "border-transparent"}`}
                        onClick={() => setPostImage(index)}
                      />
                    ))}
                  </div>
                )}

              </div>
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

export default ProductsCreate;
