
import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'


export const addRecordSchema = joi.object({
    userId: generalFields.id.required(),
    date: joi.date().iso().required(),
    status: joi.string().valid("Present", "Absent", "Late", "Leave").required(),
    incentives: joi.number().min(0).optional()
}).required()


export const updateSchema = joi.object({
    userId: generalFields.id.required(),
    date: joi.date().iso().required(),
    status: joi.string().valid("Present", "Absent", "Late", "Leave").required(),
    incentives: joi.number().min(0).optional()
}).required()
