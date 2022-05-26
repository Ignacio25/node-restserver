const { Router } = require('express');
const { body, param } = require('express-validator');
const { 
    getCategorias, 
    getCategoriaById, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria 
} = require('../controllers/categoria.controller');
const { existCategoria } = require('../helpers/db-validators');
const {
    validarCampos, 
    validarJWT,
    esAdminRole
} = require('../middlewares');

const router = Router();

router.get('/', getCategorias);

router.get('/:id', [
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existCategoria ),
    validarCampos
] ,getCategoriaById );

router.post('/', [
    validarJWT,
    body('nombre','Nombre es obligatorio').not().isEmpty(),
    validarCampos
],createCategoria );

router.put('/:id', [
    validarJWT,
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existCategoria ),
    body('nombre','Nombre es obligatorio').not().isEmpty(),
    validarCampos
],updateCategoria );

router.delete('/:id', [
    validarJWT,
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existCategoria ),
    esAdminRole,
    validarCampos
],deleteCategoria );

module.exports = router;
