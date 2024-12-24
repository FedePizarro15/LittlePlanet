import { Entity } from "./entity.js"
import { CONFIG } from "../config.js"

// Escudo, más balas por disparo (una atrás de la otra), veneno, relentización global, rebote de balas

export class Player extends Entity {
    constructor(context, x, y) {
        const radius = 10
        const color = CONFIG.COLOR_PLAYER
        const velocity = {x: 0, y: 0}

        super(context, x, y, radius, color, velocity)

        this.boost = false

        this.health = 100
        this.score = 0

        this.powerShield = 0
        this.powerBullets = 0
        this.powerPoison = 0
        this.powerSlowdown = 0
        this.powerRicochet = 0
    }

    update() {
        this.draw()

        if (this.powerShield > 0) {
            this.powerShield--
            console.log(this.powerShield)
        } else {
            this.powerShield = 0
            this.deactivateShield()
        }

        if (this.powerBullets > 0) {
            this.powerBullets--
            console.log(this.powerBullets)
        } else {
            this.powerBullets = 0
            this.deactivateBullets()
        }

        if (this.powerPoison > 0) {
            this.powerPoison--
            console.log(this.powerPoison)
        } else {
            this.powerPoison = 0
            this.deactivatePoison()
        }

        if (this.powerSlowdown > 0) {
            this.powerSlowdown--
            console.log(this.powerSlowdown)
        } else {
            this.powerSlowdown = 0
            this.deactivateSlowdown()
        }

        if (this.powerRicochet > 0) {
            this.powerRicochet--
            console.log(this.powerRicochet)
        } else {
            this.powerRicochet = 0
            this.deactivateRicochet()
        }
    }

    addPowerup(type, duration) {
        switch(type) {
            case 'Shield':
                this.activateShield(duration)
                break
            case 'Bullets':
                this.activateBullets(duration)
                break
            case 'Poison':
                this.activatePoison(duration)
                break
            case 'Slowdown':
                this.activateSlowdown(duration)
                break
            case 'Ricochet':
                this.activateRicochet(duration)
                break
        }
    }

    activateShield(duration) {
        this.powerShield = duration
        
        gsap.to(this, {
            radius: 15,
            duration: 0.3
        })
    }

    deactivateShield() {
        this.powerShield = 0

        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activateBullets(duration) {
        this.powerBullets = duration

        gsap.to(this, {
            color: 'purple',
            duration: 0.3
        })
    }

    deactivateBullets() {
        this.powerBullets = 0

        gsap.to(this, {
            color: CONFIG.COLOR_PLAYER,
            duration: 0.3
        })
    }

    activatePoison(duration) {
        this.powerPoison = duration

        gsap.to(this, {
            color: 'green',
            duration: 0.3
        })
    }

    deactivatePoison() {
        this.powerPoison = 0

        gsap.to(this, {
            color: CONFIG.COLOR_PLAYER,
            duration: 0.3
        })
    }

    activateSlowdown(duration) {
        this.powerSlowdown = duration

        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateSlowdown(), duration)
    }

    deactivateSlowdown() {
        this.powerSlowdown = 0

        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activateRicochet(duration) {
        this.powerRicochet = duration
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateRicochet(), duration)
    }

    deactivateRicochet() {
        this.powerRicochet = 0
        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    takeDamage(amount) {
        if (!this.isInvulnerable) {
            this.health -= amount
            gsap.to(this, {
                radius: '-=2',
                duration: 0.1,
                yoyo: true,
                repeat: 1
            })
        }
    }
}