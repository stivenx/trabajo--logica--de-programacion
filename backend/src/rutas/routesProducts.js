const express = require('express')
const router = express.Router()
const {
    crearProduct,
    obtenerProductos,upload,obtenerProducto,eliminarProducto,updateProducts,productsCategoriSelec,obtenerProductosSearch,productsSelect,obtenerProductosSearchAll  } = require('../controladores/controllerProducts')
router.get('/select/', productsSelect);
router.get('/select/categoris', productsCategoriSelec);
router.post('/',upload.array('imagenes',3) ,crearProduct);
router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.get('/searchLimit/:search ?', obtenerProductosSearch);
router.get('/searchAll/:search ?', obtenerProductosSearchAll);
router.delete('/:id', eliminarProducto);
router.put('/:id',upload.array('imagenes',3) ,updateProducts);


module.exports = router