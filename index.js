/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var watch = Object.create(null)
var KEY_ID = 'onloadid'

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      eachMutation(mutations[i].removedNodes, function (target) {
        target[1]()
      })
      eachMutation(mutations[i].addedNodes, function (target) {
        // TODO: Should queue functions to run, then run them all on setImmediate?
        target[0]()
      })
    }
  })
  observer.observe(document.body, {childList: true, subtree: true})
}

module.exports = function onload (el, on, off) {
  on = on || function () {}
  off = off || function () {}
  var id
  if (el.dataset && el.dataset[KEY_ID]) {
    id = el.dataset[KEY_ID]
  } else {
    // TODO: Is there a better way to uniquely identify an element?
    var caller = onload.caller.toString()
    if (caller) {
      id = hash(caller)
    } else {
      var err = new Error()
      var lines = err.stack.split('\n')
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('onload') !== -1) {
          id = lines[i + 1]
          break
        }
      }
      id = hash(id.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
    }
    el.dataset[KEY_ID] = id
  }
  // TODO: Should we allow multiple set per element?
  watch[id] = [on, off]
}

function eachMutation (nodes, fn) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].dataset && nodes[i].dataset[KEY_ID] && watch[nodes[i].dataset[KEY_ID]]) {
      fn(watch[nodes[i].dataset[KEY_ID]])
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

function hash (str) {
  var res = 5381
  var i = str.length
  while (i) {
    res = (res * 33) ^ str.charCodeAt(--i)
  }
  return res >>> 0
}
