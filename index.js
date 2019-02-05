const { logOnce } = require("./log.js")
const { waitFor } = require("./utils.js")
const { getIpfs, stopIpfs } = require('./ipfs.js')
let RUNNING = true


async function main() {
  await getIpfs()
  while (RUNNING) {
    await logOnce()
    await waitFor(60000)
  }
  return stopIpfs()
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })


process.on('SIGTERM', () => {
  RUNNING = false
  console.log('TERMINATING!')
})

process.on('SIGINT', () => {
  RUNNING = false
  console.log('TERMINATING!')
})
