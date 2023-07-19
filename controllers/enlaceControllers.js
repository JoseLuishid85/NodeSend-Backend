import Enlace from "../models/Enlace.js"
import shortid from "shortid";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const nuevoEnlace = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ 
            errores: errores.array()
        })
    }
    
    const { nombre_original, nombre } = req.body;
    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    if(req.usuario){
        const { password, descargas } = req.body;
        //Asignar a enlace el numero de descarga 
        if(descargas){
            enlace.descargas = descargas;
        }

        //Asignar Password
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        //Asignar el Autor
        enlace.autor = req.usuario.id;
    }

    //Almacenar en la BD
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` })
        next();
    } catch (error) {
        console.log(error)
    }
}

const obtenerEnlace = async(req, res, next) => {
    
    const { url } = req.params;
    //Verificar si exite el enlace
    const enlace = await Enlace.findOne({ url });
    if(!enlace){
        res.status(404).json({ msg: 'Ese enlace no existe' });
        next();
    }


    res.json({archivo: enlace.nombre, password: false});

    next();
}

const todosEnlaces = async(req, res, next) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({ enlaces });
    } catch (error) {
        console.log(error)
    }
}

//retorna si el enlace tiene password o no
const tienePassword = async(req,res, next) => {
    const { url } = req.params;
    //Verificar si exite el enlace
    const enlace = await Enlace.findOne({ url });
    if(!enlace){
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    if(enlace.password){
        return res.json({ password: true, enlace })
    }

    next();
}

const verificarPassword = async(req,res, next) =>{

    const { url } = req.params;
    const { password } = req.body;

    //Consultar Enlace
    const enlace  = await Enlace.findOne({url});

    
    //verificar el password
    if(bcrypt.compareSync(password,enlace.password)){
        //Permitirle al usuario descargar el archivo
        next();
        }else{
            return res.status(401).json({ msg: 'Password Incorrecto' })
    }
    
}


export {
    nuevoEnlace,
    obtenerEnlace,
    todosEnlaces,
    tienePassword,
    verificarPassword
}