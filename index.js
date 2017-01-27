var passthrough = require('readable-stream/passthrough')
var transform = require('readable-stream/transform')
var duplexify = require('duplexify')

var opts = { objectMode: true }

module.exports = mitm

/*
            ----MITM-----
           A      |      V
  dup -> [a2b -> aTc -> b2c] -> dupNew -> [c2b -> cTa -> b2a] -> dup
                                            V      |      A
                                             ----MITM-----

  USAGE:

  function cb (a2c, c2a) {
    a2c.transform = function (chunk, encoding, next) {
      next(null, chunk.toUpperCase())
    }
    a2c.on('data', function (data) { console.log(data) })
    a2c.write('pingpong [BY MITM]')
    c2a.transform = function (chunk, encoding, next) {
      next(null, chunk.toUpperCase())
    }
    c2a.on('data', function (data) { console.log(data) })
    c2a.write('pongping [BY MITM]')
  }
*/

function mitm (dup, cb) {
  if (typeof cb !== 'function') return dup

  var aTb = transform(opts)
  var b2c = passthrough(opts)
  dup.pipe(aTb).pipe(b2c)

  var c2b = passthrough(opts)
  var bTa = passthrough(opts)
  c2b.pipe(bTa).pipe(dup)

  cb(aTb, bTa)

  return duplexify(c2b, b2c, opts)
}
