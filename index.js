var document = require('global/document')

module.exports = function createOnload () {
  var watch = []

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i]
      for (var x = 0; x < mutation.addedNodes.length; x++) {
        for (var y = 0; y < watch.length; y++) {
          if (watch[y][0] === mutation.addedNodes[x]) {
            watch[y][1]()
          }
        }
      }
      for (var x = 0; x < mutation.removedNodes.length; x++) {
        for (var y = 0; y < watch.length; y++) {
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
