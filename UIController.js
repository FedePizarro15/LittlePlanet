export class UIController {
    constructor(game, domElements) {
        this.game = game
        this.domElements = domElements
    }

    updateScore() {
        this.domElements.scoreEl.innerHTML = Math.floor(this.game.score)
        this.domElements.bigScoreEl.innerHTML = Math.floor(this.game.score)
        this.domElements.bigScoreEl2.innerHTML = Math.floor(this.game.score)
    }

    updateRecordScore() {
        this.domElements.recordEl.innerHTML = Math.floor(this.game.record)
        this.domElements.bigRecordEl.innerHTML = Math.floor(this.game.record)
        this.domElements.bigRecordEl2.innerHTML = Math.floor(this.game.record)
    }

    updateTimer() {
        this.domElements.timeEl.innerHTML = this.game.timer
        this.domElements.bigTimeEl.innerHTML = this.game.timer
        this.domElements.bigTimeEl2.innerHTML = this.game.timer
    }

    showGameOver() {
        this.updateScore()
        this.domElements.GOEl.style.display = 'block'
    }

    hideGameOver() {
        this.domElements.GOEl.style.display = 'none'
    }

    showPause() {
        this.updateScore()
        this.domElements.pauseEl.style.display = 'block'
    }

    hidePause() {
        this.domElements.pauseEl.style.display = 'none'
    }

    showModalEl() {
        this.updateScore()
        this.domElements.modalEl.style.display = 'block'
    }
    
    hideModalEl() {
        this.domElements.modalEl.style.display = 'none'
    }
}