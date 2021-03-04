const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { User, Categoria, Producto } = require('../models/index')


const coleccionesPermitidas = [
    'users',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        try {
            const usuario = await User.findById(termino);
            return res.json({
                results: (usuario) ? [usuario] : [] //si el usuario existe retorna un arreglo de usuarios si no un arreglo vacio
            });
        } catch (error) {
            console.log(error)
        }
    }

    const regExp = new RegExp(termino, 'i');

    try {
        const usuarios = await User.find({

            $or: [{ nombre: regExp }, { correo: regExp }],
            $and: [{ estado: true }]

        });
        res.json({
            results: usuarios
        })
    } catch (error) {
        console.log(error);
    }

};

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regExp = new RegExp(termino, 'i');

    try {
        const categorias = await Categoria.find({
            $or: [{ nombre: regExp }],
            $and: [{ estado: true }]
        });

        res.json({
            results: categorias
        })

    } catch (error) {
        console.log(error);
    }


};

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regExp = new RegExp(termino, 'i');

    try {
        const productos = await Producto.find({
            $or: [{ nombre: regExp }],
            $and: [{ estado: true }]
        }).populate('categoria','nombre');

        res.json({
            results: productos
        })

    } catch (error) {
        console.log(error);
    }


};



const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'users':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda.'
            });
    }
};

module.exports = {
    buscar
}