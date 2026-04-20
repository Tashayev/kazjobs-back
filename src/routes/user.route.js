import { Router } from "express"
import {
  getProfile,
  registerUser,
  loginUser,
  logoutUser,
  getRefreshToken,
  getUsers,
  updateUser,
  changePassword,
  getCV,
  uploadCV,
} from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router
  .route("/profile")
  .get(authMiddleware, getProfile)
  .patch(authMiddleware, updateUser)
router.route("/refresh").post(getRefreshToken)
router.route("/").get(getUsers)
router.route("/change-password").post(authMiddleware, changePassword)
router
  .route("/cv")
  .get(authMiddleware, getCV)
  .post(authMiddleware, upload.single("cv"), uploadCV)

export default router
