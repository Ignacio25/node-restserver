const { response } = require("express");
const res = require("express/lib/response");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', resp = response ) => {

    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const usuario = await Usuario.findById(termino);
        resp.json({
            results: (usuario) ? [ usuario ] : []
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{nombre: regexp }, { email: regexp }],
        $and: [{ estado: true }]
    });
    resp.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', resp = response ) => {

    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const categoria = await Categoria.findById(termino);
        resp.json({
            results: (categoria) ? [ categoria ] : []
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({
        $or: [{nombre: regexp }],
        $and: [{ estado: true }]
    });
    resp.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', resp = response ) => {

    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        resp.json({
            results: (producto) ? [ producto ] : []
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const productos = await Producto.find({
        $or: [{nombre: regexp }, { descripcion: regexp }],
        $and: [{ estado: true }]
    })
    .populate('categoria','nombre');
    resp.json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${ coleccionesPermitidas }`
        })
    };

    switch(coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

    
}

module.exports = {
    buscar
}