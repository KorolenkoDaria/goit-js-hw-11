import axios from "axios";

async function fetchData(q, page = 1) {
    const BASE_URL = "https://pixabay.com/api/";
    const API_KEY = "40285676-751807e61d49ed3d514893f9d"
    const params = new URLSearchParams({
        key: API_KEY,
        q: q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
    });

    const response = await axios.get(`${BASE_URL}?${params}`);
    const data = await response.data;

    if (!data.totalHits) {
        Notiflix.Notify.failure('❌ "Sorry, there are no images matching your search query. Please try again."');
    }

    return data;   
}

export { fetchData};    