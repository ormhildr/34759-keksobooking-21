'use strict';

const MAP_WIDTH = 1200;
const MIN_Y = 130;
const MAX_Y = 630;
const PIN_WIDTH = 65;
const PIN_HEIGHT = 65;
const POINT_HEIGHT = 20;
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

const RoomsAmount = {
  ONE: `1`,
  TWO: `2`,
  THREE: `3`,
  HUNDRED: `100`
};

const GuestsAmount = {
  ZERO: `0`,
  ONE: `1`,
  TWO: `2`,
  THREE: `3`
};

const roomsForGuests = {
  1: `«для 1 гостя»`,
  2: `«для 2 гостей» или «для 1 гостя»`,
  3: `«для 3 гостей, «для 2 гостей» или «для 1 гостя»`,
  100: `«не для гостей»`
};

const map = document.querySelector(`.map`);
const pins = map.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const mapFilters = map.querySelector(`.map__filters-container`);
const mainPin = document.querySelector(`.map__pin--main`);


const adForm = document.querySelector(`.ad-form`);
const adAddress = adForm.querySelector(`input[name=address]`);
const mapForm = document.querySelector(`.map__filters`);
const roomsAmount = document.querySelector(`#room_number`);
const guestsAmount = document.querySelector(`#capacity`);

let isDisable = false;

const getChangeGuests = () => {
  guestsAmount.setCustomValidity(``);

  switch (roomsAmount.value) {
    case RoomsAmount.ONE:
      if (guestsAmount.value !== GuestsAmount.ONE) {
        guestsAmount.setCustomValidity(roomsForGuests[roomsAmount.value]);
      }
      break;
    case RoomsAmount.TWO:
      if (guestsAmount.value !== GuestsAmount.ONE && guestsAmount.value !== GuestsAmount.TWO) {
        guestsAmount.setCustomValidity(roomsForGuests[roomsAmount.value]);
      }
      break;
    case RoomsAmount.THREE:
      if (guestsAmount.value === GuestsAmount.ZERO) {
        guestsAmount.setCustomValidity(roomsForGuests[roomsAmount.value]);
      }
      break;
    case RoomsAmount.HUNDRED:
      if (guestsAmount.value !== GuestsAmount.ZERO) {
        guestsAmount.setCustomValidity(roomsForGuests[roomsAmount.value]);
      }
      break;
  }
};


const getStatusForm = (form, status) => {
  for (let element of form.children) {
    element.disabled = status;
  }
};

const getDisable = () => {
  adForm.classList.add(`ad-form--disabled`);
  map.classList.add(`map--faded`);

  getStatusForm(adForm, true);
  getStatusForm(mapForm, true);

  adAddress.value = getAddressDisable();

  isDisable = true;
};

const getActive = () => {
  const ads = generateAds(AMOUNT_ADS);

  if (isDisable === true) {
    adForm.classList.remove(`ad-form--disabled`);
    map.classList.remove(`map--faded`);

    getStatusForm(adForm, false);
    getStatusForm(mapForm, false);

    getChangeGuests();

    pins.appendChild(renderPins(ads));
    mapFilters.before(renderCard(ads[0]));
  }
};

const getAddressDisable = () => {
  return `${Math.floor(parseInt(mainPin.style.left, 10) + PIN_WIDTH / 2)}, ${Math.floor(parseInt(mainPin.style.top, 10) + PIN_HEIGHT / 2)}`;
};

const getAddressActive = (pin) => {
  return `${Math.floor(parseInt(pin.style.left, 10) + PIN_WIDTH / 2)}, ${Math.floor(parseInt(pin.style.top, 10) + PIN_HEIGHT + POINT_HEIGHT)}`;
};

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

getDisable();

mainPin.addEventListener(`mousedown`, (evt) => {
  if (evt.which === 1) {
    getActive();
    adAddress.value = getAddressActive(mainPin);
  }
});

mainPin.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter`) {
    getActive();
    adAddress.value = getAddressActive(mainPin);
  }
});

roomsAmount.addEventListener(`change`, getChangeGuests);
guestsAmount.addEventListener(`change`, getChangeGuests);
