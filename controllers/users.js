const { response, request } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");


const usersGet = async (req = request, res = response) => {
    const {limite = 5,desde=0} = req.query; //argumentos opcionales
    const query = {estado : true}

    const resp = await Promise.all([ //promise.all ejecuta ambas promesas en simultaneo
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    ]);

    const [total,usuarios] = resp; //desestructurar el resultado de la promesa
    res.json({
        total,
        usuarios
    });
};

const getUserById = async(req,res) =>{

    const {id} = req.params;
    const user = await User.findById(id);
    res.json({
        user
    })

}

const usersPut = async (req, res) => {
    const {id} = req.params;
    const {_id,password,google,correo, ...resto} = req.body; //se quitan algunos campos que no se deberian actulizar

    //TODO validar contra base de datos

    if(password){
        //encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await User.findByIdAndUpdate(id,resto);


    res.json(usuario);
};

const userPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;

    try {
        const user = new User({ nombre, correo, password, rol });

        //encriptar contrasena

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        //guardar en base de datos
        await user.save();

        res.json({

            user,
        });

    } catch (error) {
        console.log(error);
    }
};

const userDelete = async (req, res) => {
    const {id} = req.params;

    //borrar fisicamente
    //const user = await User.findByIdAndDelete(id);

    //baja logica
    const user = await User.findByIdAndUpdate(id,{estado:false})

    res.json({
        user
    });
};

module.exports = {
    usersGet,
    usersPut,
    userPost,
    userDelete,
    getUserById
};
