import {Server} from 'socket.io';

const PORT = process.env.PORT || 9000

let active_users = []
let users = []

const io = new Server(PORT, {
    cors: {
        origin: "https://whatsapp-clone-client-mern.herokuapp.com"
    }
})

const addUser = (userId, socketId) => {
    if (!active_users.some(user => user.userId === userId))
        active_users.push({userId, socketId});

    if (!users.some(user => user.userId === userId))
        users.push({userId, socketId});
}

const getUser = (receiverId) => {
    return users.find(user => user.userId === receiverId)
}

const removeUser = (socketId) => {
    active_users = active_users.filter(user => user.socketId !== socketId);
}

io.on('connection', socket => {
    console.log('Socket connected!!'),
    socket.on('addUser', userId => {
        addUser(userId, socket.id);
        io.emit('getUsers', active_users);
    })

    socket.on('sendMessage', ({senderId, receiverId, message}) => {
        const receiver = getUser(receiverId);
        io.emit('getMessage', {senderId, receiverId, message});
        //console.log(senderId, receiverId, receiver.socketId, message);
    })

    socket.on('disconnect', () => {
        removeUser(socket.id);
        io.emit('getUsers', active_users);
    })

})
