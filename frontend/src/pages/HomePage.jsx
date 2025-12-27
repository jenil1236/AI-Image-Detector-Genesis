import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { historyAPI } from "../services/api";

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        historyAPI.getStats(),
        historyAPI.getHistory(5, 1),
      ]);

      setStats(statsRes.data.data);
      setRecentHistory(historyRes.data.data.history);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Image Detector
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Detect AI-generated images with our advanced machine learning model.
          Upload any image to check if it was created by AI or is authentic.
        </p>
        <Link
          to="/upload"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Upload Image Now
        </Link>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalAnalyses}
            </div>
            <div className="text-gray-700">Total Analyses</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.realImages}
            </div>
            <div className="text-gray-700">Real Images</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.aiGenerated}
            </div>
            <div className="text-gray-700">AI Generated</div>
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Analyses</h2>
          <Link
            to="/history"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {recentHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No analyses yet. Upload your first image!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-600">Result</th>
                  <th className="text-left py-3 text-gray-600">Date</th>
                  <th className="text-left py-3 text-gray-600">Size</th>
                  <th className="text-left py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
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
                    <td className="py-4 text-gray-700">
                      {item.date} {item.time}
                    </td>
                    <td className="py-4 text-gray-700">
                      {item.imageMeta?.sizeKB} KB
                    </td>
                    <td className="py-4">
                      <Link
                        to={`/history/${item.id}`}
                        className="text-blue-600 hover:text-blue-700 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            <p className="text-gray-600">
              Upload any image (JPG, PNG, WebP) up to 10MB
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our model analyzes the image using advanced pattern recognition
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600">
              Receive detailed analysis with heatmap visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
