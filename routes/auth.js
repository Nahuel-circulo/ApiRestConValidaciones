const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar_campos");


const router = Router();


router.get('/login',login);

router.post('/login',[
    check('correo',"El correo es Obligatorio").isEmail(),
    check('password',"La contraseña es obligatoria").not().isEmpty(),
    validarCampos
],login);


module.exports = router;