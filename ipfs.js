const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
const MAIN_DIR = '/dweather'

let TOPIC = `dweather_robi`

async function getId() {
  const id = await ipfs.id()
  console.log(id)
}


async function addItem(temp, humid, sensorId = 'main') {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = (now.getUTCMonth() + 1).toString(10).padStart(2, '0')
  const day = now.getUTCDate().toString(10).padStart(2, '0')
  const ts = now.getTime()
  const filename = `${MAIN_DIR}/${year}-${month}-${day}.txt`
  const line = Buffer.from(`${ts},${sensorId},${temp},${humid}\n`)

  console.log(filename, line.toString())

  let stat = null
  try {
    stat = await ipfs.files.stat(filename)
  }
  catch (e) {
    console.log('create a new file')
    stat = { size: 0 }
  }
  console.log('additem - getStat,', Date.now())

  const result = await ipfs.files.write(filename, line, { offset: stat.size, create: true, parents: true })
  console.log('additem - write,', Date.now())
  const dir = await ipfs.files.stat(MAIN_DIR)
  await ipfs.files.flush()
  if (TOPIC) {
    await ipfs.pubsub.publish(TOPIC, Buffer.from(dir.hash))
  }
  return dir
}


async function stat() {

}

module.exports = {
  getId,
  addItem
}
