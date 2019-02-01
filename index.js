const { logOnce } = require("./log.js")
const { waitFor } = require("./utils.js")
const { openRoom } = require("./ipfs.js")

let RUNNING = true


function main() {
  return new Promise(async resolve => {
    if (!RUNNING) {
      resolve(true)
    }
    else {
      await logOnce()
      setTimeout(main, 5000)
    }
  })
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
