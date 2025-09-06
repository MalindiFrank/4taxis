'use client';

import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { routeContributorABI } from '@/lib/abi';
import { useState } from 'react';

const contractAddress = '0x2452984eA21f2425D2e455c5DF8f432427837aC9'; // Replace with your actual contract address

export default function MintButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending } = useWriteContract();

  const handleMint = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi: routeContributorABI,
        functionName: 'safeMint',
        args: [address, ''], // TODO: Add a real token URI
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  if (isConnected) {
    return (
      <div>
        <p className="text-white mb-2">Connected as {address}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
          <button
            onClick={handleMint}
            disabled={isPending}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {isPending ? 'Minting...' : 'Mint Contributor Badge'}
          </button>
        </div>
        {hash && <p className="mt-4 text-white">Transaction Hash: {hash}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
}