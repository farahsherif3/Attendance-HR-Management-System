import express from "express"
import { config } from "dotenv"
import bootstrab from "./src/bootstrap.js"
import cors from 'cors'


const app=express()


app.use(cors())

const port=process.env.PORT

bootstrab(app,express)

app.listen(port,()=>{
console.log("server running")
})


