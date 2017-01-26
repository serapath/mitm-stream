# mitm-stream
creates a connected replacement for an original duplex stream and gives access to two transforms to intercept messages

# usage

`npm install mitm-stream`

```js
var through2 = require('through2')
var duplexify = require('duplexify')
var opts = { objectMode: true }
var pt1 = through2(opts, function (chunk, encoding, next) { this.push(chunk); next() })
var pt2 = through2(opts, function (chunk, encoding, next) { this.push(chunk); next() })
var remoteOriginal = duplexify(pt2, pt1, opts)
remoteOriginal.write('ping')
remoteOriginal.on('data', function (data) { console.log(data) })
//----------------------------------------------------------
// GIVEN:

var original = duplexify(pt1, pt2, opts)

var mitm = require('mitm-stream')
var replacement = mitm(original, function (original2replacement, replacement2original) {
  original2replacement.write('pingpong [BY MITM]') // data to replacement
  original2replacement.on('data', function (data) { // data from original
    console.log(`[MITM] ${data} [from original]`)
  })
  replacement2original.write('pongping [BY MITM]') // data to original
  replacement2original.on('data', function (data) { // data from replacement
    console.log(`[MITM] ${data} [from replacement]`)
  })
})


replacement.write('pong')
replacement.on('data', function (data) { console.log(data) })
```
