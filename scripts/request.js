// TODO: 迁移请求函数到这里

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function absoluteFetch(originalFetch, prefixs) {
  return function realFetch(path, options, usePrefix = "") {
    const url = composeURL(path, usePrefix, prefixs);

    return originalFetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => ({ data }))
      .catch((err) => ({ err }));
  };
}

function composeURL(urlOfInput, prefixKey, prefixs) {
  // 未配置, 使用用户输入的path作为完整路径
  if (!prefixs) {
    return urlOfInput;
  }

  // 多实例情况 --> prefixs[prefixKey] + urlOfInput;
  if (Object.prototype.toString.call(prefixs) === "[object Object]") {
    if (prefixs.hasOwnProperty(prefixKey)) {
      return prefixs[prefixKey] + urlOfInput;
    }
    throw new Error(
      "When using multiple instances, the KEY must be passed in..."
    );
  }

  // 单实例：prefixs + urlOfInput;
  if (Object.prototype.toString.call(prefixs) === "[object String]") {
    return prefixs + urlOfInput;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const request = absoluteFetch(fetch, "https://www.mxnzp.com");


function objectToQueryString(options) {
  return (
    Object.keys(options)
      .map((key) => `${key}=${options[key]}`)
      .join("&")
  );
}

function queryStringToObject(url) {
  return url
    .match(/([^?=&]+)(=([^&]*))/g)
    .reduce(
      (initial, curr) => (
        (initial[curr.slice(0, curr.indexOf("="))] = curr.slice(
          curr.indexOf("=") + 1
        )),
        initial
      ),
      {}
    );
}
