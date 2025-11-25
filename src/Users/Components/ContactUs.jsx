import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import HomeImage from '../../assets/User/user';

const ContactUs = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Layout */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT SIDE – CONTACT DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full"
          >
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">
                Contact Us
              </h2>
              <p className="text-lg text-blue-700 font-medium">
                We love helping little stars find their perfect preschool
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Email */}
              <ContactCard
                icon={<Mail className="w-8 h-8 text-pink-600" />}
                title="Email Us"
                text="info@lankapreschool.lk"
              />

              {/* Phone */}
              <ContactCard
                icon={<Phone className="w-8 h-8 text-blue-600" />}
                title="Call Us"
                text="+94 77 123 4567"
              />

              {/* Address */}
              <ContactCard
                icon={<MapPin className="w-8 h-8 text-green-600" />}
                title="Visit Us"
                text="Colombo 07, Sri Lanka"
              />

              {/* Hours */}
              <ContactCard
                icon={<Clock className="w-8 h-8 text-yellow-600" />}
                title="We’re Open"
                text={
                  <>
                    <p>Mon – Fri: 9 AM – 5 PM</p>
                    <p>Sat: 10 AM – 2 PM</p>
                  </>
                }
              />

            </div>
          </motion.div>

          {/* RIGHT SIDE – IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full flex justify-center"
          >
            <img
              src={HomeImage.contact}
              alt="Preschool Kids"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain"
              loading="lazy"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* --- Contact Card Component for Cleaner Code --- */
const ContactCard = ({ icon, title, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
    className="p-5 rounded-3xl shadow-lg bg-white text-center"
  >
    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-black mb-1">{title}</h3>
    <div className="text-black font-semibold text-sm">{text}</div>
  </motion.div>
);

export default ContactUs;
