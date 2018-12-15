const calcCrc8 = (buf, len) => {
  var dataandcrc
  // Generator polynomial: x**8 + x**5 + x**4 + 1 = 1001 1000 1
  var poly = 0x98800000
  var i

  if (len === null) return -1
  if (len !== 3) return -1
  if (buf === null) return -1

  // Justify the data on the MSB side. Note the poly is also
  // justified the same way.
  dataandcrc = (buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8)
  for (i = 0; i < 24; i++) {
    if (dataandcrc & 0x80000000) {
      dataandcrc ^= poly
    }
    dataandcrc <<= 1
  }
  return (dataandcrc === 0)
}

const waitfor = ms => new Promise(resolve => {
  setTimeout(() => resolve(), ms)
})



const DEVICE_ADDRESS = 0x40
CONST READ_TEMP = 0xF3

module.exports = {
  DEVICE_ADDRESS,
  calcCrc8,
  waitfor,
  READ_TEMP
}
