import { Router } from "express";
import {
  deleteLogistic,
  createLogisticController,
  updateLogisticController,
  getAllLogistics,
  getLogistic,
  updateEventsController,
  deleteEventsController,
  getDashboardStats,
} from "../controllers/logistic.mjs";
import { authenticate, authorizeAdmin } from "../middleware/index.mjs";

const router = Router();

router.route("/all").get(authenticate, authorizeAdmin, getAllLogistics);
router.route("/stats").get(authenticate, authorizeAdmin, getDashboardStats);
router.route("/specific/:id").get(getLogistic);
router
  .route("/:id/events")
  .put(authenticate, authorizeAdmin, updateEventsController);
router
  .route("/delete-events/:id")
  .patch(authenticate, authorizeAdmin, deleteEventsController);

router.route("/").post(authenticate, authorizeAdmin, createLogisticController);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, updateLogisticController);
router.route("/:id").delete(authenticate, authorizeAdmin, deleteLogistic);

export default router;
