const express = require('express');
const router = express.Router();
const jobController = require('../controllers/vagaController');
const authMiddleware = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.post('/create', authMiddleware, authorize('empresa'), jobController.createJob);
router.get('/companyJobs', authMiddleware, authorize('empresa'), jobController.getCompanyJobs);
router.get('/get/:jobId', authMiddleware, jobController.getJobDetails);
router.put('/update/:jobId', authMiddleware, authorize('empresa'), jobController.updateJob);
router.delete('/delete/:jobId', authMiddleware, authorize('empresa'), jobController.deleteJob);
router.post('/:jobId/accept/:candidateId', authMiddleware, authorize('empresa'), jobController.acceptCandidate);
router.get('/:jobId/applicants', authMiddleware, authorize('empresa'), jobController.getApplicants);
router.post('/:jobId/apply', authMiddleware, authorize('usuario'), jobController.applyToJob);
router.get('/search', jobController.searchJobsByTag);
router.put('/favorite', authMiddleware, authorize('usuario'), jobController.favoriteJobs);
router.get('/all', authMiddleware, jobController.getAllJobs);
router.delete('/favorite/:id', authMiddleware, authorize('usuario'), jobController.unfavoriteJobs);
router.get('/favorite', authMiddleware, authorize('usuario'), jobController.getFavorited);


module.exports = router;

