import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import routes from './routes/index'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: `${process.env.BASE_URL}`,
  credentials: true
}))
app.use(morgan('dev'))
app.use(fileUpload()); 
app.use(cookieParser())

app.use('/api', routes)

import './config/database'

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})