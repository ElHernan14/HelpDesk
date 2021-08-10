const Empleado = require("../models").Empleado;
const Area = require("../models").Area;
const Cliente = require("../models").Cliente;
const bcrypt = require("bcrypt");
const { Op, where } = require("sequelize");

exports.gestion = async(req,res,next) =>{
    let idarea = req.token.usuario.area;
    let dni = req.token.usuario.dni;
    let empleado = await Empleado.findOne({where:{dni:`${dni}`},raw:true});
    const areas = await Area.findAll({where:{id_area:{[Op.ne]: `${idarea}`}}});
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    let Areas = [];
    const clientes = await Cliente.findAll({where:{estado:false}},{raw:true});
    let Clientes = [];
    let nombreApellido = null;
    let cantidad = 0;
    clientes.forEach(clientes =>{
        nombreApellido = `${clientes.dataValues.nombre} ${clientes.dataValues.apellido}`;
        Clientes.push({
            dni: clientes.dataValues.dni,
            nombre: nombreApellido,
            mail: clientes.dataValues.mail,
            celular: clientes.dataValues.celular,
            estado: clientes.dataValues.estado
        })
        cantidad++;
    })
    areas.forEach( areas =>{
        Areas.push(areas.dataValues);
    })
    res.render('./gestion/gestion.jade',{
        pretty:true,
        nombre:nombre,
        apellido:apellido,
        empleadocargado:req.query.empleadocargado,
        areacargada:req.query.areacargada,
        dniexistente:req.query.dniexistente,
        emailexistente:req.query.emailexistente,
        areaexistente:req.query.areaexistente,
        nombreform:req.query.nombre,
        apellidoform:req.query.apellido,
        mailform:req.query.mail,
        telefonoform:req.query.telefono,
        contrasenaform:req.query.contrasena,
        email: empleado.mail,
        telefono:empleado.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        cantidad,
        clientes:Clientes,
        areas:Areas,
        action:"gestion",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
}

//CARGA DE AREAS Y CLIENTES
exports.cargarempleado = async(req,res,next) =>{
    let dni = req.body.dni;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let telefono = req.body.telefono;
    let mail = req.body.mail;
    let idarea = req.body.idarea;
    let fecha = req.body.fecha;
    const salt = await bcrypt.genSalt(10);
    const contraseña = await bcrypt.hash(req.body.contraseña,salt);
    const empleado = await Empleado.findOne({where:{mail}});
    if(empleado == null){
        Empleado.create({
            dni: dni,
            nombre: nombre,
            apellido: apellido,
            mail: mail,
            telefono: telefono,
            contraseña: contraseña,
            id_area: idarea,
            estado: true,
            fecha: fecha
        }).then(empleado =>{
            let empleadocargado = "Empleado cargado y en estado activo"
            res.redirect("../../gestion?empleadocargado="+empleadocargado);
        }).catch(error =>{
            if(error.parent.errno){
                let dniexistente = "Dni ya existente"
                res.redirect("../../gestion?dniexistente="+dniexistente);
            }
        })
    }else{
        let emailexistente = "Email ya existente"
        res.redirect("../../gestion?emailexistente="+emailexistente);
    }
    
}

exports.areas = async(req,res,next) =>{
    let areas = await Area.findAll();
    let Areas = [];
    let areaexiste = req.query.areaexiste;
    let error = req.query.msjError;
    let dniuser = req.token.usuario.dni;
    let empleados = await Empleado.findOne({where:{dni:`${dniuser}`},raw:true});
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    areas.forEach(areas =>{
        Areas.push({id_area:areas.dataValues.id_area,nombre_area:areas.dataValues.nombre_area});
    })
    res.render('./gestion/areas.jade',{
        pretty:true,
        areas:Areas,
        areaexiste,
        error,
        email: empleados.mail,
        telefono:empleados.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        nombre,apellido,
        action:"areas",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
}

exports.estadoclientes = async(req,res,next) =>{
    let dni = req.body.dni;
    let estado = req.body.estado;
    Cliente.update({estado},{where:{dni}});
    res.redirect('../../gestion');
}

//MODIFICAR EMPLEADOS
exports.empleados = async(req,res,next) =>{
    const empleados = await Empleado.findAll({where:{id_area:{[Op.ne]: `${req.token.usuario.area}`}}});
    const areas = await Area.findAll();
    let dniuser = req.token.usuario.dni;
    let empleado = await Empleado.findOne({where:{dni:`${dniuser}`},raw:true});
    let nombre = req.token.usuario.nombre;
    let apellido = req.token.usuario.apellido;
    let invalido = req.query.correoinvalido;
    let correcto = req.query.contactocorrecto;
    let noiguales = req.query.nosoniguales;
    let cambiada = req.query.cambiada;
    let contraseñainvalida = req.query.contrasenainvalida;
    let Empleados = [];
    let Areas = [];
    let nombreApellido = null;
    let nombre_area = null;
    empleados.forEach(empleados =>{
        areas.forEach(areas =>{
            if(areas.dataValues.id_area == empleados.dataValues.id_area){
                nombre_area = areas.dataValues.nombre_area;
            }
        })
        nombreApellido = `${empleados.dataValues.nombre} ${empleados.dataValues.apellido}`;
        Empleados.push({
            dni:empleados.dataValues.dni,
            nombreApellido,
            area:nombre_area,
            telefono:empleados.dataValues.telefono,
            mail:empleados.dataValues.mail,
            estado:empleados.dataValues.estado
        }) 
    })
    areas.forEach(areas =>{
        Areas.push(areas.dataValues);
    })
    res.render('./gestion/empleados.jade',{
        pretty:true,
        areas:Areas,
        empleados:Empleados,
        email: empleado.mail,
        telefono:empleado.telefono,
        invalido,
        correcto,
        contraseñainvalida,
        noiguales,
        cambiada,
        nombre,apellido,
        action:"empleados",
        cerrarsesion:"Cerrar Sesion",
        ruta:"/cerrarsesion"
    })
}

exports.cambiarEstado = function(req,res){
    let estado = req.body.estado;
    let dni = req.body.dni;
    Empleado.update({estado},{where:{dni}});
    res.redirect('../../gestion/empleados');
}

exports.cambiarArea = function(req,res){
    let area = req.body.idarea;
    let dni = req.body.dni;
    console.log(area)
    console.log(dni)
    Empleado.update({id_area:area},{where:{dni}});
    res.redirect('../../gestion/empleados');
}

//MODIFICAR AREAS
exports.modificarNombre = async(req,res,next) =>{
    let nombre = req.body.nombre;
    let id_area = req.body.id_area;
    let string = null;
    let error = null;
    const areas = await Area.findAll({where:{nombre_area:{[Op.startsWith]:`${nombre}`}}})
    if(areas == ''){
        Area.update({nombre_area:nombre},{where:{id_area}});
        res.redirect('../areas')
    }else{
        string = "areaexiste"
        error = "Area ya existente"
        res.redirect('../../gestion/areas?areaexiste=' +string+'&msjError='+error);
    }
}

exports.cargararea = async(req,res,next) =>{
    let nombre = req.body.area;
    const areas = await Area.findAll({where:{nombre_area:{[Op.startsWith]:`${nombre}`}}});
    if(areas == ''){
        Area.create({
            nombre_area: nombre
        })
        let areacargada = "Area creada exitosamente"
        res.redirect('../../gestion/?areacargada='+areacargada);
    }else{
        let areaexistente = "Area ya existente"
        res.redirect('../../gestion/?areaexistente='+areaexistente);
    }
}

exports.borrarArea = function(req,res,next){
    let id_area = req.body.id_area;
    Area.destroy({
        where:{id_area}
    })
    res.redirect('../areas');
}

//EDITAR PERFIL
exports.editarperfil = async(req,res,direccion) =>{
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
    const empleado = await Empleado.findOne({where:{dni}},{raw:true});
    const validPassword = await bcrypt.compare(req.body.actual, empleado.dataValues.contraseña);
    if(validPassword){
        if(nueva == copia){
            let string = "Contraseña modificada correctamente";
            let contraseñaNueva = await bcrypt.hash(nueva,salt);
            Empleado.update({
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