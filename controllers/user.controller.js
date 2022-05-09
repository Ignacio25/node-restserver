const { response, request } = require('express');

const getUsers = (req = request, res = response) => {
    const { q, nombre = 'No name', apellido, page = 1, limit = 10 } = req.query;
    res.json({
        msg: "API get - controlador",
        q,
        nombre,
        apellido,
        page,
        limit
    });
}

const postUser = ( req, res = response ) => {

    const { nombre, edad } = req.body;
    res.json({
        msg: "API Post - controlador",
        nombre,
        edad
    });
}

const putUser = ( req, res = response ) => {

    const id = req.params.id;
    res.json({
        msg: "API Put - controlador",
        id
    });
}

const deleteUser = ( req, res = response ) => {
    res.json({
        msg: "API Delete - controlador"
    });
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}