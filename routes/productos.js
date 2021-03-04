const { Router } = require("express");
const { check } = require("express-validator");
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
} = require("../controllers/productos");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar_campos");
const { existeProductoId , existeCategoriaId,ProductoNombreExiste} = require("../helpers/db-validators");
const router = Router();

//obtener todos
router.get("/", obtenerProductos);
//obtener por id
router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeProductoId),
        validarCampos,
    ],
    obtenerProducto
);
//crear Producto -  privado
router.post(
    "/",
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("nombre").custom(ProductoNombreExiste),
        check("categoria", "La categoria es oblogatoria").not().isEmpty(),
        check("categoria").custom(existeCategoriaId),
        validarCampos,
    ],
    crearProducto
);

// actualizar - privado
router.put(
    "/:id",
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("nombre").custom(ProductoNombreExiste),
        check("id", "No es un ID valido").isMongoId(),
        check("categoria", "La categoria es oblogatoria").not().isEmpty(),
        check("categoria").custom(existeCategoriaId),
        check("id").custom(existeProductoId),
        validarCampos,
    ],
    actualizarProducto
);

// eliminar - privado
router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeProductoId),
        validarCampos,
    ],
    eliminarProducto
);

module.exports = router;