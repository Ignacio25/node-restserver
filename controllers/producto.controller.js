const { response, request } = require('express');
const { Producto } = require('../models/index');

const getProductos = async(req = request, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
                .populate('usuario','nombre')
                .populate('categoria','nombre')
               .skip(Number( desde ))
               .limit(Number( limite ))
    ]);
    res.json({
        total,
        productos
    });
}

const getProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
                                   .populate('usuario','nombre')
                                   .populate('categoria','nombre');
    
    if ( !producto.estado ) {
        return res.status(401).json({
            msg: 'Hable con el administrador, producto bloqueado'
        });
    }
    return res.status(200).json(producto);
}

const createProducto = async(req = request, res = response) => {

    const { nombre, precio, categoria, descripcion } = req.body;
    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `La categoria ${ productoDB.nombre }, ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria,
        descripcion
    }

    const producto = await new Producto( data );
    await producto.save();
    return res.status(201).json(producto);
}

const updateProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new:true });
    return res.status(200).json(producto);
}

const deleteProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new:true });
    return res.status(200).json(producto);
}

module.exports = {
    getProductos,
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto
}