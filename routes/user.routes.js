const { Router } = require('express');
const { body } = require('express-validator');
const { getUsers, postUser, putUser, deleteUser } = require('../controllers/user.controller');
const { isValidRole, existEmail, existUserById, convertToMongoId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol
} = require('../middlewares');

const router = Router();

router.get('/', getUsers);

router.post('/', [ 
    body('email','El email no tiene un formato valido').isEmail(),
    body('nombre','El nombre es obligatorio').not().isEmpty(),
    body('password','La contraseña es obligatoria y debe contener mas de 6 caracteres.').isLength({ min: 6}),
    body('rol').custom( isValidRole ),
    body('email').custom(existEmail),
    validarCampos
], postUser);

router.put('/:id', [
    body('id','No es un id valido').isMongoId(),
    body('id').custom( existUserById ),
    body('rol').custom( isValidRole ),
    validarCampos
], putUser);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE','NOSE_ROLE'),
    body('id','No es un id valido').isMongoId(),
    body('id').custom( existUserById )
], deleteUser);

module.exports = router;
