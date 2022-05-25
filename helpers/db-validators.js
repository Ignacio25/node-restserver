const Role = require('../models/role');
const Usuario = require('../models/usuario');

const isValidRole = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}


const existEmail = async(email = '') => {
    const existeEmail = await Usuario.findOne( {email} );
    if ( existeEmail ) {
        throw new Error(`El email ${email} ya esta registrado en la BD`);
    }
}

const existUserById = async(id = '') => {
    const existeUser = await Usuario.findById(id);
    if ( !existeUser ) {
        throw new Error(`El usuario con ${id} no esta registrado en la BD`);
    }
}

module.exports = {
    isValidRole,
    existEmail,
    existUserById
}