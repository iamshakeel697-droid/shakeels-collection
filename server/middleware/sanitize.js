const xss = require('xss');

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
};

const deepSanitize = (value) => {
  if (typeof value === 'string') {
    return xss(value.trim(), xssOptions);
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepSanitize(item));
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = deepSanitize(value[key]);
    }
    return result;
  }
  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitize(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = deepSanitize(req.params);
  }
  next();
};

module.exports = { sanitizeInput };
