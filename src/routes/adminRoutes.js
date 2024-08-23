const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.post('/login', adminController.login);

router.use(authMiddleware, authorize('admin'));

router.get('/users', adminController.viewUsers);

router.get('/companies', adminController.viewCompanies);

router.post('/approve-user', adminController.acceptUser);

router.post('/approve-company', adminController.acceptCompany);

module.exports = router;
