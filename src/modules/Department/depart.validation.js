import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'



export const getByIdSchema=joi.object({
    departmenttId:generalFields.id
}).required()

export const deleteSchema=joi.object({
    departmenttId:generalFields.id
}).required()

export const createDepartmenttSchema=joi.object({
    name:joi.string().max(30).min(3).trim().required(),
       employees:generalFields.id.required()
}).required()

export const updateSchema=joi.object({
    departmenttId:generalFields.id.required(),
    name:joi.string().max(30).min(3).trim(),
      startTime:joi.string(),
     endTime:joi.string(),
      department:generalFields.id,
       employees:generalFields.id
}).required()