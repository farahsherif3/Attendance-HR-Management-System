import {Schema,Types,model} from "mongoose";

const attendanceSchema = new Schema(
  {
    userId: {  // Changed from employeeId to userId
      type: Types.ObjectId,
      ref: "User",  // Referencing User table
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    shift:{
      type:Types.ObjectId,
      ref:"Shift"
    },
    arrives:{
      type:Date,
      required:true,
    },
    leaves:{
      type:Date,
      required:true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Leave"],
    },
    incentives: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const attendanceModel= model("Attendance", attendanceSchema);
export default attendanceModel
