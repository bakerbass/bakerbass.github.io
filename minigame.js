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

let audioCtx;
let distortionNode;
let convolverNode;
let masterGain;

function makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

function createImpulseResponse(ctx) {
    const rate = ctx.sampleRate;
    const length = rate * 2.0;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (rate * 0.5));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
}

const pentatonicFrequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        distortionNode = audioCtx.createWaveShaper();
        distortionNode.curve = makeDistortionCurve(0);
        distortionNode.oversample = '4x';

        convolverNode = audioCtx.createConvolver();
        convolverNode.buffer = createImpulseResponse(audioCtx);

        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playNote(freq, score) {
    if (!audioCtx) return;

    // Distortion builds much slower (5x slower)
    const intensity = Math.min(score / 500, 1.0);
    distortionNode.curve = makeDistortionCurve(intensity * 400);

    const noteDuration = 0.5;

    const sineOsc = audioCtx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.value = freq;

    const sineGain = audioCtx.createGain();
    sineGain.gain.value = 1.0 - intensity;

    const sawGain = audioCtx.createGain();
    sawGain.gain.value = intensity * 0.3;

    const detunes = [-15, 0, 15];
    const saws = detunes.map(detune => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(sawGain);
        return osc;
    });

    sineOsc.connect(sineGain);

    const envGain = audioCtx.createGain();
    envGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Scale volume down as distortion intensity goes up to maintain perceived loudness
    // Assuming distortion + detuned saws add roughly 6 dB of perceived loudness at maximum intensity
    const dbReduction = 500 * intensity;
    const peakVolume = 0.15 * Math.pow(10, -dbReduction / 20);

    envGain.gain.linearRampToValueAtTime(peakVolume, audioCtx.currentTime + 0.05);
    envGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteDuration);

    sineGain.connect(envGain);
    sawGain.connect(envGain);

    envGain.connect(distortionNode);

    const dryGain = audioCtx.createGain();
    const wetGain = audioCtx.createGain();

    let reverbMix = 0;
    if (score >= 25) {
        reverbMix = Math.min((score - 75) / 25, 1.0) * 0.6;
    }

    dryGain.gain.value = 1.0 - reverbMix;
    wetGain.gain.value = reverbMix;

    distortionNode.connect(dryGain);
    distortionNode.connect(wetGain);

    wetGain.connect(convolverNode);
    convolverNode.connect(masterGain);
    dryGain.connect(masterGain);

    sineOsc.start();
    saws.forEach(osc => osc.start());

    sineOsc.stop(audioCtx.currentTime + noteDuration);
    saws.forEach(osc => osc.stop(audioCtx.currentTime + noteDuration));
}

function startGame() {
    initAudio();
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

    const mouseMoveHandler = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = gameArea.getBoundingClientRect();
        let x = clientX - rect.left - (basket.offsetWidth / 2);

        // Bounds checking
        if (x < 0) x = 0;
        if (x > gameArea.offsetWidth - basket.offsetWidth) x = gameArea.offsetWidth - basket.offsetWidth;

        basket.style.left = x + "px";
    };

    gameArea.addEventListener("mousemove", mouseMoveHandler);
    gameArea.addEventListener("touchmove", (e) => {
        e.preventDefault(); // Prevent scrolling while playing
        mouseMoveHandler(e);
    }, { passive: false });

    function spawnEmoji() {
        if (isGameOver) return;

        const emoji = document.createElement("div");
        emoji.className = "falling-emoji";
        emoji.innerText = gameEmojis[Math.floor(Math.random() * gameEmojis.length)];

        let _x = Math.random() * (gameArea.offsetWidth - 30);
        let _y = 0;
        let _dx = 0;

        if (score >= 100) {
            _dx = (Math.random() - 0.5) * 10;
        }

        emoji.style.left = _x + "px";
        emoji.style.top = _y + "px";
        gameArea.appendChild(emoji);

        // Speed increases slightly as score goes up
        let baseSpeed = 2 + (score * 0.1);
        let speed = baseSpeed + Math.random() * 2;
        let _dy = speed;

        let fallInterval = setInterval(() => {
            if (isGameOver || !document.getElementById("minigame-overlay")) {
                clearInterval(fallInterval);
                if (emoji.parentElement) emoji.remove();
                return;
            }

            _y += _dy;
            _x += _dx;

            if (score >= 100) {
                if (_x <= 0) {
                    _x = 0;
                    _dx *= -1;
                } else if (_x >= gameArea.offsetWidth - 30) {
                    _x = gameArea.offsetWidth - 30;
                    _dx *= -1;
                }
            }

            emoji.style.top = _y + "px";
            emoji.style.left = _x + "px";

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

                // Audio feedback mapping X to pentatonic scale
                let caughtX = emojiRect.left - gameArea.getBoundingClientRect().left + (emojiRect.width / 2);
                let normalizedX = caughtX / gameArea.offsetWidth;
                let noteIndex = Math.floor(normalizedX * pentatonicFrequencies.length);
                noteIndex = Math.max(0, Math.min(noteIndex, pentatonicFrequencies.length - 1));
                playNote(pentatonicFrequencies[noteIndex], score);

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
