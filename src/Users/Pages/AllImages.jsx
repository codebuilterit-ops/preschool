import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicProfile } from "../../api/profileapi";

const AllImages = () => {
  const { preschoolId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getPublicProfile(preschoolId);
        const profile = res.data;
        const all = (profile.gallery || []).flatMap((g) => [
          ...(g.images || []),
          ...(g.videos || []),
        ]);
        if (mounted) setPhotos(all);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, [preschoolId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading photos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load photos
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Photos</h1>
          <Link
            to={`/preschool/${preschoolId}`}
            className="text-sm text-blue-600"
          >
            Back to profile
          </Link>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded p-8 text-center text-gray-600">
            No photos available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded overflow-hidden cursor-pointer"
                onClick={() => setSelected(src)}
              >
                {typeof src === "string" &&
                (src.includes(".mp4") || src.includes("video")) ? (
                  <video
                    src={src}
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-full"
            >
              {selected.includes(".mp4") || selected.includes("video") ? (
                <video
                  src={selected}
                  controls
                  className="max-w-full max-h-[90vh] rounded"
                />
              ) : (
                <img
                  src={selected}
                  alt="Selected"
                  className="max-w-full max-h-[90vh] rounded"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllImages;
