var express = require('express');
var router = express.Router();
const areaControlador = require('../controladores/areas');

router.get('/',(req,res,next) =>areaControlador.area(req,res));
router.post('/pasarsolicitud',(req,res,next) =>areaControlador.pasarsolicitud(req,res));
router.post('/resolversolicitud',(req,res,next) =>areaControlador.resolversolicitud(req,res));
router.post('/modificarcontacto',(req,res,next) =>areaControlador.editarperfil(req,res));
router.post('/modificarcontrasena',(req,res,next) =>areaControlador.modificarcontraseña(req,res));

module.exports = router;