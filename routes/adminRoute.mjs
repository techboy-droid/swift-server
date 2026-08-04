import { Router } from "express";

import { loginAdmin, createAdmin } from "../controllers/auth.mjs";
const router = Router();

// router.post("/", createAdmin);

router.post("/auth", loginAdmin);

export default router;
