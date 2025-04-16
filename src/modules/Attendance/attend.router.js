import { Router } from "express";
import*as attendController from './controller/attend.controller.js'
import*as attendanceValidation from './attendance.validation.js'
import validation from "../../middleware/validation.js"
import uploadFile ,{fileValidation} from "../../utils/multer.js";

const router=Router()


router
.post('/import', uploadFile({ customValidation: fileValidation.excel }).single("file"),attendController.importAttendanceFromExcel)

.post('/addRecord'/*,validation(attendanceValidation.addRecordSchema)*/,attendController.addRecord)
.get('/getRecord',attendController.getRecords)
.get('/getById/:employeeCode',attendController.getRecordId)
.put('/update',validation(attendanceValidation.updateSchema),attendController.update)
.delete('/delete/:_id',attendController.Delete)

export default router