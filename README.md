# 4Taxis - TaxiConnect

4Taxis is a community-driven platform for discovering and sharing taxi routes and stops. It allows users to view existing routes, contribute new stops, and earn on-chain rewards for their contributions.

[Base + Farcaster Mini App](https://farcaster.xyz/miniapps/Y1ED5ZAdKKum/taxiconnect)

## Features

- **Route and Stop Visualization:** Interactive map powered by Leaflet to display taxi routes and stops.
- **Community Contributions:** Users can add new stops to existing routes, including details like hand signals and recommended waiting spots.
- **Social Sharing:** Easily share specific stops with others via a unique URL.
- **On-Chain Rewards:** Contributors can mint a "Route Contributor" NFT badge on the Base Sepolia testnet as a proof-of-contribution.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following:

   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

- `app/` - Contains the main application logic, including pages, components, and API routes.
- `lib/` - Contains shared libraries and utilities, such as the smart contract ABI and notification clients.
- `public/` - Contains static assets like images and fonts.

## Technologies Used

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet](https://leafletjs.com)
- [Wagmi](https://wagmi.sh)
- [@coinbase/onchainkit](https://github.com/coinbase/onchainkit)

## Future Work

- **Notifications:** Implement a notification system to alert users when new stops are added to routes they are interested in.
- **NFT Metadata:** Enhance the NFT minting process to include unique metadata for each badge.
- **User Profiles:** Create user profiles to showcase their contributions and earned badges.
