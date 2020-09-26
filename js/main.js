'use strict';

const MAP_WIDTH = 1200;
const MIN_Y = 130;
const MAX_Y = 630;
const PIN_WIDTH = 65;
const PIN_HEIGHT = 65;
const MIN_PRICE = 30000;
const MAX_PRICE = 100000;
const AMOUNT_ADS = 8;
const AMOUNT_ROOMS = 4;
const AMOUNT_GUESTS = 10;

const TIME = [
  `12:00`,
  `13:00`,
  `14:00`
];

const TITLES = [
  `Уютное гнездышко`,
  `Мрачное место`,
  `Хорошая квартира по заоблачной цене`,
  `Просто гараж`,
  `Люксовая хрущевка`,
  `Минка`,
  `Домик без воды и отопления`,
  `Лучшее жилье в городе`
];

const DESCRIPTIONS = [
  `Бабушкин ремонт`,
  `СРОЧНО!`,
  `Торг уместен`,
  `Славянам не звонить`,
  `Подходит для шумных вечеринок`
];

const TYPES = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const ALL_FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const ALL_PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const map = document.querySelector(`.map`);
const pins = map.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const getRandom = (min = 0, max = 100) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const shuffle = (array) => {
  const doubleArr = array.slice();
  let j;
  let temp;
  for (let i = doubleArr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = doubleArr[j];
    doubleArr[j] = doubleArr[i];
    doubleArr[i] = temp;
  }
  return doubleArr;
};

const generateAd = () => ({
  author: {
    avatar: `img/avatars/user0${getRandom(1, AMOUNT_ADS)}.png`
  },
  offer: {
    title: TITLES[getRandom(0, TITLES.length - 1)],
    address: `${location.x}, ${location.y}`,
    price: getRandom(MIN_PRICE, MAX_PRICE),
    type: TYPES[getRandom(0, TYPES.length - 1)],
    rooms: getRandom(1, AMOUNT_ROOMS),
    guests: getRandom(1, AMOUNT_GUESTS),
    checkin: TIME[getRandom(0, TIME.length - 1)],
    checkout: TIME[getRandom(0, TIME.length - 1)],
    features: shuffle(ALL_FEATURES).slice(getRandom(0, ALL_FEATURES.length)),
    description: DESCRIPTIONS[getRandom(0, DESCRIPTIONS.length - 1)],
    photos: shuffle(ALL_PHOTOS).slice(getRandom(0, ALL_PHOTOS.length))
  },
  location: {
    x: getRandom(0, MAP_WIDTH),
    y: getRandom(MIN_Y, MAX_Y)
  }
});

const getAds = () => {
  const ads = [];
  for (let i = 0; i < AMOUNT_ADS; i++) {
    ads.push(generateAd());
  }
  return ads;
};

const renderAd = (ad) => {
  const adElement = pinTemplate.cloneNode(true);

  adElement.querySelector(`.map__pin`).style = `left: ${ad.location.x + PIN_WIDTH}px; top: ${ad.location.y + PIN_HEIGHT}px;`;
  adElement.querySelector(`img`).src = ad.author.avatar;
  adElement.querySelector(`img`).alt = ad.offer.title;

  return adElement;
};

const renderAds = (ads) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < ads.length; i++) {
    fragment.appendChild(renderAd(ads[i]));
  }
  return fragment;
};

pins.appendChild(renderAds(getAds()));

map.classList.remove(`map--faded`);
