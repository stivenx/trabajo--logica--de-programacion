const express = require('express')
const router = express.Router()
const {crearProducto, obtenerProductos, actualizarProducto, eliminarProducto, obtenerProductosPorCategoria,obtenerProductoPorId}  = require('../controladores/controladorProducto')

router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.get('/categoria/:categoria_id', obtenerProductosPorCategoria);
router.get('/:id', obtenerProductoPorId);


module.exports = router