const { response, request } = require('express');

// obtener todas las categorias
const getCategorias = (req = request, res = response) => {
    return res.json({
        msg: 'get all'
    });
}

// obtener una categoria por id
const getCategoriaById = (req = request, res = response) => {
    return res.json({
        msg: 'get all by id'
    });
}

// crear categoria - privado - cualquier persona con token valido -> post
const createCategoria = (req = request, res = response) => {
    return res.json({
        msg: 'create categoria'
    });
}

// Actualizar un registro por id. - privado - cualquiera con token valido
const updateCategoria = (req = request, res = response) => {
    return res.json({
        msg: 'update categoria'
    });
}

// borrar una categoria - solo ADMIN, marca estado a false.
const deleteCategoria = (req = request, res = response) => {
    return res.json({
        msg: 'delete categoria'
    });
}

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
}