var express = require('express');
var router = express.Router();
const gestion = require('../controladores/gestion'); 

router.get('/',(req,res,next) => gestion.gestion(req,res));
router.post('/cargarempleado',(req,res,next) => gestion.cargarempleado(req,res));
router.post('/cargararea',(req,res,next) => gestion.cargararea(req,res));
router.get('/areas',(req,res,next) => gestion.areas(req,res));
router.post('/areas/quitar',(req,res,next) => gestion.borrarArea(req,res));
router.post('/areas/modificar',(req,res,next) => gestion.modificarNombre(req,res));
router.get('/empleados',(req,res,next) => gestion.empleados(req,res));
router.post('/empleados/estado',(req,res,next) => gestion.cambiarEstado(req,res));
router.post('/empleados/modificar',(req,res,next) => gestion.cambiarArea(req,res));
router.post('/modificarestado',(req,res,next) =>gestion.estadoclientes(req,res));
router.post('/modificarcontacto',(req,res,next) =>gestion.editarperfil(req,res,'../../gestion'));
router.post('/modificarcontrasena',(req,res,next) =>gestion.modificarcontraseña(req,res,'../../gestion'));
router.post('/areas/modificarcontacto',(req,res,next) =>gestion.editarperfil(req,res,'../../gestion/areas'));
router.post('/areas/modificarcontrasena',(req,res,next) =>gestion.modificarcontraseña(req,res,'../../gestion/areas'));
router.post('/empleados/modificarcontacto',(req,res,next) =>gestion.editarperfil(req,res,'../../gestion/empleados'));
router.post('/empleados/modificarcontrasena',(req,res,next) =>gestion.modificarcontraseña(req,res,'../../gestion/empleados'));


module.exports = router;