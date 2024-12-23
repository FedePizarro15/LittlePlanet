import { Entity } from "./entity.js"
import { CONFIG } from "../config.js"

export class Projectile extends Entity {
    constructor(context, x, y, radius, color, velocity, powerPoison = false) {
        super(context, x, y, radius, color, velocity)
        this.powerPoison = powerPoison
    }
    
    update() {
        this.draw()
        this.velocity.x *= CONFIG.ACCELERATION
        this.velocity.y *= CONFIG.ACCELERATION
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}