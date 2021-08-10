var express = require('express');
var router = express.Router();
const clienteControlador = require('../controladores/cliente');

router.get('/',(req,res,next) =>clienteControlador.cliente(req,res));
router.get('/cargarsolicitud',(req,res,next) =>clienteControlador.solicitud(req,res));
router.post('/enviarsolicitud',(req,res,next) =>clienteControlador.enviarSolicitud(req,res));
router.post('/modificarcontacto',(req,res,next) =>clienteControlador.editarperfil(req,res,'../../cliente'));
router.post('/modificarcontrasena',(req,res,next) =>clienteControlador.modificarcontraseña(req,res,'../../cliente'));
router.post('/solicitud/modificarcontacto',(req,res,next) =>clienteControlador.editarperfil(req,res,'../../cliente/solicitud'));
router.post('/solicitud/modificarcontrasena',(req,res,next) =>clienteControlador.modificarcontraseña(req,res,'../../cliente/solicitud'));

module.exports = router;
