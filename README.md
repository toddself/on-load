# on-load

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

On load/unload events for DOM elements using a MutationObserver

## usage

```js
var onload = require('on-load')

var div = document.createElement('div')
onload(div, function () {
  console.log('in the dom')
}, function () {
  console.log('out of the dom')
})

// Will fire the onload
document.body.appendChild(div)

// ... some time later

// Will fire the onunload
document.body.removeChild(div)
```

# license
(c) 2016 Kyle Robinson Young. MIT License

[npm-image]: https://img.shields.io/npm/v/bel.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bel
[travis-image]: https://img.shields.io/travis/shama/bel/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/shama/bel
[downloads-image]: http://img.shields.io/npm/dm/vel.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/bel
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
