// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const owner = "0x560EBafD8dB62cbdB44B50539d65b48072b98277";
  const rlBTRFLY = "0x742B70151cd3Bc7ab598aAFF1d54B90c3ebC6027";
  const mintCost = hre.ethers.parseEther("0.01");
  const levels = [1, 10, 100, 1000];

  const flappers = await hre.ethers.deployContract("Flappers", [owner, rlBTRFLY, mintCost, levels], {});

  await flappers.waitForDeployment();

  console.log(`Contract deployed to: ${flappers.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
