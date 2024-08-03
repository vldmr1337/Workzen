// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/userController');
const loginEmpresa = require('../controllers/empresaController');

router.post('/user/login', loginUser.login);
router.post('/empresa/login', loginEmpresa.login);
module.exports = router;
