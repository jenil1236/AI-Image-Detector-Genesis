import { useState, useEffect } from "react";
import { historyAPI } from "../services/api";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [page]);

  const fetchHistory = async () => {
    try {
      const response = await historyAPI.getHistory(10, page);
      if (page === 1) {
        setHistory(response.data.data.history);
      } else {
        setHistory((prev) => [...prev, ...response.data.data.history]);
      }
      setHasMore(response.data.data.pagination.hasMore);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await historyAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis?"))
      return;

    setDeletingId(id);
    try {
      await historyAPI.deleteHistory(id);
      setHistory(history.filter((item) => item.id !== id));
      if (stats) {
        setStats({
          ...stats,
          totalAnalyses: stats.totalAnalyses - 1,
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete analysis");
    } finally {
      setDeletingId(null);
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Analysis History
      </h1>
      <p className="text-gray-600 mb-8">
        View all your previous image analyses
      </p>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalAnalyses}
            </div>
            <div className="text-gray-700">Total Analyses</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.realImages}
            </div>
            <div className="text-gray-700">Real Images</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.aiGenerated}
            </div>
            <div className="text-gray-700">AI Generated</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              Last Analysis
            </div>
            <div className="text-lg font-semibold">
              {stats.lastAnalysis
                ? new Date(stats.lastAnalysis).toLocaleDateString()
                : "None"}
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No Analysis History</h3>
          <p className="text-gray-600 mb-6">
            You haven't analyzed any images yet. Upload your first image to get
            started!
          </p>
          <a
            href="/upload"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Upload Image
          </a>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Result
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Details
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        {item.uploadImageUrl ? (
                          <img
                            src={item.uploadImageUrl}
                            alt="Analysis"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.modelResult?.toLowerCase().includes("ai")
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.modelResult}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        <div>{item.date}</div>
                        <div className="text-sm text-gray-500">{item.time}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          <div>Size: {item.imageMeta?.sizeKB || "N/A"} KB</div>
                          <div>Format: {item.imageMeta?.format || "N/A"}</div>
                          <div>
                            Dimensions: {item.imageMeta?.width || "N/A"} ×{" "}
                            {item.imageMeta?.height || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <a
                            href={item.uploadImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
