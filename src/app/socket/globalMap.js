const Room = require('./roomSocket');
module.exports = class GlobalMap {
    constructor(socket) {
        this.rooms = [];
        this.socket = socket;
        this.signal = false;
    }

    init() {
        this.handleReceiveEvent();
        console.log('init')
    }

    handleSendSignal() {
        this.socket.emit('signal-room', this.rooms);
        this.signal = false;
    }

    handleCreateRoom(item) {
        const room = new Room(item);
        this.rooms.push(room);
        this.signal = true;
    }

    handleDeleteRoom(item) {
        const updatedRoom = this.rooms.filter(i => i.url !== item.url);
        this.rooms = updatedRoom;
        this.signal = true;
    }

    handleJoinRoom(url, user) {
        const roomIndex = this.rooms.findIndex(i => i.url === url);
        if (roomIndex !== -1) {
            this.rooms[roomIndex].handleJoinRoom(user);
            this.signal = true;
        }
    }

    handleLeaveRoom(url, user) {
        const roomIndex = this.rooms.findIndex(i => i.url === url);
        if (roomIndex !== -1) {
            this.rooms[roomIndex].handleLeaveRoom(user);
            this.signal = true;
        }
    }

    handleReceiveEvent() {
        this.socket.on('create-room', this.handleCreateRoom);
        this.socket.on('delete-room', this.handleDeleteRoom);

        if (this.signal) {
            handleSendSignal();
        }
    }

}

