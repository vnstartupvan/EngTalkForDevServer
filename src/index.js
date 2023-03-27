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
    origin: ['http://localhost:3000','https://engtalkfordev-client-git-main-vnstartupvan.vercel.app']
}));

const socketIo = require("socket.io")(server, {
    cors: ['http://localhost:3000','https://engtalkfordev-client-git-main-vnstartupvan.vercel.app']
});


const rooms = [];
const peers = [];
socketIo.on("connection", (socket) => {
    const global = new GlobalMap(socket, rooms, peers);
    global.init();
});


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


