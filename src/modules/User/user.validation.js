import joi from 'joi'
import { generalFields } from '../../utils/generalFeildes.js'



export const signUPSchema=joi.object({
    name:joi.string().min(2).max(20).required(),
    password:generalFields.password.required(),
    nationalId:joi.string().required(),
    role:joi.string().required(),


}).required()

export const logInSchema=joi.object({
    nationalId:joi.string().required(),
    password:generalFields.password.required()
}).required()


export const tokenSchema=joi.object({
    token:joi.string().required(),
}).required()


export const updateSchema=joi.object({
    password:generalFields.password.required(),
    name:joi.string(),
    nationalId:joi.string().required(),
    department:generalFields.id,
    shift:generalFields.id,
    authorization:joi.string().required()
}).required()

export const deleteSchema=joi.object({
    token:joi.string().required(),
    nationalId:joi.string().required(),
    authorization:joi.string().required()

}).required()

export const getByIdSchema=joi.object({
    token:joi.string().required(),
    nationalId:joi.string().required(),
    authorization:joi.string().required()
}).required()

