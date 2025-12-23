const { db } = require("../firebase/admin");

class HistoryService {
  constructor() {
    this.collection = db.collection("history");
  }

  /**
   * Create a new history entry
   */
  async createHistory(userId, historyData) {
    try {
      const docRef = await this.collection.add({
        userId,
        ...historyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        id: docRef.id,
        ...historyData,
      };
    } catch (error) {
      throw new Error(`Failed to create history: ${error.message}`);
    }
  }

  /**
   * Get user's history with pagination
   */
  async getUserHistory(userId, limit = 10, lastDoc = null) {
    try {
      let query = this.collection
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(limit);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      const history = [];

      snapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return {
        history,
        hasMore: snapshot.size === limit,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      throw new Error(`Failed to get user history: ${error.message}`);
    }
  }

  /**
   * Get a specific history entry
   */
  async getHistoryById(historyId, userId) {
    try {
      const doc = await this.collection.doc(historyId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      
      // Verify ownership
      if (data.userId !== userId) {
        throw new Error("Unauthorized access to history entry");
      }

      return {
        id: doc.id,
        ...data,
      };
    } catch (error) {
      throw new Error(`Failed to get history: ${error.message}`);
    }
  }

  /**
   * Delete a history entry
   */
  async deleteHistory(historyId, userId) {
    try {
      const doc = await this.collection.doc(historyId).get();

      if (!doc.exists) {
        return false;
      }

      const data = doc.data();
      
      // Verify ownership
      if (data.userId !== userId) {
        throw new Error("Unauthorized access to history entry");
      }

      await this.collection.doc(historyId).delete();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete history: ${error.message}`);
    }
  }
}

module.exports = new HistoryService();