const Role = require("../models/role");
const User = require("../models/user");

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

module.exports = {
    esRolValido,
    emailExiste,
    existeUserId,
};
