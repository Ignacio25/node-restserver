const { Router } = require('express');
const { body, param } = require('express-validator');
const { 
    getProductos,
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto 
} = require('../controllers/producto.controller');
const { existProducto, existCategoria } = require('../helpers/db-validators');
const {
    validarCampos, 
    validarJWT,
    esAdminRole
} = require('../middlewares');

const router = Router();

router.get('/', getProductos);

router.get('/:id', [
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existProducto ),
    validarCampos
] ,getProducto );

router.post('/', [
    validarJWT,
    body('nombre','Nombre es obligatorio').not().isEmpty(),
    body('categoria').custom( existCategoria),
    validarCampos
],createProducto );

router.put('/:id', [
    validarJWT,
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existProducto ),
    body('nombre','Nombre es obligatorio').not().isEmpty(),
    body('categoria').custom( existCategoria),
    validarCampos
],updateProducto );

router.delete('/:id', [
    validarJWT,
    param('id','No es un id valido').isMongoId(),
    param('id').custom( existProducto ),
    esAdminRole,
    validarCampos
],deleteProducto );

module.exports = router;
