const { logOnce } = require("./log.js")
const { openRoom } = require("./ipfs.js")
const { waitFor } = require("./utils.js")
let RUNNING = true


async function main() {
  while (RUNNING) {
    await logOnce()
    await waitFor(15000)
  }
}


openRoom().then(() => main())
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
