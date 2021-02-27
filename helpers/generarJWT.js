const jwt = require("jsonwebtoken");

// uid user identifier
const generarJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid }; // no enviar informacion sensible

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "12h",
            },
            (error, token) => {
                if (error) {
                    console.log(error);
                    reject("No se pudo generar el token");
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    generarJWT,
};
