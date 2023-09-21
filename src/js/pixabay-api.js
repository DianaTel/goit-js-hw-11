import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { paramsForNotify } from './paramsForNotify';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '39562941-58b357ab3f6663d5ce277b2dd';

export async function fetchPhoto(q, page, perPage) {

  try {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    onFetchError()
  }

  return null;
}

function onFetchError() {
  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or make another choice!',
    paramsForNotify
  );
}