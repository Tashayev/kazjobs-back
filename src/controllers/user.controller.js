import {
  registerService,
  loginService,
  logoutService,
  refreshTokenService,
  getProfileService,
  getUsersService,
  changePasswordService,
} from "../services/auth.service.js"

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body
    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields." })
    }
    const { user, accessToken, refreshToken } = await registerService({
      username,
      email,
      password,
      role,
    })
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields." })
    }
    const { user, accessToken, refreshToken } = await loginService({
      email,
      password,
    })
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const logoutUser = async (req, res) => {
  try {
    const { email } = req.body
    await logoutService(email)
    res.status(200).json({ message: "User logged out successfully." })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const getRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken is required." })
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshTokenService(refreshToken)
    res.status(200).json({ accessToken, refreshToken: newRefreshToken })
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refreshToken." })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.email)
    if (!user) return res.status(404).json({ message: "User not found." })
    res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await getUsersService(req.query.role)
    res.status(200).json({ users })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.user._id, req.body)
    if (!user) return res.status(404).json({ message: "User not found." })
    
    res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Please provide all the required fields." })
    const { user, accessToken, refreshToken } = await changePasswordService(req.user._id, oldPassword, newPassword)
    res.status(200).json({ user, accessToken, refreshToken })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// const deleteUser = async (req, res) => {
//   try {
//     const user = await deleteUserService(req.user._id)
//     if (!user) return res.status(404).json({ message: "User not found." })
//     res.status(200).json({ message: "User deleted successfully." })
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }
// }

export {
  registerUser,
  loginUser,
  logoutUser,
  getRefreshToken,
  getProfile,
  getUsers,
  updateUser,
  changePassword
  //deleteUser,
}
