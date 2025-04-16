import { Router } from "express";
import * as reportCotroller from './controller/report.controller.js'
const router=Router()

router
.get('/getReport',reportCotroller.generateMonthlyReport)
.get('/getReports',reportCotroller.generateYearReport)
.get('/getOne',reportCotroller.MonthlyReportForUser)
export default router