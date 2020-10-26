'use strict';

const SERVER_URL = {
  load: `https://21.javascript.pages.academy/keksobooking/data`,
  save: `https://21.javascript.pages.academy/keksobooking`
};

const StatusCode = {
  OK: 200
};
const TIMEOUT_IN_MS = 10000;

const createXhr = (request, url, onLoad, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
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
  createXhr(`GET`, SERVER_URL.load, onLoad, onError).send();
};

const save = (data, onLoad, onError) => {
  createXhr(`POST`, SERVER_URL.save, onLoad, onError).send(data);
};

window.backend = {
  load,
  save
};
