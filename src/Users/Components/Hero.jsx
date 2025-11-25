import React from 'react';
import { motion } from 'framer-motion';
import HomeImage from '../../assets/User/user';
import { Link } from 'react-router-dom';
const text = "Discover the Best Preschools ";

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <img
        src={HomeImage.hero}
        alt="Preschool Hero"
        className="w-full h-auto object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {/* Main Animated Heading - Centered */}
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-600 drop-shadow-lg max-w-4xl px-4 text-center merriweather-regular">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Sub Header - Left Aligned */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: text.length * 0.05 + 0.5, duration: 0.8, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-left self-start ml-8 md:ml-16 lg:ml-24"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
            Find the Perfect Start for Your Child
          </h2>
          <p className="text-base md:text-lg text-gray-200 mt-2 leading-relaxed">
            Trusted preschools • Expert guidance • Safe & nurturing environments
          </p>
        </motion.div>

        {/* Optional CTA or description below (centered again if needed) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: text.length * 0.05 + 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-green-600 mt-8 drop-shadow-md max-w-xl "
        >
          Explore amazing things with us <br/>
          <Link to="/preschool" >
           <button className="bg-amber-500 hover:bg-amber-600 mt-4 text-black font-semibold rounded-2xl shadow-lg w-28 h-10 transform transition-all duration-200 hover:scale-105 active:scale-95 hover:cursor-pointer">
          View
        </button>
        </Link>
        </motion.p>

        
      </div>
    </div>
  );
};

export default Hero;