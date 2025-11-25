import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import SearchBar from "../Components/SearchBar";
import { Link } from "react-router-dom";
import { getPublicProfiles } from "../../api/profileapi";

const districts = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha",
  "Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala",
  "Mannar","Matale","Matara","Moneragala","Mullaitivu","Nuwara Eliya",
  "Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya",
];

const PreSchool = () => {
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await getPublicProfiles();
        setProfiles(res.data || []);
      } catch (err) {
        console.error("Failed to fetch public profiles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleDistrictSelect = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const filteredProfiles = profiles
    .filter((p) =>
      selectedDistricts.length > 0 ? selectedDistricts.includes(p.district) : true
    )
    .filter((p) => {
      const name = (p.preschoolname || p.name || "").toLowerCase();
      return name.includes(searchTerm.trim().toLowerCase());
    });

  return (
    <div className="bg-purple-300/50 min-h-screen p-4 md:p-8">

      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search preschool..."
      />

      {/* MOBILE FILTER BUTTON */}
      <div className="flex md:hidden justify-end mt-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaFilter /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">

        {/* ---------- FILTER SIDEBAR ---------- */}
        <div
          className={`
            md:w-1/4 bg-white md:block rounded-2xl shadow p-4 
            ${showFilters ? "block" : "hidden"} md:block
          `}
        >
          <h2 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
            <FaFilter /> Filters
          </h2>

          <p className="text-slate-700 text-sm mb-3">Districts</p>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {districts.map((district) => (
              <label
                key={district}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-amber-500"
                  checked={selectedDistricts.includes(district)}
                  onChange={() => handleDistrictSelect(district)}
                />
                <span className="text-slate-800">{district}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ---------- RESULT CARDS ---------- */}
        <div className="flex-1 bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Find Preschools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-16">Loading...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-gray-600">
                No preschools found.
              </div>
            ) : (
              filteredProfiles.map((p) => (
                <Link
                  key={p._id || p.id}
                  to={`/preschool/${encodeURIComponent(p._id || p.id)}`}
                  className="block"
                >
                  <div className="bg-gray-50 rounded-2xl overflow-hidden shadow hover:shadow-xl transition">
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={p.coverImage || "/default-cover.jpg"}
                        alt={p.preschoolname || p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {p.preschoolname || p.name}
                      </h3>
                      <p className="text-sm text-slate-600">{p.district}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSchool;
