import React from 'react';
import { motion } from 'framer-motion';
import HomeImage from '../../assets/User/user';

const AboutUs = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 flex justify-center"
          >
            <img src={HomeImage.about} alt="About Littlez Illustration" />
          </motion.div>

          {/* Right: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-700 mb-4 leading-tight prata-regular">
              About StarSprout
            </h2>

            <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed outfit-regular">
              <p>
                Welcome to <span className="font-semibold text-amber-600">StarSprout</span>, your guide to finding the best preschools in Sri Lanka.
              </p>

              <p>
                Discover trusted schools, learn about teaching styles like Montessori or Play-Based, and explore fun activities for your child.
              </p>

              <p>
                Stay updated with events like open days, workshops, and festivals to see schools in action.
              </p>

              <p className="italic text-amber-600 font-medium">
                StarSprout helps parents choose a safe, nurturing, and joyful early learning environment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
