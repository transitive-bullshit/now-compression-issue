'use strict'

const got = require('got')

const util = require('util')
const zlib = require('zlib')

const compress =
  process.env.COMPRESSION === 'gzip'
    ? util.promisify(zlib.gzip.bind(zlib))
    : util.promisify(zlib.brotliCompress.bind(zlib))

module.exports = async function main() {
  // const bodyRaw = JSON.stringify(require('./out.json'))
  const bodyRaw = JSON.stringify({ name: 'a'.repeat(4500000) })
  const body = process.env.COMPRESSION
    ? await compress(Buffer.from(bodyRaw))
    : bodyRaw

  console.log({ body: body.length, bodyRaw: bodyRaw.length })

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }

  if (process.env.COMPRESSION) {
    headers['content-encoding'] = process.env.COMPRESSION
  }

  // hello-world
  const res = await got.post(`${process.env.NOW_URL}`, {
    body,
    headers
  })

  return res
}

module
  .exports()
  .then((output) => {
    // console.log(output)
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
