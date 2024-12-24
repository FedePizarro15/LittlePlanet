import {
    clearIntervals,
    spawnEnemies,
    spawnBonus,
    updateTimer,
    updateBackground,
    updateRecord,
    updateStars,
    updateParticles,
    updateProjectiles,
    updateBonus,
    isCollision,
    updateDamageTexts,
    resizeElements,
    createParticlesOnCollision,
    randomStarDirection,
    secondsToFrames
} from './utils.js'
import { Player } from './entities/player.js'
import { Star } from './entities/star.js'
import { Projectile } from './entities/projectile.js'
import { UIController } from './UIController.js'


class Game {
    constructor(domElements, config) {
        this.domElements = domElements
        this.config = config

        this.uiController = new UIController(domElements)

        this.canvas = domElements.canvas
        this.context = domElements.context
        
        this.animate = this.animate.bind(this)

        this.player = null

        this.projectiles = []
        this.enemies = []
        this.particles = []
        this.stars = []
        this.damageTexts = []
        this.bonusList = []
        this.enemyIntervals = []
        this.bonusIntervals = []

        this.animationID = null
        
        this.score = 0
        this.record = 0
        this.difficulty = this.config.INITIAL_DIFFICULTY
        this.frames = 0
        this.time = 0
        this.timer = 0
        
        this.starDirectionX = randomStarDirection()
        this.starDirectionY = randomStarDirection()
        
        this.gameMode = "Starting"
        this.esc = 0
        this.interval = this.config.ENEMY_SPAWN_INTERVAL
        this.bonusInterval = this.config.BONUS_SPAWN_INTERVAL
    }

    init() {
        this.setupCanvas()
        this.createPlayer()
        this.resetEntities()
        this.resetGameState()
        this.startSpawners()
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    createPlayer() {
        const x = this.canvas.width / 2
        const y = this.canvas.height / 2
        this.player = new Player(this.context, x, y)
    }

    resetEntities() {
        this.projectiles = []
        this.enemies = []
        this.particles = []
        this.stars = []
        this.damageTexts = []
        this.bonusList = []
        
        clearIntervals(this.enemyIntervals, this.bonusIntervals)
    }
                
    resetGameState() {
        this.score = 0
        this.difficulty = this.config.INITIAL_DIFFICULTY
        this.frames = 0
        this.time = 0
        this.timer = 0
        this.gameMode = "Playing"
        this.esc = 0
        this.interval = this.config.ENEMY_SPAWN_INTERVAL
        this.bonusInterval = this.config.BONUS_SPAWN_INTERVAL
    }

    startSpawners() {
        if (this.config.ENEMY_GENERATION) {
            spawnEnemies(this.context, this.interval, this.config.ENEMY_SPAWN_INTERVAL, this.difficulty, this.enemyIntervals, this.gameMode, this.enemies, this.canvas)
        }
    
        spawnBonus(this.bonusInterval, this.config.BONUS_SPAWN_INTERVAL, this.difficulty, this.bonusIntervals, this.gameMode, this.bonusList, this.context, this.canvas)
    }
                
    animate() {
        if (this.gameMode != "Playing") return

        this.animationID = requestAnimationFrame(this.animate)
        this.difficulty *= this.config.DIFFICULTY_INCREASE
        
        updateBackground(this.context, this.canvas.width, this.canvas.height)

        const {frames, time, timer} = updateTimer(this.frames, this.time, this.timer)
        this.frames = frames
        this.time = time
        this.timer = timer
        this.uiController.updateTimer(this.timer)

        this.uiController.updateScore(this.score)

        const record = updateRecord(this.score, this.record)
        this.record = record
        this.uiController.updateRecordScore(this.record)

        this.updateEntities(this.stars, this.particles, this.projectiles, this.bonusList, this.enemies, this.damageTexts, this.context, this.canvas.width, this.canvas.height, this.player)
        this.maintainStarCount()
    }

    updateEntities(stars, particles, projectiles, bonusList, enemies, damageTexts, context, width, height, player) {
        updateStars(stars)
        updateParticles(particles)
        updateProjectiles(projectiles, width, height)
        player.update()
        updateBonus(bonusList, projectiles, player)
        this.updateEnemies(enemies, projectiles)
        updateDamageTexts(damageTexts, context)
    }
    
    updateEnemies(enemies, projectiles) {
        for (let index = enemies.length - 1; index >= 0; index--) {
            const enemy = enemies[index]
            enemy.update(this, index, this.damageTexts)
    
            if (isCollision(this.player, enemy) && !this.config.TEST && !enemy.isDestroying) {
                this.endGame(enemy, index)
                return
            }
    
            for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
                const projectile = projectiles[projectileIndex]
                
                if (isCollision(projectile, enemy)) {
                    this.handleEnemyProjectileCollision(projectile, enemy, index)
                    break
                }
            }
        }
    }
    
    endGame(enemy, enemyIndex) {
        if (this.player.powerShield) {
            enemy.isDestroying = true
            this.enemies.splice(enemyIndex, 1)
            
            this.player.deactivateShield()
        } else {
            cancelAnimationFrame(this.animationID)
            clearIntervals(this.enemyIntervals, this.bonusIntervals)
            this.gameMode = "Lost"
            this.uiController.showGameOver(this.score)
        }
    }
    
    handleEnemyProjectileCollision(projectile, enemy, enemyIndex) {
        if (enemy.isDestroying) return
    
        createParticlesOnCollision(projectile, enemy, this.particles)

        this.handleEnemyDamage(projectile, enemy, enemyIndex)
    }

    handleEnemyDamage(projectile, enemy, enemyIndex) {
        if (projectile.powerPoison) {
            enemy.isPoisoned += secondsToFrames(3)
        }

        this.projectiles.splice(this.projectiles.indexOf(projectile), 1)
        
        let damage = projectile.radius * 2
        enemy.getDamage(damage, this, enemyIndex, this.damageTexts)
    }

    maintainStarCount() {
        while (this.stars.length < this.config.MAX_STARS) {
            this.stars.push(new Star(
                this.context,
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 0.95 + 0.1,
                'rgba(255, 255, 230, 0.25)',
                Math.random() * 0.99 + 0.01,
                {x: this.starDirectionX, y: this.starDirectionY}
            ))
        }
    }

    spawnProjectile(x, y, radius, color, velocity, isPoisoned) {
        const projectile = new Projectile(this.context, x, y, radius, color, velocity, isPoisoned)
        this.projectiles.push(projectile)

        if (this.player.powerBullets) {
            setTimeout(() => {
                const projectile2 = new Projectile(this.context, x, y, radius, color, velocity, isPoisoned)
                this.projectiles.push(projectile2)
            }, 100)
        }
    }

    resizeCanvas() {
        const oldWidth = this.canvas.width
        const oldHeight = this.canvas.height
        
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight
    
        const scaleX = this.canvas.width / oldWidth
        const scaleY = this.canvas.height / oldHeight
    
        this.player.x = this.canvas.width / 2
        this.player.y = this.canvas.height / 2
    
        resizeElements(this.projectiles, scaleX, scaleY)
        resizeElements(this.enemies, scaleX, scaleY)
        resizeElements(this.particles, scaleX, scaleY)
        resizeElements(this.stars, scaleX, scaleY)
        resizeElements(this.bonusList, scaleX, scaleY)
    }

}

export { Game }