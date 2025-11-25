import React, { useEffect, useState } from "react";
import adsApi from "../../api/adsApi";

const YouTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await adsApi.getYouTubeVideos();
        const all = res.data.data || [];
        // our separate youtube collection stores thumbnails in thumbnailUrl
        const mapped = all.map((v) => ({
          _id: v._id,
          title: v.title,
          description: v.description,
          youtubeLink: v.youtubeLink,
          mediaUrl: v.thumbnailUrl || v.mediaUrl,
          createdAt: v.createdAt,
        }));
        setVideos(mapped);
      } catch (err) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6">Loading videos...</div>;
  if (videos.length === 0)
    return <div className="p-6 text-gray-500">No YouTube videos available</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">YouTube Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((v) => (
          <a
            key={v._id}
            href={v.youtubeLink || v.mediaUrl}
            target="_blank"
            rel="noreferrer"
            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src={v.mediaUrl}
                alt={v.title }
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">
                {v.title }
              </h3>
              {v.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {v.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default YouTube;
