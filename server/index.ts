import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import routes from './routes/index'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(morgan('dev'))
app.use(fileUpload()); 
app.use(cookieParser())

app.get("/", (req: Request, res: Response ) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.BASE_URL}`)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
   });

app.use('/api', routes)

import './config/database'

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})