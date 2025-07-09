const petContainer = document.getElementById('pet-container');
const PET_SPRITES = ['/public/images/pixel-fox.gif', '/public/images/pixel-cat.gif'];

function createRunningPet() {
    const pet = document.createElement('img');
    pet.classList.add('running-pet');
    pet.src = PET_SPRITES[Math.floor(Math.random() * PET_SPRITES.length)];
    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight;
    let speedX = (Math.random() - 0.5) * 4;
    let speedY = (Math.random() - 0.5) * 2;
    pet.style.left = `${posX}px`;
    pet.style.top = `${posY}px`;
    if (speedX < 0) { pet.style.transform = 'scaleX(-1)'; }
    petContainer.appendChild(pet);
    setInterval(() => {
        posX += speedX;
        posY += speedY;
        if (posX <= 0 || posX >= window.innerWidth - pet.width) {
            speedX *= -1;
            pet.style.transform = speedX > 0 ? 'scaleX(1)' : 'scaleX(-1)';
        }
        if (posY <= 0 || posY >= window.innerHeight - pet.height) { speedY *= -1; }
        pet.style.left = `${posX}px`;
        pet.style.top = `${posY}px`;
    }, 33);
}
document.addEventListener('DOMContentLoaded', () => {
    createRunningPet();
    createRunningPet();
});