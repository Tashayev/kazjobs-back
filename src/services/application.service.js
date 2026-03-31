// services/application.service.js
import { Application } from "../moduls/application.module.js"
import { Job } from "../moduls/job.module.js"

export const createNewApplication = async ({ job, CV, applicant }) => {
  const existingApplication = await Application.findOne({ job, applicant })
  if (existingApplication) throw new Error("Already applied to this job.")
  return await Application.create({ job, applicant, CV })
}

export const getMyApplications = async (applicantId) => {
  return await Application.find({ applicant: applicantId })
}

export const getApplicationById = async (id) => {
  return await Application.findById(id)
    .populate("applicant", "username email")
    .populate({
      path: "job",
      select: "title location salary employer",
      populate: { path: "employer", select: "username email" }
    })
}

export const updateApplicationStatus = async (id, status) => {
  return await Application.findByIdAndUpdate(id, { status }, { new: true })
}

export const deleteApplicationById = async (id, user) => {
  let application
  if (user.role === "seeker") {
    application = await Application.findOne({ _id: id, applicant: user._id })
  } else if (user.role === "employer") {
    application = await Application.findById(id).populate("job")
    if (application?.job.employer.toString() !== user._id.toString()) {
      application = null
    }
  }
  if (!application) return null
  await Application.findByIdAndDelete(id)
  return true
}

export const getApplicationsByJobId = async (jobId, employerId) => {
  const job = await Job.findOne({ _id: jobId, employer: employerId })
  if (!job) return null
  return await Application.find({ job: jobId })
    .populate("applicant", "username email")
}