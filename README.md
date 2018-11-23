# pretty-please

Simple HTTP/HTTPS request library with ZERO DEPENDENCIES.

``` 
const please = require('pretty-please');

// As a Promise 

please.get('https://domain.com/blah', { timeout: 5000 })
  .then(result => console.log(result.statusCode))
  .catch(err => console.error(err));
 
please.post('http://domain.com/blah, { data: 'hello=world' })
  .then()

// As a callback

please.delete('http://domain.com/resource/123', function (result) { console.log(result); })
```
