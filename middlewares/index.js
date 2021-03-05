const validarCampos = require("../middlewares/validar_campos");
const validarJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar_roles");
const validarArchivo = require("../middlewares/validar-archivo");

module.exports = {
    ...validaRoles,
    ...validarCampos,
    ...validarJWT,
    ...validarArchivo
};
