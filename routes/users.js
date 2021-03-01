const { Router } = require("express");
const { check } = require("express-validator");

/* const { validarCampos } = require("../middlewares/validar_campos");
const {validarJWT} = require('../middlewares/validar-jwt');
const {esAdminRole ,tieneRol} = require('../middlewares/validar_roles');
 */

const {
    esAdminRole,
    tieneRol,
    validarCampos,
    validarJWT,
} = require("../middlewares");

const {
    esRolValido,
    emailExiste,
    existeUserId,
} = require("../helpers/db-validators");

const {
    usersGet,
    userDelete,
    userPost,
    usersPut,
    getUserById,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);
router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUserId),
        validarCampos,
    ],
    getUserById
);

router.put(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUserId),
        check("rol").custom(esRolValido), // es igual a (rol)=> esRolValido(rol)
        validarCampos,
    ],
    usersPut
);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio perro").not().isEmpty(),
        check("correo", "El correo no es valido").isEmail(),
        check("correo").custom(emailExiste),
        check(
            "password",
            "el password debe contener al menos 8 caracteres"
        ).isLength({ min: 8 }),
        check("rol").custom(esRolValido), // es igual a (rol)=> esRolValido(rol)
        validarCampos,
    ],
    userPost
);

router.delete(
    "/:id",
    [
        validarJWT,
        //esAdminRole,
        tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUserId),
        validarCampos,
    ],
    userDelete
);

module.exports = router;
