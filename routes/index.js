var express = require('express');
var router = express.Router();
const indexControlador = require("../controladores/index");

/* GET home page. */
router.get('/',(req,res,next) =>indexControlador.index(req,res));
router.post('/login',(req,res,next) => indexControlador.login(req,res));
router.get('/registrarse',(req,res,next) => indexControlador.registrarse(req,res));
router.post('/registrar',(req,res,next) => indexControlador.registrar(req,res));
router.get('/cerrarsesion',(req,res,next) => indexControlador.cerrarsesion(req,res));
router.post('/buscar',(req,res,next) => indexControlador.buscar(req,res));

module.exports = router;
