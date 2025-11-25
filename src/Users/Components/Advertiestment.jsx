import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adsApi from "../../api/adsApi";

const Advertisement = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await adsApi.getAds();
      setAds(res.data.data || []);
    } catch (err) {
      console.error("Failed to load ads", err);
    }
  };

  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-3 merriweather-regular">
            
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover top-rated preschools with nurturing environments and joyful
            learning experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {ads.slice(0, 2).map((ad, idx) => (
            <motion.div
              key={ad._id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {ad.resource_type === "image" ? (
                <img
                  src={ad.mediaUrl}
                  alt={ad.title || "Advertisement"}
                  className="w-full h-[60vh] md:h-[70vh] object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <video
                  src={ad.mediaUrl}
                  className="w-full h-[60vh] md:h-[70vh] object-cover"
                  controls
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-semibold">
                  {ad.title || "Sponsored"}
                </h3>
                <p className="text-sm mt-1 opacity-90">
                  {ad.description || ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
