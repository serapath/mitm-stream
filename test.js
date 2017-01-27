var through2 = require('through2')
var duplexify = require('duplexify')
var opts = { objectMode: true }
var in$  = through2(opts, function (chunk, encoding, next) { this.push(chunk); next() })
var out$ = through2(opts, function (chunk, encoding, next) { this.push(chunk); next() })
var remoteOriginal = duplexify(in$, out$, opts)

remoteOriginal.write('ping')
remoteOriginal.on('data', function (data) { console.log('O',data) })

//----------------------------------------------------------
// GIVEN:

var original = duplexify(out$, in$, opts)

var mitm = require('./')
var replacement = mitm(original, function (original2replacement, replacement2original) {
  original2replacement._transform = function (chunk, encoding, next) {
    next(null, chunk.toUpperCase())
  }
  original2replacement.on('data', function (data) { // data from original
    console.log(`[MITM] ${data} [from original]`)
  })
  original2replacement.write('pingpong [BY MITM]')  // data to replacement
  replacement2original._transform = function (chunk, encoding, next) {
    next(null, chunk.toUpperCase())
  }
  replacement2original.on('data', function (data) { // data from replacement
    console.log(`[MITM] ${data} [from replacement]`)
  })
  replacement2original.write('pongping [BY MITM]')  // data to original
})

replacement.write('pong')
replacement.on('data', function (data) { console.log('R',data) })
