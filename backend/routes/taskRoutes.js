import express from "express";
import {
  uploadAndDistributeTasksController,
  getDistributedTasksController,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, uploadAndDistributeTasksController);

router.get("/distributed", protect, getDistributedTasksController);

export default router;
