const randomItemList = require('random-item-from-list');
const { Player, Status } = require('./Player.js');

class Game {
    constructor() {
        this.players = [];
        this.words = ["Casa", "Alura", "Github", "Jacaré", "Elefante", "Macaco", "Alienigena", "Zumbi", "Programador"];
        this.secretWord = null;
        this.guessedWords = [];
        this.hints = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer( removedPlayerID ) {
        this.players = this.players.filter(player => player.id !== removedPlayerID )
    }

    givePoints(){
        this.players.forEach( player => player.addScore())
    }

    getHinter(){
        return this.players.filter(player => player.status === Status.HINTING);
    }

    getGesser() {
        return this.players.filter(player => player.status === Status.GUESSING);
    }

    getSpectators(){
        let spectatorsPlayerList = this.players.slice()
        spectatorsPlayerList = spectatorsPlayerList.filter( player => player.status === Status.SPECTATING);
        
        return spectatorsPlayerList;
    }

    getPlayer(socketID){
        return this.players.find(player => player.id === socketID);
    }

    setSecretWord() {
        this.secretWord = randomItemList(this.words);
    }

    setPlayerGuivingHints(){
        const spectators = this.getSpectators();
        let chosenPlayer = randomItemList(spectators);
        
        chosenPlayer.setStatus(Status.HINTING);
    }

    setPlayerGuessing(){
        const spectators = this.getSpectators();
        let chosenPlayer = randomItemList(spectators);
        
        chosenPlayer.setStatus(Status.GUESSING);
    }

    startRound() {
        this.clearStatus();
        this.setSecretWord();
        this.setPlayerGuessing();
        this.setPlayerGuivingHints();
    }

    clearStatus() {
        this.players.forEach( player => player.setStatus(Status.SPECTATING));
    }

    guessWord(guess){
        
        this.guessedWords.push(guess);

        if (guess === this.secretWord){
            this.givePoints();
            return true;
        }

        else return false;
    }

    giveHint(hint){
        if (this.hints.length >= 3) {
            return false;
        }
        else {
            this.hints.push(hint);
            return true;
        }
    }
}

module.exports = Game;