import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicProfiles } from "../../api/profileapi";

const PreschoolPreview = () => {
  const [preschools, setPreschools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreschools = async () => {
      try {
        const res = await getPublicProfiles();
        setPreschools((res.data || []).slice(0, 12)); // only first 12
      } catch (err) {
        console.error("Error loading preschools", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreschools();
  }, []);

  return (
    <section className="py-10 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 prata-regular">
            Featured Preschools
          </h2>
          <div className="flex items-center justify-between sm:mt-12 mt-4" >
                <p className="text-slate-600 mt-2">Explore some of the best preschools</p>
                 <Link
            to="/preschools"
            className=" text-yellow-900 hover:text-yellow-600 px-6 py-3 rounded-xl text-lg "
          >
            View More
          </Link>
          </div>
         
        </div>

        {/* Preschool list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-10">Loading...</div>
          ) : (
            preschools.map((p) => (
              <Link
                key={p._id}
                to={`/preschool/${p._id}`}
                className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition block"
              >
                <div className="h-32 sm:h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={p.coverImage || "/default-cover.jpg"}
                    alt={p.preschoolname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 text-center">
                    {p.preschoolname}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
         
        </div>
      </div>
    </section>
  );
};

export default PreschoolPreview;
