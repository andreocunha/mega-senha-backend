const randomItemList = require("random-item-from-list");
const { Player, Status } = require("./Player.js");

class Game {
  constructor() {
    this.round = 0;
    this.statusGame = false;
    this.players = [];
    this.words = [
      "Bala",
      "Bola",
      "Abacate",
      "Abacaxi",
      "Ajuda",
      "Azedo",
      "Alicate",
      "Banana",
      "Batata",
      "Beleza",
      "Bexiga",
      "Bife",
      "Bigode",
      "Boca",
      "Bobo",
      "Café",
      "Bode",
      "Cafuné",
      "Canela",
      "Coxa",
      "Canudo",
      "Caneta",
      "Cubo",
      "Doze",
      "Dominó",
      "Dúvida",
      "Dama",
      "Dívida",
      "Data",
      "Dedo",
      "Exame",
      "Educado",
      "Exemplo",
      "Fé",
      "Época",
      "Farofa",
      "Fumaça",
      "Furo",
      "Galo",
      "Gama",
      "Goma",
      "Gola",
      "Galinha",
      "Gorila",
      "Gula",
      "Guri",
      "Guru",
      "Hábito",
      "Macaco",
      "Habilidade",
      "Hálito",
      "Hino",
      "Hipopótamo",
      "Ídolo",
      "Idade",
      "Imagem",
      "Imigrante",
      "Iluminado",
      "Janela",
      "Jaleco",
      "Jabuti",
      "Jabá",
      "Javali",
      "Jipe",
      "Jiló",
      "Judô",
      "Lâmina",
      "Lã",
      "Laje",
      "Leve",
      "Lima",
      "Lupa",
      "Luto",
      "Mala",
      "Luva",
      "Maluco",
      "Moleza",
      "Menina",
      "Menino",
      "Mudo",
      "Nada",
      "Natureza",
      "Nítido",
      "Novela",
      "Pato",
      "Pipa",
      "Opaco",
      "Pepino",
      "Perigo",
      "Peteca",
      "Pomada",
      "Tomate",
      "Puma",
      "Rápido",
      "Saco",
      "Sacola",
      "Rolo",
      "Sede",
      "Sábado",
      "Sopa",
      "Copo",
      "Sujo",
      "Subida",
      "Suco",
      "Tela",
      "Tubo",
      "Urina",
      "Universo",
      "Único",
      "Unidade",
      "Vaca",
      "Urubu",
      "Vaso",
      "Vara",
      "Vizinho",
      "Vela",
      "Xícara",
      "Xaveco",
      "Xarope",
      "Xerife",
      "Xícara",
      "Zero",
      "Dica",
      "Leão",
      "Tigre",
      "Onça",
      "Azul",
      'Roxo"',
    ];
    this.secretWord = null;
    this.guessedWords = [];
    this.hints = [];
  }

  setStatusGame(status) {
    this.statusGame = status;
  }

  getStatusGame() {
    return this.statusGame;
  }

  getRound() {
    return this.round;
  }

  iterateRound() {
    this.round++;
  }

  verifyRound(round) {
    return this.round === round;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(removedPlayerID) {
    this.players = this.players.filter(
      (player) => player.id !== removedPlayerID
    );
  }

  givePoints() {
    this.players.forEach((player) => player.addScore());
  }

  getHinter() {
    return this.players.filter((player) => player.status === Status.HINTING);
  }

  getGesser() {
    return this.players.filter((player) => player.status === Status.GUESSING);
  }

  getSpectators() {
    let spectatorsPlayerList = this.players.slice();
    spectatorsPlayerList = spectatorsPlayerList.filter(
      (player) => player.status === Status.SPECTATING
    );

    return spectatorsPlayerList;
  }

  getPlayer(socketID) {
    return this.players.find((player) => player.id === socketID);
  }

  setSecretWord() {
    this.secretWord = randomItemList(this.words);
  }

  setPlayerGuivingHints() {
    const spectators = this.getSpectators();
    let chosenPlayer = randomItemList(spectators);

    chosenPlayer.setStatus(Status.HINTING);
  }

  setPlayerGuessing() {
    const spectators = this.getSpectators();
    let chosenPlayer = randomItemList(spectators);

    chosenPlayer.setStatus(Status.GUESSING);
  }

  startRound() {
    this.setStatusGame(true);
    this.clearStatus();
    this.setSecretWord();
    this.setPlayerGuessing();
    this.setPlayerGuivingHints();
  }

  clearGuessedWords() {
    this.guessedWords = [];
  }

  clearHints() {
    this.hints = [];
  }

  clearStatus() {
    this.players.forEach((player) => player.setStatus(Status.SPECTATING));
  }

  clearRounds() {
    this.round = 1;
  }

  clearScores() {
    this.players.forEach((player) => {
      player.score = 0;
    });
  }

  guessWord(guess) {
    this.guessedWords.push(guess);

    if (guess.toLowerCase() === this.secretWord.toLowerCase()) {
      this.givePoints();
      this.iterateRound();
      this.clearGuessedWords();
      this.clearHints();
      this.setSecretWord();
      this.clearStatus();
      this.setPlayerGuessing();
      this.setPlayerGuivingHints();

      return true;
    } else return false;
  }

  giveHint(hint) {
    this.hints.push(hint);
  }

  lastRound() {
    if (this.round === 30) {
      return true;
    }

    return false;
  }
}

module.exports = Game;
