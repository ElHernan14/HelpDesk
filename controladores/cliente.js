const Solicitud = require("../models").Solicitud;
const Empleado = require("../models").Empleado;
const Historial = require("../models").Historial;
const Area = require("../models").Area;
const Cliente = require("../models").Cliente;
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.cliente = async(req,res) =>{
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let dni = req.token.usuario.dni;
    let nombreArea = null;
    let nombreEmpleado = null;
    let myObjectJson = [];
    let pendienteObj = null;
    let resueltoObj = null;
    let transferidoObj = null;
    let transArr = [];
    let pendArr = [];
    let resueltoArr = [];
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;

    let cliente = await Cliente.findOne({where:{dni:`${dni}`},raw:true});
    const solicitudes = await Solicitud.findAll({ where: { dni_cliente: `${dni}` }});
    const areas = await Area.findAll();
    const empleados = await Empleado.findAll();
    const histopendientes = await Solicitud.findAll({
        raw:true,
        include:{model:Historial,as:'Historials', where:{ estado:{ [Op.like]: 'pendiente'}}},
        where:{[Op.and]: [{dni_cliente: `${dni}`}]}
    });
    const histotransferidos = await Solicitud.findAll({
        raw:true,
        include:{model:Historial, where:{ estado:{ [Op.like]: 'transferido'}}},
        where:{dni_cliente: `${dni}`}
    });
    const historesueltos = await Solicitud.findAll({
        raw:true,
        include:{model:Historial,as:'Historials',where:{ estado:{ [Op.like]: 'resuelto'}}},
        where:{[Op.and]: [{dni_cliente: `${dni}`}]}
    });
    console.log(dni);
    
    solicitudes.forEach(solicitudes =>{
        if(historesueltos){
            historesueltos.forEach(resueltos =>{
                if(resueltos.id_solicitud == solicitudes.id_solicitud){    
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
                        resueltoObj = {
                            fecha_ingreso:resueltos['Historials.fecha_ingreso'],
                            detalle_solucion:resueltos['Historials.detalle_solucion'],
                            nombreArea,
                            nombreEmpleado,
                            fecha_egreso:resueltos['Historials.fecha_egreso']
                        }
                        resueltoArr.push(resueltoObj);    
                }
            })
        }
        if(histopendientes){
            histopendientes.forEach(pendientes =>{
                if(pendientes.id_solicitud == solicitudes.id_solicitud){
                        areas.forEach(area =>{
                            if(area.dataValues.id_area == pendientes['Historials.id_area']){
                                nombreArea = area.dataValues.nombre_area;
                            }
                        })
                        pendienteObj = {
                            fecha_ingreso:pendientes['Historials.fecha_ingreso'],
                            nombreArea,
                        }
                        pendArr.push(pendienteObj);   
                }
            })
        }
        if(histotransferidos){
            histotransferidos.forEach(transferidos =>{
                if(transferidos.id_solicitud == solicitudes.dataValues.id_solicitud){
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
                        transferidoObj ={
                            fecha_ingreso:transferidos['Historials.fecha_ingreso'],
                            detalle_razon:transferidos['Historials.detalle_razon'],
                            nombreArea,
                            nombreEmpleado,
                            fecha_egreso:transferidos['Historials.fecha_egreso']
                        }
                        transArr.push(transferidoObj);  
                }
            })
        }
        myObjectJson.push({
            ticket:solicitudes.dataValues.ticket,
            fecha_solicitud:solicitudes.dataValues.fecha_solicitud,
            detalle:solicitudes.dataValues.detalle,
            tipo:solicitudes.dataValues.tipo,
            idUnico:solicitudes.dataValues.id_solicitud,
            transferidos:transArr,
            resueltos:resueltoArr,
            pendientes:pendArr
        })
        transArr = [];
        pendArr = [];
        resueltoArr = [];
    })

    console.log(myObjectJson);
    
    res.render('./cliente/cliente.jade',{
        pretty:true,
        nombre:nombre,
        apellido:apellido,
        email: cliente.mail,
        telefono:cliente.celular,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        solicitudes:myObjectJson,
        action:"cliente",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    });
}


//SOLICITUD
exports.solicitud = async(req,res) =>{
    let dniuser = req.token.usuario.dni;
    let empleados = await Cliente.findOne({where:{dni:`${dniuser}`},raw:true});
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    res.render('./cliente/solicitud.jade',{
        pretty:true,
        email: empleados.mail,
        telefono:empleados.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        nombre,apellido,
        action:"solicitud",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
}

exports.enviarSolicitud = async(req,res) =>{
    let dni = req.token.usuario.dni;
    let solicitudes= null;
    let ticket = null;
    do {
        ticket = Math.floor(Math.random() * (2000000 + 1));
        solicitudes = await Solicitud.findOne({where:{ticket}},{raw:true}); 
    } while (solicitudes != null);
    Solicitud.create({
        ticket: ticket,
        prioridad: null,
        fecha_solicitud: Date.now(),
        detalle: req.body.detalle,
        tipo: req.body.tipo,
        dni_cliente: dni
    })
    
    res.render('./cliente/solicitud.jade',{
        pretty:true,
        enviado:"Su solicitud fue registrada",
        action:"cliente/solicitud"
    })
}

//EDITAR PERFIL
exports.editarperfil = async(req,res,direccion) =>{
    let telefono = req.body.telefono;
    let correo = req.body.mail;
    let dni = req.token.usuario.dni;
    const cliente = await Cliente.findOne({where:{mail:correo}});
    console.log(cliente);
    if(cliente == null){
        Cliente.update({
            mail:correo,celular:telefono
        },{where:{dni}})
        .then(perfil =>{
            let correcto = "Datos de contacto actualizados"
            res.redirect(direccion+'?contactocorrecto='+correcto);
        })
    }else{
        let invalido = "Correo ya existente";
        res.redirect(direccion+'?correoinvalido='+invalido);
    }
}

exports.modificarcontraseña = async(req,res,direccion) =>{
    let dni = req.token.usuario.dni;
    let nueva = req.body.nueva;
    let copia = req.body.copia;
    const salt = await bcrypt.genSalt(10);
    const cliente = await Cliente.findOne({where:{dni}},{raw:true});
    const validPassword = await bcrypt.compare(req.body.actual, cliente.dataValues.contraseña);
    console.log("asdasdasd"+validPassword)
    if(validPassword){
        if(nueva == copia){
            let string = "Contraseña modificada correctamente";
            let contraseñaNueva = await bcrypt.hash(nueva,salt);
            Cliente.update({
                contraseña:contraseñaNueva
            },{where:{dni}});
            res.redirect(direccion+'?cambiada='+string);
        }else{
            let noiguales = "Las contraseñas no coinciden";
            res.redirect(direccion+'?nosoniguales='+noiguales);
        }
    }else{
        let contraseñainv = "Contraseña incorrecta";
        res.redirect(direccion+'?contrasenainvalida='+contraseñainv);
    }
}