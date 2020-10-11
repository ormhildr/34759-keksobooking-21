'use strict';

(() => {
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

  const ALL_FEATURES = [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`
  ];

  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  const cardElement = cardTemplate.cloneNode(true);
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  const popupPhotos = cardElement.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

  const popupTitle = cardElement.querySelector(`.popup__title`);
  const popupAddress = cardElement.querySelector(`.popup__text--address`);
  const popupPrice = cardElement.querySelector(`.popup__text--price`);
  const popupType = cardElement.querySelector(`.popup__type`);
  const popupCapacity = cardElement.querySelector(`.popup__text--capacity`);
  const popupTime = cardElement.querySelector(`.popup__text--time`);
  const popupDescr = cardElement.querySelector(`.popup__description`);
  const popupAvatar = cardElement.querySelector(`.popup__avatar`);

  const hasChildren = (element) => {
    if (element.children.length === 0) {
      element.remove();
    }
  };

  window.card = {
    cardTemplate,
    renderCard: (ad) => {
      popupTitle.textContent = ad.offer.title;
      popupAddress.textContent = ad.offer.address;
      popupPrice.textContent = `${ad.offer.price}₽/ночь`;
      popupType.textContent = OfferType.getById(ad.offer.type).name;
      popupCapacity.textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
      popupTime.textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

      for (const element of ALL_FEATURES) {
        if (!ad.offer.features.includes(element)) {
          popupFeatures.removeChild(popupFeatures.querySelector(`.popup__feature--${element}`));
        }
      }

      popupDescr.textContent = ad.offer.description;

      popupPhotos.querySelectorAll(`.popup__photo`).forEach((el) => {
        popupPhotos.removeChild(el);
      });

      for (const photo of ad.offer.photos) {
        const imgPhoto = popupPhoto.cloneNode(true);
        popupPhotos.appendChild(imgPhoto);
        imgPhoto.src = photo;
      }

      popupAvatar.src = ad.author.avatar;

      hasChildren(popupFeatures);
      hasChildren(popupPhotos);

      return cardElement;
    }
  };
})();
