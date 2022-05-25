const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde a uid
        const usuarioAutenticado = await Usuario.findById(uid);

        if (! usuarioAutenticado ) {
            return res.status(401).json({
                msg: 'token no valido - usuario no en existe en BD'
            });
        }

        // verificar si el uid tiene estado en true
        if ( !usuarioAutenticado.estado ) {
            return res.status(401).json({
                msg: 'token no valido - usuario con estado false'
            });
        }

        req.usuario = usuarioAutenticado;
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido.'
        })
    }
}

module.exports = {
    validarJWT
}