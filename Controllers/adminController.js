// Block a preschool (admin-only)
export const blockPreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await PreSchool.findOne({ id });
    if (!user) return res.status(404).json({ message: "Preschool not found" });
    if (user.status === "blocked") {
      return res.status(400).json({ message: "Already blocked" });
    }
    user.status = "blocked";
    await user.save();
    res.json({ message: "Preschool blocked", id });
  } catch (err) {
    console.error("blockPreschool error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Unblock a preschool (admin-only, sets to approved)
export const unblockPreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await PreSchool.findOne({ id });
    if (!user) return res.status(404).json({ message: "Preschool not found" });
    if (user.status !== "blocked") {
      return res.status(400).json({ message: "User is not blocked" });
    }
    user.status = "approved";
    await user.save();
    res.json({ message: "Preschool unblocked and approved", id });
  } catch (err) {
    console.error("unblockPreschool error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Approve a pending preschool (admin-only)
export const approvePreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await PreSchool.findOne({ id });
    if (!user) return res.status(404).json({ message: "Preschool not found" });
    if (user.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }
    user.status = "approved";
    await user.save();
    res.json({ message: "Preschool approved", id });
  } catch (err) {
    console.error("approvePreschool error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
import jwt from "jsonwebtoken";
import PreSchool from "../Schema/ProfileUser.js";

// Admin login - returns JWT with isAdmin flag
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: "Admin not configured" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { isAdmin: true, email: adminEmail },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  res.json({ token });
};

// List all preschools (admin-only)
export const listPreschools = async (req, res) => {
  try {
    const profiles = await PreSchool.find({}, "-password -__v").lean();
    res.json(profiles);
  } catch (err) {
    console.error("listPreschools error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a preschool by id (admin-only)
export const deletePreschool = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await PreSchool.findByIdAndDelete(id);
    if (!removed)
      return res.status(404).json({ message: "Preschool not found" });
    res.json({ message: "Preschool deleted", id });
  } catch (err) {
    console.error("deletePreschool error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin stats (example)
export const getStats = async (req, res) => {
  try {
    const total = await PreSchool.countDocuments();
    res.json({ totalPreschools: total });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
