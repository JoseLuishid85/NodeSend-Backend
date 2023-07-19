import express from "express";
import { check } from 'express-validator';
import { nuevoUsuario } from "../controllers/usuarioControllers.js";

const router = express.Router();



router.post('/',
    [
        check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
        //check('email', 'El email es Obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe tener 6 caracteres').isLength({ min:6 })
    ]
    ,nuevoUsuario)


export default router;