const io = require("socket.io")(4000, {
    cors: {
        origin: '*',
    }
});
const Game = require('./Game.js');
const { Player } = require('./Player.js');
const game = new Game();

io.on('connection', (socket) => {

    console.log(socket.id); // mostra apenas uma vez o id de uma pessoa que acabou de conectar no site

    socket.emit('allplayers', game.players); // envia as informações do jogadores para apenas o jogador que acabou de conectar no sistema


    // sempre que alguem faz o login no jogo, ele entra nessa função
    socket.on('newPlayer', nickname => {
        game.addPlayer(new Player(socket.id, nickname))
        io.emit('allplayers', game.players);
    })

    // quando o jogador fecha ou recarrega o navegador, ele entra nessa função
    socket.once("disconnect", () => {
        game.removePlayer(socket.id)
        io.emit('allplayers', game.players);
    })

    // função que recebe uma palavra e verifica se está correta
    socket.on("guess", (guessWord) => {
        if(game.guessWord(guessWord)){
            io.emit("correct");
            game.clearGuessedWords();
            game.clearHints();
            console.log('Acertou!')
            console.table(game.players)
        }
    })

    socket.on("hints", (hintWord) => {
        if(game.giveHint(hintWord)){
            io.emit('allHints', game.hints)
        }
    })


    // função que inicia uma rodada
    socket.on('startGame', () => {
        game.startRound();
        io.emit('allplayers', game.players); // atualiza os dados dos jogadores no front
        io.emit('word', game.secretWord); // envia a palavra secreta para todos os jogadores, menos para o jogador que deverá descobrir a palavra
    })
});