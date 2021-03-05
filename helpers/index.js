

const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const subirArghivo = require('./subir-archivo');


module.exports ={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArghivo,
}
