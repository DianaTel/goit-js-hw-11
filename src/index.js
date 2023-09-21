import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto } from './js/pixabay-api';
import { createMarkup } from './js/markup';
import { refs } from './js/refs';
import { lightbox } from './js/lightbox';
import { paramsForNotify } from './js/paramsForNotify';

const { searchForm, gallery, btnLoadMore } = refs;

const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

searchForm.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onClickLoadMore);

async function onSubmitForm(event) {
  event.preventDefault();

  window.scrollTo(0, 0);
  btnLoadMore.classList.add('is-hidden');
  gallery.innerHTML = '';
  page = 1;
  const { searchQuery } = event.currentTarget.elements;
  keyOfSearchPhoto = searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');
  // console.log(keyOfSearchPhoto);

  if (keyOfSearchPhoto === '') {
    Notify.info('Enter your request, please!', paramsForNotify);
    return;
  }

  const data = await fetchPhoto(keyOfSearchPhoto, page, perPage)
  if (!data) {
    return;
  }

  if (data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      paramsForNotify
    );
  } else {
    Notify.info(
      `Hooray! We found ${data.totalHits} images.`,
      paramsForNotify
    );
    createMarkup(data.hits);
    lightbox.refresh();
  }
  if (data.totalHits > perPage) {
    btnLoadMore.classList.remove('is-hidden');
    window.addEventListener('scroll', showLoadMorePage);
  }
  // scrollPage();

  event.target.reset();
}

async function onClickLoadMore() {
  
  page += 1;

  const data = await fetchPhoto(keyOfSearchPhoto, page, perPage)
  if (!data) {
    return;
  }

  const numberOfPage = Math.ceil(data.totalHits / perPage);

  createMarkup(data.hits);
  if (page === numberOfPage) {
    btnLoadMore.classList.add('is-hidden');
    Notify.info(
      "We're sorry, but you've reached the end of search results.",
      paramsForNotify
    );
    window.removeEventListener('scroll', showLoadMorePage);
  }
  lightbox.refresh();
  // scrollPage();
}

function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onClickLoadMore();
  }
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
