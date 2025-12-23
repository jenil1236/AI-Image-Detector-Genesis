const express = require('express');
const { verifyFirebaseToken } = require('../middlewares/auth.middlewares');
const { upload, handleMulterError } = require('../middlewares/upload.middleware');
const historyController = require('../controllers/history.controller');

const router = express.Router();

// All routes require authentication
router.use(verifyFirebaseToken);

/**
 * @route   POST /api/history/analyze
 * @desc    Upload and analyze image
 * @access  Private
 */
router.post('/analyze', 
  upload.single('image'), 
  handleMulterError,
  historyController.analyzeImage
);

/**
 * @route   GET /api/history
 * @desc    Get user's analysis history with pagination
 * @access  Private
 * @query   limit (optional) - Number of entries per page (default: 10)
 * @query   page (optional) - Page number (default: 1)
 */
router.get('/', historyController.getHistory);

/**
 * @route   GET /api/history/stats
 * @desc    Get user's analysis statistics
 * @access  Private
 */
router.get('/stats', historyController.getStats);

/**
 * @route   GET /api/history/:id
 * @desc    Get specific history entry by ID
 * @access  Private
 */
router.get('/:id', historyController.getHistoryById);

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete specific history entry
 * @access  Private
 */
router.delete('/:id', historyController.deleteHistory);

module.exports = router;