const express = require('express');
const router = express.Router();
const {registrarUsuario, iniciarSesion, obtenerPerfilUsuario, actualizarPerfilUsuario,obtenerTodosLosUsuarios,obtenerUsuariosDeterminados} = require('../controladores/controladorUsuario');
const middlewareAutenticacion = require('../middleware/middlewareAutenticacion');

router.get('/', obtenerTodosLosUsuarios);
router.get('/determinados', obtenerUsuariosDeterminados);
router.post('/registro', registrarUsuario);
router.post('/iniciarsesion', iniciarSesion);
router.get('/perfil', middlewareAutenticacion, obtenerPerfilUsuario);
router.put('/perfil', middlewareAutenticacion, actualizarPerfilUsuario);

module.exports = router;
