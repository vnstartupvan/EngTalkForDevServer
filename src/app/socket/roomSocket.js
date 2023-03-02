module.exports = class Room {
    constructor(socket, _id, url, groupAdmin, userLimit, topic, language, level) {
        this.socket = socket;
        this._id = _id;
        this.url = url;
        this.groupAdmin = groupAdmin;
        this.userLimit = userLimit;
        this.topic = topic;
        this.language = language;
        this.level = level;
        this.users = [];

    }

    handleJoinRoom(user) {
        const isExisted = this.users.findIndex(i => i._id === user._id);
        if (!isExisted) this.users.push(user);
    }

    handleLeaveRoom(user) {
        const updatedUsers = this.users.filter(i => i._id !== user._id);
        this.users = updatedUsers;
    }

};