import { Router } from "express";
import* as shiftController from './controller/shift.controller.js'
import validation from "../../middleware/validation.js";
import * as shiftValidation from './shift.validation.js'
const router=Router()

router.
post('/createShift',validation(shiftValidation.createShiftSchema),shiftController.createShift)
.get('/getAll',shiftController.getAll)
.get('/getId',validation(shiftValidation.getByIdSchema),shiftController.getById)
.put('/update',validation(shiftValidation.updateSchema),shiftController.update)
.patch('/delete',validation(shiftValidation.deleteSchema),shiftController.deleteShift)



export default router