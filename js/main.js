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

const getRandomFrom = (arr) => {
  return arr[getRandom(0, arr.length - 1)];
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
      title: getRandomFrom(TITLES),
      address: `${LOCATION_X}, ${LOCATION_Y}`,
      price: getRandom(MIN_PRICE, MAX_PRICE),
      type: getRandomFrom(TYPES),
      rooms: getRandom(1, AMOUNT_ROOMS),
      guests: getRandom(1, AMOUNT_GUESTS),
      checkin: getRandomFrom(TIME),
      checkout: getRandomFrom(TIME),
      features: shuffle(ALL_FEATURES).slice(getRandom(0, ALL_FEATURES.length)),
      description: getRandomFrom(DESCRIPTIONS),
      photos: shuffle(ALL_PHOTOS).slice(getRandom(0, ALL_PHOTOS.length))
    },
    location: {
      x: LOCATION_X,
      y: LOCATION_Y
    }
  };
};

const renderCard = (ad) => {
  const OfferType = {
    FLAT: {
      name: `Квартира`
    },
    BUNGALOW: {
      name: `Бунгало`
    },
    HOUSE: {
      name: `Дом`
    },
    PALACE: {
      name: `Дворец`
    },
    getById: (id) => {
      return OfferType[id.toUpperCase()];
    }
  };

  const cardElement = cardTemplate.cloneNode(true);
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  const popupPhotos = cardElement.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

  cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = OfferType.getById(ad.offer.type).name;
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  for (const element of ALL_FEATURES) {
    if (!ad.offer.features.includes(element)) {
      popupFeatures.removeChild(popupFeatures.querySelector(`.popup__feature--${element}`));
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = ad.offer.description;

  for (const photo of ad.offer.photos) {
    const imgPhoto = popupPhoto.cloneNode(true);
    popupPhotos.appendChild(imgPhoto);
    imgPhoto.src = photo;
  }

  popupPhotos.removeChild(popupPhoto);

  cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;

  const hasChildren = (element) => {
    if (element.children.length === 0) {
      element.remove();
    }
  };

  hasChildren(popupFeatures);
  hasChildren(popupPhotos);

  return cardElement;
};

const generateAds = (amount) => {
  return new Array(amount).fill(``).map(generateAd);
};

const renderPin = (ad) => {
  const adElement = pinTemplate.cloneNode(true);
  const imgAd = adElement.querySelector(`img`);

  adElement.style = `left: ${ad.location.x - PIN_WIDTH}px; top: ${ad.location.y - PIN_HEIGHT}px;`;
  imgAd.src = ad.author.avatar;
  imgAd.alt = ad.offer.title;

  return adElement;
};

const renderPins = (arr) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPin(arr[i]));
  }
  return fragment;
};

const ads = generateAds(AMOUNT_ADS);

pins.appendChild(renderPins(ads));
mapFilters.before(renderCard(ads[0]));

map.classList.remove(`map--faded`);
