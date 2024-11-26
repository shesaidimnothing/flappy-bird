class FlappyBird {
    constructor() {
        this.bird = document.getElementById('bird');
        this.gameContainer = document.getElementById('game-container');
        this.scoreElement = document.getElementById('score');
        this.startMessage = document.getElementById('start-message');
        this.gameOverMessage = document.getElementById('game-over');
        
        this.birdY = 300; // Position verticale de l'oiseau
        this.birdVelocity = 0; // Vitesse de l'oiseau
        this.gravity = 0.5; // gravité
        this.jump = -8; // force saut
        this.pipes = []; 
        this.score = 0; // Score
        this.gameStarted = false;
        this.gameOver = false;
        this.init();
    }

    init() {
        // Écouteur d'événements pour les touches du clavier
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!this.gameStarted) {
                    this.startGame(); // Démarre le jeu
                } else if (this.gameOver) {
                    this.resetGame(); // Réinitialise le jeu
                } else {
                    this.birdVelocity = this.jump; // Fait sauter l'oiseau
                }
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.startMessage.classList.add('hidden');
        this.gameLoop();
        this.spawnPipe();
    }

    resetGame() {
        this.gameOver = false;
        this.gameStarted = true;
        this.score = 0;
        this.birdY = 300;
        this.birdVelocity = 0;
        this.pipes = [];
        this.scoreElement.textContent = '0';
        this.gameOverMessage.classList.add('hidden');
        this.gameLoop();
        this.spawnPipe();
    }

    spawnPipe() {
        if (this.gameOver) return;

        const gap = 150; // Espace entre les tuyaux
        const pipeTop = document.createElement('div');
        const pipeBottom = document.createElement('div');
        
        pipeTop.className = 'pipe pipe-top';
        pipeBottom.className = 'pipe pipe-bottom';
        
        const randomHeight = Math.random() * 300 + 100;
        
        pipeTop.style.height = randomHeight + 'px';
        pipeTop.style.left = '400px';
        
        pipeBottom.style.height = (600 - randomHeight - gap) + 'px';
        pipeBottom.style.left = '400px';
        pipeBottom.style.bottom = '0';
        
        this.gameContainer.appendChild(pipeTop);
        this.gameContainer.appendChild(pipeBottom);
        
        this.pipes.push({
            top: pipeTop,
            bottom: pipeBottom,
            x: 400,
            counted: false
        });
        
        setTimeout(() => this.spawnPipe(), 2000);
    }

    gameLoop() {
        if (!this.gameStarted || this.gameOver) return;

        // changer l'endroit de l'oiseau
        this.birdVelocity += this.gravity;
        this.birdY += this.birdVelocity;
        this.bird.style.transform = `translateY(${this.birdY}px) rotate(${this.birdVelocity * 3}deg)`;

        // changer la taille et positions des tuyaux mais bizarre
        for (let pipe of this.pipes) {
            pipe.x -= 2;
            pipe.top.style.left = pipe.x + 'px';
            pipe.bottom.style.left = pipe.x + 'px';

            // comptage de score
            if (!pipe.counted && pipe.x < 50) {
                this.score++;
                this.scoreElement.textContent = this.score;
                pipe.counted = true;
            }

            // enleves les anciens tuyaux mais azy marche pas MDR
            if (pipe.x < -60) {
                this.gameContainer.removeChild(pipe.top);
                this.gameContainer.removeChild(pipe.bottom);
                this.pipes = this.pipes.filter(p => p !== pipe);
            }

            // truc pour détécter les collisions
            if (this.checkCollision(pipe)) {
                this.endGame();
                return;
            }
        }

        // regarder les limites
        if (this.birdY > 570 || this.birdY < 0) {
            this.endGame();
            return;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    checkCollision(pipe) {
        const birdRect = {
            left: 50,
            right: 90,
            top: this.birdY,
            bottom: this.birdY + 30
        };

        const topPipeRect = {
            left: pipe.x,
            right: pipe.x + 60,
            top: 0,
            bottom: parseInt(pipe.top.style.height)
        };

        const bottomPipeRect = {
            left: pipe.x,
            right: pipe.x + 60,
            top: 600 - parseInt(pipe.bottom.style.height),
            bottom: 600
        };

        return this.intersects(birdRect, topPipeRect) || 
               this.intersects(birdRect, bottomPipeRect);
    }

    intersects(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }

    endGame() {
        this.gameOver = true;
        this.gameStarted = false;
        this.gameOverMessage.classList.remove('hidden');
    }
}

new FlappyBird();
