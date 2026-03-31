import { Router } from "express"
import {
  createJob,
  getJobs,
  deleteJob,
  getJob,
  updateJob,
  getJobsByCategory,
  getJobsByEmployer,
} from "../controllers/job.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requireRole } from "../middlewares/role.middleware.js"

const router = Router()

router
  .route("/")
  .post(authMiddleware, requireRole("employer"), createJob)
  .get(getJobs)

router
  .route("/employer")
  .get(authMiddleware, requireRole("employer"), getJobsByEmployer)

router
  .route("/:id")
  .delete(authMiddleware, requireRole("employer"), deleteJob)
  .get(getJob)
  .patch(authMiddleware, requireRole("employer"), updateJob)

export default router
