import DepartmentModel from "../../../../DB/models/depart.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";


export const addDepat=asyncHandler(
    async(req,res,next)=>{
        const{name}=req.body
       
        if(await DepartmentModel.findOne({name})){
            return next(new Error('department already exist'))
        }
   
        const newDept=await DepartmentModel.create(req.body)
        return res.status(201).json({message:"added succefuly",newDept})
    }
)
export const getById=asyncHandler(
async(req,res,next)=>{
    const {name}=req.body
    const depart=await DepartmentModel.findOne({name}).populate('employees', 'name  nationalId');
   
    return res.json({message:"done",depart}) 
}
    
)
export const getAll=asyncHandler(
    async(req,res,next)=>{
       
        const departments=await DepartmentModel.find().populate('employees', 'name  role nationalId'); 
       
        return res.json({message:"done",departments}) 
        }
    )
export const update=asyncHandler(
    async(req,res,next)=>{
        const{dapartmentId}=req.body
        if(req.user.role!="Admin"){
            return next(new Error("not allowed ! Admins only",{cause:403}))
         }
       const depart=await DepartmentModel.findById({_id:dapartmentId})
        if(!depart ){
            return next(new Error('department is not exist',{cause:404}))
        }
        const updatedDepart=await DepartmentModel.findOneAndUpdate(req.body)
        return res.status(200).json({message:'updated succefly',updatedDepart})

    }
)

export const Delete=asyncHandler(
    async(req,res,next)=>{
        const{dapartmentId}=req.body
        if(req.user.role!="Admin"){
            return next(new Error("not allowed ! Admins only",{cause:403}))
         }
        if(!await DepartmentModel.findById({_id:dapartmentId})){
            return next(new Error('department is not exist',{cause:404}))
        }
       
        const deletedDepart=await DepartmentModel.findOneAndDelete(
            {dapartmentId})
        return res.status(200).json({message:'deleted succefly',deletedDepart})

    }
)