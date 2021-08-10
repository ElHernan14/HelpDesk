var express = require('express');
var router = express.Router();
const helpdesk = require('../controladores/helpdesk'); 

router.get('/',(req,res,next) => helpdesk.helpdesk(req,res));
router.post('/pasarsolicitud',(req,res,next) => helpdesk.pasarsolicitud(req,res));
router.post('/modificarcontacto',(req,res,next) =>helpdesk.editarperfil(req,res));
router.post('/modificarcontrasena',(req,res,next) =>helpdesk.modificarcontraseña(req,res));  

module.exports = router;