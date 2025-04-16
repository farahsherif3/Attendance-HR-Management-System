import { Router } from "express";
import*as userController from './controller/user.controller.js'
import validation from "../../middleware/validation.js";
import*as userValidation from './user.validation.js'
import uploadFile,{fileValidation} from "../../utils/multer.js"
const router=Router()

router
//.post('/import', uploadFile({ customValidation: fileValidation.excel }).single("file"),userController.importFromPDF)

.get('/logIn'/*,validation(userValidation.logInSchema)*/,userController.logIN)
.post('/signUp'/*,validation(userValidation.signUPSchema)*/,userController.signUp)
.put('/update',validation(userValidation.updateSchema),userController.update)
.put('/delete',validation(userValidation.deleteSchema),userController.Delete)
.get('/getAll',userController.getAll)
.get('/getById',/*validation(userValidation.getByIdSchema),*/userController.getById)



export default router