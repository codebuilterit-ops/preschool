import PreSchool from "../Schema/ProfileUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

// Register
export const register = async (req, res) => {
  const { email, preschoolname, district, phonenumber, password } = req.body;

  try {
    const existingUser = await PreSchool.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new PreSchool({
      id: uuidv4(), // auto-generate unique ID
      email,
      preschoolname,
      district,
      phonenumber,
      password: hashedPassword,
      status: "pending", // Set status to pending
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Registration request sent. Await admin approval." });
  } catch (err) {
    console.error("Register error:", err.message); // log for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await PreSchool.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account is blocked by admin." });
    }
    if (user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Account not approved by admin yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
