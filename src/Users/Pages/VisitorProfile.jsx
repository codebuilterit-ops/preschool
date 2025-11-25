// src/pages/VisitorProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPublicProfile,
  likeGalleryFolderPublic,
} from "../../api/profileapi";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Users,
  Star,
} from "lucide-react";

const VisitorProfile = () => {
  const { preschoolId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedFolders, setLikedFolders] = useState(() => {
    try {
      const raw = localStorage.getItem("liked_folders");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [likingMap, setLikingMap] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPublicProfile(preschoolId);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [preschoolId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        Preschool not found
      </div>
    );

  return (
    <div className="min-h-screen bg-purple-300/60">
      {/* === COVER PHOTO === */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={profile.coverImage || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Preschool Name */}
        <div className="absolute bottom-8 left-8 text-white ">
          <p className="text-xl mt-2 opacity-90 flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            {profile.district} • Preschool
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 right-8 flex gap-3">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-2xl prata-regular text-green-950 bg-amber-200/50 py-4 px-2 rounded-xl">
            {profile.preschoolname}
          </h1>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDEBAR - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-blue-600" />
                About
              </h2>

              <div className="space-y-5 text-gray-700">
                {profile.description && (
                  <p className="leading-relaxed">{profile.description}</p>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{profile.district}, Sri Lanka</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{profile.phonenumber}</span>
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>
                      {profile.openTime} – {profile.closedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span>Monthly Fee: LKR {profile.monthlyFee}</span>
                  </div>
                </div>

                {profile.whyYouImportant?.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Why Parents Choose Us
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.whyYouImportant.map((point, i) => (
                        <span
                          key={i}
                          className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Photos Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6" />
                Photos
              </h3>
              {/* Collect all public images/videos from every gallery */}
              {(() => {
                const photos = (profile.gallery || []).flatMap((g) => [
                  ...(g.images || []),
                  ...(g.videos || []),
                ]);
                const preview = photos.slice(0, 12);

                if (!photos || photos.length === 0) {
                  return (
                    <div className="py-8 text-center text-gray-500">
                      No photos yet. Beautiful memories coming soon!
                    </div>
                  );
                }

                return (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {preview.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
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
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/preschool/${encodeURIComponent(
                        preschoolId
                      )}/photos`}
                      className="block text-center mt-4 text-blue-600 font-medium hover:underline"
                    >
                      See all photos →
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>

          {/* RIGHT SIDE - Gallery Folders (Like Facebook Posts) */}
          <div className="lg:col-span-2 space-y-8">
            {(profile.gallery || []).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">No photos or videos yet</p>
                <p className="text-sm mt-2">Beautiful moments coming soon!</p>
              </div>
            ) : (
              profile.gallery.map((folder) => {
                const allMedia = [
                  ...(folder.images || []),
                  ...(folder.videos || []),
                ];
                const previewImages = allMedia.slice(0, 4);

                return (
                  <div
                    key={folder.galleryId || folder.folderName}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                  >
                    {/* Folder Header */}
                    <div className="p-6 border-b">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {folder.folderName}
                      </h3>
                      {folder.description && (
                        <p className="text-gray-600 mt-1">
                          {folder.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {allMedia.length} items
                      </p>
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-4 bg-gray-50">
                      {previewImages.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden rounded-lg bg-gray-200 cursor-pointer hover:opacity-90 transition"
                        >
                          {src.includes(".mp4") || src.includes("video") ? (
                            <video
                              src={src}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {allMedia.length > 4 && (
                        <div className="aspect-square bg-black/60 flex items-center justify-center text-white text-3xl font-bold rounded-lg">
                          +{allMedia.length - 4}
                        </div>
                      )}
                    </div>

                    {/* View Button */}
                    <div className="p-4 bg-gray-50 border-t">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/gallery/${encodeURIComponent(
                            preschoolId
                          )}/${encodeURIComponent(
                            folder.galleryId || folder.folderName
                          )}`}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View all {allMedia.length} items →
                        </Link>

                        {/* Likes / Heart button for this folder */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={async () => {
                              const fid = folder.galleryId || folder.folderName;
                              const already = likedFolders.includes(fid);
                              // ignore clicks while a request is in flight
                              if (likingMap[fid]) return;
                              setLikingMap((s) => ({ ...s, [fid]: true }));
                              try {
                                const res = await likeGalleryFolderPublic(
                                  preschoolId,
                                  fid,
                                  already ? "unlike" : "like",
                                  undefined
                                );
                                const updatedFolder = res.data.folder;
                                // update profile state (only gallery folder changed)
                                setProfile((p) => {
                                  if (!p) return p;
                                  const newProfile = { ...p };
                                  newProfile.gallery = (
                                    newProfile.gallery || []
                                  ).map((g) =>
                                    g.galleryId === updatedFolder.galleryId ||
                                    g.folderName === updatedFolder.folderName
                                      ? {
                                          ...g,
                                          likes: updatedFolder.likes,
                                          likedBy: updatedFolder.likedBy,
                                        }
                                      : g
                                  );
                                  return newProfile;
                                });

                                // update local likedFolders list
                                setLikedFolders((prev) => {
                                  let next;
                                  if (already)
                                    next = prev.filter((x) => x !== fid);
                                  else next = [...prev, fid];
                                  try {
                                    localStorage.setItem(
                                      "liked_folders",
                                      JSON.stringify(next)
                                    );
                                  } catch (e) {}
                                  return next;
                                });
                              } catch (err) {
                                console.error("Like action failed", err);
                                // show a simple alert so the visitor knows
                                alert(
                                  "Could not record like. Try again later."
                                );
                              } finally {
                                setLikingMap((s) => ({ ...s, [fid]: false }));
                              }
                            }}
                            disabled={
                              !!likingMap[folder.galleryId || folder.folderName]
                            }
                            className={`flex items-center gap-2 ${
                              likingMap[folder.galleryId || folder.folderName]
                                ? "opacity-60 cursor-not-allowed"
                                : "text-red-500 hover:opacity-90"
                            }`}
                            aria-label="Like folder"
                          >
                            <Heart
                              className={`w-6 h-6 ${
                                likedFolders.includes(
                                  folder.galleryId || folder.folderName
                                )
                                  ? "text-red-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="font-medium text-gray-700">
                              {folder.likes || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorProfile;
