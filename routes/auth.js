import express from "express";
import { check } from 'express-validator';
import { autenticarUsuario, usuarioAutenticado } from "../controllers/authControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',
    [
        check('email','Agrega un email valido').isEmail(),
        check('password','Password es Obligatorio').not().isEmpty()
    ], autenticarUsuario );
router.get('/',auth, usuarioAutenticado );


export default router; 