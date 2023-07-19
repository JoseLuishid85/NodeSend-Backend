import Usuario from "../models/Usuario.js"
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const nuevoUsuario = async (req, res) => {
    
    //Mostrar mensaje de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ 
            errores: errores.array()
        })
    }

    //verificar si el Usuario ya esta registrado
    const { email } = req.body;
    let usuario = await Usuario.findOne({email});
    if(usuario){
        return res.status(400).json({
            msg: "El usuario ya esta registrado"
        })
    }
    
    try {
        const nuevoUsuario = new Usuario(req.body)
        const salt = await bcrypt.genSalt(10)
        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, salt)
        await nuevoUsuario.save();

        res.json({
            msg: "Usuario Creado con Exito",
            nuevoUsuario
        })
    } catch (error) {
        console.log(error)
    }
    
}

export {
    nuevoUsuario
}