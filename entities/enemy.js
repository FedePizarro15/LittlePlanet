import { Entity } from "./entity.js"

export class Enemy extends Entity {
    constructor(context, x, y, radius, color, velocity, difficulty) {
        super(context, x, y, radius, color, velocity)
        this.difficulty = difficulty
        this.isDestroying = false
        this.normalizeVelocity()
    }

    normalizeVelocity() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
        if (speed !== 0) {
            this.velocity.x = (this.velocity.x / speed) * (15 * this.difficulty)
            this.velocity.y = (this.velocity.y / speed) * (15 * this.difficulty)
        }
    }

    update() {
        this.draw()
        const velocityScale = this.difficulty / (this.radius * 2)
        this.x += this.velocity.x * velocityScale
        this.y += this.velocity.y * velocityScale
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