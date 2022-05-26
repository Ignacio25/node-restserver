const { response, request } = require('express');
const { findByIdAndDelete } = require('../models/categoria');
const { Categoria } = require('../models/index');

// obtener todas las categorias - paginado - total - populate
const getCategorias = async(req = request, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
                .populate('usuario','nombre')
               .skip(Number( desde ))
               .limit(Number( limite ))
    ]);
    res.json({
        total,
        categorias
    });
}

// obtener una categoria por id - populate {}
const getCategoriaById = async (req = request, res = response) => {

    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    
    if ( !categoria.estado ) {
        return res.status(401).json({
            msg: 'Hable con el administrador, categoria bloqueada'
        });
    }
    return res.status(200).json(categoria);
}

// crear categoria - privado - cualquier persona con token valido -> post
const createCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria( data );
    await categoria.save();
    return res.status(201).json(categoria);
}

const updateCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new:true });
    return res.status(200).json(categoria);
}

const deleteCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new:true });
    return res.status(200).json(categoria);
}

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
}