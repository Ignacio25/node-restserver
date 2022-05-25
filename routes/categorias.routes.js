const { Router } = require('express');
const { body } = require('express-validator');
const { 
    getCategorias, 
    getCategoriaById, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria 
} = require('../controllers/categoria.controller');
const { isValidRole, existEmail, existUserById } = require('../helpers/db-validators');
const {
    validarCampos, 
    validarJWT,
    esAdminRole,
    tieneRol
} = require('../middlewares');

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoriaById );
router.post('/', createCategoria );
router.put('/:id', updateCategoria );
router.delete('/:id', deleteCategoria );

module.exports = router;
