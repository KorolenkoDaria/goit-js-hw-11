import { fetchData} from './js/api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
    searchInput: document.querySelector('input[name="searchQuery"]'),
    submitButton: document.querySelector('button[type="submit"]'),
};
let totalPages = 0;
let page = 1;
const options = {
    root: null,
    rootMargin: "300px",
};
const observer = new IntersectionObserver(handlerLoadMore, options);

refs.form.addEventListener("submit", searchData)

function searchData(evt) {
    evt.preventDefault();

    const inputValue = refs.searchInput.value.trim();
    
    if (!inputValue) {
        Notiflix.Notify.failure('Please enter your request!');
        return
       
    } 
        fetchData(inputValue, page)
            .then((data) => {
                refs.gallery.innerHTML = createMarkup(data.hits);
                slowScroll();       
                initializeLightbox();
                totalPages = Math.floor(data.totalHits / data.hits.length);
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

                if (data.hits.length < data.totalHits) {
                    observer.observe(refs.guard);
                }    
            })
            .catch((error) => {
                Notiflix.Notify.failure('❌ Oops! Something went wrong! Try reloading the page!');
            });
}

function handlerLoadMore(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {  
            page += 1;
            fetchData(refs.searchInput.value, page)    
            .then((data) => {                      
                refs.gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
                 
                    if (page === totalPages) {
                        observer.unobserve(refs.guard);
                        Notiflix.Notify.info('\"We\'re sorry, but you\'ve reached the end of search results.\"');
                    }
                })
                .catch(error => console.error(error));
            }
        });
    initializeLightbox();
    slowScroll(); 
}


function createMarkup(arr) {
    return arr.map(({ webformatURL , tags, likes , views, comments, downloads, largeImageURL }) => 
   `<div class="photo-card">
   <a href="${largeImageURL}" class="photo-card-link">
     <img src="${webformatURL}"
       alt="${tags}"
       data-source="${largeImageURL}" 
       loading="lazy" 
       width="400px" />
   </a>
   <div class="info">
     <p class="info-item">
       <b>Likes:</b>${likes}
     </p>
     <p class="info-item">
       <b>Views:</b>${views}
     </p>
     <p class="info-item">
       <b>Comments:</b>${comments}
     </p>
     <p class="info-item">
       <b>Downloads:</b> ${downloads}
     </p>
   </div>
 </div>`
    ).join("");
}

function initializeLightbox(){
new SimpleLightbox('.photo-card a', {
    captions: true,
    captionDelay: 250,
    captionSelector: 'img',
    captionsData: 'alt'
});
}; 
function slowScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
  });
}
