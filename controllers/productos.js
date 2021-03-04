const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    try {
        const productos = await Producto.find(query).populate('categoria','nombre').populate('usuario','nombre').skip(Number(desde)).limit(Number(limite));
        res.json({
            productos
        })
    } catch (error) {
        throw error
    }
};

const obtenerProducto = async (req, res = response) => {
    const {id} =req.params;    
    try {
        const producto = await Producto.findById(id).populate('categoria','nombre').populate('usuario','nombre');
        res.json({
            producto
        })
    } catch (error) {
        throw error
    }
 };

const crearProducto = async (req, res = response) => {
    
    const {nombre} = req.body;
    const { estado,usuario, ...body} = req.body;
    
    try {
        const productoExiste = await Producto.findOne({ nombre });
        
        if (productoExiste) {
            return res.status(400).json({
                msg: ` El producto ${productoExiste.nombre}, ya se encuentra cargado`,
            });
        }
        
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario : req.usuario._id
        };

        const producto = new Producto(data);
        //guardar en DB
        await producto.save();

        res.status(201).json({
            producto,
        });
    } catch (error) { 
           res.status(500).json({
            msg:"ocurrio un problema al crear producto" 
        });
    }
};

const actualizarProducto = async (req, res = response) => { 

    const {id} = req.params;
    const { estado,usuario, ...data} = req.body;
    // el estado se  modifica en eliminar
    if(data.nombre){
        data.nombre = req.body.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;
    
    try {
        const productoActualizada = await Producto.findByIdAndUpdate(id, data,{new:true});
        //new en true para que los cambios se vean en la respuesta y yo viendo porque no me mostraba los cambios y la concha de su madre voy a decir
        res.json(productoActualizada);
    
    } catch (error) {
        res.status(500).json({
            msg:"ocurrio un problema al actulizar",
            error 
        });
    }

};

const eliminarProducto = async (req, res = response) => { 

        
    const {id} = req.params;

    const productoEliminado = await Producto.findByIdAndUpdate(id,{estado:false},{new:true});

    res.status(200).json(productoEliminado);
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
};
