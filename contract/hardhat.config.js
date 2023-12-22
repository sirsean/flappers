const fs = require('fs');
const os = require('os');
const path = require('path');
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');

const configPath = path.join(os.homedir(), '.wallet');
if (!fs.existsSync(configPath)) {
    console.log('config file missing, please place it at:', configPath);
    process.exit();
}
const config = JSON.parse(fs.readFileSync(configPath));

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
      },
      forking: {
        url: config.mainnet,
        accounts: [config.key],
      },
    },
    mainnet: {
      url: config.mainnet,
      accounts: [config.key],
    },
  },
  abiExporter: {
    runOnCompile: true,
    clear: true,
  },
  etherscan: {
    apiKey: {
      mainnet: config.etherscan_key,
    },
  },
};
