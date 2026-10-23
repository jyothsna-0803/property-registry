# Property Registry dApp

A decentralized application (dApp) for registering properties and transferring property ownership on the blockchain.

## Overview

The Property Registry dApp demonstrates how blockchain technology can be used to maintain a transparent, verifiable record of property registrations and ownership transfers. It combines a Solidity smart contract with a React-based frontend.

## Features

- **Property Registration:** Register a property with its address and price.
- **Ownership Tracking:** Retrieve property details, including the current owner's wallet address.
- **Ownership Transfer:** Transfer a registered property's ownership to another wallet, subject to smart contract authorization.
- **Smart Contract Validation:** Validate property existence, restrict transfers to authorized owners, and reject invalid recipient addresses.
- **Blockchain Events:** Emit events for property registration and ownership transfers.
- **Automated Tests:** Test core smart contract functionality and expected behavior.

## Tech Stack

- **Smart Contracts:** Solidity
- **Development and Testing:** Hardhat, TypeScript, Mocha, Chai
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Blockchain Integration:** ethers.js
- **Network:** Polygon Amoy Testnet

## Project Structure

```text
property-registry/
├── contracts/
│   └── PropertyRegistry.sol
├── frontend/
│   ├── src/
│   └── package.json
├── test/
├── scripts/
├── hardhat.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A browser wallet such as MetaMask for frontend blockchain interactions
- Testnet funds if you want to submit transactions on Polygon Amoy

### Install Dependencies

From the project root, run:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

### Run Tests

From the project root, run:

```bash
npx hardhat test
```

### Start the Frontend

From the project root:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite in your browser.

## Testnet Deployment

The smart contract was deployed to the Polygon Amoy testnet.

- **Contract Address:** `0x7170540E98dE68cE915D655620e552C71EEcc4d8`
- **Network:** Polygon Amoy
- **Block Explorer:** [View contract on PolygonScan](https://amoy.polygonscan.com/address/0x7170540E98dE68cE915D655620e552C71EEcc4d8)

You can use the explorer to inspect the contract and its on-chain activity.

## Security Notes

- Never commit private keys, wallet seed phrases, API secrets, or `.env` files.
- Use testnet accounts and test tokens for development.
- Review and test smart contract authorization and validation before considering production deployment.

## Learning Outcomes

This project provided hands-on experience with Solidity smart contract development, automated testing, wallet integration, blockchain transactions, and connecting a React frontend to a deployed smart contract.

## Future Improvements

- Add property search and filtering.
- Improve transaction status and error messages in the UI.
- Add more comprehensive smart contract tests.
- Explore additional validation and security testing.

---

**Note:** This is an educational testnet project, not a legal property ownership registry.