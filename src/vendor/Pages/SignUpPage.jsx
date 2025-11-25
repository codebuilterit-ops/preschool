import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, School, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import HomeImage from "../../assets/User/user";
import { registerUser } from "../../api/auth.js";
import { toast } from "react-toastify";

// Sri Lankan Districts
const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Moneragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    preschoolname: "",
    district: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Simple frontend validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.preschoolname.trim())
      newErrors.preschoolname = "Preschool name is required";
    if (!formData.district) newErrors.district = "Please select a district";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phonenumber.trim())
      newErrors.phonenumber = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        preschoolname: formData.preschoolname,
        district: formData.district,
        email: formData.email,
        password: formData.password,
        phonenumber: formData.phonenumber,
      };

      await registerUser(payload);
      toast.success(
        "Registration request sent! Await admin approval before logging in."
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-200/50 flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* LEFT ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="hidden lg:flex items-center justify-center p-8 bg-emerald-200"
        >
          <img
            src={HomeImage.login}
            alt="Happy preschool teacher"
            className="sm:w-72 w-32 object-contain"
          />
        </motion.div>

        {/* SIGNUP FORM */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
        >
          <div className="text-center mb-8">
           
            <img src={HomeImage.logo} alt="" className="w-32 sm:w-52 items-center mb-4 sm:ml-12"/>
          
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Preschool Name */}
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="text"
                name="preschoolname"
                value={formData.preschoolname}
                onChange={handleChange}
                placeholder="Preschool Name"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.preschoolname ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.preschoolname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.preschoolname}
                </p>
              )}
            </div>

            {/* District */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none ${
                  errors.district ? "border-red-400" : "border-gray-200"
                }`}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-xs mt-1">{errors.district}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.phonenumber ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.phonenumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phonenumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.password ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-orange-500 disabled:opacity-70 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
