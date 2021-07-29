const randomItemList = require('random-item-from-list')
const io = require("socket.io")(4000, {
    cors: {
        origin: '*',
    }
});

class Player {
    constructor (id, nickname, score)
    {
        this.id = id;
        this.nickname = nickname;
        this.score = score;
        this.givingHints = false;
        this.guessing = false;
    }

    addScore(){
        if(this.givingHints){
            this.score += 1;
        }
        else if(this.guessing){
            this.score += 2;
        }
    }

    setGuessing(status){
        this.guessing = status;
    }
    setGivingHints(status){
        this.givingHints = status;
    }
    endGame(){
        this.givingHints = false;
        this.guessing = false;
    }
}


let players = []
let words = ["Casa", "Alura", "Github", "Jacaré", "Elefante", "Macaco", "Alienigena", "Zumbi", "Programador"]


io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit('allplayers', players);

    socket.on('newPlayer', nickname => {
        players.push( new Player(socket.id, nickname, 0))
        console.log(players);
        io.emit('allplayers', players);
    })

    socket.once("disconnect", () => {
        players = players.filter(player => player.id !== socket.id)
        io.emit('allplayers', players);
    })

    socket.on("addScore", () => {
        player = players.find(player => player.id === socket.id)
        console.log(player)
    })

    socket.on('startGame', () => {
        let word = randomItemList(words);
        let player = players.find(player => player.id === socket.id)
        player.setGuessing(true);

        
        let newListPlayers = players.slice()
        newListPlayers.splice(players.indexOf(player), 1) // remove o jogador da lista

        console.log(newListPlayers)

        let playerGivingHints = randomItemList(players)
        playerGivingHints.setGivingHints(true)

        socket.broadcast.emit('word', word);
        io.emit('allplayers', players);
    })
});

