import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import compression from 'compression'
import routes from './routes/index'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()
app.use(compression({level: 6, thershold: 100 * 1000}));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb'}));
app.use(cors({
  origin: `${process.env.BASE_URL}`,
  credentials: true
}))
app.use(morgan('dev'))
app.use(fileUpload()); 
app.use(cookieParser())

// Socket.io
const http = createServer(app)
export const io = new Server(http, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    credentials: true
  }
})

io.on("connection", (socket: Socket) => {
  SocketServer(socket)
})


app.use('/api', routes)

import './config/database'
import { SocketServer } from './config/socket'

const PORT = process.env.PORT || 5000

http.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})