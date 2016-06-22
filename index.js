/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var staged = []
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
  if (el.dataset && el.dataset[KEY_ID]) {
    // Already has an id, override that one
    // TODO: Allow multiple events per element?
    watch[el.dataset[KEY_ID]] = [on, off]
  } else {
    // Move the expensive identification to later
    staged.push([el, new Error(), onload.caller.toString(), on, off])
  }
}

function eachMutation (nodes, fn) {
  for (var i = 0; i < nodes.length; i++) {
    for (var j = 0; j < staged.length; j++) {
      if (staged[j][0] === nodes[i]) {
        var id = identify(nodes[i], staged[j][1], staged[j][2])
        watch[id] = [staged[j][3], staged[j][4]]
        staged.splice(j, 1)
      }
    }
    if (nodes[i].dataset && nodes[i].dataset[KEY_ID] && watch[nodes[i].dataset[KEY_ID]]) {
      fn(watch[nodes[i].dataset[KEY_ID]])
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

// TODO: Is there a better way to uniquely identify an element?
function identify (el, err, caller) {
  var id = ''
  var lines = err.stack.split('\n')
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('onload') !== -1) {
      id = lines[i + 1] + caller
      break
    }
  }
  id = hash(id.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
  el.dataset[KEY_ID] = id
  return id
}

function hash (str) {
  var res = 5381
  var i = str.length
  while (i) {
    res = (res * 33) ^ str.charCodeAt(--i)
  }
  return res >>> 0
}
