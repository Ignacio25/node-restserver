const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsers = async(req = request, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const [ total, users ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
               .skip(Number( desde ))
               .limit(Number( limite ))
    ]);
    res.json({
        total,
        users
    });
}

const postUser = async ( req = request, res = response ) => {

    const { nombre, email, password, rol } = req.body;
    const usuario = new Usuario({ nombre, email, password, rol });

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();
    res.json({
        msg: "API Post - controlador",
        usuario
    });
}

const putUser = async( req, res = response ) => {

    const id = req.params.id;
    const { _id, password, google, email, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json(usuario);
}

const deleteUser = async( req, res = response ) => {
    
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json({usuario});
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}