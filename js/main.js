'use strict';

const MAIN_PIN_SIZE = 65;
const PIN_TAIL_SIZE = 20;
const MAIN_PIN_LIMITS = {
  X: [0, document.querySelector(`.map`).offsetWidth],
  Y: [130, 630]
};

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

const GUESTS_VALIDATION_MSG = {
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

let isPageEnabled = true;

const getGuestsLimits = (rooms) => {
  return rooms <= 3 ? [1, rooms] : [0];
};

const validateGuests = () => {
  let validationMsg = ``;

  const rooms = roomsAmount.value;
  const guests = guestsAmount.value;

  const limits = getGuestsLimits(rooms);
  if (!limits.includes(guests)) {
    validationMsg = GUESTS_VALIDATION_MSG[rooms];
  }

  guestsAmount.setCustomValidity(validationMsg);
};


const setFormEnabled = (form, enabled) => {
  for (let element of form.children) {
    element.disabled = !enabled;
  }
};

const disablePage = () => {
  adForm.classList.add(`ad-form--disabled`);
  map.classList.add(`map--faded`);

  setFormEnabled(adForm, false);
  setFormEnabled(mapForm, false);

  adAddress.value = getAddressCoordinates();

  isPageEnabled = false;
};

const enablePage = () => {
  const ads = generateAds(8);

  if (isPageEnabled === false) {
    adForm.classList.remove(`ad-form--disabled`);
    map.classList.remove(`map--faded`);

    setFormEnabled(adForm, true);
    setFormEnabled(mapForm, true);

    validateGuests();

    pins.appendChild(renderPins(ads));
    mapFilters.before(renderCard(ads[0]));
  }
};

const getAddressCoordinates = () => {
  let addressCoordinates;

  if (isPageEnabled) {
    addressCoordinates = `${Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_SIZE / 2)}, ${Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_SIZE + PIN_TAIL_SIZE)}`;
  } else {
    addressCoordinates = `${Math.floor(parseInt(mainPin.style.left, 10) + MAIN_PIN_SIZE / 2)}, ${Math.floor(parseInt(mainPin.style.top, 10) + MAIN_PIN_SIZE / 2)}`;
  }

  return addressCoordinates;
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
  const LOCATION_X = getRandom(MAIN_PIN_SIZE, MAIN_PIN_LIMITS.X[1]);
  const LOCATION_Y = getRandom(MAIN_PIN_LIMITS.Y[0], MAIN_PIN_LIMITS.Y[1]);

  return {
    author: {
      avatar: `img/avatars/user0${getRandom(1, 8)}.png`
    },
    offer: {
      title: getRandomFrom(TITLES),
      address: `${LOCATION_X}, ${LOCATION_Y}`,
      price: getRandom(30000, 100000),
      type: getRandomFrom(TYPES),
      rooms: getRandom(1, 4),
      guests: getRandom(1, 10),
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

  adElement.style = `left: ${ad.location.x - MAIN_PIN_SIZE}px; top: ${ad.location.y - MAIN_PIN_SIZE}px;`;
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

disablePage();

mainPin.addEventListener(`mousedown`, (evt) => {
  if (evt.which === 1) {
    enablePage();
    adAddress.value = getAddressCoordinates();
  }
});

mainPin.addEventListener(`click`, () => {
  enablePage();
  adAddress.value = getAddressCoordinates();
});

roomsAmount.addEventListener(`change`, validateGuests);
guestsAmount.addEventListener(`change`, validateGuests);
