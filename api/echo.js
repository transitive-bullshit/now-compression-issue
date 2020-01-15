'use strict'

const inflate = require('../lib/inflate')
const raw = require('raw-body')

// uncompressed body limit size
// (must be lower than lambda RAM size which defaults to 1024mb)
const BODY_SIZE_LIMIT = '100mb'

module.exports = async (req, res) => {
  console.log('start of echo handler')
  console.log(req.headers)

  const opts = {
    limit: BODY_SIZE_LIMIT
  }

  const len = req.headers['content-length']
  const encoding = req.headers['content-encoding'] || 'identity'
  if (len && encoding === 'identity') {
    opts.length = +len
  }

  const rawBody = await raw(inflate(req), opts)
  const body = JSON.parse(rawBody.toString('utf8'))
  console.log(body)

  res.json(body)
}
