// services/job.service.js
import { Job } from "../moduls/job.module.js"

export const getAllJobs = async (query) => {
  const { category, type, location, search } = query
  const filter = {}

  if (category) filter.category = category
  if (type) filter.type = type
  if (location) filter.location = location
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
    ]
  }

  return await Job.find(filter).populate("employer", "username email")
}

export const createNewJob = async (data, employerId) => {
  return await Job.create({ ...data, employer: employerId })
}

export const deleteJobById = async (id, employerId) => {
  const job = await Job.findOne({ _id: id, employer: employerId })
  if (!job) return null
  return await Job.findByIdAndDelete(id)
}

export const getJobById = async (id) => {
  return await Job.findById(id).populate("employer", "username email")
}

export const updateJobById = async (id, employerId, data) => {
  const job = await Job.findOne({ _id: id, employer: employerId })
  if (!job) return null
  return await Job.findByIdAndUpdate(id, data, { new: true })
}

export const getJobsByEmployerService = async (employerId) => {
  return await Job.find({ employer: employerId })
}

export const getJobsByCategory = async (query) => {
  const { employerId } = query
  return await getJobsByEmployerService(employerId)
}

export const getJobsByCategoryService = async (category) => {
  return await Job.find({ category }).populate("employer", "username email")
}