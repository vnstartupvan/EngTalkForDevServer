const Room = require('./roomSocket');
module.exports = class GlobalMap {
    constructor(socket, rooms) {
        this.rooms = rooms;
        this.socket = socket;
    }

    init() {
        this.handleReceiveEvent();
        this.handleSendSignal();
        // console.log('init')
    }

    handleSendSignal(url) {
        // console.log('send signal: ', this.rooms, url)
        this.socket.emit('rooms-signal', this.rooms);
    }

    handleCreateRoom(item) {
        const { url,
            userLimit,
            topic,
            language,
            level,
            _id,
            groupAdmin } = item;
        const room = new Room(url, userLimit, topic, language, level, _id, groupAdmin);
        this.rooms.push(room);
        this.signal = true;
        this.handleSendSignal()
    }

    handleDeleteRoom(item) {
        const updatedRoom = this.rooms.filter(i => i.url !== item.url);
        this.rooms = updatedRoom;
    }

    handleJoinRoom(url, user, peerId) {
        const roomIndex = this.rooms.findIndex(i => i.url === url);

        if (roomIndex !== -1) {
            const isJoint = this.rooms[roomIndex].users.findIndex(i => i.fullname === user.fullname && i._id === user._id);

            if (isJoint === -1 || this.rooms[roomIndex].users.length === 0) {
                user.peerId = peerId;
                this.rooms[roomIndex].users.push(user);
            }
        }

        this.socket.join(url);
        this.socket.emit("joint-room", this.rooms[roomIndex].users);
        this.socket.emit('rooms-signal', this.rooms);
        this.socket.to(url).emit('new-user-connect', user)

        //User disconnect
        this.socket.on('disconnect', () => {
            console.log('user disconnected: ', user);
            const userIndex = this.rooms[roomIndex].users.findIndex(i => i._id === user.id);
            this.rooms[roomIndex].users.splice(userIndex, 1);
            this.handleSendSignal();
        })
    }

    handleLeaveRoom(url, user) {
        console.log('leave: ', url, user)
        // const roomIndex = this.rooms.findIndex(i => i.url === url);
        // if (roomIndex !== -1) {
        //     this.rooms[roomIndex].handleLeaveRoom(user);
        // }
    }

    handleReceiveEvent() {
        this.socket.on('create-room', this.handleCreateRoom.bind(this));
        this.socket.on('delete-room', this.handleDeleteRoom);
        this.socket.on('join-room', this.handleJoinRoom.bind(this));
        this.socket.on('leave-room', this.handleLeaveRoom.bind(this));
        this.socket.on('client-send-video', (roomURL, stream) => {
            console.log('video: ', roomURL, stream)
            this.socket.to(roomURL).emit('server-send-video', (stream));
        })
        this.socket.on('send-peerId', (peerId) => {
            console.log('peerId: ', peerId);
            this.socket.emit('peerId', peerId);
        })
    }

}

