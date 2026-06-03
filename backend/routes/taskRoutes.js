import express from "express";
import {
  uploadAndDistributeLeadsController,
  getDistributedTasksController,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, uploadAndDistributeLeadsController);

router.get("/distributed", protect, getDistributedTasksController);

export default router;
