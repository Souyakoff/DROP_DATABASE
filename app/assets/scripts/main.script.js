document.getElementById('startButton').addEventListener('click', function() {
    this.textContent = 'STARTING...';
    document.getElementById('boat').classList.add('move');

    // Rediriger après la durée de l'animation (6 secondes)
    setTimeout(function() {
        window.location.href = 'acceuil.html';
    }, 6000);
});
