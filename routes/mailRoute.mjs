import { Router } from "express";
import { sendEmail } from "../controllers/mail.mjs";
const router = Router();

router.post("/", sendEmail);

export default router;
