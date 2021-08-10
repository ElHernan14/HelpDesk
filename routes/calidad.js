var express = require('express');
var router = express.Router();
const calidadControlador = require('../controladores/calidad');

router.get('/',(req,res,next) =>calidadControlador.calidad(req,res));
router.post('/modificarcontacto',(req,res,next) =>calidadControlador.editarperfil(req,res));
router.post('/modificarcontrasena',(req,res,next) =>calidadControlador.modificarcontraseña(req,res));
router.post('/pasarsolicitud',(req,res,next) =>calidadControlador.pasarsolicitud(req,res));
router.post('/resolversolicitud',(req,res,next) =>calidadControlador.resolversolicitud(req,res));
router.post('/resolucion',(req,res,next) =>calidadControlador.resolucion(req,res));

module.exports = router;