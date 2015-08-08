# LazyPromise [![Build Status](https://travis-ci.org/Comandeer/LazyPromise.svg?branch=master)](https://travis-ci.org/Comandeer/LazyPromise) [![Code Climate](https://codeclimate.com/github/Comandeer/LazyPromise/badges/gpa.svg)](https://codeclimate.com/github/Comandeer/LazyPromise)


## What is it?

It's a subclass of native ES6 Promise object, which evaluates only when `then` is called. It's written primarily for node.js, but should also run in browser.

## Usage

```javascript
const LazyPromise = require('lazy-promise');

let promise = new LazyPromise(function(resolve, reject)
{
	resolve('ok');
});

promise.then(function(answer)
{
	console.log('Everything is ' + answer);
});
```
