import {
  createNewApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplicationById,
  getApplicationsByJobId,
} from "../services/application.service.js"

const createApplication = async (req, res) => {
  try {
    const { job, CV } = req.body
    const application = await createNewApplication({
      job,
      CV,
      applicant: req.user._id,
    })
    res.status(201).json({ application })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const getApplications = async (req, res) => {
  try {
    const applications = await getMyApplications(req.user._id)
    res.status(200).json({ applications })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getApplication = async (req, res) => {
  try {
    const application = await getApplicationById(req.params.id)
    if (!application)
      return res.status(404).json({ message: "Application not found." })

    const isApplicant =
      application.applicant?._id.toString() === req.user._id.toString()
    const isEmployer =
      application.job?.employer?._id?.toString() === req.user._id.toString()
    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: "Unauthorized." })
    }

    res.status(200).json({ application })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateApplication = async (req, res) => {
  try {
    const application = await updateApplicationStatus(
      req.params.id,
      req.body.status,
    )
    if (!application)
      return res.status(404).json({ message: "Application not found." })
    res.status(200).json({ application })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteApplication = async (req, res) => {
  try {
    const result = await deleteApplicationById(req.params.id, req.user)
    if (!result)
      return res.status(404).json({ message: "Application not found." })
    res.status(200).json({ message: "Application deleted successfully." })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getJobApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByJobId(
      req.params.id,
      req.user._id,
    )
    if (!applications)
      return res.status(404).json({ message: "Job not found." })
    res.status(200).json({ applications })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getJobApplications,
}
