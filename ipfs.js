const Room = require('ipfs-pubsub-room')
const IPFS = require('ipfs')
const MAIN_DIR = '/dweather'

let __ipfs__ = null
let TOPIC = ''
let ROOM = null

function getIpfs() {
  if (!__ipfs__) {
    const ipfs = new IPFS({
      repo: 'dweather',
      EXPERIMENTAL: {
        pubsub: true // enable pubsub
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
    })

    __ipfs__ = new Promise(resolve => {
      ipfs.on('ready', () => {
        ROOM = Room(ipfs, 'dweather_robi')
        resolve(ipfs)
      })
    })
  }
  return __ipfs__
}




async function openRoom() {
  const ipfs = await getIpfs()
  const identity = await ipfs.id()
  const id = identity.id

  TOPIC = `dweather_${id}:root`
  return TOPIC
}



async function addItem(temp, humid, sensorId = 'main') {
  const ipfs = await getIpfs()
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
  if (ROOM) {
    ROOM.broadcast(dir.hash)
  }
  return dir
}

module.exports = {
  addItem,
  openRoom
}
