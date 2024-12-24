import { resizeElements } from "./utils.js"

export class InputController {
    constructor(game, domElements) {
        this.game = game
        this.domElements = domElements
        this.attachEventListeners()
        this.handleGameStartAndRestart = this.handleGameStartAndRestart.bind(this)
    }

    attachEventListeners() {
        window.addEventListener('click', (event) => this.handleShootProjectiles(event))
        window.addEventListener('keydown', (event) => this.handleKeyDown(event))
        window.addEventListener('resize', () => this.handleResize())
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange())

        this.domElements.startGameBtn.addEventListener('click', () => this.handleGameStartAndRestart(this.domElements.modalEl))
        this.domElements.restartGameBtn.addEventListener('click', () => this.handleGameStartAndRestart(this.domElements.GOEl))
        this.domElements.restartGameBtn2.addEventListener('click', () => this.handleGameStartAndRestart(this.domElements.pauseEl))
        this.domElements.continueGameBtn.addEventListener('click', () => this.handleGameContinue())
    }
    
    handleShootProjectiles(event) {
        if (this.game.gameMode != 'Playing') return

        this.game.player.boost ? this.spawnDoubleProjectiles(event) : this.spawnSingleProjectile(event)
    }
    
    spawnDoubleProjectiles(event) {
        const center = {
            x: this.game.canvas.width / 2,
            y: this.game.canvas.height / 2
        }

        const radius = 3.33
        const color = 'rgb(182, 135, 212)'
        const baseSpeed = 7.5

        const velocity1 = this.calculateProjectileVelocity(event, center, baseSpeed)
        const velocity2 = {
            x: -velocity1.x,
            y: -velocity1.y
        }

        const isPoisoned = this.game.player.powerPoison
    
        this.game.spawnProjectile(center.x, center.y, radius, color, velocity1, isPoisoned)
        this.game.spawnProjectile(center.x, center.y, radius, color, velocity2, isPoisoned)
    }
    
    spawnSingleProjectile(event) {
        const center = {
            x: this.game.canvas.width / 2,
            y: this.game.canvas.height / 2
        }

        const radius = 5
        const color = 'rgb(182, 135, 212)'

        const velocity = this.calculateProjectileVelocity(event, center)

        const isPoisoned = this.game.player.powerPoison
    
        this.game.spawnProjectile(center.x, center.y, radius, color, velocity, isPoisoned)
    }

    calculateProjectileVelocity(event, center, baseSpeed = 5) {
        const angle = Math.atan2(
            event.clientY - center.y,
            event.clientX - center.x
        )

        return {
            x: Math.cos(angle) * baseSpeed,
            y: Math.sin(angle) * baseSpeed
        }
    }

    handleGameStartAndRestart(elToHide) {
        this.game.init()
        elToHide.style.display = 'none'

        setTimeout(() => {
            this.game.projectiles.splice(0, 1)
        }, 1)
        this.game.gameMode = "Playing"
        this.game.animate()
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' && this.game.gameMode === "Paused") {
            this.handleGameContinue()
        } else if (event.key === 'Escape' && this.game.gameMode === "Playing") {
            this.handleGamePause()
        } else if (event.key === " " && this.game.gameMode === "Playing") {
            this.handleBoostToggle()
        }
    }

    handleGameContinue() {
        this.game.esc++

        this.game.enemyIntervals.forEach(interval => clearInterval(interval))
        this.game.enemyIntervals = []
    
        this.game.bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
        this.game.bonusIntervals = []

        this.game.gameMode = "Playing"

        this.game.startSpawners()

        setTimeout(() => {
            this.game.projectiles.splice(0, 1)
        }, 1)
    
        this.game.animate()
        this.game.uiController.hidePause()
    }
    
    handleGamePause() {
        this.game.esc++

        cancelAnimationFrame(this.game.animationID)
    
        this.game.enemyIntervals.forEach(interval => clearInterval(interval))
        this.game.bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
        
        this.domElements.bigScoreEl2.innerHTML = this.game.score
        this.domElements.pauseEl.style.display = 'block'
    
        this.game.gameMode = "Paused"
    }

    handleBoostToggle() {
        this.game.player.boost = !this.game.player.boost
    }

    handleResize() {
        const oldWidth = this.game.canvas.width
        const oldHeight = this.game.canvas.height
        
        this.game.canvas.width = window.innerWidth
        this.game.canvas.height = window.innerHeight
    
        const scaleX = this.game.canvas.width / oldWidth
        const scaleY = this.game.canvas.height / oldHeight
    
        this.game.player.x = this.game.canvas.width / 2
        this.game.player.y = this.game.canvas.height / 2
    
        resizeElements(this.game.projectiles, scaleX, scaleY)
        resizeElements(this.game.enemies, scaleX, scaleY)
        resizeElements(this.game.particles, scaleX, scaleY)
        resizeElements(this.game.stars, scaleX, scaleY)
        resizeElements(this.game.bonusList, scaleX, scaleY)
    }

    handleVisibilityChange() {
        if (document.hidden && this.game.gameMode === "Playing") {
            this.handleGamePause()
        }
    }
}