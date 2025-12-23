const historyService = require('../services/history.service');
const aiAnalysisService = require('../services/aiAnalysis.service');

class HistoryController {
  /**
   * Upload and analyze image
   * POST /api/history/analyze
   */
  async analyzeImage(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const { buffer, originalname } = req.file;
      const userId = req.user.uid;

      // Validate file size (max 10MB)
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum 10MB allowed.'
        });
      }

      // Process image analysis
      const analysisResult = await aiAnalysisService.processImageAnalysis(
        buffer, 
        originalname, 
        userId
      );

      // Save to history
      const historyEntry = await historyService.createHistory(userId, analysisResult);

      res.status(200).json({
        success: true,
        message: 'Image analyzed successfully',
        data: {
          id: historyEntry.id,
          prediction: analysisResult.modelResult,
          originalImageUrl: analysisResult.uploadImageUrl,
          heatmapImageUrl: analysisResult.modelGradCamPng,
          // reasoning: analysisResult.llmReasoning,
          metadata: analysisResult.imageMeta,
          analyzedAt: {
            date: analysisResult.date,
            time: analysisResult.time
          }
        }
      });

    } catch (error) {
      console.error('Analysis error:', error.message);
      
      // Handle specific error types
      if (error.message.includes('AI analysis failed')) {
        return res.status(503).json({
          success: false,
          message: 'AI analysis service is currently unavailable. Please try again later.'
        });
      }

      if (error.message.includes('Cloudinary upload failed')) {
        return res.status(503).json({
          success: false,
          message: 'Image upload failed. Please try again.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during image analysis'
      });
    }
  }

  /**
   * Get user's analysis history
   * GET /api/history
   */
  async getHistory(req, res) {
    try {
      const userId = req.user.uid;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      const result = await historyService.getUserHistory(userId, limit, offset);

      res.status(200).json({
        success: true,
        data: {
          history: result.history,
          pagination: {
            currentPage: page,
            limit: limit,
            hasMore: result.hasMore,
            total: result.history.length
          }
        }
      });

    } catch (error) {
      console.error('Get history error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve history'
      });
    }
  }

  /**
   * Get specific history entry
   * GET /api/history/:id
   */
  async getHistoryById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      const historyEntry = await historyService.getHistoryById(id, userId);

      if (!historyEntry) {
        return res.status(404).json({
          success: false,
          message: 'History entry not found'
        });
      }

      res.status(200).json({
        success: true,
        data: historyEntry
      });

    } catch (error) {
      console.error('Get history by ID error:', error.message);
      
      if (error.message.includes('Unauthorized access')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve history entry'
      });
    }
  }

  /**
   * Delete history entry
   * DELETE /api/history/:id
   */
  async deleteHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      const deleted = await historyService.deleteHistory(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'History entry not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'History entry deleted successfully'
      });

    } catch (error) {
      console.error('Delete history error:', error.message);
      
      if (error.message.includes('Unauthorized access')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete history entry'
      });
    }
  }

  /**
   * Get user statistics
   * GET /api/history/stats
   */
  async getStats(req, res) {
    try {
      const userId = req.user.uid;
      
      // Get all user history to calculate stats
      const { history } = await historyService.getUserHistory(userId, 1000); // Get up to 1000 entries

      const stats = {
        totalAnalyses: history.length,
        aiGenerated: history.filter(h => 
          h.modelResult.toLowerCase().includes('ai') || 
          h.modelResult.toLowerCase().includes('generated')
        ).length,
        realImages: history.filter(h => 
          h.modelResult.toLowerCase().includes('real') || 
          h.modelResult.toLowerCase().includes('authentic')
        ).length,
        lastAnalysis: history.length > 0 ? history[0].createdAt : null
      };

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get stats error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics'
      });
    }
  }
}

module.exports = new HistoryController();