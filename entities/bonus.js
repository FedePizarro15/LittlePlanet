import { Entity } from "./entity.js"

export class Bonus extends Entity {
    constructor(context, x, y, type) {
        const radius = 17.5
        const color = 'hsl(144, 50%, 50%)'
        const velocity = {x: 0, y: 0}

        super(context, x, y, radius, color, velocity)
        
        this.alpha = 0.65
        this.animation = true
        this.isDestroying = false
        this.type = type
        
        this.image = new Image()
        this.image.src = `./assets/images/sprites/bonus/${type}.png`
        this.imageSize = 22.5 //px
    }

    draw() {
        this.context.save()
        this.context.globalAlpha = this.alpha
        
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color
        this.context.fill()
        
        const imageX = this.x - this.imageSize / 2
        const imageY = this.y - this.imageSize / 2
        this.context.drawImage(this.image, imageX, imageY, this.imageSize, this.imageSize)
        
        this.context.restore()
    }

    update() {
        this.draw()

        if (this.animation) {
            this.alpha += 0.015
            this.radius += 0.075
        } else {
            this.alpha -= 0.015
            this.radius -= 0.075
        }

        if (this.alpha <= 0.3 || this.alpha >= 1) {
            this.animation = !this.animation
        }
    }
}