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
        this.powerups = []
        this.health = 100
        this.score = 0
        this.powerShield = false
        this.powerBullets = false
        this.powerPoison = false
        this.powerSlowdown = false
        this.powerRicochet = false
    }

    addPowerup(type, duration) {
        this.powerups.push({type, duration})
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
        this.powerShield = true
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateShield(), duration)
    }

    deactivateShield() {
        this.powerShield = false
        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activateBullets(duration) {
        this.powerBullets = true
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateBullets(), duration)
    }

    deactivateBullets() {
        this.powerBullets = false
        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activatePoison(duration) {
        this.powerPoison = true
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivatePoison(), duration)
    }

    deactivatePoison() {
        this.powerPoison = false
        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activateSlowdown(duration) {
        this.powerSlowdown = true
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateSlowdown(), duration)
    }

    deactivateSlowdown() {
        this.powerSlowdown = false
        gsap.to(this, {
            radius: 10,
            duration: 0.3
        })
    }

    activateRicochet(duration) {
        this.powerRicochet = true
        gsap.to(this, {
            radius: this.radius * 1.5,
            duration: 0.3
        })
        setTimeout(() => this.deactivateRicochet(), duration)
    }

    deactivateRicochet() {
        this.powerRicochet = false
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