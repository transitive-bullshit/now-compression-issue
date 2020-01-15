'use strict'

// slightly modified version of https://github.com/sindresorhus/decompress-response

const {
  pipeline: streamPipeline,
  PassThrough: PassThroughStream
} = require('stream')

const zlib = require('zlib')

module.exports = function(req) {
  const contentEncoding = (req.headers['content-encoding'] || '').toLowerCase()

  if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
    return req
  }

  // TODO: Remove this when targeting Node.js 12.
  const isBrotli = contentEncoding === 'br'
  if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
    return req
  }

  const decompress = isBrotli
    ? zlib.createBrotliDecompress()
    : zlib.createUnzip()
  const stream = new PassThroughStream()

  decompress.on('error', (error) => {
    // Ignore empty response
    if (error.code === 'Z_BUF_ERROR') {
      stream.end()
      return
    }

    stream.emit('error', error)
  })

  return streamPipeline(req, decompress, stream, () => {})
}
