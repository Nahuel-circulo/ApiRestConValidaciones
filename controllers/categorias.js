const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async(req,res = response)=>{

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    try {
        const categorias = await Categoria.find(query).populate('usuario','nombre').skip(Number(desde)).limit(Number(limite));
        res.json({
            categorias
        })
    } catch (error) {
        console.log(error)
    }
}

const obtenerCategoria = async(req,res = response)=>{
    
    const {id} = req.params
    try {
        const categoria = await Categoria.findById(id).poulate('usuario','nombre');
        res.json({
            categoria
        })
    } catch (error) {
        console.log(error)
    }
}

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`,
        });
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id,
    };
    
    const categoria = new Categoria(data);
    //guardar Db
    await categoria.save();
    
    res.status(201).json({
        categoria,
    });
};

const actualizarCategoria = async (req,res = response)=>{

    const {id} = req.params;
    const { estado,usuario, ...data} = req.body;
    // el estado se  modifica en eliminar
    
    data.nombre = req.body.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data,{new:true});
        //new en true para que los cambios se vean en la respuesta y yo viendo porque no me mostraba los cambios y la concha de su madre voy a decir
        res.json(categoriaActualizada);

    } catch (error) {
        console.log(error);
    }

};

const eliminarCategoria = async (req,res = response)=>{
    
    const {id} = req.params;

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});

    res.status(200).json(categoriaEliminada);

};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
};
