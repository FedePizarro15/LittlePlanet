import { Entity } from "./entity.js"

export class Star extends Entity {
    constructor(context, x, y, radius, color, alpha, velocity) {
        super(context, x, y, radius, color, velocity)
        this.alpha = alpha
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
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.002
    }
}