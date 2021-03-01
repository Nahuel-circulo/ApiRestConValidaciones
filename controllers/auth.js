const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/user");

const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password incorrecto - correo",
            });
        }
        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password incorrecto - estado: false",
            });
        }
        //verificar el password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password incorrecto - password",
            });
        }
        //generar el jwt

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Algo Salio Mal",
        });
    }

};
const googleSignin = async (req = request, res = response) => {


    const { id_token } = req.body;
    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await User.findOne({ correo });
        if (!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'Cualquier Cosa',//porque es obligatorio, pero no sirve para autenticarse porque al autenticarse se evalua con un hash
                img,
                google:true
            }
            usuario = new User(data);
            await usuario.save();
        }

        if(!usuario.estado){
            res.status(401).json({
                msg:"Hable con el Administrador, usuario bloqueado"
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: "Token de google no es valido"
        })
    }
}

module.exports = {
    login,
    googleSignin
};
