import Usuario from "../models/Usuario.js"
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt  from "jsonwebtoken";


const autenticarUsuario = async (req, res, next) => {
    //revisar si hay 
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ 
            errores: errores.array()
        })
    }

    //Buscar el usuario para ver si esta registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        res.status(401).json({ msg: 'El usuario no existe' })
        return next();
    }

    
    //Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password,usuario.password)){
        //crear JSONWEBTOKEN
        
        const token = jwt.sign({
                id: usuario._id,
                email: usuario.email,
                nombre: usuario.nombre
            }, 
            process.env.JWT_SECRET,
            {
            expiresIn: '8h'
        });


        res.json({ token })
        
        }else{
        res.status(401).json({ msg: 'Password incorrecto' })
    }
    
}

const usuarioAutenticado = async (req, res, next) => {
    
    res.json({ usuario: req.usuario});
}

export {
    autenticarUsuario,
    usuarioAutenticado
}