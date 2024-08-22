import { catchAsynError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Job } from "../models/jobSchema.js";

export const postJob = catchAsynError(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;

  if (
    !(
      title ||
      !jobType ||
      !location ||
      !companyName ||
      !introduction ||
      !responsibilities ||
      !qualifications ||
      !salary ||
      !jobNiche
    )
  ) {
    return next(new ErrorHandler("Please provide full job details", 400));
  }

  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (!personalWebsiteTitle && personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler(
        "Provide both the website title and url, or leave it blank",
        400
      )
    );
  }

  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,

    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "Job created successfully!",
    job,
  });
});

// get all jobs
export const getAllJobs = catchAsynError(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query;
  const query = {};
  if (city) {
    query.location = city;
  }

  if (niche) {
    query.jobNiche = niche;
  }

  if (searchKeyword) {
    query.$or = [
      {
        title: { $regex: searchKeyword, $options: "i" },
      },
      {
        companyName: { $regex: searchKeyword, $options: "i" },
      },
      {
        introduction: { $regex: searchKeyword, $options: "i" },
      },
    ];
  }

  const jobs = await Job.find(query);

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

export const getMyJobs = catchAsynError(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const deleteJob = catchAsynError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops job not found", 400));
  }
  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully!",
  });
});
export const getSingleJob = catchAsynError(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops job not found", 400));
  }

  res.status(200).json({
    success: true,
    job,
  });
});
