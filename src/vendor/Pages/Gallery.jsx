import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/SchoolContext";
import { getProfile, getPublicProfile } from "../../api/profileapi";

const Gallery = () => {
  const { folderId, preschoolId } = useParams();
  const { token } = useContext(AuthContext);

  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        setLoading(true);

        const decoded = decodeURIComponent(folderId || "");

        // If token is present, use owner's profile (private view)
        if (token) {
          const res = await getProfile(token);
          const profile = res.data;
          const found = profile.gallery.find(
            (g) =>
              g.galleryId === folderId ||
              g.galleryId === decoded ||
              g.folderName === folderId ||
              g.folderName === decoded
          );
          setFolder(found || null);
          return;
        }

        // No token (visitor). If preschoolId is provided, fetch public profile
        if (preschoolId) {
          const res = await getPublicProfile(preschoolId);
          const profile = res.data;
          const found = (profile.gallery || []).find(
            (g) =>
              g.galleryId === folderId ||
              g.galleryId === decoded ||
              g.folderName === folderId ||
              g.folderName === decoded
          );
          setFolder(found || null);
          return;
        }

        // No way to fetch folder without either token or preschoolId
        setFolder(null);
      } catch (err) {
        console.error("Error fetching folder:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">Camera</div>
          <p className="text-xl text-gray-600">
            Loading your beautiful memories...
          </p>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            Folder Not Found
          </h1>
         
        </div>
      </div>
    );
  }

  const photos = [...folder.images, ...(folder.videos || [])];
  const title = folder.folderName;

  const items = [...photos];

  if (folder.description && photos.length >= 8) {
    items.splice(8, 0, { type: "desc", content: folder.description });
  }

  const middle = Math.floor(photos.length / 2);
  items.splice(middle, 0, { type: "title", content: title });

  const getCoverImageFromCoderFolder = () => {
    if (!token) return null;

    const coderFolder =
      folder?.gallery?.find((g) => g.folderName === "coderImage") ||
      folder?.gallery?.find((g) => g.galleryId === "coderImage");
    return coderFolder?.images?.[0] || coderFolder?.coverImage;
  };

  // But better & simpler: since you're uploading with addAsCoderImage puts the image in a folder called "coderImage"
  // → just find that folder and use its first image as cover
  const coderCoverImage = folder?.gallery
    ? folder.gallery.find(
        (g) => g.folderName === "coderImage" || g.galleryId === "coderImage"
      )?.images?.[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      

        {/* COVER PHOTO - NOW SHOWS YOUR UPLOADED CODERIMAGE */}
        {photos.length > 0 && (
          <div className="relative w-full h-72 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-12">
            <img
              src={
                // This is the magic line
                coderCoverImage || folder.coverImage
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <h1 className="absolute bottom-10 left-10 text-white text-5xl md:text-7xl font-bold drop-shadow-2xl prata-regular">
              {title}
            </h1>
          </div>
        )}

        {/* Rest of your beautiful design — 100% unchanged */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-6">
          {items.map((item, idx) => {
            if (typeof item !== "string") {
              if (item.type === "title") {
                return (
                  <div
                    key={`title-${idx}`}
                    className="mb-12 break-inside-avoid text-center merriweather-regular"
                  >
                    <p className="text-5xl md:text-7xl font-bold bg-amber-300 bg-clip-text text-transparent py-8 px-4">
                      {item.content}
                    </p>
                  </div>
                );
              }
              return (
                <div
                  key={`desc-${idx}`}
                  className="mb-12 break-inside-avoid text-center px-6"
                >
                  <p className="text-lg md:text-xl italic text-white leading-relaxed max-w-2xl mx-auto ">
                    "{item.content}"
                  </p>
                </div>
              );
            }

            return (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(item)}
                className="mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item}
                  alt={`Memory ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        {/* Lightbox - unchanged */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Fullscreen"
                className="max-w-full max-h-[92vh] rounded-2xl object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white text-5xl font-light hover:text-pink-400"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
