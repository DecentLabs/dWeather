const { Bus } = require('i2c-bus-promised')
const { calcCrc8, DEVICE_ADDRESS, READ_TEMP, waitFor, READ_HUMIDITY } = require('./utils.js')

const bus = new Bus()

const setup = async () => {
  await bus.open()
}

const readTemperature = async () => {
  const data = Buffer.alloc(3)
  let temperature = 0
  await bus.write(DEVICE_ADDRESS, 1, Buffer.from([READ_TEMP]))
  await waitFor(50)
  await bus.read(DEVICE_ADDRESS, 3, data)
  if ((data.length === 3) && calcCrc8(data, 3)) {
    const rawtemp = ((data[0] << 8) | data[1]) & 0xFFFC
    temperature = ((rawtemp / 65536.0) * 175.72) - 46.85
  }

  return temperature
}

const readHumidity = async () => {
  const data = Buffer.alloc(3)
  let humidity = 0
  await bus.write(DEVICE_ADDRESS, 1, Buffer.from([READ_HUMIDITY]))
  await waitFor(50)
  await bus.read(DEVICE_ADDRESS, 3, data)
  if ((data.length === 3) && calcCrc8(data, 3)) {
    const rawhumi = ((data[0] << 8) | data[1]) & 0xFFFC
    humidity = ((rawhumi / 65536.0) * 125.0) - 6.0
  }
  return humidity
}

const main = async () => {
  await setup()
  while (true) {
    const temperature = await readTemperature()
    const humidity = await readHumidity()
    console.log('temperature|humidity ', temperature, humidity)
    await waitFor(1000)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
