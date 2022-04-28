const chatForm  = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get the username and the room that has
// been joined from the url 
/*
    For getting the username and room values 
    from the url we are using Query String 
    Library i.e qs
*/

const { username , room } = Qs.parse(location.search, {
    // To ignore the Symbols in URL ( $,&)
    ignoreQueryPrefix : true

});
const socket = io();

// Join Chatroom 
socket.emit('joinRoom' , {username, room});

// Get room and users 
socket.on('roomUsers', ({ room, users}) =>{

    outputRoomName(room);
    outputUsers(users);

});
// Message from Server
socket.on('message', message => {

    console.log(message);
    outputMessage(message); 

    // Scroll down automatically when message 
    // is recived

    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Mesage submits

chatForm.addEventListener('submit' , (e) => {
    e.preventDefault();

    // Getting message text from Form 
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage',msg);

    // Clears the Message Field everytime 
    // a message has been sent.

    e.target.elements.msg.value = '';
    // Brings the Focus again on Message Field
    e.target.elements.msg.focus();
});

// Output Message to ChatBox.

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add Room Name to side Bar
function outputRoomName() {

    roomName.innerText = room;
}

// Add Current Users to Side Bar 
function outputUsers(users){
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
