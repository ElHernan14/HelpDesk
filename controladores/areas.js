const Area = require("../models").Area;
const Solicitud = require("../models").Solicitud;
const Historial = require("../models").Historial;
const Notificacion = require("../models").Notificacion;
const Empleado = require("../models").Empleado;
const bcrypt = require("bcrypt");
var moment = require('moment');
const { Op, DATE } = require("sequelize");

exports.area = async(req,res,next) =>{
    let idarea = req.token.usuario.area;
    let area = req.token.usuario.nombre_area;
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    let dni = req.token.usuario.dni;
    let empleado = await Empleado.findOne({where:{dni:`${dni}`},raw:true});
    const historialarea = await Historial.findAll({where:{[Op.and]: [{ id_area: `${idarea}`}, { estado:{ [Op.like]: 'pendiente'}}]}})
    const solicitudesarea = await Solicitud.findAll();
    const Areas = await Area.findAll({where:{id_area:{[Op.ne]: `${idarea}`}}});
    let solicitudes = [];
    let areas = [];
    historialarea.forEach(ha => {
        solicitudesarea.forEach(sa => {
            if(ha.id_solicitud == sa.id_solicitud){
                solicitudes.push({
                    valorUnico:sa.ticket,
                    fecha_ingreso:ha.fecha_ingreso,
                    prioridad:sa.prioridad,
                    estado: ha.estado,
                    detalle: sa.detalle,
                    detalle_razon: ha.detalle_razon,
                    id_solicitud: ha.id_solicitud
                })
            }
        })
    });
    Areas.forEach( arr =>{
        areas.push(arr.dataValues);
    })
    res.render('./areas/area.jade',{
        pretty:true,
        nombre:nombre,
        apellido:apellido,
        email: empleado.mail,
        telefono:empleado.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        area:area,
        areas:areas,
        action:"area",
        solicitudes:solicitudes,
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
}

exports.pasarsolicitud = async(req,res) =>{
    let idSolicitud = req.body.id_solicitud;
    let area = req.body.area;
    let dni = req.token.usuario.dni;
    let razon = req.body.razon;
    let fecha_ingreso = req.body.fecha_ingreso;
    let fecha = moment(Date.now());
    let fecha2 = fecha.format('YYYY-MM-DD HH:mm:ss');
    let cantidad = 0;
    
    const historiales = await Historial.findAll({where:{[Op.and]: [{ id_solicitud: `${idSolicitud}`}, { estado:{ [Op.like]: 'transferido'}}]}})
    historiales.forEach(historiales =>{
        cantidad++;
    })
    if(cantidad<=3){
        Historial.create({
            fecha_ingreso: fecha2,
            estado: "pendiente",
            detalle_razon: razon,
            detalle_solucion: 'null',
            id_area: area,
            id_solicitud: idSolicitud,  
            fecha_egreso: 'null'
        })
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
            estado: 'pendiente',
            fecha_historial: fecha_ingreso,
            id_solicitud_historial: idSolicitud,
            id_area_historial: req.token.usuario.area
        })
        Historial.update({
            estado: "transferido",dni_empleado:`${dni}`,fecha_egreso: fecha2,detalle_razon:`${razon}`
        },{where:{[Op.and]: [{ id_area: `${req.token.usuario.area}`}, { id_solicitud:idSolicitud},{fecha_ingreso:fecha_ingreso}]}});
    }
    
    res.redirect('../../area');
}

exports.resolversolicitud = async(req,res) =>{
    let idSolicitud = req.body.id_solicitud;
    let area = req.token.usuario.area;
    let dni = req.token.usuario.dni;
    let solucion = req.body.solucion;
    let fecha_ingreso = req.body.fecha_ingreso;
    let fecha = moment(Date.now());
    let fecha2 = fecha.format('YYYY-MM-DD HH:mm:ss');
    Historial.update({
        estado: "resuelto",dni_empleado:`${dni}`,fecha_egreso: fecha2, detalle_solucion: solucion,detalle_razon:null
    },{where:{[Op.and]: [{ id_area: `${area}`}, { id_solicitud:idSolicitud},{fecha_ingreso:fecha_ingreso}]}});
    res.redirect('../../area');  
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
            res.redirect('../../area?contactocorrecto='+correcto);
        })
    }else{
        let invalido = "Correo ya existente";
        res.redirect('../../area?correoinvalido='+invalido);
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
            res.redirect('../area?cambiada='+string);
        }else{
            let noiguales = "Las contraseñas no coinciden";
            res.redirect('../../area?nosoniguales='+noiguales);
        }
    }else{
        let contraseñainv = "Contraseña incorrecta";
        res.redirect('../../area?contrasenainvalida='+contraseñainv);
    }
}