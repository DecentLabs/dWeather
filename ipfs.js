const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');

async function main() {
  const stat = await ipfs.stats.bw()
  console.log(stat)
  return stat
}

main()