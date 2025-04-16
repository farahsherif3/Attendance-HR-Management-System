import { asyncHandler } from "../../../utils/errorHandler.js"
import ShiftModel from "../../../../DB/models/shift.model.js"
import DepartmentModel from "../../../../DB/models/depart.model.js";
import userModel from "../../../../DB/models/User.model.js";

export const createShift=asyncHandler(
    async(req,res,next)=>{
        const { name, startTime, endTime, department, employees, isActive } = req.body;

        // Validation for endTime > startTime
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (endMinutes <= startMinutes) {
            return res.status(400).json({ message: "End time must be after start time" });
        }
if(!await DepartmentModel.findById({_id:department})){
    return next(new Error("department is not exist"))
}
 
const existingUsers = await userModel.find({ _id: { $in: employees } }).select("_id");
const existingUserIds = existingUsers.map(user => user._id.toString());

if (existingUserIds.length !== employees.length) {
    return next(new Error("Some users do not exist"));
}
const newShift = await  ShiftModel.create({
            name,
            startTime,
            endTime,
            department,
            employees,
            isActive
        });
       return res.status(201).json({ message: "Shift created successfully", shift: newShift });
        return res.status(500).json({message:"failed to create shift"})
    }
)

export const getAll=asyncHandler(
    async(req,res,nex)=>{
        const shifts=await ShiftModel.find()
        .populate("department","name ")
        .populate("employees","name" );

        return res.status(200).json({meassage:"done",shifts})
    }
)

export const getById=asyncHandler(
    async(req,res,next)=>{
        const{name}=req.body
        const exist=await ShiftModel.findOne({name}).populate("department","name")
        .populate("employees","name _id")
        if(!exist){
            return next(new Error("shift is not exist"))
        }
        res.status(200).json({message:"done",exist})
    }
)

export const update=asyncHandler(
    async(req,res,next)=>{
        const {id,startTime,endTime} = req.body

        if(!await ShiftModel.findById({_id:id})){
            return next(new Error("shift is not exist"))
        };
    

        // Validate startTime & endTime
        if(startTime && endTime){
       const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (endMinutes <= startMinutes) {
            return res.status(400).json({ message: "End time must be after start time" });
        }
    }
    const updateShift=await ShiftModel.findByIdAndUpdate({_id:id},req.body,{new:true})
    return res.status(200).json({message:"updated succefully",updateShift})

    }
)


export const deleteShift=asyncHandler(
    async(req,res,next)=>{
        const{id}=req.body
        const shift=await ShiftModel.findById({_id:id})
        if(!shift){
            return next(new Error("shift is not exist"))
        }
        await ShiftModel.findByIdAndUpdate({_id:id},{isActive:false},{new:true})//make it delete in the end
        return res.json({message:"done",shift})
    }
)