'use strict';

(() => {
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
    const LOCATION_X = getRandom(window.pin.MAIN_PIN_SIZE, MAIN_PIN_LIMITS.X[1]);
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

  window.data = {
    ALL_FEATURES,
    generateAds: (amount) => {
      return new Array(amount).fill(``).map(generateAd);
    }
  };
})();
