document.addEventListener("DOMContentLoaded", () => {

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
