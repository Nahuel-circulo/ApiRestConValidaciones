const validarCampos = require("../middlewares/validar_campos");
const validarJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar_roles");

module.exports = {
    ...validaRoles,
    ...validarCampos,
    ...validarJWT,
};
