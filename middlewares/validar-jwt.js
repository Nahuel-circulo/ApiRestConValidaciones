const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).res({
            msg: "No hay token en la peticion",
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //el uid viene del payload con la que se construye el token

        //leer el usuario que corresponda el uid
        const usuario = await User.findById(uid); 
        //controlar que usuario no sea undefined
        
        if(!usuario){
            return res.status(401).json({
                msg: "token no valido - usuario no existe en DB"
            })
        }
        
        //verificar si el usuario no esta eliminado 
        
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Token no valido - Usuario con estado false"
            })
        }
        
        req.usuario = usuario;
        //se pasa al req.usuario ya que pasa por los middleware siguientes hasta llegar al controlador

        next();
    } catch (error) {

        res.status(401).json({
            msg: "Token no valido",
        });
    }
};

module.exports = {
    validarJWT,
};
