import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import routes from './routes/index'

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'DELETE',
    'PATCH',
    'UPDATE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};



const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(cors(corsOpts))
app.use(morgan('dev'))
app.use(fileUpload()); 
app.use(cookieParser())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use('/api', routes)

import './config/database'

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})