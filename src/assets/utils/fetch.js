const fetch = require('node-fetch')
const fetchWithTimeout = function (url, options, timeout = 15000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(), timeout)
    )
  ]);
};

export { fetchWithTimeout };