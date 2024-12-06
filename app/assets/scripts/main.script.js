document.getElementById('startButton').addEventListener('click', function() {
    this.textContent = 'STARTING...';
    document.getElementById('boat').classList.add('move');

    // Redirection vers la page des règles après l'animation du bateau
    setTimeout(function() {
        window.location.href = 'game/rules.html';
    }, 3000);
});

// Ajouter l'effet parallaxe pour les nuages
document.addEventListener('mousemove', function(e) {
    const clouds = document.querySelectorAll('.cloud, .cloud2');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    clouds.forEach(cloud => {
        const speed = cloud.classList.contains('cloud') ? 2 : 4;
        const x = (window.innerWidth - mouseX * speed) / 100;
        const y = (window.innerHeight - mouseY * speed) / 100;
        
        cloud.style.transform = `translate(${x}px, ${y}px)`;
    });
}); 