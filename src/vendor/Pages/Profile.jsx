import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/SchoolContext";
import {
  getProfile,
  updateProfile,
  uploadGallery,
  uploadProfileImage,
  deleteGallery,
  setGalleryPrivacy,
} from "../../api/profileapi";
import { Upload, Edit, Camera, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { token, logout } = useContext(AuthContext);
  // Delete account handler
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    try {
      setLoading(true);
      await deleteGallery(token, "all"); // Optionally delete all galleries first (if needed)
      await import("../../api/profileapi").then(({ deleteAccount }) =>
        deleteAccount(token)
      );
      alert("Your account has been deleted.");
      if (logout) logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err, err?.response?.data);
      alert(err?.response?.data?.message || "Account deletion failed");
    } finally {
      setLoading(false);
    }
  };
  const [profile, setProfile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFile, setGalleryFile] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [folderName, setFolderName] = useState("default");
  const [folderDescription, setFolderDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDebugProfile, setShowDebugProfile] = useState(false);

  const [formData, setFormData] = useState({});
  const [privacyLoading, setPrivacyLoading] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setProfile(res.data);
        setFormData({
          description: res.data.description || "",
          openTime: res.data.openTime || "",
          closedTime: res.data.closedTime || "",
          monthlyFee: res.data.monthlyFee || "",
          whyYouImportant: res.data.whyYouImportant?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const updated = {
        ...formData,
        whyYouImportant: formData.whyYouImportant
          .split(",")
          .map((x) => x.trim()),
      };

      const res = await updateProfile(token, updated);
      setProfile(res.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // upload gallery files and optional cover image (added to coderImage folder)
  const handleUploadGallery = async () => {
    if (!folderName.trim()) return alert("Album name is required.");
    if (!coverImageFile) return alert("Album cover image is required.");
    if (!galleryFile || galleryFile.length === 0)
      return alert("Add at least one image or video to the album.");

    try {
      setLoading(true);
      const fd = new FormData();
      galleryFile.forEach((f) => fd.append("file", f));
      fd.append("folderName", folderName);
      if (folderDescription) fd.append("description", folderDescription);
      fd.append("coverImage", coverImageFile); // send cover image as separate field

      console.log("Uploading album:", {
        files: galleryFile.map((f) => f.name),
        cover: coverImageFile.name,
        folderName,
        folderDescription,
      });
      const res = await uploadGallery(token, fd);
      if (res.data?.uploaded) {
        console.log("uploaded album:", res.data.uploaded);
      }

      // refresh profile
      try {
        const refreshed = await getProfile(token);
        setProfile(refreshed.data);
      } catch (refreshErr) {
        console.warn("Could not refresh profile after upload", refreshErr);
      }

      // cleanup
      setGalleryFile([]);
      galleryPreviews.forEach((p) => URL.revokeObjectURL(p.url));
      setGalleryPreviews([]);
      setCoverImageFile(null);
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      setCoverImagePreview(null);
      setFolderDescription("");
    } catch (err) {
      console.error(err, err.response?.data);
      alert(err.response?.data?.message || "Gallery Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [galleryPreviews]);

  if (!profile)
    return (
      <p className="text-center mt-20 text-lg text-gray-600">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-purple-300/50 md:p-8">
      <div className="relative w-full md:h-80 h-64 rounded-3xl overflow-hidden shadow-lg">
        <img
          src={coverPreview || profile.coverImage || "/default-cover.jpg"}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-6 left-8 text-black prata-regular bg-green-300/70 px-8 py-2 rounded-lg">
          <h1 className="text-4xl font-bold drop-shadow-xl">
            {profile.preschoolname}
          </h1>
          
        </div>

        <label
          className={`absolute bottom-5 right-5 px-4 py-2 rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition ${
            loading
              ? "bg-gray-400/60 pointer-events-none"
              : "bg-amber-600/90 hover:bg-amber-700"
          }`}
        >
          <Camera className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">
            {loading ? "Uploading..." : "Change Cover"}
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setCoverPreview(url);
              try {
                setLoading(true);

                // Upload the cover and add it to the coderImage gallery so it's persisted
                const fd = new FormData();
                fd.append("file", file);
                fd.append("addAsCoderImage", "true");
                fd.append("coderFolder", "coderImage");

                const res = await uploadGallery(token, fd);
                if (res.data?.profile) setProfile(res.data.profile);
                else {
                  try {
                    const refreshed = await getProfile(token);
                    setProfile(refreshed.data);
                  } catch (err) {
                    console.warn(
                      "Could not refresh profile after cover upload",
                      err
                    );
                  }
                }
              } catch (err) {
                console.error(err, err.response?.data);
                alert(err.response?.data?.message || "Cover upload failed");
              } finally {
                setLoading(false);
              }
            }}
          />
        </label>
            
      </div>


      <div className="flex justify-end mt-4 mr-6 md:mr-14">
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-5 py-2 bg-gray-900 text-white rounded-xl shadow flex items-center gap-2 hover:bg-gray-700"
        >
          <Edit className="w-5 h-5" />
          {editMode ? "Cancel" : "Edit"}
        </button>
        <button
          onClick={() => setShowDebugProfile((s) => !s)}
          className="ml-3 px-4 py-2 bg-gray-200 rounded-xl text-sm"
        >
          {showDebugProfile ? "Hide Debug" : "Show Debug"}
        </button>

           <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="ml-4 px-6 py-3 rounded-xl shadow flex items-center gap-2  text-white hover:bg-red-300"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
      </div>

      <div className=" rounded-3xl  p-6 md:p-8 mt-6 mx-4 md:mx-14 ">
        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 outfit-regular">
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">District:</span>{" "}
              {profile.district}
            </p>
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">Phone:</span>{" "}
              {profile.phonenumber}
            </p>
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">Open Time:</span>{" "}
              {profile.openTime}
            </p>
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">Email:</span>{" "}
              {profile.email}
            </p>
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">Closed Time:</span>{" "}
              {profile.closedTime}
            </p>
            <p className="bg-amber-300/30 px-4 py-2 rounded-xl">
              <span className="font-semibold text-black">Monthly Fee:</span>{" "}
              {profile.monthlyFee}
            </p>
            <p className="col-span-full  bg-white/50 py-4 px-2 rounded-2xl text-slate-800  ">
              <span className="font-semibold text-black outfit-regular">
                Description:
              </span>{" "}
              {profile.description}
            </p>
            <p className="col-span-full  bg-white/50 py-4 px-2 rounded-2xl text-shadow-gray-900 ">
              <span className="font-semibold text-black outfit-regular">
                Why You Important:
              </span>{" "}
              {profile.whyYouImportant?.join(", ")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInput}
              placeholder="Description"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:ring-2 ring-gray-300"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="openTime"
                value={formData.openTime}
                onChange={handleInput}
                placeholder="Open Time"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 focus:ring-2 ring-gray-300"
              />
              <input
                type="text"
                name="closedTime"
                value={formData.closedTime}
                onChange={handleInput}
                placeholder="Closed Time"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 focus:ring-2 ring-gray-300"
              />
            </div>
            <input
              type="text"
              name="monthlyFee"
              value={formData.monthlyFee}
              onChange={handleInput}
              placeholder="Monthly Fee"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:ring-2 ring-gray-300"
            />
            <input
              type="text"
              name="whyYouImportant"
              value={formData.whyYouImportant}
              onChange={handleInput}
              placeholder="Why You Are Important (comma separated)"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:ring-2 ring-gray-300"
            />
            <button
              onClick={handleProfileUpdate}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow transition"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {showDebugProfile && (
        <div className="mx-4 md:mx-14 mt-4 p-4 bg-white rounded shadow overflow-auto max-h-96">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}

      <div className="relative bg-amber-100/50 rounded-3xl shadow p-6 pb-24 md:pb-6 mt-8 mx-4 md:mx-14 flex flex-col gap-4 ">
        <input
          type="text"
          placeholder="Album Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="bg-gray-100 rounded-xl px-4 py-3 mb-2"
        />
        <input
          type="text"
          placeholder="Album Description (optional)"
          value={folderDescription}
          onChange={(e) => setFolderDescription(e.target.value)}
          className="bg-gray-100 rounded-xl px-4 py-3 mb-2"
        />
        <label className="block mb-2 font-medium">Album Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setCoverImageFile(file);
            setCoverImagePreview(file ? URL.createObjectURL(file) : null);
          }}
          className="bg-gray-100 rounded-xl px-4 py-3 mb-2"
        />
        {coverImagePreview && (
          <div className="flex items-center gap-3 mt-3">
            <div className="text-sm font-medium">Album Cover Preview:</div>
            <img
              src={coverImagePreview}
              className="w-32 h-20 object-cover rounded"
            />
          </div>
        )}
        <label className="block mb-2 font-medium">Other Images & Videos</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setGalleryFile(files);
            const previews = files.map((f) => ({
              url: URL.createObjectURL(f),
              type: f.type,
            }));
            setGalleryPreviews(previews);
          }}
          className="bg-gray-100 rounded-xl px-4 py-3 mb-2"
        />
        {galleryPreviews.length > 0 && (
          <div className="flex gap-3 mt-3">
            {galleryPreviews.map((p, i) =>
              p.type.startsWith("video") ? (
                <video
                  key={i}
                  src={p.url}
                  className="w-32 h-20 object-cover rounded"
                  controls
                />
              ) : (
                <img
                  key={i}
                  src={p.url}
                  className="w-32 h-20 object-cover rounded"
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Upload button footer (kept separate so it stays visible on-page) */}
      <div className="mx-4 md:mx-14 mt-4 mb-8">
        <div className="flex justify-end gap-4">
          <button
            onClick={handleUploadGallery}
            disabled={loading}
            aria-busy={loading}
            className={`px-6 py-3 rounded-xl shadow flex items-center gap-2 ${
              loading
                ? "bg-gray-500 text-white cursor-wait"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {loading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Album
              </>
            )}
          </button>
         
        </div>
      </div>

      <div className="mx-4 md:mx-14 mt-10 grid gap-8">
        {(profile.gallery || []).map((folder) => {
          const id = folder.galleryId || folder.folderName;
          return (
            <div key={id} className="relative">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    !confirm(
                      `Delete folder '${folder.folderName}'? This will remove all items in the folder.`
                    )
                  )
                    return;
                  try {
                    setLoading(true);
                    const res = await deleteGallery(token, id);
                    setProfile(res.data);
                  } catch (err) {
                    console.error(err, err.response?.data);
                    alert(err.response?.data?.message || "Delete failed");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="absolute top-3 right-12 z-10 bg-red-100 hover:bg-red-200 p-2 rounded-full shadow"
                title="Delete folder"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
              {/* Privacy toggle button (top-left) */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const fid = id;
                  const currentlyPrivate = !!folder.isPrivate;
                  setPrivacyLoading((s) => ({ ...s, [fid]: true }));
                  try {
                    await setGalleryPrivacy(token, fid, !currentlyPrivate);
                    const refreshed = await getProfile(token);
                    setProfile(refreshed.data);
                  } catch (err) {
                    console.error(
                      "Failed to toggle privacy",
                      err,
                      err?.response?.data
                    );
                    alert(
                      err?.response?.data?.message || "Could not change privacy"
                    );
                  } finally {
                    setPrivacyLoading((s) => ({ ...s, [fid]: false }));
                  }
                }}
                className={`absolute top-3 right-24 z-10 px-3 py-1 rounded-full text-xs font-medium ${
                  folder.isPrivate
                    ? "bg-yellow-600 text-white"
                    : "bg-green-100 text-gray-800"
                }`}
                title={folder.isPrivate ? "Private" : "Public"}
              >
                {privacyLoading[id]
                  ? "..."
                  : folder.isPrivate
                  ? "Private"
                  : "Public"}
              </button>

              <Link to={`/gallery/${encodeURIComponent(id)}`} className="block">
                <div className="bg-rose-200/50 p-6 rounded-3xl shadow  hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-2">
                    {folder.folderName}
                  </h3>
                  {folder.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {folder.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(folder.images || []).slice(0, 8).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-full h-32 object-cover rounded-xl shadow hover:scale-105 transition"
                      />
                    ))}

                    {(folder.videos || []).map((vid, i) => (
                      <video
                        key={i}
                        src={vid}
                        controls
                        className="w-full h-32 rounded-xl shadow hover:scale-105 transition"
                      />
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
