import { hash } from "bcrypt"
import userModel from "../../../../DB/models/User.model.js"
import DepartmentModel from "../../../../DB/models/depart.model.js"
import ShiftModel from "../../../../DB/models/shift.model.js"
import attendanceModel from "../../../../DB/models/attendance.model.js"
import { asyncHandler } from "../../../utils/errorHandler.js"
import { GenerateToken } from "../../../utils/Generate_Varify.js"
import { compare, Hash } from "../../../utils/Hash_Compare.js"
import xlsx from "xlsx";
import fs from "fs";
//import pdfParse from 'pdf-parse';

/*export const importAttendanceFromExcel =async (req, res, next) => {
 
  if (!req.file || !req.file.path) {
    return next(new Error('No file uploaded', { cause: 400 }));
  }
  
  const fileUrl = req.file.path;
  const workbook = xlsx.readFile(fileUrl);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const insertedRecords = [];
  const failedRecords = [];

  console.log("jkvkb")
for (const item of data) {
  try {
    const { name, shiftName, date, arrives, leaves, status } = {};

    const user = await userModel.findOne({ name });
    if (!user) throw new Error(`User not found: ${name}`);

    const shift = await ShiftModel.findOne({
      name: shiftName,
      startTime: new Date(`1970-01-01T${shiftStart}`),
      endTime: new Date(`1970-01-01T${shiftEnd}`)
    });
    if (!shift) throw new Error(`Shift not found: ${shiftName}`);

    const attendance = await attendanceModel.create({
      userId: user._id,
      shift: shift._id,
      date: new Date(date),
      arrives: new Date(`${date}T${arrives}`),
      leaves: new Date(`${date}T${leaves}`),
      status: status || "Present"
    });

    insertedRecords.push(attendance);

  } catch (err) {
    failedRecords.push({ item, error: err.message });
  }
}

/*if (!fs.existsSync(filePath)) {
  return next(new Error('File not found', { cause: 404 }));
}


return res.status(201).json({
  message: "Import completed",
  inserted: insertedRecords.length,
  failed: failedRecords.length,
  failedRecords
});

  }*/
  

/*export const importFromPDF = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded'));
  }

  const filePath = req.file.path;

  const dataBuffer = fs.readFileSync(filePath);

  const data = await pdfParse(dataBuffer);

  console.log("PDF Content: ", data.text); // هنا البيانات كلها كنص

  // ممكن تبدأي تـ parse الـ text بناءً على الـ format بتاع الـ PDF
  // مثلا تقسمي على \n وتدوري على الأسامي أو أوقات الحضور والانصراف
  // بعد كده تكملي نفس خطوات تخزين الحضور زي ما كنتي بتعملي مع الـ Excel

  return res.status(200).json({ message: 'PDF processed successfully', rawText: data.text });
};
*/








export const signUp=asyncHandler(
async(req,res,next)=>{
    const {nationalId}=req.body
    if(await userModel.findOne({nationalId})){
        return next(new Error("user exist before",{cause:400}))
    }
    const token=GenerateToken({
        payload:{nationalId},
        signature:process.env.SIGNUP_SEGNATURE,
        expiresIn:60*60
    })
    const ref_token=GenerateToken({
        payload:{nationalId},
        signature:process.env.SIGNUP_SEGNATURE,
        expiresIn:60*60
    })

  req.body.password= Hash({plaintext:req.body.password})

    const newUser=await userModel.create(req.body)
     return res.status(201).json({message:"done",newUser})
})


export const logIN=asyncHandler(
async(req,res,next)=>{

const {nationalId,password}=req.body

const userExist=await userModel.findOne({nationalId})
if(!userExist){
   next( new error('user is not exist'))
}
if(!compare({ plaintext:password, hashValue:userExist.password})){
    console.log(req.body)

    return next(new error("invalid password",{cause:400}))
}
const token=GenerateToken({
    payload:{nationalId},
    signature:process.env.SIGNUP_SEGNATURE,
    expiresIn:60*60
})
const ref_token=GenerateToken({
    payload:{nationalId},
    signature:process.env.SIGNUP_SEGNATURE,
    expiresIn:60*60
})

return res.status(200).json({message:"done",token,ref_token})

})

export const update = asyncHandler(async (req, res, next) => {
    const { nationalId } = req.body;
    
    const user = await userModel.findOne({ nationalId });
    if (!user) {
      return next(new Error("User does not exist", { cause: 404 }));
    }
  
    if (user.isDeleted) {
      return next(new Error("User is deleted", { cause: 404 }));
    }
  
    if (user.role !== "Admin") {
      return next(new Error("Not allowed to update", { cause: 403 }));
    }
  
    const updateUser = await userModel.findOneAndUpdate({ nationalId }, req.body, { new: true });
  
    res.status(200).json({
      message: "User updated successfully",
      updateUser
    });
  });
  


export const Delete = asyncHandler(
    async (req, res, next) => {
    const { nationalId } = req.body;
    const user = await userModel.findOne({ nationalId });
    if (!user) {
        return next(new Error("User does not exist", { cause: 404 }));
    }
    if(user.role!="Admin"){
        return next(new Error ("not allowed"))
    }
    const deletedUser = await userModel.findOneAndUpdate(
        { nationalId },
        { isDeleted: true },
        { new: true } // Ensures updated document is returned
    );

    if (!deletedUser) {
        return next(new Error("Failed to delete user", { cause: 500 }));
    }

    res.status(200).json({ message: "Deleted successfully", deletedUser });
});

export const getAll=asyncHandler(
async(req,res,next)=>{
    const users=await userModel.find()

    return res.status(200).json({message:"done",users})
})


export const getById=asyncHandler(
    async(req,res,next)=>{
        const{name}=req.body
        const user=await userModel.findOne({name})
        if(!user){
            return next(new Error ("user is nit exist",{cause:404}))
        }
    
        return res.status(200).json({message:"done",user})
    }

)