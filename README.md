# mitm-stream
creates a connected replacement for an original duplex stream and gives access to two transforms to intercept messages

# usage

`npm install mitm-stream`

```js
var original = getDuplexStreamSomehow()
original.write('hello')
original.on('data', function (data) { console.log(data) })

var mitm = require('mitm-stream')

var replacement = mitm(original, function (original2replacement, replacement2original) {
  original2replacement.write('hello replacement [BY MITM]') // data to replacement
  original2replacement.on('data', function (data) { // data from original
    console.log('[MITM]', data, '[from original]')
  })
  replacement2original.write('hello original [BY MITM]') // data to original
  replacement2original.on('data', function (data) { // data from replacement
    console.log('[MITM]', data, '[from replacement]')
  })
})

replacement.write('hello')
replacement.on('data', function (data) { console.log(data) })
```
