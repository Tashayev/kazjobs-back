import { Router } from "express"
import {
  createApplication,
  getApplications,
  deleteApplication,
  updateApplication,
  getApplication,
  getJobApplications,
} from "../controllers/application.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requireRole } from "../middlewares/role.middleware.js"

const router = Router()

router
  .route("/")
  .post(authMiddleware, requireRole("seeker"), createApplication)
  .get(authMiddleware, getApplications)

router.route("/job/:id").get(authMiddleware, getJobApplications)

router
  .route("/:id")
  .get(authMiddleware, getApplication)
  .delete(authMiddleware, deleteApplication)
  .patch(authMiddleware, requireRole("employer"), updateApplication)

export default router
