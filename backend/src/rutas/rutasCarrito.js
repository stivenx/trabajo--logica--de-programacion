
const express = require('express');
const router = express.Router();
const {crearCarrito, obtenerCarrito, actualizarCarrito, eliminarCarrito,vaciarCarrito} = require('../controladores/controladorCarrito'); // Importación del controlador
// Crear carrito
router.post('/crear', crearCarrito);
// Obtener carrito
router.get('/:usuario_id', obtenerCarrito);
// Actualizar carrito
router.put('/actualizar', actualizarCarrito);
// Eliminar carrito
router.delete('/vaciarEspecifico/:cardId/:product_id',eliminarCarrito);
// Vaciar carrito
router.delete('/vaciar/:cardId',vaciarCarrito);


module.exports = router;