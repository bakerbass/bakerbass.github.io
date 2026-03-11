document.addEventListener("DOMContentLoaded", () => {
    const emojis = document.querySelectorAll(".category-icon");
    let clickedEmojis = new Set();

    emojis.forEach((emoji, index) => {
        emoji.style.cursor = 'pointer';
        emoji.addEventListener("click", () => {
            if (!clickedEmojis.has(index)) {
                clickedEmojis.add(index);
                emoji.classList.add("emoji-clicked");
                emoji.style.transform = "scale(1.2)";
                emoji.style.transition = "transform 0.2s";
                
                setTimeout(() => {
                    emoji.style.transform = "scale(1)";
                }, 200);

                if (clickedEmojis.size === emojis.length) {
                    setTimeout(() => {
                        launchMinigame();
                    }, 600);
                }
            }
        });
    });
});

function launchMinigame() {
    // Check if it already exists
    if (document.getElementById("minigame-overlay")) {
        return;
    }

    // Create the minigame container
    const gameContainer = document.createElement("div");
    gameContainer.id = "minigame-overlay";
    
    gameContainer.innerHTML = `
        <div class="minigame-modal">
            <button id="close-minigame">&times;</button>
            <h2 style="color: var(--accent); margin-top: 0; font-family: var(--font-display);">Emoji Catcher</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Catch the falling emojis with your paddle!</p>
            <div id="game-area">
                <div id="player-basket"></div>
            </div>
            <div id="score-board">Score: <span id="game-score">0</span></div>
            <button id="start-game-btn" class="btn-outline">Start Game</button>
        </div>
    `;

    document.body.appendChild(gameContainer);

    document.getElementById("close-minigame").addEventListener("click", () => {
        document.body.removeChild(gameContainer);
    });

    document.getElementById("start-game-btn").addEventListener("click", startGame);
}

function startGame() {
    const startBtn = document.getElementById("start-game-btn");
    startBtn.style.display = "none";
    
    let score = 0;
    const scoreElement = document.getElementById("game-score");
    scoreElement.innerText = score;
    
    const gameArea = document.getElementById("game-area");
    const basket = document.getElementById("player-basket");
    let emojiInterval;
    let isGameOver = false;

    const gameEmojis = ['🤖', '🎙️', '💻', '🎵', '🎧'];

    // Move basket
    const mouseMoveHandler = (e) => {
        const rect = gameArea.getBoundingClientRect();
        let x = e.clientX - rect.left - (basket.offsetWidth / 2);
        
        // Bounds checking
        if (x < 0) x = 0;
        if (x > gameArea.offsetWidth - basket.offsetWidth) x = gameArea.offsetWidth - basket.offsetWidth;
        
        basket.style.left = x + "px";
    };

    gameArea.addEventListener("mousemove", mouseMoveHandler);

    function spawnEmoji() {
        if (isGameOver) return;

        const emoji = document.createElement("div");
        emoji.className = "falling-emoji";
        emoji.innerText = gameEmojis[Math.floor(Math.random() * gameEmojis.length)];
        emoji.style.left = (Math.random() * (gameArea.offsetWidth - 30)) + "px";
        emoji.style.top = "0px";
        gameArea.appendChild(emoji);

        // Speed increases slightly as score goes up
        let baseSpeed = 2 + (score * 0.1); 
        let speed = baseSpeed + Math.random() * 2;

        let fallInterval = setInterval(() => {
            if (isGameOver || !document.getElementById("minigame-overlay")) {
                clearInterval(fallInterval);
                if (emoji.parentElement) emoji.remove();
                return;
            }

            let top = parseFloat(emoji.style.top);
            emoji.style.top = (top + speed) + "px";

            // Check collision
            let emojiRect = emoji.getBoundingClientRect();
            let basketRect = basket.getBoundingClientRect();

            if (
                emojiRect.bottom >= basketRect.top &&
                emojiRect.top <= basketRect.bottom &&
                emojiRect.right >= basketRect.left &&
                emojiRect.left <= basketRect.right
            ) {
                // Caught
                score++;
                scoreElement.innerText = score;
                clearInterval(fallInterval);
                emoji.remove();
                
                // Visual feedback for catch
                basket.style.transform = "scale(1.1)";
                setTimeout(() => { 
                    if (basket) basket.style.transform = "scale(1)"; 
                }, 100);
            } else if (top > gameArea.offsetHeight) {
                // Missed
                clearInterval(fallInterval);
                emoji.remove();
                endGame();
            }
        }, 20);
    }

    emojiInterval = setInterval(spawnEmoji, 1000);

    function endGame() {
        isGameOver = true;
        clearInterval(emojiInterval);
        
        // clear falling emojis
        document.querySelectorAll(".falling-emoji").forEach(el => el.remove());
        
        if (startBtn) {
            startBtn.style.display = "block";
            startBtn.innerText = "Game Over! Play Again?";
            
            // reset logic
            startBtn.onclick = () => {
                isGameOver = false;
                startGame();
            };
        }
        
        gameArea.removeEventListener("mousemove", mouseMoveHandler);
    }
}
