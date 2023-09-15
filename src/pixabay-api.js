
import axios from "axios";


export class PixabayAPI {
    #URL = 'https://pixabay.com/api/';
    #KEY = '39445468-5bef8aca8c71dbf8b443014bc';
    #PARAMS = {
                key: this.#KEY,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearh: true
    }
page = 1;
q = null;
per_page = 40;

    async fetchPics() {
        const searchParams = new URLSearchParams({
            ...this.#PARAMS,
            page: this.page,
            q: this.q,
            per_page: this.per_page

        });
        return await axios.get(`${this.#URL}?${searchParams}`)
    }
}
