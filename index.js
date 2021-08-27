const port = process.env.PORT || 4000;

const io = require("socket.io")(port, {
    cors: {
        origin: '*',
    }
});
const { emit } = require("nodemon");
const Game = require('./Game.js');
const { Player } = require('./Player.js');
const game = new Game();

io.on('connection', (socket) => {

    console.log(socket.id); // mostra apenas uma vez o id de uma pessoa que acabou de conectar no site

    socket.emit('allplayers', game.players); // envia as informações do jogadores para apenas o jogador que acabou de conectar no sistema
    socket.emit('statusGame', game.statusGame); // envia as informações do status do jogo para apenas o jogador que acabou de conectar no sistema

    // sempre que alguem faz o login no jogo, ele entra nessa função
    socket.on('newPlayer', nickname => {
        game.addPlayer(new Player(socket.id, nickname))
        io.emit('allplayers', game.players);
    })

    socket.on('round', () => {
        io.emit('allRounds', game.getRound());
    })

    // quando o jogador fecha ou recarrega o navegador, ele entra nessa função
    socket.once("disconnect", () => {
        game.removePlayer(socket.id)
        io.emit('allplayers', game.players);

        if (game.players.length === 0) {
            game.clearGuessedWords();
            game.clearHints();
            game.clearRounds();
            game.setStatusGame(false);
            io.emit("endRound");
        }
    })

    // função que recebe uma palavra e verifica se está correta
    socket.on("guess", (guessWord) => {
        if(game.guessWord(guessWord)){
            io.emit('correct', game.players);
        }
        io.emit('allGuess', game.guessedWords);
    })

    socket.on("hints", (hintWord) => {
        game.giveHint(hintWord)
        io.emit('allHints', game.hints)
    })

    socket.on("status", () => {
        socket.emit('statusGame', game.statusGame);
    })


    // função que inicia uma rodada
    socket.on('startGame', () => {
        if(!game.statusGame){
            game.startRound();
            io.emit('allplayers', game.players); // atualiza os dados dos jogadores no front
            io.emit('word', game.secretWord); // envia a palavra secreta para todos os jogadores, menos para o jogador que deverá descobrir a palavra
            
            let round = game.getRound();
            setTimeout(() => {
                console.log(round, game.getRound());

                if(game.verifyRound(round)){
                    game.clearGuessedWords();
                    game.clearHints();
                    game.iterateRound();
                    game.setStatusGame(false);
                    io.emit('endRound');
                }
            }, 60000)
        }
    })
});