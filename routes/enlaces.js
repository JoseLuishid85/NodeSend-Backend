import express from "express";
import { check } from 'express-validator';
import { nuevoEnlace, obtenerEnlace, todosEnlaces, tienePassword, verificarPassword } from "../controllers/enlaceControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',
    [
        check('nombre','Sube un archivo').not().isEmpty(),
        check('nombre_original','Sube un archivo').not().isEmpty(),
    ] 
,auth, nuevoEnlace );

router.get('/',todosEnlaces);

router.get('/:url', tienePassword, obtenerEnlace );

router.post('/:url', verificarPassword, obtenerEnlace);


export default router; 