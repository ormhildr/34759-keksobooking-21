'use strict';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;

const PhotoSizes = {
  WIDTH: 70,
  HEIGHT: 70
};

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const guestsValidationMessage = {
  1: `«для 1 гостя»`,
  2: `«для 2 гостей» или «для 1 гостя»`,
  3: `«для 3 гостей, «для 2 гостей» или «для 1 гостя»`,
  100: `«не для гостей»`
};

const MinPriceValidation = {
  BUNGALOW: `0`,
  FLAT: `1000`,
  HOUSE: `5000`,
  PALACE: `10000`
};

const adForm = document.querySelector(`.ad-form`);

const titleAd = adForm.querySelector(`#title`);
const roomsAmount = adForm.querySelector(`#room_number`);
const guestsAmount = adForm.querySelector(`#capacity`);
const typeHouse = adForm.querySelector(`#type`);
const price = adForm.querySelector(`#price`);
const timeIn = adForm.querySelector(`#timein`);
const timeOut = adForm.querySelector(`#timeout`);

const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
const errorElement = errorTemplate.cloneNode(true);
const errorBtn = errorElement.querySelector(`.error__button`);

const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
const successElement = successTemplate.cloneNode(true);

const btnReset = adForm.querySelector(`.ad-form__reset`);

const avatarChooser = document.querySelector(`.ad-form__field input[type=file]`);
const avatarPreview = document.querySelector(`.ad-form-header__preview`);

const photoChooser = document.querySelector(`.ad-form__upload input[type=file]`);
const photoPreview = document.querySelector(`.ad-form__photo`);

const loadPhoto = (currentFile, currentPhoto) => {
  const file = currentFile.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((element) => {
    return fileName.endsWith(element);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (!currentPhoto.firstChild) {
        const newImg = document.createElement(`img`);
        newImg.src = reader.result;
        newImg.width = PhotoSizes.WIDTH;
        newImg.height = PhotoSizes.HEIGHT;
        currentPhoto.append(newImg);
      } else {
        const photo = currentPhoto.firstElementChild;
        if (photo.tagName === `IMG`) {
          photo.src = reader.result;
        }
      }
    });

    reader.readAsDataURL(file);
  }
};

const onEscPressError = (evt) => {
  window.util.escPress(evt, closeErrorWindow);
};

const onEscPressSuccess = (evt) => {
  window.util.escPress(evt, closeSuccessWindow);
};

const closeErrorWindow = () => {
  errorElement.remove();

  document.removeEventListener(`keydown`, onEscPressError);
};

const closeSuccessWindow = () => {
  successElement.remove();

  document.removeEventListener(`keydown`, onEscPressSuccess);
};

const getErrorWindow = () => {
  document.body.insertAdjacentElement(`afterbegin`, errorElement);

  errorBtn.addEventListener(`click`, () => {
    closeErrorWindow();
  });

  document.addEventListener(`keydown`, onEscPressError);

  errorElement.addEventListener(`click`, () => {
    closeErrorWindow();
  });
};

const getSuccessWindow = () => {
  document.body.insertAdjacentElement(`afterbegin`, successElement);

  document.addEventListener(`keydown`, onEscPressSuccess);

  successElement.addEventListener(`click`, () => {
    closeSuccessWindow();
  });
};

const resetForm = () => {
  window.util.removeAdPins();

  if (window.map.map.contains(window.map.map.querySelector(`.map__card`))) {
    window.map.map.querySelector(`.map__card`).remove();
  }
  adForm.reset();
  window.map.disablePage();
};

const getGuestsLimits = (rooms) => {
  return rooms <= 3 ? [1, rooms] : [0];
};

const onValidateGuests = () => {
  let validationMsg = ``;

  const rooms = Number(roomsAmount.value);
  const guests = Number(guestsAmount.value);

  const limits = getGuestsLimits(rooms);
  if (!limits.includes(guests)) {
    validationMsg = guestsValidationMessage[rooms];
  }

  guestsAmount.setCustomValidity(validationMsg);
};

const onValidatePrice = () => {
  price.min = MinPriceValidation[typeHouse.value.toUpperCase()];
  price.placeholder = MinPriceValidation[typeHouse.value.toUpperCase()];
};

const onValidateCheckOut = () => {
  timeOut.value = timeIn.value;
};

const onValidateCheckIn = () => {
  timeIn.value = timeOut.value;
};

const onValidateText = () => {
  const titleLength = titleAd.value.length;

  if (titleLength < MIN_TITLE_LENGTH) {
    titleAd.setCustomValidity(`Еще ${MIN_TITLE_LENGTH - titleLength} симв.`);
  } else if (titleLength > MAX_TITLE_LENGTH) {
    titleAd.setCustomValidity(`Удалите лишние ${titleLength - MAX_TITLE_LENGTH} симв.`);
  } else {
    titleAd.setCustomValidity(``);
  }
};

titleAd.addEventListener(`input`, onValidateText);
roomsAmount.addEventListener(`change`, onValidateGuests);
guestsAmount.addEventListener(`change`, onValidateGuests);
typeHouse.addEventListener(`change`, onValidatePrice);
timeIn.addEventListener(`change`, onValidateCheckOut);
timeOut.addEventListener(`change`, onValidateCheckIn);

adForm.addEventListener(`submit`, (evt) => {
  window.backend.save(new FormData(adForm), () => {
    getSuccessWindow();
    resetForm();
  }, getErrorWindow);
  evt.preventDefault();
});

btnReset.addEventListener(`click`, () => {
  resetForm();
});

avatarChooser.addEventListener(`change`, () => {
  loadPhoto(avatarChooser, avatarPreview);
});

photoChooser.addEventListener(`change`, () => {
  loadPhoto(photoChooser, photoPreview);
});

window.form = {
  adForm,
  onValidateGuests,
  onValidatePrice
};
