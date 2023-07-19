import multer from "multer";
import shortid from "shortid";
import fs from "fs";
import Enlace from "../models/Enlace.js";




const subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10  : 1024 * 1024 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads');
            },
            filename: (req,file,cd) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cd(null, `${shortid.generate()}${extension}`); 
            }
        })
    } 

    const upload = multer(configuracionMulter).single('archivo');

    upload(req,res, async (error)=>{
        if(!error){
            res.json({ archivo: req.file.filename });
            }else{
            console.log(error);
            return next();
        }
    });

    
}

const eliminarArchivo = async (req, res) => {
    console.log(req.archivo)

    try {
        fs.unlinkSync(`./uploads/${req.archivo}`);
    } catch (error) {
        console.log(error)
        
    }
}

const descargar = async(req,res, next) =>{

    //Obtener Enlace
    const enlace = await Enlace.findOne({ nombre: req.params.archivo});
    
    const descargarArchivo = 'uploads/' + req.params.archivo;
    res.download(descargarArchivo);

    //Eliminar archivo
    const { descargas,nombre } = enlace;

    if(descargas===1){

        //Eliminar el archivo
        req.archivo = nombre

        //Eliminar de la base de datos
        await Enlace.findOneAndRemove(enlace.url)

        next();

        }else{
        enlace.descargas--;
        await enlace.save();
    }
    
}

export {
    subirArchivo,
    eliminarArchivo,
    descargar
}