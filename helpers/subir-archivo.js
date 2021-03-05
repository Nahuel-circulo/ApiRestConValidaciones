const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
    files,
    extencionesValidas = ["png", "jpg", "jpeg", "gif"],
    carpeta = ""
) => {
    return new Promise((resolve, reject) => {
        //desestructurar archivo de la peticion
        const { archivo } = files;

        //separo el nombre en el punto
        const nombreCortado = archivo.name.split(".");

        //ultima posicion es la extension
        const extension = nombreCortado[nombreCortado.length - 1];

        // validar la extension
        // const extencionesValidas = ["png", "jpg", "jpeg", "gif"];

        if (!extencionesValidas.includes(extension)) {
            return reject(
                `La extension ${extension} no es permitida, permitidas: ${extencionesValidas}`
            );
        }

        // darle nombre unico al archivo (uuid genera un id unico y se le coloca la extension)
        const nombreTemp = uuidv4() + "." + extension;
        //carpeta donde estoy (controller) + '../uploads' + nombre del archivo
        const uploadPath = path.join(__dirname,"../uploads/", carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            // retorna el nombre
            resolve(nombreTemp);
        });
    });
};

module.exports = {
    subirArchivo,
};
