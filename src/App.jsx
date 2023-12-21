import { useState } from 'react'
import './App.css'

function Level({ level }) {
  return (
    <div className="level">
      <img src={`/images/${level}.png`} alt={`level ${level}`} />
      <div className="rlBTRFLY">{level} rlBTRFLY</div>
      <button>Mint</button>
    </div>
  )
}

function App() {
  return (
    <>
      <h1>Flappers</h1>
      <h2>can we get an NFT just because lol</h2>
      <p>You're mainly into defi, that's why you like Redacted so much. But wouldn't it be fun to have some NFTs to show off just how much you like it?</p>
      <p>Each level of Flapper is available to mint depending on how much rlBTRFLY your wallet has locked. This is to prove your flappiness! Each wallet is only allowed to mint (up to) one copy of each level.</p>
      <section className="levels-grid">
        <Level level={1} />
        <Level level={10} />
        <Level level={100} />
        <Level level={1000} />
      </section>
      <p>You will pay a little bit of ETH to mint, but your rlBTRFLY stays yours.</p>
      <p>There is no cap on the supply of any of these NFTs. It is entirely driven by how many people have enough rlBTRFLY to mint them.</p>
    </>
  )
}

export default App
