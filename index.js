/**
 * pretty-please.js
 * 
 * Simple HTTP/HTTPS request library with ZERO DEPENDENCIES.
 * 
 */

const url = require('url');
const URL = url.URL;
const http = require('http');
const https = require('https');

const request = function(opts, callbackOrOpts, callback) {

  //console.trace('Starting request()', { opts });

  if (!opts || !opts.url || !opts.url.match && !opts.url.match('$(http\:|https\:)')) {
    return Promise.reject('Invalid URL');
  }

  const urlObj = url.parse(opts.url);
  const method = 
    ['GET','POST','DELETE','PUT','HEAD','OPTIONS']
      .includes(opts.method) ? opts.method : 'GET';
  
  const options = Object.assign(urlObj, opts, { method });

  //console.trace('Url parsed:', { urlObj });
  //console.trace('Options ready:', { options });

  const promise = new Promise((resolve, reject) => {

    let impl = undefined;
    switch(options.protocol) {
      case 'https:': impl = https; break;
      case 'http:': impl = http; break;
      default: return reject('Invalid URL');
    }

    //console.trace('Making request', { options });
    const req = impl.request(options, (res) => {
      //console.trace('Response ready', { res });
      let result = { 
        statusCode: res.statusCode,
        headers: res.headers,
        body: '' 
      };
    
      res.on('data', chunk => result.body += chunk);
      res.on('end', () => {
        try {
          result.data = JSON.parse(result.body);
        } catch (err) { }
        resolve(result)
      });
    })
    
    req.on("error", reject);
    
    if (opts.data) {
      if (typeof opts.data === 'object') req.write(JSON.stringify(opts.data));
      else req.write(data);
    }

    req.end();

  });

  if (typeof callbackOrOpts === 'function') {
    callback = callbackOrOpts;
  }

  if (typeof callback === 'function') {
    promise.then(result => callback(null, result)).catch(callback);
  } 
  
  return promise;
}


if (module) {
  module.exports = {
    request,
    get: (url, o, c) => request(Object.assign({ url, method: 'GET' }, o), o, c),
    post: (url, o, c) => request(Object.assign({ url, method: 'POST' }, o), o, c),
    put: (url, o, c) => request(Object.assign({ url, method: 'PUT' }, o), o, c),
    delete: (url, o, c) => request(Object.assign({ url, method: 'DELETE' }, o), o, c),
    head: (url, o, c) => request(Object.assign({ url, method: 'HEAD' }, o), o, c),
    options: (url, o, c) => request(Object.assign({ url, method: 'OPTIONS' }, o), o, c),
  };
}

