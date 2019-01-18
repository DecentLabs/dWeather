const { Bus } = require('i2c-bus-promised')
const { READ_TEMP, READ_HUMIDITY, readSensor } = require('./utils.js')
const { addItem } = require("./ipfs.js")

const bus = new Bus()

const setup = async() => {
  await bus.open()
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
  const name = await addItem(temperature, humidity)
  console.log('[end],', Date.now())
  console.log(name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
