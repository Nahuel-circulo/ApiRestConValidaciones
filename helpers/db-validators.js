const { Categoria,Role,Producto,User } = require("../models");


const esRolValido = async (rol = "") => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en base de datos`);
    }
};

const emailExiste = async (correo) => {
    const existeCorreo = await User.findOne({
        correo,
    });

    if (existeCorreo) {
        throw new Error(`El correo ${correo}, ya se encuentra registrado`);
    }
};

const existeUserId = async (id) => {
    const existeUser = await User.findById(id);
    if (!existeUser) {
        throw new Error(`No existe el usuario con el id ${id}`);
    }
};

const existeCategoriaId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`No existe la categoria con el id ${id}`);
    }
};

const existeProductoId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`No existe la producto con el id ${id}`);
    }
};

const ProductoNombreExiste = async (nombre) => {
    const producto = await Producto.findOne({
        nombre:nombre.toUpperCase()
    });
    if (producto) {
        throw new Error(`El producto ${nombre}, ya se encuentra registrado`);
    }
};
const CategoriaNombreExiste = async (nombre) => {
    const categoria = await Categoria.findOne({
        nombre: nombre.toUpperCase()
    });
    if (categoria) {
        throw new Error(`La categoria ${nombre}, ya se encuentra registrado`);
    }
};




module.exports = {
    esRolValido,
    emailExiste,
    existeUserId,
    existeCategoriaId,
    existeProductoId,
    ProductoNombreExiste,
    CategoriaNombreExiste
};
