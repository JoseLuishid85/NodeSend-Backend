import jwt  from "jsonwebtoken";


const auth = (req, res, next) => {
    
    const authHeader = req.get('Authorization');
    if(authHeader){
        //Obtener Token
        const token = authHeader.split(' ')[1];

        try {
            const usuario = jwt.verify(token,process.env.JWT_SECRET);
            req.usuario = usuario;
        } catch (error) {
            console.log(error)
            console.log('JWT no valido');
        }
    }

    next();
};

export default auth;