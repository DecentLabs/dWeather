const { addItem } = require("./ipfs.js")
const { Bus } = require('i2c-bus-promised')
const { READ_TEMP, READ_HUMIDITY, readSensor } = require('./utils.js')
const bus = new Bus()
let isBusOpen = false

const setup = async() => {
  if (!isBusOpen) {
    await bus.open()
    isBusOpen = true
  }
}

const readTemperature = async() => {
  const sensorData = await readSensor(bus, READ_TEMP)
  return (((sensorData / 65536.0) * 175.72) - 46.85)
}

const readHumidity = async() => {
  const sensorData = await readSensor(bus, READ_HUMIDITY)
  return (((sensorData / 65536.0) * 125.0) - 6.0)
}

const main = async() => {
  console.log('[start],', Date.now())
  await setup()

  console.log('read temperature,', Date.now())
  const temperature = await readTemperature()
  console.log('read humidity,', Date.now())
  const humidity = await readHumidity()
  console.log('additem,', Date.now())
  const directoryHash = await addItem(temperature.toPrecision(4), humidity.toPrecision(4))
  console.log(`[end] ${directoryHash},`, Date.now())
}

module.exports = {
  logOnce: main
}
