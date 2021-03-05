const {Router} = require('express');
const {check} = require('express-validator');
const { cargarArchivo, actualizarImagen ,servirArchivo} = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers');

const {validarCampos, validarArchivoASubir}=require('../middlewares/index');

const router = Router();


router.get('/:coleccion/:id',[
    check('id',"el id debe ser un id de mongo").isMongoId(),
    check('coleccion').custom(c=> validarColeccionesPermitidas(c, ['users','productos'])),
    validarCampos
],servirArchivo);

router.post('/',cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoASubir,
    check('id',"el id debe ser un id de mongo").isMongoId(),
    check('coleccion').custom(c=> validarColeccionesPermitidas(c, ['users','productos'])),
    validarCampos
],actualizarImagen);


module.exports = router;

