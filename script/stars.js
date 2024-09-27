document.addEventListener("DOMContentLoaded", () => {
    calculateAngle()
    const cursor = document.createElement("div");
    cursor.className = "cursor-follower";
    document.querySelector("body").appendChild(cursor);
        
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener("mouseleave", (e) => {
        cursor.style.opacity = 0;
    });
    document.addEventListener("mouseenter", (e) => {
        cursor.style.opacity = 1;
    });
    
    loadStars(3);
});

function loadStars(stars){
    console.log("Loading stars");
    const starsContainer = document.createElement("div");
    starsContainer.className = "stars-container";
    const shootingStarDiv = document.createElement("div");
    shootingStarDiv.className = "shooting-star-container";
    const shootingStar = document.createElement("div");
    shootingStar.className = "shooting-star";
    shootingStarDiv.appendChild(shootingStar);
    starsContainer.appendChild(shootingStarDiv);
    if(stars > 3) stars = 3;
    if(stars < 0) return;
    for(let i = 0; i < stars; i++){
       const stars = document.createElement("div");
       stars.id = "stars";
       if(i != 0) stars.id += i;
       starsContainer.appendChild(stars);
    };
    document.querySelector("body").appendChild(starsContainer);
}
function calculateAngle() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const angle = Math.atan2(height, -width) * (180 / Math.PI);
    document.documentElement.style.setProperty('--angle', `${angle}deg`);
  }