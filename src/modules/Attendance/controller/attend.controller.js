import attendanceModel from "../../../../DB/models/attendance.model.js";
import userModel from "../../../../DB/models/User.model.js";
import ShiftModel from "../../../../DB/models/shift.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import xlsx from "xlsx"
import fs from "fs"

//  Add Attendance Record
export const addRecord = asyncHandler(async (req, res, next) => {
    try {
        const { userId, date, arrives, leaves, shift } = req.body;

        // Validate user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Validate shift
        const shiftExist = await ShiftModel.findById(shift);
        if (!shiftExist) {
            return res.status(404).json({ success: false, message: "Shift does not exist" });
        }

        const formattedDate = new Date(date);
        if (isNaN(formattedDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        // Ensure arrives and leaves are valid
        const arrivesTime = new Date(arrives);
        const leavesTime = new Date(leaves);

        if (isNaN(arrivesTime) || isNaN(leavesTime)) {
            return res.status(400).json({ success: false, message: "Invalid arrives or leaves time format" });
        }

        if (arrivesTime >= leavesTime) {
            return res.status(400).json({ success: false, message: "Leave time must be after arrive time" });
        }

        // Determine attendance status
        let status = "Absent"; // Default to Absent
        const shiftStart = new Date(shiftExist.startTime);
        const gracePeriod = 15 * 60 * 1000; // 15 minutes in milliseconds

        if (arrivesTime <= shiftStart) {
            status = "Present";
        } else if (arrivesTime > shiftStart && arrivesTime <= shiftStart.getTime() + gracePeriod) {
            status = "Late";
        }

        // Save attendance record
        const attendance = new attendanceModel({
            userId,
            date: formattedDate,
            shift: shiftExist._id,
            arrives: arrivesTime,
            leaves: leavesTime,
            status,
        });

        await attendance.save();

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
});

//  Get All Attendance Records
export const getRecords = asyncHandler(async (req, res, next) => {
    const attendance = await attendanceModel.find().populate("userId", "name userId");

    if (!attendance || attendance.length === 0) {
        return next(new Error("No attendance records found", { cause: 404 }));
    }

    return res.status(200).json({ message: "Done", attendance });
});

//  Get Attendance by Employee Code
export const getRecordId = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    // Find the user
    const user = await userModel.findOne({ userId });
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // Find attendance
    const attendance = await attendanceModel.find({ userId: user._id }).populate("userId", "name userId");

    if (!attendance || attendance.length === 0) {
        return next(new Error("No attendance records found", { cause: 404 }));
    }

    return res.status(200).json({ message: "Done", attendance });
});

//  Update Attendance Record
export const update = asyncHandler(async (req, res, next) => {
    const { userId, date, status, incentives } = req.body;
     if(req.user.role!="Admin"){
        return next(new Error("not allowed ! Admins only",{cause:403}))
     }
    // Find the user
    const user = await userModel.findOne({ userId });
    if (!user) {
        return next(new Error("User does not exist", { cause: 404 }));
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Find and update the attendance record
    const updatedAttendance = await attendanceModel.findOneAndUpdate(
        { userId: user._id, date: formattedDate },
        { status, incentives },
        { new: true }
    );

    if (!updatedAttendance) {
        return next(new Error("Attendance record not found for this date", { cause: 404 }));
    }

    return res.status(200).json({
        message: "Attendance updated successfully",
        attendance: updatedAttendance
    });
});

//  Delete Attendance Record
export const Delete = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(req.user.role!="Admin"){
        return next(new Error("not allowed ! Admins only",{cause:403}))
     }
    const recordExist = await attendanceModel.findById(id);
    if (!recordExist) {
        return next(new Error("Record does not exist", { cause: 404 }));
    }

    await attendanceModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Deleted successfully" });
});











const isValidTime = (time) => /^\d{2}:\d{2}$/.test(time);

export const importAttendanceFromExcel = async (req, res, next) => {

    if (!req.file) {
      return next(new Error("No file uploaded"));
    }

    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const insertedRecords = [];
    const failedRecords = [];

    for (const item of data) {
        const { name, shiftName, shiftStart, shiftEnd, date, arrives, leaves, status } = item;
      
        // تحويل الوقت العشري إلى وقت
        const arrivesTime = decimalToTime(arrives);
        const leavesTime = decimalToTime(leaves);
      
        // باقي الكود مثل السابق
        const user = await userModel.findOne({ name });
        if (!user) {
          return next(new Error("User not found", { cause: 404 }));
        }
      
        const shift = await ShiftModel.findOne({
          name: shiftName,
          startTime: new Date(`1970-01-01T${shiftStart}`),
          endTime: new Date(`1970-01-01T${shiftEnd}`)
        });
        if (!shift) {
          return next(new Error("Shift not found", { cause: 404 }));
        }
      
        const attendance = await attendanceModel.create({
          userId: user._id,
          shift: shift._id,
          date: new Date(date),
          arrives: new Date(`${date}T${arrivesTime}`),
          leaves: new Date(`${date}T${leavesTime}`),
          status: status || "Present"
        });
      
        insertedRecords.push(attendance);
      }
    }