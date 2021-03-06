'use strict';

const ServerURL = {
  LOAD: `https://21.javascript.pages.academy/keksobooking/data`,
  SAVE: `https://21.javascript.pages.academy/keksobooking`
};

const SUCCESS_STATUS = 200;
const TIMEOUT_IN_MS = 10000;

const createXhr = (request, url, onLoad, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === SUCCESS_STATUS) {
      onLoad(xhr.response);
    } else {
      onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
    }
  });
  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });
  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.timeout = TIMEOUT_IN_MS;

  xhr.open(request, url);

  return xhr;
};

const load = (onLoad, onError) => {
  createXhr(`GET`, ServerURL.LOAD, onLoad, onError).send();
};

const save = (data, onLoad, onError) => {
  createXhr(`POST`, ServerURL.SAVE, onLoad, onError).send(data);
};

window.backend = {
  load,
  save
};
