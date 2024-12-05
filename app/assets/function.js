let data = []; //création / initialisation de la variable data vide 

// Charger les données depuis le fichier JSON
fetch('data.json')
    .then(response => response.json()) // Lire et convertir les données JSON
    .then(json => {
        data = json; // Stocker les données dans la variable data
        
        // Lancer la fonction DisplayRandomCard pour afficher une première carte a l'ouverture de la page 
        displayRandomCard(); //
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));



// Fonction pour afficher une carte au hasard
function displayRandomCard() {
    if (data.length === 0) return; // Vérifier que les données sont disponibles

    const randomIndex = Math.floor(Math.random() * data.length); // Choisir un index aléatoire
    const cardData = data[randomIndex]; // Récupérer l'objet correspondant

    // Construire le contenu de la carte . ('card') Fait référence a la div nommé "card" en Html , correspondant a la carte ou l'on affiche les données
    const cardContainer = document.getElementById('card');
    cardContainer.innerHTML = `
        <h3>${cardData.title}</h3>
        <p>${cardData.content}</p>
    `;
}

// Ajouter un écouteur pour le bouton qui lance la fonction Displayrandomcard
document.getElementById('change-btn').addEventListener('click', displayRandomCard);

