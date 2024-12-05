// Fonction pour démarrer un défilement automatique de la page
function scrollAutomatically(speed = 2) {
    // Variable pour stocker l'ID de l'intervalle du défilement
    let intervalId = null;

    // Démarre le défilement
    function startScrolling() {
        intervalId = setInterval(() => {
            window.scrollBy(0, speed); // fait défiler la page vers le bas avec la vitesse spécifiée

            // Si on est arrivé en bas de la page, on arrête le défilement
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                stopScrolling(); // Arrêt du défilement lorsque l'on atteint la fin de la page
            }
        }, 16); // L'intervalle est de 16ms, ce qui correspond à un taux de 60 FPS (images par seconde)
    }

    // Arrête le défilement
    function stopScrolling() {
        clearInterval(intervalId); // Arrête l'intervalle du défilement
    }

    // Ajoute des événements pour interagir avec l'utilisateur via les touches du clavier
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            speed = Math.max(1, speed - 1); // Réduit la vitesse de défilement
        } else if (event.key === 'ArrowDown') {
            speed += 1; // Augmente la vitesse de défilement
        } else if (event.key === 'Escape') {
            stopScrolling(); // Arrête le défilement lorsque la touche 'Escape' est pressée
        }
    });

    startScrolling(); // Démarre le défilement au moment de l'exécution de la fonction
}

// Appel de la fonction pour démarrer le défilement automatique
scrollAutomatically();

// Fonction pour charger les données du quiz depuis un fichier JSON
function loadQuizData() {
  fetch('../../DATA/quizz.json') // Charge le fichier JSON avec les données du quiz
      .then(response => response.json()) // Transforme la réponse en JSON
      .then(data => startQuiz(data)) // Démarre le quiz avec les données chargées
      .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error)); // En cas d'erreur, affiche un message
}

// Fonction pour démarrer le quiz avec les données du fichier JSON
function startQuiz(questions) {
  let currentQuestionIndex = 0; // Indice de la question actuelle
  let score = 0; // Le score du joueur
  let correctAnswers = 0; // Compteur des bonnes réponses successives
  let wrongAnswers = 0; // Compteur des mauvaises réponses successives
  let currentLevel = "soft"; // Niveau initial du quiz

  // Limiter le nombre de questions à 20
  const maxQuestions = 20;

  // Fonction pour afficher la question actuelle, le niveau, et les options de réponse
  function displayQuestion() {
      if (currentQuestionIndex >= maxQuestions) { // Si on atteint le maximum de questions, on affiche les résultats
          showResults();
          return;
      }

      const question = questions[currentQuestionIndex]; // Récupère la question actuelle

      // Mise à jour du niveau
      const levelElement = document.getElementById('level');
      if (levelElement) {
          levelElement.textContent = `Niveau: ${currentLevel}`; // Affiche le niveau actuel
      }

      // Affichage de la question
      const questionElement = document.getElementById('question');
      if (questionElement) {
          questionElement.textContent = question.question; // Affiche le texte de la question
      }

      // Réinitialise les options de réponse si elles existent
      const optionsElement = document.getElementById('options');
      if (optionsElement) {
          optionsElement.innerHTML = ''; // Vide les options précédentes

          // Crée les boutons pour les réponses "Oui" et "Non"
          const yesButton = document.createElement('button');
          yesButton.textContent = 'Oui';
          yesButton.onclick = () => checkAnswer('Oui', question.detail); // Lien avec la fonction de vérification de la réponse

          const noButton = document.createElement('button');
          noButton.textContent = 'Non';
          noButton.onclick = () => checkAnswer('Non', question.detail); // Lien avec la fonction de vérification de la réponse

          // Ajoute les boutons au conteneur des options
          optionsElement.appendChild(yesButton);
          optionsElement.appendChild(noButton);
      }
  }

  // Fonction pour vérifier la réponse de l'utilisateur
  function checkAnswer(userAnswer, detail) {
      const correctAnswer = questions[currentQuestionIndex].response; // Récupère la réponse correcte de la question

      // Vérification si la réponse donnée par l'utilisateur est correcte
      if (userAnswer === correctAnswer) {
          score++; // Augmente le score
          correctAnswers++; // Augmente le nombre de bonnes réponses consécutives
          wrongAnswers = 0; // Réinitialise le compteur de mauvaises réponses
      } else {
          wrongAnswers++; // Augmente le compteur de mauvaises réponses
          correctAnswers = 0; // Réinitialise le compteur de bonnes réponses
      }

      // Affiche le détail de la question pendant 2 secondes
      const detailElement = document.getElementById('detail');
      if (detailElement) {
          detailElement.textContent = detail; // Affiche le détail de la question
      }

      // Attendre 2 secondes avant de passer à la question suivante
      setTimeout(() => {
          // Réinitialise le détail pour le faire disparaître après 2 secondes
          if (detailElement) {
              detailElement.textContent = '';
          }

          // Change le niveau du quiz en fonction des bonnes et mauvaises réponses
          if (correctAnswers === 3) {
              changeLevel("up"); // Augmente le niveau après 3 bonnes réponses consécutives
          } else if (wrongAnswers === 3) {
              changeLevel("down"); // Diminue le niveau après 3 mauvaises réponses consécutives
          }

          // Passe à la question suivante
          currentQuestionIndex++;

          // Vérifie s'il reste des questions, sinon montre les résultats
          if (currentQuestionIndex < maxQuestions) {
              displayQuestion(); // Affiche la question suivante
          } else {
              showResults(); // Montre les résultats à la fin
          }
      }, 2000); // Attendre 2 secondes avant de passer à la question suivante
  }

  // Fonction pour changer le niveau
  function changeLevel(direction) {
      const levels = ["soft", "mid", "hard"]; // Les différents niveaux de difficulté
      const currentLevelIndex = levels.indexOf(currentLevel); // Trouve l'indice du niveau actuel

      // Si on veut augmenter le niveau et qu'on n'est pas déjà au niveau maximum
      if (direction === "up" && currentLevelIndex < levels.length - 1) {
          currentLevel = levels[currentLevelIndex + 1];
      } 
      // Si on veut diminuer le niveau et qu'on n'est pas déjà au niveau minimum
      else if (direction === "down" && currentLevelIndex > 0) {
          currentLevel = levels[currentLevelIndex - 1];
      }
  }

  // Fonction pour afficher les résultats à la fin du quiz
  function showResults() {
      const resultElement = document.getElementById('results');
      resultElement.textContent = `Votre score est : ${score} / ${maxQuestions}`; // Affiche le score final
  }

  // Initialiser la première question
  displayQuestion();
}

// Démarre le quiz dès que la page est chargée
window.onload = loadQuizData;
