import { Entity } from "./entity.js"
import { CONFIG } from "../config.js"

export class Player extends Entity {
    constructor(context, x, y) {
        const radius = 10
        const color = CONFIG.COLOR_PLAYER
        const velocity = {x: 0, y: 0}

        super(context, x, y, radius, color, velocity)

        this.boost = false

        this.powers = {
            Shield: { value: 0, radius: 15, color: 'yellow' },
            Bullets: { value: 0, radius: null, color: 'purple' },
            Poison: { value: 0, radius: null, color: 'green' },
            Slowdown: { value: 0, radius: 15, color: 'brown' },
            Ricochet: { value: 0, radius: 15, color: 'red' }
        }
    }

    update() {
        this.draw()
        
        Object.entries(this.powers).forEach(([power, config]) => {
            if (config.value > 0) {
                config.value--
                if (config.value <= 0) {
                    this.deactivatePower(power)
                }
            }
        })
    }

    addPowerup(type, duration) {
        this.powers[type].value = duration
        
        const animations = {
            radius: this.powers[type].radius || this.radius,
            color: this.powers[type].color || this.color,
            duration: 0.3
        }

        gsap.to(this, animations)
    }

    deactivatePower(type) {
        this.powers[type].value = 0
        
        gsap.to(this, {
            radius: 10,
            color: CONFIG.COLOR_PLAYER,
            duration: 0.3
        })
    }
}
