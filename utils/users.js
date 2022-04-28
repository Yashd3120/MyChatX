const users = [];

// Joins user to Chat

function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id == id);
}

// When users leaves the chat

function userLeave(id){
    const index  = users.findIndex(user => user.id == id);

    if( index !== -1){
        return users.splice(index , 1)[0];
    }
}

// Get the Users Present in the room

function getRoomUsers(room){
    return users.filter(user => user.room === room );
}
module.exports = {
    userJoin , 
    getCurrentUser,
    userLeave,
    getRoomUsers
};
