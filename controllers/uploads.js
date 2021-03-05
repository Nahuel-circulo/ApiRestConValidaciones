const { request, response } = require("express");
const fs = require("fs");
const path = require("path");
const { subirArchivo } = require("../helpers");

const { User, Producto } = require("../models/index");

const cargarArchivo = async (req = request, res = response) => {
    try {
        //imagenes usa las extenciones por defecto por eso el undefined
        const nombre = await subirArchivo(req.files, undefined, "imgs");
        //subirArchivo retorna el nombre

        res.json({
            nombre,
        });
    } catch (msg) {
        res.status(400).json({
            msg,
        });
    }
};

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case "users":
            modelo = await User.findById(id);

            if (!modelo) {
                return res.json({
                    msg: `no existe usuario con id ${id}`,
                });
            }

            break;
        case "productos":
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.json({
                    msg: `no existe producto con id ${id}`,
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto",
            });
            break;
    }

    //limpiar imagenes previas

    if (modelo.img) {
        // hay que borrar la imagen del servidor
        const pathImagen = path.join(
            __dirname,
            "../uploads",
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen); // borra el archivo
        }
    }

    //subir imagen nueva

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo,
    });
};

const servirArchivo = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case "users":
            modelo = await User.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe usuario con id ${id}`,
                });
            }

            break;
        case "productos":
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `no existe producto con id ${id}`,
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto",
            });
            break;
    }

    if (modelo.img) {
        const pathImagen = path.join(
            __dirname,
            "../uploads",
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathPlaceHolder = path.join(
        __dirname,
        "../assets/no-image.jpg"
    );
    res.sendFile(pathPlaceHolder);
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    servirArchivo,
};
