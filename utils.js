import { Particle } from './entities/particle.js'
import { Enemy } from './entities/enemy.js'
import { Bonus } from './entities/bonus.js'

export function clearIntervals(enemyIntervals, bonusIntervals) {
    enemyIntervals.forEach(interval => clearInterval(interval))
    enemyIntervals = []

    bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
    bonusIntervals = []
}

export function spawnEnemies(context, interval, spawnInterval, difficulty, enemyIntervals, gameMode, enemies, canvas) {
    setInterval(() => {
        interval = spawnInterval / difficulty
    }, 1)

    enemyIntervals.push(setInterval(() => {
        if (gameMode === "Playing") {
            enemies.push(getRandomEnemy(context, difficulty, canvas))
        }
    }, interval))
}
            
export function spawnBonus(bonusInterval, spawnInterval, difficulty, bonusIntervals, gameMode, bonusList, context, canvas) {
    setInterval(() => {
        bonusInterval = spawnInterval / difficulty
    }, 1)

    bonusIntervals.push(setInterval(() => {
        if (gameMode === "Playing") {
            bonusList.push(getRandomBonus(context, canvas))
        }
    }, bonusInterval))
}

export function updateTimer(frames, time, timer) {
    frames++

    time = frames / 60

    if (time < 60) {
        timer = "00:" + formatTime(time)
    } else if (time < 600) {
        timer = "0" + Math.floor(time / 60) + ":" + formatTime(time % 60)
    } else {
        timer = Math.floor(time / 60) + ":" + formatTime(time % 60)
    }

    return {frames, time, timer}
}

export function updateBackground(context, width, height) {
    context.fillStyle = 'rgba(0, 0, 0, 0.15)'
    context.fillRect(0, 0, width, height)
}

export function updateRecord(score, record) {
    if (score > record) {
        record = score
    }

    return record
}

export function updateStars(stars) {
    for (let index = stars.length - 1; index >= 0; index--) {
        const star = stars[index]

        if (star.alpha <= 0) {
            stars.splice(index, 1)
        } else {
            star.update()
        }
    }
}

export function updateParticles(particles) {
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]

        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    }
}

export function updateProjectiles(projectiles, width, height) {
    for (let index = projectiles.length - 1; index >= 0; index--) {
        const projectile = projectiles[index]
        projectile.update()

        if (isProjectileOffScreen(projectile, width, height)) {
            projectiles.splice(index, 1)
        }
    }
}

export function updateBonus(bonusList, projectiles, player) {
    for (let index = bonusList.length -1; index >= 0; index--) {
        const bonus = bonusList[index]
        bonus.update()

        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = projectiles[projectileIndex]
            
            if (isCollision(projectile, bonus)) {
                handleBonusProjectileCollision(projectileIndex, bonus, index, bonusList, projectiles, player)
                break
            }
        }
    }
}

export function isCollision(obj1, obj2) {
    const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y)
    return dist - obj1.radius - obj2.radius < 0.1
}

export function updateDamageTexts(damageTexts, context) {
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const dt = damageTexts[i]

        context.save()
        context.globalAlpha = dt.alpha
        context.fillStyle = dt.color
        context.font = '20px Arial'
        context.fillText(dt.damage, dt.x, dt.y - (60 - dt.duration) * 0.5)
        context.restore()

        dt.duration--
        dt.alpha -= 1/60

        if (dt.duration <= 0) {
            damageTexts.splice(i, 1)
        }
    }
}

export function resizeElements(elements, scaleX, scaleY) {
    elements.forEach(element => {
        element.x *= scaleX
        element.y *= scaleY
        element.velocity.x *= scaleX
        element.velocity.y *= scaleY
    })
}
    
export function createParticlesOnCollision(projectile, enemy, particles) {
    const particleCount = (enemy.radius * projectile.radius) / 2

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            projectile.context,
            projectile.x,
            projectile.y,
            Math.random() * (2 - 0.1) + 0.1,
            enemy.color,
            {x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8)}
        ))
    }
}

export function randomStarDirection() {
    let direction = Math.random() - 0.5
    let speed = Math.random() * 0.285 + 0.03
    return direction * speed
}

function getRandomEnemy(context, difficulty, canvas) {
    const width = canvas.width
    const height = canvas.height
    
    let radius = (difficulty <= 5) 
        ? Math.random() * 25 + 2 * (10 - difficulty)
        : Math.random() * 25 + 10
    
    let x, y

    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : width + radius
        y = Math.random() * height
    } else {
        x = Math.random() * width
        y = Math.random() < 0.5 ? 0 - radius : height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    const angle = Math.atan2(
        height / 2 - y,
        width / 2 - x
    )

    const velocity = {
        x: 100 * Math.cos(angle) * difficulty * (1 / Math.sqrt(radius)),
        y: 100 * Math.sin(angle) * difficulty * (1 / Math.sqrt(radius))
    }
    
    return new Enemy(context, x, y, radius, color, velocity, difficulty)
}

function getRandomBonus(context, canvas) {
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const minRadius = height / 4

    let x = 0
    let y = 0
    do {
        x = Math.random() * (width - 40) + 20
        y = Math.random() * (height - 40) + 20
        
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        
        if (distance > minRadius) break
    } while (true)

    const bonusTypes = ['Shield', 'Bullets', 'Poison', 'Slowdown', 'Ricochet']
    const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)]
    
    return new Bonus(context, x, y, randomType)
}

function isProjectileOffScreen(projectile, width, height) {
    return (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > height
    )
}

function handleBonusProjectileCollision(projectileIndex, bonus, bonusIndex, bonusList, projectiles, player) {
    if (bonus.isDestroying) return

    bonus.isDestroying = true

    projectiles.splice(projectileIndex, 1)
    
    gsap.to(bonus, {
        radius: 3 * bonus.radius,
        alpha: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            bonusList.splice(bonusIndex, 1)
        }
    })

    player.color = 'red'
    setTimeout(() => {
        player.color = 'white'
    }, 15000)
}

function formatTime(value) {
    const intVal = Math.floor(value)
    return intVal < 10 ? "0" + intVal : intVal
}