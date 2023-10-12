const users = [];

//join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

//Get Current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function  userleave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index != -1)
    {
        return users.splice(index, 1)[0];
    }
}

// Get Room Users
function getRoomsUser(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userleave,
    getRoomsUser
};