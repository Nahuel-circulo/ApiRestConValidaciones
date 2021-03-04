const { Router } = require("express");
const { check } = require("express-validator");
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
} = require("../controllers/categorias");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar_campos");
const { existeCategoriaId,CategoriaNombreExiste } = require("../helpers/db-validators");
const router = Router();

//obtener todos
router.get("/", obtenerCategorias);
//obtener por id
router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaId),
        validarCampos,
    ],
    obtenerCategoria
);
//crear categoria -  privado
router.post(
    "/",
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check('nombre').custom(CategoriaNombreExiste),
        validarCampos,
    ],
    crearCategoria
);

// actualizar - privado
router.put(
    "/:id",
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check('nombre').custom(CategoriaNombreExiste),
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaId),
        validarCampos,
    ],
    actualizarCategoria
);

// eliminar - privado
router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoriaId),
        validarCampos,
    ],
    eliminarCategoria
);

module.exports = router;
