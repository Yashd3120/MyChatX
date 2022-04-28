// Entry point to everything 
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser , userLeave , getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting Static Folder 

app.use(express.static(path.join(__dirname,'public')));

const botName = 'MyChatX Bot';
// Run when a client connects.
io.on('connection' , socket => {

    socket.on('joinRoom', ({ username, room }) =>{

    const user = userJoin(socket.id ,username, room);
    socket.join(user.room);

    // Welcomes the current user .
    socket.emit('message' , formatMessage(botName,'Welcome to MyChatX'));

    // Shows Message when a user joins(connects) a room
    socket.broadcast.to(user.room).emit('message' , formatMessage(botName,`${user.username} has joined the Room`));

    // Send users and room info for side bar

    io.to(user.room).emit('roomUsers' , {
        room: user.room,
        users: getRoomUsers(user.room)
    });
});
    
   
    // Getting the message to server.
    socket.on('chatMessage' , (msg) => {

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });

    // Shows Message when a user leaves the room .
    socket.on('disconnect',() => {

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the room`));

            io.to(user.room).emit('roomUsers' , {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });
});
const PORT = 3000 || process.env.PORT;server. listen (PORT, () => console.log(`Server running on port ${PORT}`));



 /*
        socket.emit = emits the message to single client that is connecting.

        socket.broadcast.emit =  emits the message to everybody excepts the user that has been connected.

        io.emit = emits he message to all of the clients that has been connected.
    */ 
