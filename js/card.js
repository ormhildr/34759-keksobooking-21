'use strict';

const OfferType = {
  FLAT: `Квартира`,
  BUNGALOW: `Бунгало`,
  HOUSE: `Дом`,
  PALACE: `Дворец`,
  getById: (id) => {
    return OfferType[id.toUpperCase()];
  }
};

const AllFeatures = {
  WIFI: `wifi`,
  DISHWASHER: `dishwasher`,
  PARKING: `parking`,
  WASHER: `washer`,
  ELEVATOR: `elevator`,
  CONDITIONER: `conditioner`
};

const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

const removeChildren = (element) => {
  if (element.children.length === 0) {
    element.remove();
  }
};

window.renderCard = (ad) => {
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

  popupTitle.textContent = ad.offer.title;
  popupAddress.textContent = ad.offer.address;
  popupPrice.textContent = `${ad.offer.price}₽/ночь`;
  popupType.textContent = OfferType.getById(ad.offer.type);
  popupCapacity.textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  popupTime.textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  for (let el in AllFeatures) {
    if (!ad.offer.features.includes(AllFeatures[el])) {
      popupFeatures.removeChild(popupFeatures.querySelector(`.popup__feature--${AllFeatures[el]}`));
    }
  }

  popupDescr.textContent = ad.offer.description;

  popupPhotos.querySelectorAll(`.popup__photo`).forEach((el) => {
    popupPhotos.removeChild(el);
  });

  ad.offer.photos.forEach((el) => {
    const imgPhoto = popupPhoto.cloneNode(true);
    popupPhotos.appendChild(imgPhoto);
    imgPhoto.src = el;
  });

  popupAvatar.src = ad.author.avatar;

  removeChildren(popupFeatures);
  removeChildren(popupPhotos);

  return cardElement;
};
