const Area = require("../models").Area;
const Solicitud = require("../models").Solicitud;
const Empleado = require("../models").Empleado;
const Historial = require("../models").Historial;
const Notificacion = require("../models").Notificacion;
const bcrypt = require("bcrypt");
var moment = require('moment');
const { Op } = require("sequelize");

exports.helpdesk = async(req,res)=>{
    const solicitudesNull = await Solicitud.findAll({where:{prioridad:null}});    
    const HDhistorial = await Historial.findAll({where:{[Op.and]: [{ id_area:1 }, { estado:{ [Op.notLike]: 'transferido'}}]}});
    const solicitudes = await Solicitud.findAll();
    const Areas = await Area.findAll({where:{id_area:{[Op.ne]: 1}}});
    let dni = req.token.usuario.dni;
    let empleado = await Empleado.findOne({where:{dni:`${dni}`},raw:true});
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let solicitudesHD = [];
    let areas = [];
    HDhistorial.forEach( hd => {
        solicitudes.forEach( solicitudes =>{
            if(hd.id_solicitud == solicitudes.id_solicitud){
                solicitudesHD.push({
                    id_solicitud: solicitudes.dataValues.id_solicitud,
                    ticket: solicitudes.dataValues.ticket,
                    prioridad: solicitudes.dataValues.prioridad,
                    fecha_solicitud: solicitudes.dataValues.fecha_solicitud,
                    detalle: solicitudes.dataValues.detalle,
                    tipo: solicitudes.dataValues.tipo,
                    fecha_ingreso: hd.dataValues.fecha_ingreso,
                    detalle_razon: hd.dataValues.detalle_razon
                });
            }
        });
    });
    solicitudesNull.forEach( solicitudes => {
        solicitudesHD.push(solicitudes.dataValues);
    });
    Areas.forEach( arr =>{
        areas.push(arr.dataValues);
    })
    res.render('./helpdesk/helpdesk.jade',{
        pretty:true,
        nombre,apellido,
        solicitudes:solicitudesHD,
        areas:areas,
        email: empleado.mail,
        telefono:empleado.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        action:"helpdesk",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
} 

exports.pasarsolicitud = async(req,res) =>{
    let idSolicitud = req.body.id_solicitud;
    let prioridad = req.body.prioridad;
    let razon = req.body.detalle_razon;
    let area = req.body.area;
    let dni = req.token.usuario.dni;
    let fecha_ingreso = req.body.fecha_ingreso;
    let fecha = moment(Date.now());
    let fecha2 = fecha.format('YYYY-MM-DD HH:mm:ss');
    let cantidad = 0;
    
    const historiales = await Historial.findAll({where:{[Op.and]: [{ id_solicitud: `${idSolicitud}`}, { estado:{ [Op.like]: 'transferido'}}]}})
    historiales.forEach(historiales =>{
        cantidad++;
    })
    if(cantidad<5){
        Historial.create({
            fecha_ingreso: fecha2,
            estado: "pendiente",
            detalle_razon: razon,
            detalle_solucion: 'null',
            id_area: area,  
            id_solicitud: idSolicitud,
            fecha_egreso: 'null'
        })
        Solicitud.update({
            prioridad:prioridad
        },{where:{id_solicitud:idSolicitud}})
        
        Historial.update({
            estado: "transferido",dni_empleado:`${dni}`,fecha_egreso: fecha2,detalle_razon:`${razon}`
        },{where:{[Op.and]: [{ id_area: `${req.token.usuario.area}`}, { id_solicitud:idSolicitud},{fecha_ingreso:fecha_ingreso}]}});
    }else{
        Historial.create({
            fecha_ingreso: fecha2,
            estado: "en calidad",
            detalle_razon: razon,
            detalle_solucion: 'null',
            id_area: 3,
            id_solicitud: idSolicitud,  
            fecha_egreso: 'null'
        })
        Notificacion.create({
            fecha: fecha2,
            descripcion: "Solicitud transferida mas de 4 veces",
            estado: "pendiente",
            fecha_historial: fecha_ingreso,
            id_solicitud_historial: idSolicitud,
            id_area_historial: req.token.usuario.area
        })
        Historial.update({
            estado: "transferido",dni_empleado:`${dni}`,fecha_egreso: fecha2,detalle_razon:`${razon}`
        },{where:{[Op.and]: [{ id_area: `${req.token.usuario.area}`}, { id_solicitud:idSolicitud},{fecha_ingreso:fecha_ingreso}]}});
    }
    res.redirect('../../helpdesk');
}

//EDITAR PERFIL
exports.editarperfil = async(req,res) =>{
    let telefono = req.body.telefono;
    let correo = req.body.mail;
    let dni = req.token.usuario.dni;
    const empleado = await Empleado.findOne({where:{mail:correo}});
    if(empleado == null){
        Empleado.update({
            mail:correo,telefono
        },{where:{dni}})
        .then(perfil =>{
            let correcto = "Datos de contacto actualizados"
            res.redirect('../../helpdesk?contactocorrecto='+correcto);
        })
    }else{
        let invalido = "Correo ya existente";
        res.redirect('../../helpdesk?correoinvalido='+invalido);
    }
}

exports.modificarcontraseña = async(req,res) =>{
    let dni = req.token.usuario.dni;
    let nueva = req.body.nueva;
    let copia = req.body.copia;
    const salt = await bcrypt.genSalt(10);
    const empleado = await Empleado.findOne({where:{dni}},{raw:true});
    const validPassword = await bcrypt.compare(req.body.actual, empleado.dataValues.contraseña);
    if(validPassword){
        if(nueva == copia){
            let string = "Contraseña modificada correctamente";
            let contraseñaNueva = await bcrypt.hash(nueva,salt);
            Empleado.update({
                contraseña:contraseñaNueva
            },{where:{dni}});
            res.redirect('../../helpdesk?cambiada='+string);
        }else{
            let noiguales = "Las contraseñas no coinciden";
            res.redirect('../../helpdesk?nosoniguales='+noiguales);
        }
    }else{
        let contraseñainv = "Contraseña incorrecta";
        res.redirect('../../helpdesk?contrasenainvalida='+contraseñainv);
    }
}