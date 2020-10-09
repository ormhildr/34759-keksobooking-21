'use strict';

(() => {
  const URL = {
    load: `https://21.javascript.pages.academy/keksobooking/data`
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
    createXhr(`GET`, URL.load, onLoad, onError).send();
  };

  window.backend = {
    load
  };
})();
