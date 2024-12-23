export class UIController {
    constructor(domElements) {
        this.domElements = domElements
    }

    updateScore(score) {
        this.domElements.scoreEl.innerHTML = score
        this.domElements.bigScoreEl.innerHTML = score
        this.domElements.bigScoreEl2.innerHTML = score
    }

    updateRecordScore(record) {
        this.domElements.recordEl.innerHTML = record
        this.domElements.bigRecordEl.innerHTML = record
        this.domElements.bigRecordEl2.innerHTML = record
    }

    updateTimer(timer) {
        this.domElements.timeEl.innerHTML = timer
        this.domElements.bigTimeEl.innerHTML = timer
        this.domElements.bigTimeEl2.innerHTML = timer
    }

    showGameOver(score) {
        this.domElements.GOEl.style.display = 'block'
        this.domElements.bigScoreEl.innerHTML = score
    }

    hideGameOver() {
        this.domElements.GOEl.style.display = 'none'
    }

    showPause() {
        this.domElements.pauseEl.style.display = 'block'
    }

    hidePause() {
        this.domElements.pauseEl.style.display = 'none'
    }

    showModalEl() {
        this.domElements.modalEl.style.display = 'block'
    }
    
    hideModalEl() {
        this.domElements.modalEl.style.display = 'none'
    }

    // Puedes agregar más métodos para manejar otros elementos de la UI
}