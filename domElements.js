export class DOMElements {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        
        this.scoreEl = document.querySelector('#scoreEl')
        this.bigScoreEl = document.querySelector('#bigScoreEl')
        this.bigScoreEl2 = document.querySelector('#bigScoreEl2')
        
        this.recordEl = document.querySelector('#recordEl')
        this.bigRecordEl = document.querySelector('#bigRecordEl')
        this.bigRecordEl2 = document.querySelector('#bigRecordEl2')
        
        this.timeEl = document.querySelector('#timeEl')
        this.bigTimeEl = document.querySelector('#bigTimeEl')
        this.bigTimeEl2 = document.querySelector('#bigTimeEl2')
        
        this.startGameBtn = document.querySelector('#startGameBtn')
        this.restartGameBtn = document.querySelector('#restartGameBtn')
        this.restartGameBtn2 = document.querySelector('#restartGameBtn2')
        this.continueGameBtn = document.querySelector('#continueGameBtn')
        
        this.modalEl = document.querySelector('#modalEl')
        this.GOEl = document.querySelector('#GOEl')
        this.pauseEl = document.querySelector('#pauseEl')
    }
}