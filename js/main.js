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
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const mapFilters = map.querySelector(`.map__filters-container`);

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

const generateAd = () => {
  const LOCATION_X = getRandom(PIN_WIDTH, MAP_WIDTH);
  const LOCATION_Y = getRandom(MIN_Y, MAX_Y);

  return {
    author: {
      avatar: `img/avatars/user0${getRandom(1, AMOUNT_ADS)}.png`
    },
    offer: {
      title: TITLES[getRandom(0, TITLES.length - 1)],
      address: `${LOCATION_X}, ${LOCATION_Y}`,
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
      x: LOCATION_X,
      y: LOCATION_Y
    }
  };
};

const renderCardAd = (ad) => {
  const cardElement = cardTemplate.cloneNode(true);
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  const popupPhotos = cardElement.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

  cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;

  switch (ad.offer.type) {
    case `flat`:
      cardElement.querySelector(`.popup__type`).textContent = `Квартира`;
      break;
    case `bungalow`:
      cardElement.querySelector(`.popup__type`).textContent = `Бунгало`;
      break;
    case `house`:
      cardElement.querySelector(`.popup__type`).textContent = `Дом`;
      break;
    case `palace`:
      cardElement.querySelector(`.popup__type`).textContent = `Дворец`;
      break;
  }

  cardElement.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  for (let i = 0; i < ALL_FEATURES.length; i++) {
    if (ad.offer.features.indexOf(ALL_FEATURES[i]) === -1) {
      popupFeatures.removeChild(popupFeatures.querySelector(`.popup__feature--${ALL_FEATURES[i]}`));
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = ad.offer.description;

  for (let i = 0; i < ad.offer.photos.length; i++) {
    const imgPhoto = popupPhoto.cloneNode(true);
    popupPhotos.appendChild(imgPhoto);
    imgPhoto.src = ad.offer.photos[i];
  }

  popupPhotos.removeChild(popupPhoto);

  cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;

  for (let i = 0; i < cardElement.children.length; i++) {
    const child = cardElement.children[i];
    if (!child.hasChildNodes()) {
      cardElement.removeChild(child);
    }
  }

  return cardElement;
};

const getAds = () => {
  const ads = [];
  for (let i = 0; i < AMOUNT_ADS; i++) {
    ads.push(generateAd());
    mapFilters.before(renderCardAd(ads[0]));
  }
  return ads;
};

const renderAd = (ad) => {
  const adElement = pinTemplate.cloneNode(true);
  const imgAd = adElement.querySelector(`img`);

  adElement.style = `left: ${ad.location.x - PIN_WIDTH}px; top: ${ad.location.y - PIN_HEIGHT}px;`;
  imgAd.src = ad.author.avatar;
  imgAd.alt = ad.offer.title;

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
