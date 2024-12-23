// Cuando se Activa el Disparo Doble las balas se Dividen, se Dirigen más Rápido y hacen Menos Daño

// Definir tipos de Bonus (Escudo, más balas por disparo (una atrás de la otra), veneno, relentización global, rebote de balas)
// Creación de Boses
// Jefes y más enemigos: Naves que despliegan enemigos por detrás (Jefes), Tanques (Jefes, cura al rededor, cuesta más sacarle vida), Movimientos curvos, Curandero, Francotirador
// Cuando se recoge un bonus aparece un menu para elegir entre 3 bonus aleatorios
// Añadir sonidos
// Eliminar Enemigos color parecido al bonus
// Generación de enemigos continua, es decir cada vez que el juego se pausa se reinicia la generacion de enemigos, quiero que sea una sola generacion

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const bigScoreEl2 = document.querySelector('#bigScoreEl2')
const GOEl = document.querySelector('#GOEl')
const restartGameBtn = document.querySelector('#restartGameBtn')
const restartGameBtn2 = document.querySelector('#restartGameBtn2')
const bigRecordEl = document.querySelector('#bigRecordEl')
const bigRecordEl2 = document.querySelector('#bigRecordEl2')
const recordEl = document.querySelector('#recordEl')
const timeEl = document.querySelector('#timeEl')
const pauseEl = document.querySelector('#pauseEl')
const continueGameBtn = document.querySelector('#continueGameBtn')
const bigTimeEl = document.querySelector('#bigTimeEl')
const bigTimeEl2 = document.querySelector('#bigTimeEl2')

const CONFIG = {
    INITIAL_DIFFICULTY: 1,
    DIFFICULTY_INCREASE: 1.0001,
    MAX_STARS: 800,
    ENEMY_SPAWN_INTERVAL: 2000,
    BONUS_SPAWN_INTERVAL: 20000,
    FRICTION: 0.985,
    ACCELERATION: 1.005,
    COLOR_PLAYER: 'white',
    TEST: false,
    ENEMY_GENERATION: true
}

class Entity {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Player extends Entity {
    constructor() {
        super(x, y, 10, CONFIG.COLOR_PLAYER, {x: 0, y:0})
    }
}

class Projectile extends Entity {
    update() {
        this.draw()
        this.velocity.x *= CONFIG.ACCELERATION
        this.velocity.y *= CONFIG.ACCELERATION
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy extends Entity {
    isDestroying = false

    update() {
        this.draw()
        this.x += this.velocity.x * difficulty / this.radius
        this.y += this.velocity.y * difficulty / this.radius
    }
}

class Particle extends Entity {
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
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

class Star extends Entity {
    constructor(x, y, radius, color, alpha, velocity) {
        super(x, y, radius, color, velocity)
        this.alpha = alpha
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.002
    }
}

class Bonus extends Entity {
    constructor(x, y) {
        super(x, y)
        this.radius = 15
        this.color = 'hsl(144, 50%, 50%)'
        this.alpha = 0.65
        this.animation = true
        this.isDestroying = false
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
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

let x, y

let player

let projectiles, enemies, particles, stars, damageTexts, bonusList
let enemyIntervals = []
let bonusIntervals = []

let animationID

let score, difficulty, frames, time, timer
let record = 0

function randomStarDirection() {
    let direction = Math.random() - 0.5
    let speed = Math.random() * 0.285 + 0.03
    return direction * speed
}

let starDirectionX = randomStarDirection()
let starDirectionY = randomStarDirection()

let gameMode, esc, boost, interval, bonusInterval

function init() {
    canvas.width = innerWidth
    canvas.height = innerHeight

    x = canvas.width / 2
    y = canvas.height / 2

    player = new Player()

    projectiles = []
    enemies = []
    particles = []
    stars = []
    damageTexts = []
    bonusList = []

    enemyIntervals.forEach(interval => clearInterval(interval))
    enemyIntervals = []

    bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
    bonusIntervals = []

    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
    bigScoreEl2.innerHTML = score

    difficulty = CONFIG.INITIAL_DIFFICULTY
    frames = 0
    time = 0
    timer = 0
    
    gameMode = "Starting"
    esc = 0
    boost = false
    interval = CONFIG.ENEMY_SPAWN_INTERVAL
    bonusInterval = CONFIG.BONUS_SPAWN_INTERVAL

    if (CONFIG.ENEMY_GENERATION) {
        spawnEnemies()
    }

    spawnBonus()
}

function animate() {
    animationID = requestAnimationFrame(animate)

    difficulty *= CONFIG.DIFFICULTY_INCREASE

    updateTimer()
    updateBackground()

    updateRecord()
    
    updateStars()
    updateParticles()
    updateProjectiles()
    player.draw()
    updateBonus()
    updateEnemies()
    updateDamageTexts()

    maintainStarCount()
}

function updateTimer() {
    frames++

    time = frames / 60

    if (time < 60) {
        timer = "00:" + formatTime(time)
    } else if (time < 600) {
        timer = "0" + Math.floor(time / 60) + ":" + formatTime(time % 60)
    } else {
        timer = Math.floor(time / 60) + ":" + formatTime(time % 60)
    }

    timeEl.innerHTML = timer
    bigTimeEl.innerHTML = timer
    bigTimeEl2.innerHTML = timer
}

function formatTime(value) {
    const intVal = Math.floor(value)
    return intVal < 10 ? "0" + intVal : intVal
}

function updateBackground() {
    c.fillStyle = 'rgba(0, 0, 0, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
}

function updateRecord() {
    if (score > record) {
        record = score
    }

    bigRecordEl.innerHTML = record
    bigRecordEl2.innerHTML = record
    recordEl.innerHTML = record
}

function updateParticles() {
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]

        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    }
}

function updateProjectiles() {
    for (let index = projectiles.length - 1; index >= 0; index--) {
        const projectile = projectiles[index]
        projectile.update()

        if (isProjectileOffScreen(projectile)) {
            projectiles.splice(index, 1)
        }
    }
}

function isProjectileOffScreen(projectile) {
    return (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
    )
}

function updateBonus() {
    for (let index = bonusList.length -1; index >= 0; index--) {
        const bonus = bonusList[index]
        bonus.update()

        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = projectiles[projectileIndex]
            
            if (isCollision(projectile, bonus)) {
                handleBonusProjectileCollision(projectileIndex, bonus, index)
                break
            }
        }
    }
}

function handleBonusProjectileCollision(projectileIndex, bonus, bonusIndex) {
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
        player.color = CONFIG.COLOR_PLAYER
    }, 15000)
}

function updateEnemies() {
    for (let index = enemies.length - 1; index >= 0; index--) {
        const enemy = enemies[index]
        enemy.update()

        if (isCollision(player, enemy) && !CONFIG.TEST && !enemy.isDestroying) {
            endGame()
            return
        }

        for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = projectiles[projectileIndex]
            
            if (isCollision(projectile, enemy)) {
                handleEnemyProjectileCollision(projectile, projectileIndex, enemy, index)
                break
            }
        }
    }
}

function isCollision(obj1, obj2) {
    const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y)
    return dist - obj1.radius - obj2.radius < 0.1
}

function endGame() {
    cancelAnimationFrame(animationID)
    gameMode = "Lost"
    GOEl.style.display = 'block'
    bigScoreEl.innerHTML = score
}

function handleEnemyProjectileCollision(projectile, projectileIndex, enemy, enemyIndex) {
    if (enemy.isDestroying) return

    createParticlesOnCollision(projectile, enemy)
    showDamage(projectile.radius * 2, enemy)

    if (enemy.radius - 10 > 5) {
        score += 10
        scoreEl.innerHTML = score

        gsap.to(enemy, {radius: enemy.radius - projectile.radius * 2})

        projectiles.splice(projectileIndex, 1)
    } else {
        enemy.isDestroying = true

        enemy.velocity = {x: enemy.velocity.x * enemy.radius / 20 / difficulty, y: enemy.velocity.y * enemy.radius / 20 / difficulty}
        
        score += 50
        scoreEl.innerHTML = score
        
        projectiles.splice(projectileIndex, 1)

        gsap.to(enemy, {
            radius: 0,
            alpha: 0,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
                enemies.splice(enemyIndex, 1)
            }
        })
    }
}

function createParticlesOnCollision(projectile, enemy) {
    const particleCount = (enemy.radius * projectile.radius) / 2

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            projectile.x,
            projectile.y,
            Math.random() * (2 - 0.1) + 0.1,
            enemy.color,
            {x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8)}
        ))
    }
}

function showDamage(damage, enemy) {
    damageTexts.push({
        x: enemy.x,
        y: enemy.y,
        damage: damage,
        alpha: 1,
        duration: 60,
        color: enemy.color
    })
}

function updateStars() {
    for (let index = stars.length - 1; index >= 0; index--) {
        const star = stars[index]

        if (star.alpha <= 0) {
            stars.splice(index, 1)
        } else {
            star.update()
        }
    }
}

function updateDamageTexts() {
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const dt = damageTexts[i]

        c.save()
        c.globalAlpha = dt.alpha
        c.fillStyle = dt.color
        c.font = '20px Arial'
        c.fillText(dt.damage, dt.x, dt.y - (60 - dt.duration) * 0.5)
        c.restore()

        dt.duration--
        dt.alpha -= 1/60

        if (dt.duration <= 0) {
            damageTexts.splice(i, 1)
        }
    }
}

function maintainStarCount() {
    while (stars.length < CONFIG.MAX_STARS) {
        stars.push(new Star(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 0.95 + 0.1,
            'rgba(255, 255, 230, 0.25)',
            Math.random() * 0.99 + 0.01,
            {x: starDirectionX, y: starDirectionY}
        ))
    }
}

function spawnEnemies() {
    setInterval(() => {
        interval = CONFIG.ENEMY_SPAWN_INTERVAL / difficulty
    }, 1)

    enemyIntervals.push(setInterval(() => {
        if (gameMode === "Playing") {
            let radius

            if (difficulty <= 5) {
                radius = Math.random() * 25 + 2 * (10 - difficulty)
            } else {
                radius = Math.random() * 25 + 10
            }
            
            let x
            let y

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                y = Math.random() * canvas.height
            } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }

            const color = `hsl(${Math.random() * 360}, 50%, 50%)`

            const angle = Math.atan2(
                canvas.height / 2 - y,
                canvas.width / 2 - x
            )

            const velocity = {
                x: 100 * Math.cos(angle) * difficulty * (1 / Math.sqrt(radius)),
                y: 100 * Math.sin(angle) * difficulty * (1 / Math.sqrt(radius))
            }

            enemies.push(new Enemy(x, y, radius, color, velocity))
        }
    }, interval))
}

function spawnBonus() {
    setInterval(() => {
        bonusInterval = CONFIG.BONUS_SPAWN_INTERVAL / difficulty
    }, 1)

    bonusIntervals.push(setInterval(() => {
        if (gameMode === "Playing") {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const minRadius = canvas.height / 4;
            
            let x, y;
            do {
                x = Math.random() * (canvas.width - 40) + 20;
                y = Math.random() * (canvas.height - 40) + 20;
                
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                
                if (distance > minRadius) break;
            } while (true);
            
            bonusList.push(new Bonus(x, y));
        }
    }, bonusInterval))
}

function resizeElements(elements, scaleX, scaleY) {
    elements.forEach(element => {
        element.x *= scaleX
        element.y *= scaleY
        element.velocity.x *= scaleX
        element.velocity.y *= scaleY
    })
}

function resizeCanvas() {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const scaleX = canvas.width / oldWidth;
    const scaleY = canvas.height / oldHeight;

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    resizeElements(projectiles, scaleX, scaleY)
    resizeElements(enemies, scaleX, scaleY)
    resizeElements(particles, scaleX, scaleY)
    resizeElements(stars, scaleX, scaleY)
    resizeElements(bonusList, scaleX, scaleY)
}

addEventListener('click', (event) => {
    if (boost) {
        let angle = Math.atan2(
            event.clientY - canvas.height / 2,
            event.clientX - canvas.width / 2
        )

        let velocityp = {
            x: Math.cos(angle) * 7.5,
            y: Math.sin(angle) * 7.5
        }

        projectiles.push(new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            3.33,
            'rgb(182, 135, 212)',
            velocityp
        ))

        let angle2 = Math.atan2(
            (event.clientY - canvas.height / 2) * -1,
            (event.clientX - canvas.width / 2) * -1
        )

        let velocityp2 = {
            x: Math.cos(angle2) * 7.5,
            y: Math.sin(angle2) * 7.5
        }

        projectiles.push(new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            3.33,
            'rgb(182, 135, 212)',
            velocityp2
        ))
    } else {
        let angle = Math.atan2(
            event.clientY - canvas.height / 2,
            event.clientX - canvas.width / 2
        )

        let velocityp = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }

        projectiles.push(new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            5,
            'rgb(182, 135, 212)',
            velocityp
        ))
    }
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        esc++

        if (esc % 2 === 1 && gameMode === "Playing") {
            cancelAnimationFrame(animationID)

            enemyIntervals.forEach(interval => clearInterval(interval))
            bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
            
            bigScoreEl2.innerHTML = score
            pauseEl.style.display = 'block'

            gameMode = "Pause"

        } else {
            if (gameMode === "Pause") {
                enemyIntervals.forEach(interval => clearInterval(interval))
                enemyIntervals = []

                if (CONFIG.ENEMY_GENERATION) {
                    spawnEnemies()
                }

                bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
                bonusIntervals = []
                spawnBonus()

                animate()

                pauseEl.style.display = 'none'
                
                gameMode = "Playing"
            }
        }
    }
})

document.addEventListener("keydown", (event) => {
    if (event.key === " " && gameMode === "Playing") {
        if (boost) {
            boost = false
        } else {
            boost = true
        }
    }
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()

    modalEl.style.display = 'none'

    setTimeout(() => {
        projectiles.splice(0, 1)
    }, 1)

    gameMode = "Playing"
})

restartGameBtn.addEventListener('click', () => {
    init()
    animate()

    GOEl.style.display = 'none'

    setTimeout(() => {
        projectiles.splice(0, 1)
    }, 1)

    gameMode = "Playing"
})

restartGameBtn2.addEventListener('click', () => {
    init()
    animate()

    pauseEl.style.display = 'none'

    setTimeout(() => {
        projectiles.splice(0, 1)
    }, 1)

    gameMode = "Playing"
})

continueGameBtn.addEventListener('click', () => {
    animate()

    pauseEl.style.display = 'none'

    esc++

    setTimeout(() => {
        projectiles.splice(projectiles.length - 1, 1)
    }, 1)
    
    gameMode = "Playing"

    if (CONFIG.ENEMY_GENERATION) {
        spawnEnemies()        
    }

    spawnBonus()
})

addEventListener('resize', () => {
    resizeCanvas()
})

document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameMode === "Playing") {
        cancelAnimationFrame(animationID)

        enemyIntervals.forEach(interval => clearInterval(interval))
        bonusIntervals.forEach(bonusInterval => clearInterval(bonusInterval))
        
        bigScoreEl2.innerHTML = score
        pauseEl.style.display = 'block'

        gameMode = "Pause"

        esc++
    }
});
