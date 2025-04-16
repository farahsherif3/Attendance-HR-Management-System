import connection from "../DB/connection.js"
import { globalError } from "./utils/errorHandler.js"
import userRouter from './modules/User/user.router.js'
import departRouter from './modules/Department/depart.router.js'
import shiftRouter from './modules/shift/shift.router.js'
import attendanceRouter from './modules/Attendance/attend.router.js'
import reportRouter from './modules/MReport/report.router.js'
const bootstrab=(app,express)=>{
 app.use((req,res,next)=>{
    if(req.originalUrl=='order/webhook'){
      return next();
    }else{
         express.json({})(req,res,next);
    }
   
 })
 app.use('/user',userRouter)
 app.use('/department',departRouter)
 app.use('/shift',shiftRouter)
 app.use('/attendance',attendanceRouter)
 app.use('/report',reportRouter)
 app.use(globalError)
connection()
}
export default bootstrab