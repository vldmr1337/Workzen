const express = require('express');
const router = express.Router();
const jobController = require('../controllers/vagaController');
const authMiddleware = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Rotas para as empresas gerenciarem suas vagas
router.post('/create', authMiddleware, authorize('empresa'), jobController.createJob);
router.get('/companyJobs', authMiddleware, authorize('empresa'), jobController.getCompanyJobs);
router.get('/get/:jobId', authMiddleware, jobController.getJobDetails);
router.put('/update/:jobId', authMiddleware, authorize('empresa'), jobController.updateJob);
router.delete('/delete/:jobId', authMiddleware, authorize('empresa'), jobController.deleteJob);

// Rota para listar os candidatos a uma vaga
router.get('/:jobId/applicants', authMiddleware, authorize('empresa'), jobController.getApplicants);

// Rota para os usuários se inscreverem em vagas
router.post('/:jobId/apply', authMiddleware, authorize('usuario'), jobController.applyToJob);
// Rota para buscar vagas por tags
router.get('/search', jobController.searchJobsByTag);

module.exports = router;

