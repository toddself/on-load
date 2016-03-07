/* global MutationObserver */
var document = require('global/document')

module.exports = function createOnload () {
  var watch = []

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i]
      var x, y
      for (x = 0; x < mutation.addedNodes.length; x++) {
        for (y = 0; y < watch.length; y++) {
          if (watch[y][0] === mutation.addedNodes[x]) {
            watch[y][1]()
          }
        }
      }
      for (x = 0; x < mutation.removedNodes.length; x++) {
        for (y = 0; y < watch.length; y++) {
          if (watch[y][0] === mutation.removedNodes[x]) {
            watch[y][2]()
            watch.splice(y, 1)
          }
        }
      }
    }
  })
  observer.observe(document.body, {childList: true, subtree: true})
  return function onload (el, l, u) {
    l = l || function () {}
    u = u || function () {}
    watch.push([el, l, u])
  }
}
