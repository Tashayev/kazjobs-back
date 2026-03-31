import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    salary: {
      type: String,
      max: 1000000000000,
      min: 0,
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "remote"],
    },
    category: {
      type: String,
      enum: [
        "it-technology",
        "sales-business-development",
        "marketing-pr",
        "healthcare-pharma",
        "engineering-manufacturing",
        "education-science",
        "retail-ecommerce",
        "accounting-finance",
        "legal",
        "logistics-transportation",
        "construction-real-estate",
        "administrative-staff",
        "hospitality-tourism",
        "design-creative",
        "security",
        "skilled-labor",
      ],
      default: "it-technology",
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);