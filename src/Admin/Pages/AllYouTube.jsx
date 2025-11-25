import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adsApi from "../../api/adsApi";
import { Trash2 } from "lucide-react";

const AllYouTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await adsApi.getYouTubeVideos();
      setVideos(res.data.data || []);
    } catch (err) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this YouTube video?")) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return navigate("/admin/login");
    setDeleting(id);
    try {
      await adsApi.adminDeleteYouTube(id, token);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-6">Loading videos...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All YouTube Videos</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-4 py-2 border rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="p-6 text-gray-500">No videos uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v._id} className="bg-white rounded-lg shadow p-3">
              <a href={v.youtubeLink} target="_blank" rel="noreferrer">
                <div className="aspect-video bg-gray-100 mb-3 overflow-hidden rounded">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title || "video"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium truncate">
                    {v.title || "YouTube Video"}
                  </h3>
                  {v.description && (
                    <p className="text-xs text-gray-500">{v.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(v._id)}
                  disabled={deleting === v._id}
                  className="ml-3 text-red-600"
                  title="Delete"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllYouTube;
