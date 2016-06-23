/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var watch = []
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      eachMutation(mutations[i].removedNodes, function (index) {
        if (watch[index][2]) {
          watch[index][2]()
          // TODO: Do we need clean up here?
        }
      })
      eachMutation(mutations[i].addedNodes, function (index) {
        if (watch[index][1]) {
          watch[index][1]()
        }
      })
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

module.exports = function onload (el, on, off) {
  on = on || function () {}
  off = off || function () {}
  el.dataset[KEY_ID] = INDEX
  watch.push([INDEX.toString(), on, off])
  INDEX += 1
}

function eachMutation (nodes, fn) {
  if (watch.length < 1) return
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].dataset && nodes[i].dataset[KEY_ID]) {
      for (var j = 0; j < watch.length; j++) {
        if (watch[j][0] === nodes[i].dataset[KEY_ID]) {
          fn(j)
        }
      }
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}
