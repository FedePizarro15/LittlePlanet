// Terminar últimos dos bonus
// Añadir puntaje al recoger bonus
// Nuevos tipos de enemigos y boses
// Controlar por que los enemigos desaparecen
// Poder guardar partidas y records

import { Game } from './game.js'
import { GameController } from './GameController.js'
import { DOMElements } from './domElements.js'
import { UIController } from './UIController.js'
import { CONFIG } from './config.js'

const domElements = new DOMElements()
const uiController = new UIController(null, domElements)
const game = new Game(domElements, CONFIG, uiController)
uiController.game = game
const gameController = new GameController(game, domElements, uiController)