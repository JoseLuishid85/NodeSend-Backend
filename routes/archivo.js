import express from "express";
import { subirArchivo, descargar, eliminarArchivo } from "../controllers/archivoControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',auth, subirArchivo );

router.get('/:archivo', descargar, eliminarArchivo)


export default router; 