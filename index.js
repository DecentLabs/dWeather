const { logOnce } = require("./log.js")
const { waitFor } = require("./utils.js")
const { openRoom } = require("./ipfs.js")

let RUNNING = true

async function main() {
  console.log(await openRoom())
  while (RUNNING) {
    await logOnce()
    await waitFor(5000)
  }
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
