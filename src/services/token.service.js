import jwt from "jsonwebtoken"
import { User } from "../moduls/user.module.js"

export const generateToken = async (user) => {
  const accessToken = jwt.sign(
    { email: user.email, _id: user._id, role: user.role },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" },
  )
  const refreshToken = jwt.sign(
    { email: user.email, _id: user._id, role: user.role },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" },
  )
  await User.findByIdAndUpdate(user._id, { refreshToken })
  return { accessToken, refreshToken }
}
