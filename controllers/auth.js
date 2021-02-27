const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
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
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Algo Salio Mal",
        });
    }
};

module.exports = { login };
