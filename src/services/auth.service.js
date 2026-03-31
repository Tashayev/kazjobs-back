import { User } from "../moduls/user.module.js"
import { generateToken } from "./token.service.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export const registerService = async ({ username, email, password, role }) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const existingUser = await User.findOne({ email })
    if (existingUser) throw new Error("Email already exists.")

    const user = await User.create([{ username, email: email.toLowerCase(), password, role }], { session })
    const { accessToken, refreshToken } = await generateToken(user[0])
    await session.commitTransaction()
    return { user: user[0], accessToken, refreshToken }
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw new Error("User not found.")
  if (!(await user.comparePassword(password))) throw new Error("Incorrect password.")
  const { accessToken, refreshToken } = await generateToken(user)
  return { user, accessToken, refreshToken }
}

export const logoutService = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw new Error("User not found.")
  await User.findByIdAndUpdate(user._id, { refreshToken: null })
}

export const refreshTokenService = async (refreshToken) => {
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
  const user = await User.findOne({ refreshToken })
  if (!user) throw new Error("Invalid refreshToken.")
  return await generateToken(user)
}

export const getProfileService = async (email) => {
  return await User.findOne({ email }).select("-password -refreshToken")
}

export const getUsersService = async (role) => {
  const filter = role ? { role } : {}
  return await User.find(filter).select("-password -refreshToken -__v")
}

export const updateUserService = async (id, data) => {
  const user = await User.findById(id)
  if (!user) throw new Error("User not found.")
  await User.findByIdAndUpdate(id, data)  
  return await User.findById(id).select("-password -refreshToken -__v")
}

export const changePasswordService = async (id, oldPassword, newPassword) => {
  const user = await User.findById(id)
  if (!user) throw new Error("User not found.")
  if (!(await user.comparePassword(oldPassword))) throw new Error("Incorrect password.")
  user.password = newPassword  // pre-save hook will hash it
  await user.save()            // triggers bcrypt hash
  const { accessToken, refreshToken } = await generateToken(user)
  return { user, accessToken, refreshToken }
}
// export const deleteUserService = async (id) => {
//   const user = await User.findById(id)
//   if (!user) throw new Error("User not found.")
//   await User.findByIdAndDelete(id)
// }