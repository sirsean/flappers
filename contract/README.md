# Flappers Contract

This contract is an ERC-1155 implementation of Flappers.

You are allowed to mint the NFTs if you've locked rlBTRFLY; there are escalating
tiers of NFT, access to which are opened to increasing balances of rlBTRFLY in
your wallet.

You are only allowed to mint one of each level.

## Setup

Hardhat has rules about what version of Node you can use.

```shell
nvm use
```

## Usage

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js
```
