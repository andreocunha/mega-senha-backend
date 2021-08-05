const Status = {
    GUESSING: 'guessing',
    HINTING: 'hinting',
    SPECTATING: 'spectating'
}

class Player {
    constructor (id, nickname) {
        this.id = id;
        this.nickname = nickname;
        this.score = 0;
        this.status = Status.SPECTATING;
    }

    setStatus(status) {
        this.status = status;
    }

    isGuessing() {
        return this.status === this.Status.GUESSING;
    }

    isHinting() {
        return this.status === this.Status.HINTING;
    }

    isSpectating() {
        return this.status === this.Status.SPECTATING;
    }

    addScore() {
        if ( this.isGuessing() ){
            this.score += 2;
        }

        else if (this.isHinting){
            this.score += 1;
        }
    }
}

module.exports = {
    Player,
    Status
};