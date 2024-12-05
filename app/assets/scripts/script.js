class DeepSeaQuiz {
    constructor() {
        // État du jeu
        this.currentQuestionIndex = 0;
        this.incorrectAnswers = 0;
        this.currentDifficulty = "easy";
        this.questions = this.shuffleQuestions();
        
        // Éléments du DOM
        this.diverElement = document.getElementById('diver');
        this.questionText = document.getElementById('question-text');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.factPopup = document.getElementById('fact-popup');
        this.factText = document.getElementById('fact-text');

        // Initialiser d'abord le système de bulles
        this.bubbleSystem = new BubbleSystem();

        // Lier les écouteurs d'événements
        this.initializeEventListeners();
        
        // Démarrer le jeu en dernier
        this.startGame();
    }

    shuffleQuestions() {
        return [...quizQuestions].sort(() => Math.random() - 0.5);
    }

    initializeEventListeners() {
        // Boutons de réponse
        document.querySelector('.true-btn').addEventListener('click', () => this.handleAnswer(true));
        document.querySelector('.false-btn').addEventListener('click', () => this.handleAnswer(false));

        // Bouton question suivante
        document.querySelector('.next-btn').addEventListener('click', () => this.showNextQuestion());
    }

    startGame() {
        this.currentQuestionIndex = 0;
        this.incorrectAnswers = 0;
        this.currentDifficulty = "easy";
        this.questions = this.shuffleQuestions();
        this.updateDiverPosition();
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.question;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
    }

    handleAnswer(userAnswer) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isCorrect = userAnswer === currentQuestion.answer;
        const button = document.querySelector(userAnswer ? '.true-btn' : '.false-btn');
        const questionCard = document.querySelector('.question-card');

        if (!isCorrect) {
            // Ajouter la classe d'erreur au bouton
            button.classList.add('wrong');
            
            // Créer l'effet d'onde
            const ripple = document.createElement('div');
            ripple.className = 'error-ripple';
            button.appendChild(ripple);
            
            // Ajouter l'animation de secousse à la carte
            questionCard.classList.add('shake');
            
            // Mettre à jour la position du plongeur et l'état du jeu
            this.incorrectAnswers++;
            this.updateDiverPosition();

            // Supprimer les animations après leur completion
            setTimeout(() => {
                button.classList.remove('wrong');
                questionCard.classList.remove('shake');
                ripple.remove();
            }, 1500); // Augmenté à 1.5 secondes

            // Créer les particules d'erreur
            this.createErrorParticles(button);
        }

        this.showFact(currentQuestion.fact);
        this.updateDifficulty(isCorrect);

        if (this.incorrectAnswers >= 10) {
            this.resetGame();
            return;
        }
    }

    updateDiverPosition() {
        const depthPercentage = (this.incorrectAnswers / 10) * 100;
        const overlay = document.querySelector('.depth-overlay');
        
        // Update diver position
        this.diverElement.style.top = `${depthPercentage}%`;
        
        // Update depth overlay opacity
        overlay.style.opacity = depthPercentage / 100;
        
        // Update bubble system depth if it exists
        if (this.bubbleSystem) {
            this.bubbleSystem.updateDepth(depthPercentage);
        }

        // Add shake animation
        this.diverElement.classList.add('shaking');
        setTimeout(() => {
            this.diverElement.classList.remove('shaking');
        }, 500);

        // Update background position for gradient scrolling
        document.querySelector('.game-area').style.backgroundPosition = `center ${depthPercentage}%`;
    }

    updateDifficulty(wasCorrect) {
        const difficultyLevels = ["easy", "medium", "hard"];
        const currentIndex = difficultyLevels.indexOf(this.currentDifficulty);
        
        if (wasCorrect && currentIndex < difficultyLevels.length - 1) {
            this.currentDifficulty = difficultyLevels[currentIndex + 1];
        } else if (!wasCorrect && currentIndex > 0) {
            this.currentDifficulty = difficultyLevels[currentIndex - 1];
        }
    }

    showFact(fact) {
        this.factText.textContent = fact;
        const popup = document.getElementById('fact-popup');
        const nextButton = document.querySelector('.next-btn');
        
        popup.style.display = 'block';
        nextButton.style.display = 'block';
        
        // Add animation class if it's not already there
        if (!popup.classList.contains('poof')) {
            popup.classList.add('poof');
        }
        
        // Animate next button
        setTimeout(() => {
            nextButton.classList.add('visible');
        }, 100);
    }

    showNextQuestion() {
        const popup = document.getElementById('fact-popup');
        const nextButton = document.querySelector('.next-btn');
        
        popup.style.display = 'none';
        popup.classList.remove('poof');
        nextButton.style.display = 'none';
        nextButton.classList.remove('visible');
        
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions.length) {
            this.resetGame();
            return;
        }

        this.showQuestion();
    }

    resetGame() {
        this.bubbleSystem.destroy();
        this.bubbleSystem = new BubbleSystem();
        this.startGame();
    }

    // Add this method to create error particles
    createErrorParticles(button) {
        const rect = button.getBoundingClientRect();
        const particleCount = 15; // Augmenté le nombre de particules

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: rgba(255, 68, 68, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            document.body.appendChild(particle);

            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 3 + Math.random() * 4; // Réduit la vitesse
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let opacity = 1;
            let scale = 1;

            const animate = () => {
                if (opacity <= 0) {
                    particle.remove();
                    return;
                }

                const x = parseFloat(particle.style.left);
                const y = parseFloat(particle.style.top);
                
                particle.style.left = `${x + vx}px`;
                particle.style.top = `${y + vy}px`;
                opacity -= 0.01; // Réduit la vitesse de disparition
                scale -= 0.005; // Réduit la vitesse de réduction
                
                particle.style.opacity = opacity;
                particle.style.transform = `scale(${scale})`;

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }
    }
}

// Add this to your DeepSeaQuiz class
class BubbleSystem {
    constructor() {
        this.container = document.querySelector('.bubble-container');
        this.bubbleCount = 0;
        this.maxBubbles = 50;
        this.currentDepth = 0;
        this.createBubbleInterval = setInterval(() => this.createBubble(), 200);
    }

    updateDepth(depth) {
        this.currentDepth = depth;
    }

    createBubble() {
        if (this.bubbleCount >= this.maxBubbles) return;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Add depth-specific class
        if (this.currentDepth < 30) {
            bubble.classList.add('surface');
        } else if (this.currentDepth < 70) {
            bubble.classList.add('deep');
        } else {
            bubble.classList.add('abyss');
        }

        // Random properties with depth-based adjustments
        const size = Math.random() * (20 - this.currentDepth/10) + 5;
        const startX = Math.random() * 100;
        const wander = (Math.random() - 0.5) * (50 - this.currentDepth/3);
        const duration = Math.random() * 4 + (8 - this.currentDepth/20);
        const delay = Math.random() * 2;
        const scale = Math.random() * 0.5 + (1 - this.currentDepth/200);
        const opacity = Math.random() * 0.3 + (0.4 - this.currentDepth/200);

        // Set animation based on depth
        const animation = this.currentDepth < 30 ? 'float-bubble-surface' :
                         this.currentDepth < 70 ? 'float-bubble-deep' :
                         'float-bubble-abyss';

        // Set CSS custom properties
        bubble.style.cssText = `
            --x: ${startX}vw;
            --wander: ${wander}px;
            --scale: ${scale};
            --opacity: ${opacity};
            width: ${size}px;
            height: ${size}px;
            left: ${startX}vw;
            animation: ${animation} ${duration}s ease-out ${delay}s;
        `;

        this.container.appendChild(bubble);
        this.bubbleCount++;

        // Remove bubble after animation
        bubble.addEventListener('animationend', () => {
            bubble.remove();
            this.bubbleCount--;
        });
    }

    // Clean up method
    destroy() {
        clearInterval(this.createBubbleInterval);
        this.container.innerHTML = '';
    }
}

// Initialize game when all resources are loaded
window.addEventListener('load', () => {
    new DeepSeaQuiz();
}); 