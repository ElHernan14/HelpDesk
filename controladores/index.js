const Cliente = require("../models").Cliente;
const Empleado = require("../models").Empleado;
const Solicitud = require("../models").Solicitud;
const Historial = require("../models").Historial;
const Area = require("../models").Area;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op, where } = require("sequelize");

exports.index = function(req,res){
    let feliz = req.query.feliz;
    res.render('./index/index.jade',{
        feliz,
        pretty:true,
        incorrecto:false,
    })
}

exports.login = async(req,res) =>{
    const mailIng = req.body.mail;
    const contraseñaIng = req.body.contraseña;
    const rolIng = req.body.rol;
    console.log(rolIng);
    let nombre = null;
    let apellido = null;
    let dni = null;
    let area = null;
    let nombre_area = null;
    let usuario = null;
    let passwordvalida = null;
    const empleados = await Empleado.findOne({where:{[Op.and]: [{estado:true}, { mail: mailIng }]}},{raw:true});
    const cliente = await Cliente.findOne({where:{[Op.and]: [{estado:true}, { mail: mailIng }]}},{raw:true});
    console.log(empleados);
    if(cliente){
        passwordvalida = await bcrypt.compare(contraseñaIng,cliente.dataValues.contraseña);
        if(passwordvalida){
            nombre = cliente.dataValues.nombre;
            apellido = cliente.dataValues.apellido;
            dni = cliente.dataValues.dni;
            usuario ={
                nombre: `${nombre}`,
                apellido:`${apellido}`,
                dni:`${dni}`,
                area:`${area}`,
                nombre_area: `${nombre_area}`
            }
        }
    }else if(empleados){
        passwordvalida = await bcrypt.compare(contraseñaIng,empleados.dataValues.contraseña);
        console.log(passwordvalida) 
            if(passwordvalida){
                nombre = empleados.dataValues.nombre;
                apellido = empleados.dataValues.apellido;
                dni = empleados.dataValues.dni;
                area = empleados.dataValues.id_area;
                usuario ={
                    nombre: `${nombre}`,
                    apellido:`${apellido}`,
                    dni:`${dni}`,
                    area:`${area}`,
                    nombre_area: `${nombre_area}`
                }
            }
        if(area != null){
            const areaUsuario = await Area.findAll({where:{id_area:`${area}`}});
            nombre_area = areaUsuario[0].dataValues.nombre_area;
            usuario.nombre_area = nombre_area;
        }
    }
    if(usuario != null){
        console.log(usuario);
        jwt.sign({usuario}, 'keyboard cat', {expiresIn:  60*60*24}, (err, token) => {
            req.session.token = token;
            if(usuario.area != 'null'){
                if(usuario.area == 1){
                    console.log(usuario.nombre_area)
                    res.redirect('../helpdesk');
                }else if(usuario.area == 2){
                    res.redirect('../gestion');
                }else if(usuario.area == 3){
                    res.redirect('../calidad');
                }else{
                    res.redirect('../area');
                }
            }else{
                res.redirect('../cliente');
            }
        });    
    }else{
        res.render('./index.jade',{
            pretty:true,
            incorrecto:true,
            msjError:"Usuario y/o contraseña incorrectos"
        })
    }
}

exports.buscar = async(req,res,next) =>{
    let ticket = req.body.ticket;
    let nombreArea = null;
    let nombreEmpleado = null;
    let transArr = [];
    let pendArr = [];
    let resueltoArr = [];
    let myObjectJson = [];
    const solicitudes = await Solicitud.findOne({where:{ticket},raw:true});
    const areas = await Area.findAll();
    const empleados = await Empleado.findAll();
    if(solicitudes != null){
        const histopendientes = await Solicitud.findAll({
            raw:true,
            include:{model:Historial,as:'Historials', where:{ estado:{ [Op.like]: 'pendiente'}}},
            where:{[Op.and]: [{ticket}]}
        });
        const histotransferidos = await Solicitud.findAll({
            raw:true,
            include:{model:Historial, where:{ estado:{ [Op.like]: 'transferido'}}},
            where:{ticket}
        });
        const historesueltos = await Solicitud.findAll({
            raw:true,
            include:{model:Historial,as:'Historials',where:{ estado:{ [Op.like]: 'resuelto'}}},
            where:{[Op.and]: [{ticket}]}
        });
        
        if(historesueltos != null){
            historesueltos.forEach(resueltos => {
                areas.forEach(area =>{
                    if(area.dataValues.id_area == resueltos['Historials.id_area']){
                        nombreArea = area.dataValues.nombre_area;
                    }
                })
                empleados.forEach(empleado =>{
                    if(empleado.dataValues.dni == resueltos['Historials.dni_empleado']){
                        nombreEmpleado = `${empleado.dataValues.nombre} ${empleado.dataValues.apellido}`;
                    } 
                })
                resueltoArr.push({
                    fecha_ingreso:resueltos['Historials.fecha_ingreso'],
                    detalle_solucion:resueltos['Historials.detalle_solucion'],
                    nombreArea,
                    nombreEmpleado,
                    fecha_egreso:resueltos['Historials.fecha_egreso']
                })
            });
        }
        if(histopendientes != null){
            histopendientes.forEach(pendientes => {
                areas.forEach(area =>{
                    if(area.dataValues.id_area == pendientes['Historials.id_area']){
                        nombreArea = area.dataValues.nombre_area;
                    }
                })
                pendArr.push({
                    fecha_ingreso:pendientes['Historials.fecha_ingreso'],
                    nombreArea,
                })
            });
        }
        if(histotransferidos != null){
            histotransferidos.forEach(transferidos => {
                areas.forEach(area =>{
                    if(area.dataValues.id_area == transferidos['Historials.id_area']){
                        nombreArea = area.dataValues.nombre_area;
                    }
                })
                empleados.forEach(empleado =>{
                    if(empleado.dataValues.dni == transferidos['Historials.dni_empleado']){
                        nombreEmpleado = `${empleado.dataValues.nombre} ${empleado.dataValues.apellido}`;
                    } 
                })
                transArr.push({
                    fecha_ingreso:transferidos['Historials.fecha_ingreso'],
                    detalle_razon:transferidos['Historials.detalle_razon'],
                    nombreArea,
                    nombreEmpleado,
                    fecha_egreso:transferidos['Historials.fecha_egreso']
                })
            });
        }
        console.log(solicitudes)       
        myObjectJson.push({
            ticket:solicitudes.ticket,
            fecha_solicitud:solicitudes.fecha_solicitud,
            detalle:solicitudes.detalle,
            tipo:solicitudes.tipo,
            idUnico:solicitudes.id_solicitud,
            transferidos:transArr,
            resueltos:resueltoArr,
            pendientes:pendArr
        })
        res.render('./index/buscar.jade',{
            pretty:true,
            value:myObjectJson,
            solicitudexiste:true
        });
    }else{
        res.render('./index/index.jade',{
            pretty:true,
            solicitudnoexiste:"La solicitud no existe"
        });
    }
}

//VISTA REGISTRAR
exports.registrarse = async(req,res,next) =>{
    /*const admin = await Empleado.findOne({where:{mail:'jefesuperior@gmail.com'},raw:true});
    const dni = admin.dni;
    const salt = await bcrypt.genSalt(10);
    const contraseña = await bcrypt.hash(admin.contraseña,salt);
    Empleado.update({contraseña},{where:{dni}});
    res.redirect('/');*/
    res.render('./index/registrar.jade',{
        pretty:true
    });
}

exports.registrar = async(req,res,next)=>{
    const salt = await bcrypt.genSalt(10);
    const contraseña = await bcrypt.hash(req.body.contraseña,salt);
    Cliente.create({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        mail: req.body.mail,
        celular: req.body.celular,
        contraseña,
        fecha: req.body.fecha,
        estado:false
      }).then(registro =>{
        let feliz = "Se registro correctamente";
        res.redirect('../?feliz='+feliz);
      })
      .catch((err) => {
        if(err.parent.errno){
            res.render('./index/registrar.jade',{
                pretty:true,
                msjError:"Dni ya existente"
            });
        }
      }         
)}

//CERRAR SESION

exports.cerrarsesion = function(req,res,next){
    req.session.destroy(function(err) {    
        res.redirect('../../../');
     })
}

//AUTENTICAR USUARIO

exports.estaLogeado = function(req,res,next){
    if(req.session.token){
        jwt.verify(req.session.token, "keyboard cat", function(err, token){
            req.token = token;
            console.log(req.token.usuario);
            next();
        });
    }else{
        next();
    }
}

exports.esCliente = function(req,res,next){
    jwt.verify(req.session.token, "keyboard cat", function(err, token) {
        if (!err) {
            req.token = token;
            if(req.token.usuario.area == 'null'){
                next();
            }else{
                res.redirect('../');
            }     
        }else{              
            res.redirect('../');
        }
    }); 
}

exports.esEmpleadoHD = function(req,res,next){
    console.log("Y ACA");
    jwt.verify(req.session.token, "keyboard cat", function(err, token) {
        if (!err) {
            req.token = token;
            if(req.token.usuario.area == 1){
                next();
            }else{           
                res.redirect('../'); 
            }    
        }else{           
            res.redirect('../');
        }
    });   
}

exports.esEmpleado = function(req,res,next){
    jwt.verify(req.session.token, "keyboard cat", function(err, token) {
        if (!err) {
            req.token = token;
            if(req.token.usuario.area != 'null'){
                next();
            }else{           
                res.redirect('../'); 
            }    
        }else{           
            res.redirect('../');
        }
    });   
}

exports.esAdmin = function(req,res,next){
    jwt.verify(req.session.token, "keyboard cat", function(err, token) {
        if (!err) {
            req.token = token;
            if(req.token.usuario.area == 2){
                next();
            }else{           
                res.redirect('../'); 
            }    
        }else{           
            res.redirect('../');
        }
    });
}
