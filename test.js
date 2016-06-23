var onload = require('./')
var test = require('tape')
var yo = require('yo-yo')

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

test('complex', function (t) {
  t.plan(4)
  var state = []

  function button () {
    var el = yo`<button>click</button>`
    onload(el, function () {
      state.push('on')
    }, function () {
      state.push('off')
    })
    return el
  }

  var root = yo`<div>
    ${button()}
  </div>`
  document.body.appendChild(root)

  runops([
    function () {
      t.deepEqual(state, ['on'], 'turn on')
      state = []
      root = yo.update(root, yo`<p>${button()}</p>`)
    },
    function () {
      t.deepEqual(state, ['off', 'on'], 'turn off/on')
      state = []
      root = yo.update(root, yo`<p>removed</p>`)
    },
    function () {
      t.deepEqual(state, ['off'], 'turn off')
      state = []
      var btn = button()
      root = yo.update(root, yo`<p><div>${btn}</div></p>`)
      root = yo.update(root, yo`<p>
        <div>Updated</div>
        <div>${btn}</div>
      </p>`)
    },
    function () {
      t.deepEqual(state, ['off', 'on'], 'turn off/on')
    }
  ], function () {
    //document.body.innerHTML = ''
    t.end()
  })
})

test('complex nested', function (t) {
  var state = []
  function button () {
    var el = yo`<button>click</button>`
    onload(el, function () {
      state.push('on')
    }, function () {
      state.push('off')
    })
    return el
  }
  function app (page) {
    return yo`<div class="app">
      <h1>Hello</h1>
      ${page}
    </div>`
  }

  var root = app(yo`<div>Loading...</div>`)
  document.body.appendChild(root)

  runops([
    function () {
      t.deepEqual(state, [], 'did nothing')
      state = []
      root = yo.update(root, app(yo`<div class="page">
        ${button()}
      </div>`))
    },
    function () {
      t.deepEqual(state, ['on'], 'turn on')

      state = []
      root = yo.update(root, app(yo`<div class="page">
        <h3>Another Page</h3>
      </div>`))
    },
    function () {
      t.deepEqual(state, ['off'], 'turn off')
      state = []
      root = yo.update(root, app(yo`<div class="page">
        ${button()}
        ${button()}
      </div>`))
    },
    function () {
      t.deepEqual(state, ['on', 'on'], 'turn 2 on')
      state = []
      root = yo.update(root, app(yo`<div class="page">
        ${button()}
        ${button()}
      </div>`))
    },
    function () {
      t.deepEqual(state, [], 'do nothing')
      state = []
      root = yo.update(root, app(yo`<div class="page">
        ${button()}
        <p>removed</p>
      </div>`))
    },
    function () {
      t.deepEqual(state, ['off'], 'turn 1 off')
    }
  ], function () {
    //document.body.innerHTML = ''
    t.end()
  })
})

function runops (ops, done) {
  function loop () {
    var next = ops.shift()
    if (next) {
      next()
      setTimeout(loop, 10)
    } else {
      done()
    }
  }
  setTimeout(loop, 10)
}
