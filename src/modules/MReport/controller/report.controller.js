import attendanceModel from "../../../../DB/models/attendance.model.js";
import userModel from "../../../../DB/models/User.model.js"; 
import { asyncHandler } from "../../../utils/errorHandler.js";

export const generateMonthlyReport = asyncHandler(async (req, res) => {

    // Get month and year from params
    const { month, year } = req.body;
    
    // Convert month & year to Date objects
    const startDate = new Date(year, month - 1, 1);
const endDate = new Date(year, month, 0, 23, 59, 59, 999);


    // Aggregate attendance records for the given month
    const report = await attendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
          totalIncentives: { $sum: "$incentives" },
        },
      },
      {
        $lookup: {
          from: "users", // Make sure this matches your MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          role: "$user.role",
          department: "$user.department",
          shift: "$user.shift",
          totalPresent: 1,
          totalAbsent: 1,
          totalLate: 1,
          totalIncentives: 1,
        },
      },
    ]);

    

     res.json({ success: true, report });


    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

});







export const generateYearReport = asyncHandler(async (req, res) => {
  
    // Get year from request body
    let { year } = req.body;

    // Set start and end dates for the entire year
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st

    // Aggregate attendance records for the given year
    const report = await attendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }, // Filter by year
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
          totalIncentives: { $sum: "$incentives" },
        },
      },
      {
        $lookup: {
          from: "users", // Ensure collection name matches
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          role: "$user.role",
          department: "$user.department",
          shift: "$user.shift",
          totalPresent: 1,
          totalAbsent: 1,
          totalLate: 1,
          totalIncentives: 1,
        },
      },
    ]);

  

     res.json({ message: "Done", report });

 return  res.status(500).json({ message: "false", message: "Server Error", error: error.message });
  
});





export const MonthlyReportForUser = asyncHandler(async (req, res) => {
  try {
      // Get month, year, and userName from request body
      const { month, year, userName } = req.body;

      if (!userName){
          return res.status(400).json({ success: false, message: "User name is required" });
      }

      // Convert month & year to Date objects
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      // Find the user by name
      const user = await userModel.findOne({ name: userName });

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Aggregate attendance records for the given month & specific user
      const report = await attendanceModel.aggregate([
          {
              $match: {
                  userId: user._id, // Filter by userId
                  date: { $gte: startDate, $lte: endDate }, // Filter by date range
              },
          },
          {
              $group: {
                  _id: "$userId",
                  totalPresent: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
                  totalAbsent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
                  totalLate: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
                  totalIncentives: { $sum: "$incentives" },
              },
          },
          {
              $lookup: {
                  from: "users",
                  localField: "_id",
                  foreignField: "_id",
                  as: "user",
              },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
              $project: {
                  _id: 0,
                  userId: "$_id",
                  name: "$user.name",
                  role: "$user.role",
                  department: "$user.department",
                  shift: "$user.shift",
                  totalPresent: 1,
                  totalAbsent: 1,
                  totalLate: 1,
                  totalIncentives: 1,
              },
          },
      ]);

      if (report.length === 0) {
          return res.status(404).json({ success: false, message: "No attendance records found for this user in the given month" });
      }

      return res.json({ success: true, report });

  } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});