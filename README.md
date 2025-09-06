# 4taxis
# Taxi Connect — MVP

A mobile-first web app MVP that displays minibus taxi routes, stops, and hand-signal guidance using a static `routes.json`. Includes a lightweight on-chain social layer for contributor badges (ERC-721) deployed on Base (Layer 2). This repository is scoped for a hackathon/demo: simple, fast to implement, visually polished, and focused on the essential demo flows.

---

## Table of contents

* [Objective](#objective)
* [MVP features](#mvp-features)
* [Tech stack](#tech-stack)
* [Folder structure](#folder-structure)
* [Getting started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Install](#install)
  * [Run (development)](#run-development)
  * [Build (production)](#build-production)
* [Using `routes.json`](#using-routesjson)
* [On-chain component (Base L2)](#on-chain-component-base-l2)

  * [Contract: `RouteBadge.sol`](#contract-routebadesol)
  * [Deploying to Base testnet (example)](#deploying-to-base-testnet-example)
  * [Frontend mint flow (ethers.js example)](#frontend-mint-flow-ethersjs-example)
  * [IPFS metadata template + upload script (nft.storage)](#ipfs-metadata-template--upload-script-nftstorage)
  * [Demo fallback: mock mint](#demo-fallback-mock-mint)
* [Demo script (what to show to judges)](#demo-script-what-to-show-to-judges)
* [Design tokens & UI guidance](#design-tokens--ui-guidance)
* [Future improvements](#future-improvements)
* [Contributing](#contributing)
* [License](#license)
* [Credits](#credits)

---

## Objective

Ship a compact, hackathon-ready MVP that:

* Shows taxi routes/stops and hand-signal guidance from a static `routes.json`.
* Lets users add a stop in-session (client-side) and immediately see the change.
* Demonstrates an on-chain mint: a “Route Contributor” badge (ERC-721) minted on Base testnet when a user makes their first contribution.
* Keeps the experience mobile-first, attractive, and socially shareable.

---

## MVP features

**Core**

* Static `routes.json` as data source.
* Search routes by city or route title.
* Map view (Leaflet + OpenStreetMap) with polylines and clickable stop markers.
* Route detail with hand-signal card and share/export capability.
* Add-stop contribution (client-only for the hackathon).

**On-chain**

* Minimal ERC-721 (`RouteBadge`) to mint contributor badges on Base testnet.
* Metadata (tokenURI) stored on IPFS (recommended: nft.storage).
* Frontend shows tx hash and minted token details after confirmation.
* Demo fallback for users without wallets or testnet funds.

---

## Tech stack

* Frontend: React (Vite or Create React App), Tailwind CSS recommended for rapid styling.
* Mapping: Leaflet.js + OpenStreetMap tiles.
* On-chain: ethers.js, MetaMask (or other injected wallets).
* Contract: Solidity (OpenZeppelin ERC-721 extensions), Hardhat recommended for deployment.
* IPFS: nft.storage (optional, for metadata hosting).
* Hosting: Vercel / Netlify (frontend only; no backend required).

---

## Folder structure

Example recommended structure:

```
/ (repo root)
├─ public/
│  ├─ routes.json          # Seed static dataset (required)
│  └─ assets/              # images, icons, hand-signal svgs
├─ src/
│  ├─ components/
│  │  ├─ MapView.jsx
│  │  ├─ RouteCard.jsx
│  │  ├─ StopCard.jsx
│  │  └─ WalletModal.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  └─ RouteDetail.jsx
│  ├─ styles/
│  │  └─ tailwind.css
│  ├─ utils/
│  │  ├─ routesLoader.js
│  │  └─ ethersHelpers.js
│  └─ main.jsx
├─ contracts/
│  └─ RouteBadge.sol
├─ scripts/
│  ├─ deploy.js            # hardhat deploy script example
│  └─ uploadMetadata.js    # optional nft.storage uploader
├─ README.md
└─ package.json
```

---

## Getting started

### Prerequisites

* Node.js (14+ recommended)
* npm or yarn
* MetaMask or another injected web3 wallet for testing minting
* (Optional) Hardhat and an RPC endpoint for Base testnet if you will deploy the contract
* (Optional) nft.storage API key for uploading metadata to IPFS

### Install

```bash
# clone repository
git clone <repo-url>
cd taxi-connect

# install dependencies
npm install
# or
yarn install
```

### Run (development)

```bash
# run the frontend
npm run dev
# or
yarn dev
```

Open the local dev server in your browser (default Vite URL: [http://localhost:5173](http://localhost:5173)). The app will load `public/routes.json` at startup.

### Build (production)

```bash
npm run build
# or
yarn build
```

Deploy the `dist/` (or `build/`) folder to Vercel/Netlify or another static host.

---

## Using `routes.json`

* `public/routes.json` is the single source of route data for the MVP.
* Each route object should include an `id`, `title`, `city`, `origin`, `destination`, `roads`, `stops` (ordered array with `name`, `lat`, `lon`, `description`, `hand_signal`), `hand_signals`, and `share_card`.
* On app load, fetch `routes.json` (e.g., `fetch('/routes.json').then(r => r.json())`) and populate the UI.
* To draw a route polyline in Leaflet:

```js
const latLngs = route.stops.map(s => [s.lat, s.lon]);
L.polyline(latLngs).addTo(map);
```

* Contributions add stops client-side by appending to `route.stops` in memory and re-rendering the map and UI.

---

## On-chain component (Base L2)

### Contract: `RouteBadge.sol`

A minimal ERC-721 contract for badges. Save in `contracts/RouteBadge.sol`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RouteBadge is ERC721URIStorage, Ownable {
    uint256 public nextId;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mintBadge(address to, string calldata tokenURI) external returns (uint256) {
        uint256 id = ++nextId;
        _safeMint(to, id);
        _setTokenURI(id, tokenURI);
        return id;
    }

    // Owner can withdraw accidental funds
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
```

Notes:

* Keep contract simple; the goal is provenance, not token economics.
* `mintBadge` is `external` and callable by frontend. For production, you might restrict minting or add minting conditions.

### Deploying to Base testnet (example)

Use Hardhat for deployment. Example `scripts/deploy.js`:

```js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const RouteBadge = await ethers.getContractFactory("RouteBadge");
  const badge = await RouteBadge.deploy("TaxiConnect Badge", "TCB");
  await badge.deployed();
  console.log("RouteBadge deployed to:", badge.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Hardhat config should include a network configuration for Base testnet RPC and an account private key. For a hackathon, you may deploy to Base testnet manually and paste the contract address into frontend env.

### Frontend mint flow (ethers.js example)

Minimal flow to call `mintBadge`:

```js
import { ethers } from "ethers";
import RouteBadgeABI from "./RouteBadgeABI.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

const contract = new ethers.Contract(CONTRACT_ADDRESS, RouteBadgeABI, signer);

// metadataURI should point to IPFS / static server
const tx = await contract.mintBadge(await signer.getAddress(), metadataURI);
const receipt = await tx.wait();
console.log("Mint tx hash:", receipt.transactionHash);

// optionally, parse Transfer event to get tokenId
const transferEvent = receipt.events.find(e => e.event === "Transfer");
const tokenId = transferEvent ? transferEvent.args[2].toString() : null;
```

Show the user `receipt.transactionHash` and token metadata (image, name, route reference).

### IPFS metadata template + upload script (nft.storage)

Sample metadata JSON structure:

```json
{
  "name": "Taxi Connect Contributor Badge",
  "description": "Badge for contributing a taxi stop to Taxi Connect. Route: {routeId}, Stop: {stopId}",
  "image": "ipfs://<imageCid>", 
  "properties": {
    "routeId": "<routeId>",
    "stopId": "<stopId>",
    "contributionDate": "2025-09-06"
  }
}
```

Simple Node upload snippet using `nft.storage`:

```js
// scripts/uploadMetadata.js
const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY; // set in env
const client = new NFTStorage({ token: NFT_STORAGE_KEY });

async function uploadBadge(metadata, imageFilePath) {
  const image = await fs.promises.readFile(imageFilePath);
  const file = new File([image], path.basename(imageFilePath), { type: "image/png" });
  const cid = await client.store({
    name: metadata.name,
    description: metadata.description,
    image: file,
    properties: metadata.properties
  });
  // cid.url holds ipfs://... style reference
  return cid; // contains .url
}
```

Use the returned IPFS URL as `tokenURI` when calling `mintBadge`.

### Demo fallback: mock mint

Provide a mock mint path to keep the demo friction-free:

* Create a client-side function that returns a fake tx hash (e.g., `0xdead...`) and a fake tokenId.
* UI should clearly label it as `Demo mint` and not on-chain.
* Use the mock path if the wallet is not connected or user has no testnet funds.

---

## Demo script (what to show to judges)

1. Home → Search for a sample city (e.g., "Soweto") and select a featured route.
2. Show the map with the polyline and clickable stop markers.
3. Click a stop → open hand-signal card; demonstrate “Share to WhatsApp” or “Save image.”
4. Click “Add Stop” → fill in a short stop form → submit → show immediate UI update and small confetti microinteraction.
5. Connect wallet (MetaMask) → click “Mint Contributor Badge” → confirm transaction in wallet → show tx hash and minted token details (metadata).
6. If no wallet/testnet funds, use “Demo mint” fallback and explain that the real flow mints on Base testnet.

Keep the demo short and reproducible: each step should be quick, with visual confirmation for every action.

---

## Design tokens & UI guidance

Use the following tokens for a South African taxi-inspired, mobile-first UI:

**Colors**

* Taxi Yellow: `#FFD100`
* Deep Black: `#0B0B0B`
* Signal Green: `#2EB872`
* Warm Red: `#E63946`
* Neutral Light: `#F5F5F7`
* Neutral Gray: `#8A8A8A`

**Typography**

* Headline: Poppins or Montserrat
* Body: Inter or system UI font

**Shapes & motion**

* 2xl rounded corners for cards, soft shadows, touch targets >= 44px.
* Use micro-animations for marker pulses, card lifts, and confetti on first contribution/mint.
* Share card export: provide PNG at 1200×630 and 1080×1080.

---

## Future improvements (post-hackathon)

* Persist contributions to a backend and add moderation or verification workflows.
* Index on-chain contribution events for robust leaderboards (The Graph or custom indexer).
* Gasless minting via a relayer for reduced wallet friction.
* Expanded localization (Afrikaans, isiZulu, Sesotho).
* Community verification badges and reputation curves.
* Offline-first features for low-connectivity users.

---

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Open a pull request describing the change and demo instructions.
4. Keep commits small and focused.

Coding style:

* React components should be functional components using hooks.
* Keep UI/UX changes isolated and add screenshots in PR description.

---

## License

This project is released under the MIT License. See `LICENSE` for details.

---

## Credits

* Concept, product & UX direction: Taxi Connect (project team).
* Seed data: `public/routes.json` (sample dataset provided for hackathon).
* Smart contract: OpenZeppelin ERC-721 primitives.

---

Tell me which deliverable you want next and I will generate it.
