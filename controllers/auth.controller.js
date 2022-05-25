const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require("../models/usuario");


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if ( !usuario ) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - email"
            })
        }

        // Verificar si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - estado: false"
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - password"
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'login ok',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Algo salio mal. Contactese con el administrador."
        })
    }
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, email } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({email});

        if ( !usuario ) {
            //tengo que crearlo
            const data = {
                nombre,
                email,
                password: 'test',
                img,
                google: true,
                rol: 'USER_ROLE'
            };  
            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si es usuario en bbdd tiene estado: false
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}
