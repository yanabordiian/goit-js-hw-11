
import './css/common.css';
import { Notify } from "notiflix";
import { PixabayAPI } from "./js/pixabay-api";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('.search-form');
const newGallery = document.querySelector('.gallery'); 
const btnLoadMore = document.querySelector('.load-more');


const pixabayAPI = new PixabayAPI();
let gallery = new SimpleLightbox('.gallery a');
let totalPages = 0;

form.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);


function onSearch(e) {
    e.preventDefault();
    newGallery.innerHTML = '';
    
    const form = e.currentTarget;
    const searchQuery = form.elements['searchQuery'].value.trim();

   
    pixabayAPI.q = searchQuery;
    pixabayAPI.page = 1;

    if (!searchQuery) {
        btnLoadMore.classList.add('is-hidden'); 
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        
        return;
    }
    fetchGallery();
}



async function fetchGallery() {
    try {
        const { data } = await pixabayAPI.fetchPics();
        
        

        if (data.totalHits === 0)
        {
            btnLoadMore.classList.add('is-hidden');
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            
            return;
        }
        newGallery.innerHTML = createGallery(data.hits);
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        gallery.refresh();
        
        if (data.totalHits > pixabayAPI.per_page) { btnLoadMore.classList.remove('is-hidden') };
        scrollGallery();
    } catch (error) { console.error("Error fetching gallery:",error); }
    }
    
    

function createGallery(data) {
    
    return data
    .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
 `
 <a class="gallery-link" href="${largeImageURL}">
 <div class="photo-card">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
 </div>    
 </div>
 </a>`
    )
    .join('')
 }


function onLoadMore() {
    pixabayAPI.page += 1;
    searchMorePics();
}

async function searchMorePics() {
    try {
        const { data } = await pixabayAPI.fetchPics();

        newGallery.insertAdjacentHTML('beforeend', createGallery(data.hits));
        gallery.refresh();

        if (data.hits.length < pixabayAPI.per_page) {
            btnLoadMore.classList.add('is-hidden');
            return Notify.info( "We're sorry, but you've reached the end of search results."
      );
        }
        scrollGallery();
    } catch (error) { console.error("Error fetching more pics:",error); }
}
        

function scrollGallery() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

