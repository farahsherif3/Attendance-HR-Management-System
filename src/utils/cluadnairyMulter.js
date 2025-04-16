import multer from "multer";

export const fileValidation={
    image:['image/png','image/gif','image/jpeg'],
    pdf:'application/pdf',
    excel: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ]
}
 export const uploadFile=({customValidation}={})=>{
    const storage=multer.diskStorage({})
     const fileFilter=(req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new error('invalid formate',false))
        }
    }
    const upload=multer({fileFilter,storage})
    return upload
 }
 //export default uploadFile