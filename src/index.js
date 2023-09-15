import { Notify } from "notiflix";
import { PixabayAPI, PixabayAPI } from "./pixabay-api";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const newGallery = document.querySelector('.gallery'); 


const pixabayAPI = new PixabayAPI();
let gallery = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSearch)

function onSearch(e) {
    e.preventDefault();
    newGallery.innerHTML = '';
    
    const form = e.currentTarget;
    const searchQuery = form.elements['searchQuery'].value.trim();

    pixabayAPI.q = searchQuery;

    if (!searchQuery) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    }
    fetchGallery();
}



async function fetchGallery() {
    try {
        const {data} = await pixabayAPI.fetchPics();
        if (data.totalHits === 0)
        {
            Notify.info("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        newGallery.innerHTML = createGallery(data.hits);
        Notify.info("Hooray! We found ${data.totalHits} images.");
        gallery.refresh();
        
    } catch (error) { console.log(error); }
    }
    
    



function createGallery(data) {
    
    return data
    .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
 `
 <a class="gallery-link" href="${largeImageURL}">
 <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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



        



