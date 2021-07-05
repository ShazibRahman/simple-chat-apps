const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)



const port = process.env.PORT || 3000
const staticFilesDir = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(staticFilesDir))

let count = 0

// socket -> emits to a single client io-> emits to all client ,socket.broadcast -> 
// to all other than itself
io.on('connection', (socket) => {
    console.log('new webSocketConnection');

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        if (!user) {
            return callback({
                error: 'something went wrong'
            })
        }


        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'welcome ' + user.username + ' to ' + user.room))

        socket.broadcast.to(room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        // socket.emit ,io.emit , socket.broadcast.emit
        //io().to.emit -> specific room , socket.broadcast.to().emit -> all ecept itself in a room
        callback()
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

    })



    //called when user send messages
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        const user = getUser(socket.id)
        if (!user) {
            callback({
                error: "something went wrong"
            })
        }


        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    //caleed when user leave
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })

        }

    })


    // called when a user send a location
    socket.on('sendLocation', (pos, callback) => {
        // console.log(pos);
        const user = getUser(socket.id)
        io.to(user.room).emit('sendLocation', generateLocationMessage(user.username, `https://google.com/maps?q=${pos.la},${pos.lg}`))
        callback()

    })



})









server.listen(port, () => console.log('running on port ' + port))




