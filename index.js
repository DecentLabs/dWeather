const { Bus, Device } = require('i2c-bus-promised');

const waitfor = ms => new Promise(resolve => {
	setTimeout(() => resolve(),ms)
})

function calc_crc8(buf, len)
{
    var dataandcrc;
    // Generator polynomial: x**8 + x**5 + x**4 + 1 = 1001 1000 1
    var poly = 0x98800000;
    var i;

    if (len === null) return -1;
    if (len != 3) return -1;
    if (buf === null) return -1;

    // Justify the data on the MSB side. Note the poly is also
    // justified the same way.
    dataandcrc = (buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8);
    for (i = 0; i < 24; i++) {
        if (dataandcrc & 0x80000000)
            dataandcrc ^= poly;
        dataandcrc <<= 1;
    }
    return (dataandcrc === 0);
}

const setup = Buffer.alloc(1)
setup[0] = 0xF3



const main = async () => {
  const bus = new Bus();

  await bus.open();

  await bus.write(0x40,1,setup);

  await waitfor(50)

  const data = Buffer.alloc(3)

  await bus.read(0x40,3,data)

  if ((data.length === 3) && calc_crc8(data, 3)) {
	var rawtemp = ((data[0] << 8) | data[1]) & 0xFFFC;
        var temperature = ((rawtemp / 65536.0) * 175.72) - 46.85;
  }

  console.log('temp out',temperature)
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
