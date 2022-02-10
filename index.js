const modal = document.querySelector('div.overlay');
const body = document.querySelector('body');

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-open')) {
        modal.style.display = "flex";
        body.style.overflow = "hidden";
    }

    if (e.target.classList.contains('modal-close')) {
        modal.style.display = "none";
        body.style.overflow = "visible";
    }
})

const swiper = new Swiper('.swiper', {
    slidesPerView: 1.5,
    spaceBetween: -50,
    centeredSlides: true,
    preventClicks:true,
    loop:true, 
    pagination: {
        el: '.swiper-pagination',
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
})