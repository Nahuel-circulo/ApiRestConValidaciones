


const validarArchivoASubir = (req,res,next)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      return  res.status(400).json({
            msg: "No hay archivos en la peticion - validar archivo a subir",
        });
        
    }
    next();

}


module.exports = {
    validarArchivoASubir
}