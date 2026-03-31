
export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    console.log(req.user.role)
    return res.status(403).json({ message: `Only ${role}s can do this.` })
  }
  next()
}