import { Entity } from "./entity.js"
import { CONFIG } from "../config.js"

export class Particle extends Entity {
    constructor(context, x, y, radius, color, velocity) {
        super(context, x, y, radius, color, velocity)
    }
    
    draw() {
        this.context.save()
        this.context.globalAlpha = this.alpha
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color
        this.context.fill()
        this.context.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= CONFIG.FRICTION
        this.velocity.y *= CONFIG.FRICTION
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}