function scrollAutomatically(speed = 2) {
    // Vitesse du défilement pixels par intervalle
    let intervalId = null;

    // Démarre le défilement
    function startScrolling() {
        intervalId = setInterval(() => {
            window.scrollBy(0, speed); // défile vers le bas
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                stopScrolling(); // Arrête le défilement en bas de page
            }
        }, 16); // Intervalle de temps normalement 60 FPS
    }

    // Arrête le défilement
    function stopScrolling() {
        clearInterval(intervalId);
    }

    // Ajoute des "écouteurs" pour interagir avec l'utilisateur
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            speed = Math.max(1, speed - 1); // Réduit la vitesse
        } else if (event.key === 'ArrowDown') {
            speed += 1; // Augmente la vitesse
        } else if (event.key === 'Escape') {
            stopScrolling(); // Arrête le défilement
        }
    });

    startScrolling();
}

// Appelez la fonction pour démarrer le défilement
scrollAutomatically();

function trueFalseQuiz() {
    let difficultyLevel = 1; // Niveau de difficulté initial
    let correctAnswers = 0; // Compteur de réponses correctes consécutives
    let incorrectAnswers = 0; // Compteur de réponses incorrectes consécutives

    // Simuler des questions
    const questions = [
        { question: "Le ciel est-il bleu ?", answer: true },
        { question: "2 + 2 = 5 ?", answer: false },
        { question: "L'eau bout-elle à 100°C ?", answer: true },
        { question: "La Terre est-elle plate ?", answer: false },
    ];

    function askQuestion() {
        // Choisir une question au hasard
        const question = questions[Math.floor(Math.random() * questions.length)];
        const userAnswer = confirm(question.question); // "OK" pour Oui, "Annuler" pour Non

        // Vérifier la réponse de l'utilisateur
        if (userAnswer === question.answer) {
            alert("Bonne réponse !");
            correctAnswers++; // Augmente le compteur de bonnes réponses
            incorrectAnswers = 0; // Réinitialise le compteur de mauvaises réponses
        } else {
            alert("Mauvaise réponse !");
            incorrectAnswers++; // Augmente le compteur de mauvaises réponses
            correctAnswers = 0; // Réinitialise le compteur de bonnes réponses
        }

        // Ajuster le niveau de difficulté
        adjustDifficulty();

        // Afficher le niveau de difficulté actuel dans la console
        console.log(`Niveau actuel : ${difficultyLevel}`);
    }

    function adjustDifficulty() {
        // Augmenter la difficulté après 3 bonnes réponses consécutives
        if (correctAnswers >= 3) {
            difficultyLevel++;
            correctAnswers = 0; // Réinitialise le compteur
            alert("Le niveau de difficulté a augmenté !");
        }

        // Réduire la difficulté après 3 mauvaises réponses consécutives (si le niveau est supérieur à 1)
        if (incorrectAnswers >= 3 && difficultyLevel > 1) {
            difficultyLevel--;
            incorrectAnswers = 0; // Réinitialise le compteur
            alert("Le niveau de difficulté a baissé !");
        }
    }

    // Boucle pour poser des questions
    function startQuiz() {
        const totalQuestions = 10; // Nombre total de questions
        for (let i = 0; i < totalQuestions; i++) {
            askQuestion(); // Appelle la fonction pour poser une question
        }
        alert("Quiz terminé !"); // Indique la fin du questionnaire
    }

    startQuiz(); // Lance le quiz
}

// Appeler la fonction principale
trueFalseQuiz();
