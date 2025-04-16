import { Router } from "express";
import*as departController from './controller/department.cont.js'
const router=Router()


router
.post('/addDepart',departController.addDepat)
.get('/getById',departController.getById)
.get('/getAll',departController.getAll)
.put('/update',departController.update)
.put('/delete',departController.Delete)






export default router