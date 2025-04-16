
import { Schema,model,Types } from "mongoose";
const userSchema=new Schema({
  name:{
    type:String,
    required:[true,"name is required"] ,
    lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"] ,

    },
    nationalId:{
        type:String,
        required:[true,"nationalId is required"] ,
        unique:[true,"nationalId must be uniqe"]
    },

    department:{
        type: Types.ObjectId,
        ref:"Department"
    },

    shift:{
        type : Types.ObjectId,
        ref:"Shift"
    },
    isDeleted:{
        type:Boolean,
        index:true,
        default:false
    },
    note:{
        type:String,
        trim:true,
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User",
    },
    building:{
        type:String,
        enum:["Old","New"],
    }
},{
    timestamps:true
})

const userModel=model('User',userSchema)
export default userModel