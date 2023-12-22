import { useState } from 'react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig, useAccount, useContractRead, useWalletClient, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { fetchBalance } from '@wagmi/core'
import { formatUnits } from 'viem'
import { mainnet } from 'wagmi/chains'
import FlappersABI from '../abi/FlappersABI.js';
import './App.css'
import { useEffect } from 'react'

// for local development only
const hardhat = {
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8545'] },
    default: { http: ['http://127.0.0.1:8545/'] },
  },
}

const chains = [mainnet]
const projectId = '465cea506266b994b7edc2d57c2c0006'

// make sure we're pointed at the right address
const HARDHAT_FLAPPERS_ADDRESS = '0x839C1B05486161632b09E71d9Ba79731d44bb534';
const MAINNET_FLAPPERS_ADDRESS = '0x303e956440B2f61c7aDe26E43886F03560a3c8AF';
const FLAPPERS_ADDRESS = MAINNET_FLAPPERS_ADDRESS;
const RLBTRFLY_ADDRESS = '0x742B70151cd3Bc7ab598aAFF1d54B90c3ebC6027';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function Level({ level }) {
  const { data: walletClient } = useWalletClient()
  const [canMint, setCanMint] = useState(false);
  const [mintCost, setMintCost] = useState(null);
  useContractRead({
    address: FLAPPERS_ADDRESS,
    abi: FlappersABI,
    functionName: 'mintCost',
    onSuccess(data) {
      setMintCost(data);
    },
    onError(error) {
      console.error(error);
    },
  })
  useContractRead({
    account: walletClient?.account,
    address: FLAPPERS_ADDRESS,
    abi: FlappersABI,
    functionName: 'canMint',
    args: [level],
    onSuccess(data) {
      setCanMint(data);
    },
    onError(error) {
      console.error(error);
    },
  })
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: FLAPPERS_ADDRESS,
    abi: FlappersABI,
    functionName: 'mint',
    args: [level],
    value: mintCost,
  })
  return (
    <div className="level">
      <img src={`/images/${level}.png`} alt={`level ${level}`} />
      <div className="rlBTRFLY">{level} rlBTRFLY</div>
      {isLoading && <p>Minting...</p>}
      {isSuccess && <p>Minted! <a target='_blank' href={`https://etherscan.io/tx/${data?.hash}`}>View on Etherscan</a></p>}
      {canMint && mintCost && !isLoading && !isSuccess &&
        <button
          onClick={() => write?.()}
          disabled={!write}>
            Mint ({formatUnits(mintCost, 18)} ETH)
        </button>}
    </div>
  )
}

function LockedBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    if (!address) {
      return;
    }
    fetchBalance({
      address: address,
      token: RLBTRFLY_ADDRESS,
    }).then((balance) => {
      setBalance(balance);
    })
  }, [address]);
  if (balance) {
    return (
      <div className="LockedBalance">
        <p>You have <strong>locked {balance.formatted} rlBTRFLY</strong>.</p>
      </div>
    );
  }
}

function HomePage() {
  return (
    <>
      <Web3Button />
      <h1>Flappers</h1>
      <h2>can we get an NFT just because lol</h2>
      <p>You're mainly into defi, that's why you like Redacted so much. But wouldn't it be fun to have some NFTs to show off just how much you like it?</p>
      <p>Each level of Flapper is available to mint depending on how much rlBTRFLY your wallet has locked. This is to prove your flappiness! Each wallet is only allowed to mint (up to) one copy of each level.</p>
      <LockedBalance />
      <section className="levels-grid">
        <Level level={1} />
        <Level level={10} />
        <Level level={100} />
        <Level level={1000} />
      </section>
      <p>You will pay a little bit of ETH to mint, but your rlBTRFLY stays yours.</p>
      <p>There is no cap on the supply of any of these NFTs. It is entirely driven by how many people have enough rlBTRFLY to mint them.</p>
      <ul>
        <li><a target="_blank" href="https://github.com/sirsean/flappers">Github</a></li>
        <li><a target="_blank" href={`https://etherscan.io/address/${FLAPPERS_ADDRESS}`}>Etherscan</a></li>
        <li><a target="_blank" href={`https://opensea.io/collection/redacted-flappers`}>OpenSea</a></li>
      </ul>
    </>
  );
}

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <HomePage />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          '--w3m-font-family': 'NanumGothicCoding',
          '--w3m-accent-color': '#0b53ab',
          '--w3m-background-color': 'rgba(0, 0, 0, 0.5)',
        }}
        />
    </>
  )
}

export default App
