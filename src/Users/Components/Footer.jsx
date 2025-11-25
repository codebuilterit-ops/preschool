import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeImage from '../../assets/User/user';

const Footer = () => {
  return (
    <footer className="bg-slate-800/50 py-12 px-4 md:px-8 lg:px-16 mt-16 merriweather-regular">
      <div className="max-w-7xl mx-auto">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* === Column 1: Brand & Tagline === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
           <img src={HomeImage.logo} alt='' className='w-48' />
            <p className="text-gray-600 mt-2 text-sm">
              Helping parents find magical early learning homes since 2025
            </p>
          </motion.div>

          {/* === Column 2: Quick Links === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl  text-black mb-4">Explore</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link to="/" className="text-gray-700 hover:text-amber-600 transition">Home</Link></li>
              <li><Link to="/preschools" className="text-gray-700 hover:text-amber-600 transition">Find Preschools</Link></li>
              <li><Link to="/about" className="text-gray-700 hover:text-amber-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-amber-600 transition">Contact</Link></li>
            </ul>
          </motion.div>

          {/* === Column 3: Contact Info === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl  text-black mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-5 h-5 text-pink-600" />
                <span className="text-gray-700">info@lankapreschool.lk</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">+94 77 123 4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Colombo 07, Sri Lanka</span>
              </div>
            </div>

            {/* Social Icons */}
           
          </motion.div>
        </div>

      
      </div>
    </footer>
  );
};

export default Footer;