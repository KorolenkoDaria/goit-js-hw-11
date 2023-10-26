import axios from "axios";

axios.defaults.headers.common["x-api-key"] = "live_qpL8gSu5TR27wrci5IQUgNxYIcmpK2R93B3dqmqgh96YLP7YEswmy40zYXUoMIW0";
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';

function fetchBreeds() {
    return axios.get('/breeds')
        .then(response => {
            return response.data;
        });
}

function fetchCatByBreed (breedId) {
    return axios.get(`/images/search?breed_ids=${breedId}`)
        .then(response => {
            return response.data[0];
        });
}
export { fetchBreeds, fetchCatByBreed };    