import { generateToken } from "../core/utils.mjs";
import Admin from "../models/admin.mjs";
import bcrypt from "bcrypt";
import { asyncHandler } from "../middleware/index.mjs";
const createAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please fill all the fields");
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400).send("Admin already exists");
    return;
  }

  // Hash the Admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newAdmin = new Admin({ email, password: hashedPassword });

  try {
    await newAdmin.save();
    // createToken()

    res.status(201).json({
      _id: newAdmin._id,
      Adminname: newAdmin.Adminname,
      email: newAdmin.email,
      isAdmin: newAdmin.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid Admin data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingAdmin.password
      );

      if (isPasswordValid) {
        const token = generateToken(res, existingAdmin._id);
        res.status(200).json({
          _id: existingAdmin._id,
          email: existingAdmin.email,
          isAdmin: existingAdmin.isAdmin,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export { loginAdmin, createAdmin };
