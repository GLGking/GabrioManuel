const topButton = document.getElementById("back-to-top");
window.onscroll = function() {
    topButton.style.display = window.scrollY > 300 ? "block" : "none";
};
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}





const testimonials = document.querySelector('.testimonials');
let scrollAmount = 0;

function autoScrollTestimonials() {
    scrollAmount += testimonials.offsetWidth / 3; // Move um card por vez
    if (scrollAmount >= testimonials.scrollWidth) {
        scrollAmount = 0; // Reinicia o carrossel
    }
    testimonials.scrollTo({ left: scrollAmount, behavior: 'smooth' });
}

setInterval(autoScrollTestimonials, 4000); // Altera o slide a cada 4 segundos






document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    function highlightSection() {
        let index = sections.length;

        while (--index && window.scrollY + 50 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index]?.classList.add("active");
    }

    window.addEventListener("scroll", highlightSection);

    // Clique para navegar diretamente à seção
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });
});





const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const speedUpButton = document.getElementById('speedUpButton');
const speedDownButton = document.getElementById('speedDownButton');

let character, obstacles, obstacleTimer, gameSpeed, isPlaying, isPaused;
const groundLevel = 180;

function initializeGame() {
    character = { x: 50, y: 150, width: 20, height: 20, velocity: 0, gravity: 0.4, jump: -8 };
    obstacles = [];
    obstacleTimer = 0;
    gameSpeed = 2;
    isPlaying = true;
    isPaused = false;
    playButton.textContent = "Restart";
    playButton.style.backgroundColor = '#64b3af';
    update();
}

// Controle de tecla
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && character.y === groundLevel - character.height && isPlaying && !isPaused) {
        character.velocity = character.jump;
    }
});

// Função para criar obstáculos
function createObstacle() {
    obstacles.push({ x: canvas.width, y: groundLevel - 20, width: 20, height: 20 });
}

// Atualização do jogo
function update() {
    if (!isPlaying || isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar o personagem
    character.velocity += character.gravity;
    character.y += character.velocity;
    if (character.y > groundLevel - character.height) {
        character.y = groundLevel - character.height;
    }
    ctx.fillStyle = '#76c7c0';
    ctx.fillRect(character.x, character.y, character.width, character.height);

    // Desenhar o solo
    ctx.fillStyle = '#444';
    ctx.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);

    // Gerenciar obstáculos
    obstacleTimer++;
    if (obstacleTimer > 120) {
        createObstacle();
        obstacleTimer = 0;
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;

        // Colisão
        if (
            character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.height + character.y > obstacle.y
        ) {
            isPlaying = false;
            playButton.textContent = "Play Again";
            playButton.style.backgroundColor = '#ff6b6b';
        }

        // Desenhar obstáculos
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Remover obstáculos fora da tela
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
        }
    }

    if (isPlaying) {
        requestAnimationFrame(update);
    }
}

// Botão Play/Restart
playButton.addEventListener('click', initializeGame);

// Botão Pause/Resume
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) update();
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
    pauseButton.style.backgroundColor = isPaused ? '#64b3af' : '#ffa500';
});

// Botão Speed Up
speedUpButton.addEventListener('click', () => {
    gameSpeed += 1;
});

// Botão Slow Down
speedDownButton.addEventListener('click', () => {
    if (gameSpeed > 1) gameSpeed -= 1;
});
