const { request, response } = require("express");

const esAdminRole = async (req = request, res = response, next) => {
    
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar rol sin validar token antes",
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no posee permisos`,
        });
    }

    next();
};

const tieneRol = (...roles) => {
    // operador ... transforma en un arreglo

    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verificar rol sin validar token antes",
            });
        }

        const { rol } = req.usuario;

        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles ${roles}`,
            });
        }

        next();
    };
};

module.exports = {
    esAdminRole,
    tieneRol,
};
