import { Game } from './game.js'
import { GameController } from './GameController.js'
import { DOMElements } from './domElements.js'
import { CONFIG } from './config.js'

const domElements = new DOMElements()
const game = new Game(domElements, CONFIG)
const gameController = new GameController(game, domElements)