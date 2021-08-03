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
    console.log(socket.id); // mostra apenas uma vez o id de uma pessoa que acabou de conectar no site

    socket.emit('allplayers', players); // envia as informações do jogadores para apenas o jogador que acabou de conectar no sistema


    // sempre que alguem faz o login no jogo, ele entra nessa função
    socket.on('newPlayer', nickname => {
        players.push( new Player(socket.id, nickname, 0))
        // console.log(players);
        io.emit('allplayers', players);
    })

    // quando o jogador fecha ou recarrega o navegador, ele entra nessa função
    socket.once("disconnect", () => {
        players = players.filter(player => player.id !== socket.id)
        io.emit('allplayers', players);
    })

    // função para alterar o score de um jogador
    socket.on("addScore", () => {
        player = players.find(player => player.id === socket.id)
        console.log(player)
    })

    // função que inicia uma rodada
    socket.on('startGame', () => {
        players.forEach((player) => { player.endGame()}) // zera o status de todos os jogadores

        let word = randomItemList(words); // escolhe uma palavra aleatoria do array

        let player = players.find(player => player.id === socket.id) // encontra o jogador (que deverá descobrir a palavra), no array de jogadores
        player.setGuessing(true); // altera o estado do jogador

        
        let newListPlayers = players.slice() // cria um novo array com os mesmos jogadores
        newListPlayers.splice(players.indexOf(player), 1) // remove o jogador do array

        let playerGivingHints = randomItemList(newListPlayers) // escolhe um jogador aleatorio do array
        playerGivingHints = players.find(player => player.id === playerGivingHints.id) // encontra o playerGivingHints no array players
        playerGivingHints.setGivingHints(true) // altera o estado do jogador

        io.emit('allplayers', players); // atualiza os dados dos jogadores no front

        socket.broadcast.emit('word', word); // envia a palavra secreta para todos os jogadores, menos para o jogador que deverá descobrir a palavra
    })
});

