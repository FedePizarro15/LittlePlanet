import { InputController } from "./InputController.js"
import { UIController } from "./UIController.js"

export class GameController {
    constructor(game, domElements) {
        this.game = game
        this.uiController = new UIController(domElements)
        this.inputController = new InputController(this.game, domElements)}
        
    //     this.gameStates = {
    //         MENU: 'menu',
    //         PLAYING: 'playing',
    //         PAUSED: 'paused',
    //         GAMEOVER: 'gameover'
    //     }
    //     this.currentState = this.gameStates.MENU
    // }

    // setState(newState) {
    //     this.currentState = newState
    //     switch(newState) {
    //         case this.gameStates.PLAYING:
    //             this.game.startGame()
    //             break
    //         case this.gameStates.PAUSED:
    //             this.game.pauseGame()
    //             break
    //         case this.gameStates.GAMEOVER:
    //             this.game.endGame()
    //             break
    //     }
    // }

    // handleStateTransition(action) {
    //     switch(action) {
    //         case 'START':
    //             this.setState(this.gameStates.PLAYING)
    //             break
    //         case 'PAUSE':
    //             this.setState(this.gameStates.PAUSED)
    //             break
    //         case 'RESUME':
    //             this.setState(this.gameStates.PLAYING)
    //             break
    //         case 'GAMEOVER':
    //             this.setState(this.gameStates.GAMEOVER)
    //             break
    //     }
    // }
}