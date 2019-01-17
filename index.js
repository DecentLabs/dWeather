const { Bus } = require('i2c-bus-promised')
const { READ_TEMP, READ_HUMIDITY, readSensor } = require('./utils.js')

const bus = new Bus()

const setup = async() => {
  await bus.open()
}

const readTemperature = async() => {
  const sensorData = await readSensor(bus, READ_TEMP)
  return ((sensorData / 65536.0) * 175.72) - 46.85
}

const readHumidity = async() => {
  const sensorData = await readSensor(bus, READ_HUMIDITY)
  return ((sensorData / 65536.0) * 125.0) - 6.0
}

const main = async() => {
  await setup()

  const temperature = await readTemperature()
  const humidity = await readHumidity()
  const now = Date.now()
  console.log(`${now} T:${temperature} H:${humidity}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
