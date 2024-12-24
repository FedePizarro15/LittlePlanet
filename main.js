// Los enemigos reciben menos daño si se ataca rápido (creo que se cancela la animación anterior, por lo que no llegan a reducir el radio y arranca nuevamente la nueva animación)
// Terminar últimos dos bonus
// Nuevos tipos de enemigos y boses
// Añadir puntaje al recoger bonus
// Poner tiempo limitado para la aparición de los bonus

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