const { Router } = require('express');
const { body } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    body('email','Email es obligatorio').isEmail(),
    body('password','Contraseña es obligatorio').not().isEmpty(),
    validarCampos
] ,login);

router.post('/google', [
    body('id_token','Token de google es necesario.').not().isEmpty(),
    validarCampos
] ,googleSignIn);

module.exports = router;