//express
const express = require('express')
const app = express()
//to allow access
const cors = require('cors')
//library
const { Server } = require("socket.io");
//create server
const http = require('http').createServer(app)
//get frontend url
require('dotenv').config()
//create socket server
const io = new Server(http, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});
//allow access
app.use(cors())

app.get('/', (req, res) => {
    res.send('the app is up and running')
})

//port
const port = process.env.port || 4000

//socket connection
io.on('connection', (socket) => {
    //getting data from clientside
    socket.on('send_messages', (data) => {
        //sendind data to client
        socket.broadcast.emit('receive_messages', data)
        //with user status true
        socket.broadcast.emit('is_active', { status: true })

    })
    console.log('user connected')

    //user dicconect
    socket.on('disconnect', () => {
        //sending user status false
        socket.broadcast.emit('is_active', { status: false })
        console.log('offline')
    });
})

//node server
http.listen(port, () => {
    console.log(`server is running on port ${ port }`)
})
