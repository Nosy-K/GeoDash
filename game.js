// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameRunning = false;
let score = 0;
let gameSpeed = 5;

// Player (Cube)
class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = 100;
        this.y = canvas.height - 100 - this.height;
        this.velocityY = 0;
        this.gravity = 0.6;
        this.jumpPower = -12;
        this.isJumping = false;
        this.onGround = false;
        this.color = '#FFD700';
    }

    draw() {
        // Draw cube with gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, '#FFA500');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Add eye-like detail
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 8, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 17, this.y + 10, 5, 5);
    }

    jump() {
        if (this.onGround) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
            this.onGround = false;
        }
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Check collision with platforms
        let onPlatform = false;
        platforms.forEach(platform => {
            if (this.checkPlatformCollision(platform)) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                onPlatform = true;
                this.isJumping = false;
            }
        });

        // Check collision with ground
        const groundLevel = canvas.height - 100;
        if (this.y + this.height >= groundLevel) {
            this.y = groundLevel - this.height;
            this.velocityY = 0;
            this.onGround = true;
            this.isJumping = false;
        } else {
            this.onGround = onPlatform;
        }
    }

    checkPlatformCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y + this.height <= platform.y &&
               this.y + this.height + this.velocityY >= platform.y;
    }

    checkCollision(obstacle) {
        return this.x < obstacle.x + obstacle.width &&
               this.x + this.width > obstacle.x &&
               this.y < obstacle.y + obstacle.height &&
               this.y + this.height > obstacle.y;
    }
}

// Spike Obstacle
class Spike {
    constructor(x, y) {
        this.width = 20;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.color = '#FF0000';
    }

    draw() {
        // Draw triangle spike
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(1, '#8B0000');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update() {
        this.x -= gameSpeed;
    }
}

// Platform
class Platform {
    constructor(x, y, width) {
        this.width = width;
        this.height = 15;
        this.x = x;
        this.y = y;
        this.color = '#8B4513';
    }

    draw() {
        // Draw platform
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#A0522D');
        gradient.addColorStop(1, '#8B4513');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
    }
}

// Game Objects
const player = new Player();
let spikes = [];
let platforms = [];
let frameCount = 0;

// Initialize ground platforms
function initializePlatforms() {
    platforms = [];
    // Create some initial platforms at various heights
    platforms.push(new Platform(300, 250, 100));
    platforms.push(new Platform(500, 200, 120));
    platforms.push(new Platform(700, 280, 80));
}

// Spawn obstacles
function spawnObstacles() {
    frameCount++;
    
    // Spawn spikes on ground
    if (frameCount % 120 === 0) {
        spikes.push(new Spike(canvas.width, canvas.height - 100 - 30));
    }
    
    // Spawn platforms with spikes occasionally
    if (frameCount % 200 === 0) {
        const platformY = Math.random() * 150 + 150;
        const platformWidth = Math.random() * 80 + 80;
        platforms.push(new Platform(canvas.width, platformY, platformWidth));
        
        // Sometimes add spikes on platforms
        if (Math.random() > 0.5) {
            spikes.push(new Spike(canvas.width + platformWidth / 2, platformY - 30));
        }
    }
    
    // Random spikes at different positions
    if (frameCount % 90 === 0 && Math.random() > 0.6) {
        spikes.push(new Spike(canvas.width, canvas.height - 100 - 30));
    }
}

// Draw background
function drawBackground() {
    // Sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#8BC34A';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Ground line
    ctx.strokeStyle = '#558B2F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();
}

// Update score
function updateScore() {
    if (gameRunning) {
        score += 1;
        document.getElementById('score').textContent = score;
        
        // Increase difficulty gradually
        if (score % 500 === 0 && gameSpeed < 10) {
            gameSpeed += 0.5;
        }
    }
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    drawBackground();
    
    // Spawn new obstacles
    spawnObstacles();
    
    // Update and draw player
    player.update();
    player.draw();
    
    // Update and draw spikes
    for (let i = spikes.length - 1; i >= 0; i--) {
        spikes[i].update();
        spikes[i].draw();
        
        // Remove off-screen spikes
        if (spikes[i].x + spikes[i].width < 0) {
            spikes.splice(i, 1);
            continue;
        }
        
        // Check collision
        if (player.checkCollision(spikes[i])) {
            gameOver();
        }
    }
    
    // Update and draw platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].update();
        platforms[i].draw();
        
        // Remove off-screen platforms
        if (platforms[i].x + platforms[i].width < 0) {
            platforms.splice(i, 1);
        }
    }
    
    // Update score
    updateScore();
    
    requestAnimationFrame(gameLoop);
}

// Game over
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Start game
function startGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 5;
    frameCount = 0;
    spikes = [];
    
    // Reset player
    player.y = canvas.height - 100 - player.height;
    player.velocityY = 0;
    player.onGround = true;
    
    // Initialize platforms
    initializePlatforms();
    
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOver').classList.add('hidden');
    
    gameLoop();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        player.jump();
    }
});

canvas.addEventListener('click', () => {
    if (gameRunning) {
        player.jump();
    }
});

document.getElementById('restartBtn').addEventListener('click', startGame);

// Start the game automatically
startGame();
