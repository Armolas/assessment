import { useState } from 'react'
import abi from './abi.json'
import './App.css'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [balance, setBalance] = useState("0")
  const [depositInput, setDepositInput] = useState(0)
  const [withdrawInput, setWithdrawInput] = useState(0)
  const contractAddress = '0x54a1764bfeebc69b652e064b07dd3dfcc47f1b2a'

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, abi, provider)

    try {
      const balance = await contract.getBalance()
      setBalance(balance.toString())
      toast.success(`Balance Successfully Retrieved: ${balance.toString()}`)
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  async function deposit() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const tx = await contract.deposit(depositInput)
      const receipt = await tx.wait()
      setDepositInput(0)
      getBalance()
      toast.success('Deposit Successful')
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const tx = await contract.withdraw(withdrawInput)
      const receipt = await tx.wait()
      setWithdrawInput(0)
      getBalance()
      toast.success('Withdraw Successful')
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  return (
    <>
      <div className="App">
        <h1>Muritadhor's Bank</h1>
        <h2>Balance: {balance}</h2>
        <button onClick={getBalance}>Get Balance</button>
        <br />
        <input
          type="number"
          value={depositInput}
          placeholder='Deposit amount'
          onChange={(e) => setDepositInput(e.target.value)}
        />
        <button onClick={deposit}>Deposit</button>
        <br />
        <input
          type="number"
          value={withdrawInput}
          placeholder='Withdraw amount'
          onChange={(e) => setWithdrawInput(e.target.value)}
        />
        <button onClick={withdraw}>Withdraw</button>
      </div>
      <ToastContainer />
    </>
  )
}

export default App
