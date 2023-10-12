const path = require('path');
const http = require('http');
const express = require(`express`);
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userleave, getRoomsUser} = require('./utils/users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);


// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// RUn when client connect
io.on('connection', socket => {
     
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id,username, room);
        socket.join(user.room);

    // Welcome Current User
    socket.emit('message', formatMessage(botName,'Welcome to ChatCord..!!'));

    //BRoadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(botName, `${user.username} has joined the chat`)
    );

 
    // Send users and room info

    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomsUser(user.room)
    });


    });

// listrn for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

    io.to(user.room)
    .emit('message', formatMessage(user.username,msg));
    });


    //runs when client disconnected
    socket.on('disconnect', () => {
        const user = userleave(socket.id);
        if(user){
            io.to(user.room)
            .emit('message', formatMessage(botName,`${user.username} has left the chat`)
            );

            // Send users and room info

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomsUser(user.room)
            });
        };
        
    });


});

const PORT = process.env.PORT || 3100;

server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));