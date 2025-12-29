import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { historyAPI } from "../services/api";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a JPG, PNG, or WebP image");
      return;
    }

    // Check file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size too large. Maximum 10MB allowed.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await historyAPI.analyzeImage(formData);
      setResult(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const viewHistory = () => {
    navigate("/history");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Upload Image for Analysis
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                file ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />

              {preview ? (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="text-5xl mb-4">📷</div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    JPG, PNG, or WebP (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Analysis Results
          </h2>

          {result ? (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className={`text-5xl mb-4 ${
                    result.prediction?.toLowerCase().includes("ai")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {result.prediction?.toLowerCase().includes("ai")
                    ? "🤖"
                    : "✅"}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {result.prediction}
                </div>
              </div>

              {result.originalImageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Original Image</h3>
                  <img
                    src={result.originalImageUrl}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {result.heatmapImageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Heatmap Analysis</h3>
                  <img
                    src={result.heatmapImageUrl}
                    alt="Heatmap"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {result.metadata && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Image Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <div className="font-medium">
                        {result.metadata.width} × {result.metadata.height}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <div className="font-medium">
                        {result.metadata.sizeKB} KB
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Format:</span>
                      <div className="font-medium">
                        {result.metadata.format}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Analyzed:</span>
                      <div className="font-medium">
                        {result.analyzedAt?.date} {result.analyzedAt?.time}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={viewHistory}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
              >
                View All Analyses
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600">
                Upload an image to see analysis results here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Upload Guidelines</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Maximum file size: 10MB</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• Clear, well-lit images work best</li>
          <li>• Avoid heavily compressed images</li>
          <li>• You can upload up to 3 images per day</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
