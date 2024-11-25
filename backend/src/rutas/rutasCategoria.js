const express = require('express');
const router = express.Router();
const { crearCategoria, obtenerCategorias, actualizarCategoria, eliminarCategoria}  = require('../controladores/controladorCategoria');

router.post('/', crearCategoria);
router.get('/', obtenerCategorias);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;
