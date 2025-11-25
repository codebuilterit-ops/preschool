import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Trash2,
  AlertCircle,
  CheckCircle,
  Play,
} from "lucide-react";
import adsApi from "../../api/adsApi";
import { getPendingUsers, approveUser } from "../../api/adminapi";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [ads, setAds] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchAds();
      fetchPendingUsers();
    }
  }, [navigate]);

  const fetchPendingUsers = async () => {
    setUserLoading(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await getPendingUsers(token);
      setPendingUsers((res.data || []).filter((u) => u.status === "pending"));
    } catch (err) {
      showAlert("error", "Failed to load pending users");
    } finally {
      setUserLoading(false);
    }
  };

  const handleApproveUser = async (id) => {
    const token = localStorage.getItem("admin_token");
    try {
      await approveUser(id, token);
      showAlert("success", "User approved successfully");
      fetchPendingUsers();
    } catch (err) {
      showAlert("error", "Failed to approve user");
    }
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await adsApi.getAds();
      setAds(res.data.data || []);
    } catch (err) {
      showAlert("error", "Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 4000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover" || e.type === "dragenter") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length !== fileList.length) {
      showAlert(
        "error",
        "Some files were skipped. Only images and videos are allowed."
      );
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return navigate("/admin/login");
    if (files.length === 0)
      return showAlert("error", "Please select at least one file");

    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    setUploading(true);

    try {
      // debug: show form entries
      try {
        console.debug("File upload form entries:", Array.from(form.entries()));
      } catch (e) {
        console.debug("Could not read form entries", e);
      }

      await adsApi.adminUploadAds(form, token);
      setFiles([]);
      document.getElementById("file-input").value = "";
      fetchAds();
      showAlert(
        "success",
        `${files.length} advertisement(s) uploaded successfully!`
      );
    } catch (err) {
      console.error("Upload error:", err);
      if (err?.response) {
        console.error("Upload response data:", err.response.data);
        console.error("Upload response status:", err.response.status);
      }
      const msg =
        err?.response?.data?.message || err?.message || "Upload failed";
      showAlert("error", msg);
    } finally {
      setUploading(false);
    }
  };

  const handleYoutubeUpload = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return navigate("/admin/login");
    if (!youtubeLink || youtubeLink.trim() === "")
      return showAlert("error", "Please paste at least one YouTube link");

    const body = { youtubeLink: youtubeLink.trim() };

    setUploading(true);
    try {
      console.debug("Posting YouTube JSON body:", body);
      // Use the separate YouTube collection endpoint
      await adsApi.adminUploadYouTubeSeparate(body, token);
      setYoutubeLink("");
      fetchAds();
      showAlert("success", "YouTube link(s) added successfully");
    } catch (err) {
      console.error("YouTube upload error:", err);
      if (err?.response) {
        console.error("YouTube upload response data:", err.response.data);
        console.error("YouTube upload response status:", err.response.status);
      }
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add YouTube link(s)";
      showAlert("error", msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title || "this ad"}"?`
      )
    )
      return;

    const token = localStorage.getItem("admin_token");
    try {
      await adsApi.adminDeleteAd(id, token);
      fetchAds();
      showAlert("success", "Advertisement deleted successfully");
    } catch (err) {
      showAlert("error", "Failed to delete advertisement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Notification */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white transition-all animate-slide-in ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Pending Users Approval Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Pending User Approvals
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin/youtube")}
                className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-amber-200"
              >
                View All YouTube Videos
              </button>
           
            <button
              onClick={() => navigate("/admin/all-accounts")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              View All Accounts
            </button>
             </div>
          </div>

          {userLoading ? (
            <p className="text-gray-500">Loading pending users...</p>
          ) : pendingUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No pending users for approval
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-6 font-medium text-gray-700">
                      Preschool Name
                    </th>
                    <th className="py-3 px-6 font-medium text-gray-700">
                      District
                    </th>
                    <th className="py-3 px-6 font-medium text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-6 font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="py-3 px-6 font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{user.preschoolname}</td>
                      <td className="py-4 px-6">{user.district}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.phonenumber}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Advertisement Management */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Advertisement Management
          </h1>
          <p className="text-gray-600 mt-2">
            Upload and manage promotional images & videos
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Images & Videos
          </h2>

          <div
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? "border-amber-500 bg-amber-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-medium text-gray-700">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, GIF, MP4, WebM (Max 50MB each)
            </p>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                        <Video className="text-gray-500" size={36} />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-xs text-gray-600 mt-2 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setFiles([]);
                    document.getElementById("file-input").value = "";
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-8 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-70 flex items-center gap-2"
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      Upload {files.length} File{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* YouTube Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add YouTube Video(s)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Paste one or more YouTube URLs (one per line or separated by commas)
          </p>
          <textarea
            placeholder="https://youtu.be/dQw4w9WgXcQ&#10;https://www.youtube.com/watch?v=abc123"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setYoutubeLink("")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleYoutubeUpload}
              disabled={uploading || !youtubeLink.trim()}
              className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-70 flex items-center gap-2"
            >
              {uploading ? "Adding..." : "Add YouTube Link(s)"}
            </button>
          </div>
        </div>

        {/* Current Advertisements */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Current Advertisements ({ads.length})
            </h2>
            <button
              onClick={fetchAds}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 border-2 border-dashed rounded-xl h-64 animate-pulse"
                />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <ImageIcon className="mx-auto text-gray-400 mb-4" size={72} />
              <p className="text-xl text-gray-600">No advertisements yet</p>
              <p className="text-gray-400 mt-2">
                Upload your first ad to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video bg-gray-900">
                    {ad.resource_type === "image" ? (
                      <img
                        src={ad.mediaUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : ad.resource_type === "video" ? (
                      <video
                        src={ad.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      />
                    ) : ad.resource_type === "youtube" ? (
                      <a
                        href={ad.youtubeLink || ad.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block relative"
                      >
                        <img
                          src={ad.mediaUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Play
                            size={56}
                            className="text-white drop-shadow-2xl"
                          />
                        </div>
                      </a>
                    ) : null}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(ad._id, ad.title)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 truncate">
                      {ad.title || "Untitled"}
                    </h3>
                    {ad.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {ad.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1">
                        {ad.resource_type === "image" ? (
                          <ImageIcon size={14} />
                        ) : ad.resource_type === "video" ? (
                          <Video size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                        {ad.resource_type}
                      </span>
                      <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
