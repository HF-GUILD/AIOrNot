// Code adapted from https://codeconvey.com/html-image-zoom-on-click/

let modal = document.querySelector('.modal');
let imgs = document.querySelectorAll('.img-centered');
let modalImg = document.querySelector('.img-zoomed');
let caption = document.querySelector('.caption');

// Zoom-in
imgs.forEach((img) => {
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        caption.innerHTML = this.alt;
    }
});

// Zoom-out
modal.onclick = function () {
    modalImg.className += " out";
    setTimeout(function () {
        modal.style.display = "none";
        modalImg.className = "modal-content";
    }, 400);
}