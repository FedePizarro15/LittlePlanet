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
}