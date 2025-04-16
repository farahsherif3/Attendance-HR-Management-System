import { Types } from "mongoose";
export const idValidation=(value,helper)=>{
  return Types.ObjectId.isValid(value)?true:helper.message("Invalid Id")
}

const validation = (schema) => {
  return (req, res, next) => {
    try {
      let methods
    if(req.headers.authorization){
      
      methods={...req.body,...req.params,...req.query,authorization:req.headers.authorization}
    }
    else{
      methods={...req.body,...req.params,...req.query}
    }
    if(req.file){
      methods={...methods,file:req.file}
    }
    if(req.files){
      methods={...methods,files:req.files}
    }

    
    const validationResult = schema.validate(methods)
    
    if (validationResult?.error) {
      return res.status(400).json({ message: "validationError", validationResult });
    }
    return next()
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        //stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      });
    }
  };
};


export default validation