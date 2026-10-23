
import { useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'

const CONTRACT_ADDRESS = '0x7170540E98dE68cE915D655620e552C71EEcc4d8'

const CONTRACT_ABI = [
  'function registerProperty(string memory _address, uint256 _price)',
  'function transferOwnership(uint256 _propertyId, address newOwner)',
  'function getProperty(uint256 _propertyId) view returns (string, address, uint256)',
  'event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string propertyAddress, uint256 price)',
  'event OwnershipTransferred(uint256 indexed propertyId, address indexed previousOwner, address indexed newOwner)',
]

function App() {
  const [propertyAddress, setPropertyAddress] = useState('')
  const [price, setPrice] = useState('')
  const [propertyId, setPropertyId] = useState('0')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState('Wallet not connected')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [transferId, setTransferId] = useState('0')
  const [newOwner, setNewOwner] = useState('')

  async function getContract() {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask.')
    }

    const provider = new BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])

    const network = await provider.getNetwork()
    if (network.chainId !== 80002n) {
      throw new Error('Switch MetaMask to Polygon Amoy (Chain ID 80002).')
    }

    const signer = await provider.getSigner()
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }

  async function connectWallet() {
    try {
      await getContract()
      setStatus('Wallet connected to Polygon Amoy')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Wallet connection failed')
    }
  }

  async function registerProperty() {
    setLoading(true)
    setTxHash('')
    try {
      const contract = await getContract()
      const tx = await contract.registerProperty(propertyAddress, BigInt(price))
      setStatus('Transaction submitted. Waiting for confirmation...')
      setTxHash(tx.hash)
      await tx.wait()
      setStatus('Property registered successfully!')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  async function readProperty() {
    try {
      const contract = await getContract()
      const result = await contract.getProperty(BigInt(propertyId))
      setDetails(
        `Address: ${result[0]}\nOwner: ${result[1]}\nPrice: ${result[2].toString()}`
      )
      setStatus('Property details loaded')
    } catch (error) {
      setDetails('')
      setStatus(error instanceof Error ? error.message : 'Could not read property')
    }
  }

async function transferProperty() {
  setLoading(true)
  setTxHash('')
  try {
    const contract = await getContract()
    const tx = await contract.transferOwnership(
      BigInt(transferId),
      newOwner
    )
    setStatus('Transfer submitted. Waiting for confirmation...')
    setTxHash(tx.hash)
    await tx.wait()
    setStatus('Ownership transferred successfully!')
    await readProperty()
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Transfer failed')
  } finally {
    setLoading(false)
  }
}

  
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Polygon Amoy Testnet
          </p>
          <h1 className="text-4xl font-bold">Property Registry</h1>
          <p className="mt-3 text-slate-300">
            Register properties and view on-chain records.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">Blockchain Connection</h2>
          <p className="mb-4 break-all text-sm text-slate-300">
            Contract: {CONTRACT_ADDRESS}
          </p>
          <button
            onClick={connectWallet}
            className="rounded-lg bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
          >
            Connect MetaMask
          </button>
        </section>
        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Transfer Property Ownership</h2>

          <label className="mb-2 block text-sm text-slate-300">
            Property ID
          </label>
          <input
            type="number"
            min="0"
            value={transferId}
            onChange={(e) => setTransferId(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
          />

          <label className="mb-2 block text-sm text-slate-300">
            New Owner Wallet Address
          </label>
          <input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Enter new owner's 0x wallet address"
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
          />

          <button
            disabled={loading || !newOwner.trim()}
            onClick={transferProperty}
            className="rounded-lg bg-amber-600 px-5 py-3 font-semibold hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Transfer Ownership'}
          </button>
        </section>


        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Register a Property</h2>
          <label className="mb-2 block text-sm text-slate-300">Property address</label>
          <input
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="Enter property address"
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
          />
          <label className="mb-2 block text-sm text-slate-300">Price (integer)</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
          />
          <button
            disabled={loading || !propertyAddress.trim() || !price || Number(price) < 0}
            onClick={registerProperty}
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register on Blockchain'}
          </button>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">View Property Details</h2>
          <label className="mb-2 block text-sm text-slate-300">Property ID</label>
          <input
            type="number"
            min="0"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
          />
          <button
            onClick={readProperty}
            className="rounded-lg bg-sky-600 px-5 py-3 font-semibold hover:bg-sky-500"
          >
            Read On-Chain Details
          </button>
          {details && (
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-800 p-4 text-sm">
              {details}
            </pre>
          )}
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-2 text-xl font-semibold">Transaction Status</h2>
          <p className="break-words text-slate-300">{status}</p>
          {txHash && (
            <p className="mt-3 break-all text-sm">
              Transaction:{' '}
              <a
                className="text-violet-400 underline"
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {txHash}
              </a>
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
