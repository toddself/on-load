var onload = require('./')()
var test = require('tape')

test('onload/onunload', function (t) {
  t.plan(2)
  var el = document.createElement('div')
  el.textContent = 'test'
  onload(el, function () {
    t.ok(true, 'onload called')
  }, function () {
    t.ok(true, 'onunload called')
    document.body.innerHTML = ''
    t.end()
  })
  document.body.appendChild(el)
  document.body.removeChild(el)
})

test('nested', function (t) {
  t.plan(2)
  var e1 = document.createElement('div')
  var e2 = document.createElement('div')
  e1.appendChild(e2)
  document.body.appendChild(e1)

  var e3 = document.createElement('div')
  onload(e3, function () {
    t.ok(true, 'onload called')
  }, function () {
    t.ok(true, 'onunload called')
    document.body.innerHTML = ''
    t.end()
  })
  e2.appendChild(e3)
  e2.removeChild(e3)
})
