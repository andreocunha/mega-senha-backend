const randomItemList = require('random-item-from-list')
const io = require("socket.io")(4000, {
    cors: {
        origin: '*',
    }
});


let players = []
let words = ["Casa", "Alura", "Github", "Jacaré", "Elefante", "Macaco", "Alienigena", "Zumbi", "Programador"]

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit('allplayers', players);

    socket.on('newPlayer', nickname => {
        players.push({ 
            id: socket.id,
            nickname: nickname,
            score: 0
        })   
        console.log(players);
        io.emit('allplayers', players);
    })

    socket.once("disconnect", () => {
        players = players.filter(player => player.id !== socket.id)
        io.emit('allplayers', players);
    })

    socket.on('startGame', () => {
       word = randomItemList(words);
       console.log(word);
       socket.broadcast.emit('word', word);
    })
});

