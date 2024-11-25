const express = require('express');
const router = express.Router();
const {crearOrdenDesdeCarrito, obtenerOrden} = require('../controladores/controladorOrden');


router.post('/:usuarioId/crear', crearOrdenDesdeCarrito); 
router.get('/:usuarioId/orden/:ordenId', obtenerOrden); 


module.exports = router;
