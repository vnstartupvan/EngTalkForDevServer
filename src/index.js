const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);
const dotenv = require('dotenv');
const route = require('./routes/index');
const GlobalMap = require('./app/socket/globalMap');

dotenv.config();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

const PORT = process.env.PORT || 3001;

const URI = process.env.URI || 'mongodb+srv://engtalkfordev:engtalkfordev@cluster0.xah4te4.mongodb.net/?retryWrites=true&w=majority';

app.use('/', cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

const socketIo = require("socket.io")(server, {
    cors: 'http://localhost:3000'
});

const rooms = [];

socketIo.on("connection", (socket) => {
    console.log('connect')
    const global = new GlobalMap(socket);
    global.init();
});

// socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
//     // console.log("New client connected" + socket.id);

//     socket.on("testSocket", (data) => {
//         console.log(data)
//     })

//     socket.on("test", function (data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
//         socketIo.emit("sendDataServer", data);// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
//     })

//     socket.on("disconnect", () => {
//         console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
//     });

//     socket.on("create-room", () => {
//         socketIo.emit("new room signal")
//     })
//     socket.on("join-room", (roomUrl, user) => {
//         console.log('new user has join: ', user, roomUrl)
//         socket.on('disconnect', () => {
//             socketIo.to(roomUrl).emit("user-disconnect", user);
//         })

//         //Check is room existed 
//         const roomIndex = rooms.findIndex((i) => i.url === roomUrl);
//         //Create room and add the user to the room
//         if (roomIndex == -1) {
//             const room = {
//                 url: roomUrl,
//                 users: [user]
//             }
//             rooms.push(room)
//         } else {
//             //Check if the user is not in the room then push this user to the room
//             const isUserJoint = rooms[roomIndex].users.findIndex(u => u._id === user._id);
//             if (isUserJoint === -1) rooms[roomIndex].users.push(user);
//         }
//         const currentRoom = rooms.findIndex(i => i.url === roomUrl);
//         socket.join(roomUrl);
//         socketIo.to(roomUrl).emit("join-room", rooms[currentRoom].users)
//     })
// });




mongoose.set('strictQuery', false);
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connect to DB');
        server.listen(PORT, () => {
            console.log('run server');
        });
    })
    .catch(err => {
        throw (err);
    })


route(app);


