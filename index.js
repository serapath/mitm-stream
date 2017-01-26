var passthrough = require('readable-stream/passthrough')
var duplexify = require('duplexify')

var opts = { objectMode: true }

module.exports = mitm

function mitm (dup, cb) {
  if (typeof cb !== 'function') return dup
  var dupNew  = duplexify(null, null, opts)
  var a2b = passthrough(opts)
  var c2a = passthrough(opts)
  var b2c = passthrough(opts)
  dupNew.setWritable(c2a)
  dupNew.setReadable(b2c)
  dup.pipe(a2b).pipe(b2c)
  c2a.pipe(dup)
  cb(a2b, c2a)
  return dupNew
}
