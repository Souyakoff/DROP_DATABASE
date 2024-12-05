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

// Fonction pour charger les données depuis le fichier JSON
function loadQuizData() {
  fetch('../../DATA/quizz.json')
      .then(response => response.json())
      .then(data => startQuiz(data))
      .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
}

// Fonction pour démarrer le quiz avec les données du JSON
function startQuiz(questions) {
  let currentQuestionIndex = 0;
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let currentLevel = "soft"; // Niveau initial

  // Limiter à 20 questions
  const maxQuestions = 20;

  // Fonction pour afficher la question actuelle, le niveau et les options
  function displayQuestion() {
      if (currentQuestionIndex >= maxQuestions) {
          showResults();
          return;
      }

      const question = questions[currentQuestionIndex];

      // Mise à jour du niveau
      const levelElement = document.getElementById('level');
      if (levelElement) {
          levelElement.textContent = `Niveau: ${currentLevel}`;
      }

      // Affichage de la question
      const questionElement = document.getElementById('question');
      if (questionElement) {
          questionElement.textContent = question.question;
      }

      // Réinitialiser les options (si elles existent déjà)
      const optionsElement = document.getElementById('options');
      if (optionsElement) {
          optionsElement.innerHTML = '';

          // Ajouter les options sous forme de boutons
          const yesButton = document.createElement('button');
          yesButton.textContent = 'Oui';
          yesButton.onclick = () => checkAnswer('Oui', question.detail);

          const noButton = document.createElement('button');
          noButton.textContent = 'Non';
          noButton.onclick = () => checkAnswer('Non', question.detail);

          optionsElement.appendChild(yesButton);
          optionsElement.appendChild(noButton);
      }
  }

  // Fonction pour vérifier la réponse de l'utilisateur
  function checkAnswer(userAnswer, detail) {
      const correctAnswer = questions[currentQuestionIndex].response;

      // Vérification si la réponse est correcte
      if (userAnswer === correctAnswer) {
          score++;
          correctAnswers++;
          wrongAnswers = 0; // Réinitialiser les mauvaises réponses
      } else {
          wrongAnswers++;
          correctAnswers = 0; // Réinitialiser les bonnes réponses
      }

      // Afficher le détail de la question pendant 5 secondes
      const detailElement = document.getElementById('detail');
      if (detailElement) {
          detailElement.textContent = detail;
      }

      // Attendre 2 secondes avant de passer à la question suivante
      setTimeout(() => {
          // Réinitialiser le détail pour qu'il disparaisse après 2 secondes
          if (detailElement) {
              detailElement.textContent = '';
          }

          // Changer le niveau en fonction des bonnes et mauvaises réponses
          if (correctAnswers === 3) {
              changeLevel("up"); // Augmenter le niveau après 3 bonnes réponses
          } else if (wrongAnswers === 3) {
              changeLevel("down"); // Diminuer le niveau après 3 mauvaises réponses
          }

          // Passer à la question suivante
          currentQuestionIndex++;

          // Vérifier s'il reste des questions
          if (currentQuestionIndex < maxQuestions) {
              displayQuestion();
          } else {
              showResults();
          }
      }, 2000); // Attendre 2 secondes avant de passer à la question suivante
  }

  // Fonction pour changer le niveau
  function changeLevel(direction) {
      const levels = ["soft", "mid", "hard"];
      const currentLevelIndex = levels.indexOf(currentLevel);

      if (direction === "up" && currentLevelIndex < levels.length - 1) {
          currentLevel = levels[currentLevelIndex + 1];
      } else if (direction === "down" && currentLevelIndex > 0) {
          currentLevel = levels[currentLevelIndex - 1];
      }
  }

  // Fonction pour afficher les résultats
  function showResults() {
      const resultElement = document.getElementById('results');
      resultElement.textContent = `Votre score est : ${score} / ${maxQuestions}`;
  }

  // Initialiser la première question
  displayQuestion();
}

// Démarre le quiz au chargement de la page
window.onload = loadQuizData;

  
  