const Producto = require('../modelos/producto')
const Categoria = require('../modelos/categoria')

exports.crearProducto = async(req,res) =>{
    try{
        const nuevoProducto = new Producto(req.body)
        await nuevoProducto.save()
        res.status(201).json(nuevoProducto)
    }catch(error){
        res.status(500).json({ mensaje: 'Error al crear el producto: ', error: error.message})
    }
}

exports.obtenerProductos = async (req, res) =>{
    try{
        const productos = await Producto.find().populate('categoria')
        res.status(200).json(productos)
    } catch(error){
        res.status(500).json({ mensaje: 'Error al obtener los productos ', error: error.message})
    }
}

exports.actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
};


exports.obtenerProductosPorCategoria = async (req, res) => {
    const { categoria_id } = req.params;
  
    try {
      const productos = await Producto.find({ 'categoria': categoria_id })
        .populate('categoria');
  
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
  };

exports.obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const producto = await Producto.findById(id).populate('categoria');
  
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
  
      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
  };