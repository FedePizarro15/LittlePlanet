import { Entity } from "./entity.js"

export class Enemy extends Entity {
    constructor(context, x, y, radius, color, velocity, difficulty) {
        super(context, x, y, radius, color, velocity)
        this.difficulty = difficulty
        this.isDestroying = false
        this.isPoisoned = 0
        this.normalizeVelocity()
    }

    draw() {
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color
        this.context.globalAlpha = this.alpha
        this.context.fill()
        this.context.globalAlpha = 1

        this.context.fillStyle = 'white'
        this.context.font = '12px Arial'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText(Math.round(this.radius), this.x, this.y)
    }

    normalizeVelocity() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
        if (speed !== 0) {
            this.velocity.x = (this.velocity.x / speed) * (15 * this.difficulty)
            this.velocity.y = (this.velocity.y / speed) * (15 * this.difficulty)
        }
    }

    update(game, enemyIndex, damageTexts) {
        this.draw()
        const velocityScale = this.difficulty / (this.radius * 2)
        this.x += this.velocity.x * velocityScale
        this.y += this.velocity.y * velocityScale

        if (!this.isPoisoned) return

        if (this.isPoisoned > 0) {
            this.isPoisoned--

            if (this.isPoisoned % 60 === 0) {
                this.getDamage(3, game, enemyIndex, damageTexts)
                console.log('Poison Damage')
                console.log(this.isPoisoned)
            }
        } else {
            this.isPoisoned = 0
        }
    }

    getDamage(damage, game, enemyIndex, damageTexts) {
        if (this.isDestroying) return
        
        gsap.to(this, {radius: this.radius - damage})
        this.showDamage(damage, damageTexts)

        game.score += damage
        game.uiController.updateScore(game.score)

        if (this.radius < 15) {
            this.enemyDestroy(game, enemyIndex)

            game.score += 50
            game.uiController.updateScore(game.score)

            return
        }
    }

    getDamage(damage, game, enemyIndex, damageTexts) {
        if (this.isDestroying) return
        
        const newRadius = this.radius - damage
        
        if (newRadius < 10) {
            this.enemyDestroy(game, enemyIndex)

            game.score += 50 + damage
            game.uiController.updateScore(game.score)

            return
        }
    
        gsap.to(this, {radius: newRadius})
        this.showDamage(damage, damageTexts)
    
        game.score += damage
        game.uiController.updateScore(game.score)
    }
        
    showDamage(damage, damageTexts) {
        damageTexts.push({
            x: this.x,
            y: this.y,
            damage: damage,
            alpha: 1,
            duration: 60,
            color: this.color
        })
    }

    enemyDestroy(game, enemyIndex) {
        this.isDestroying = true
        this.velocity = {
            x: this.velocity.x * this.radius / 20 / this.difficulty,
            y: this.velocity.y * this.radius / 20 / this.difficulty
        }

        gsap.to(this, {
            radius: 0,
            alpha: 0,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
                if (game.enemies.includes(this)) {
                    game.enemies.splice(enemyIndex, 1)
                }
            }
        })
    }
}