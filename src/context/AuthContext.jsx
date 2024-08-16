"use client" // directive ensures that this file is treated as a client component in Next.js.

// Importing necessary libraries and hooks from React and Particle Network SDK
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useEthereum,       // Hook to interact with Ethereum provider
  useConnect,        // Hook to manage connection to a wallet
  useAuthCore,       // Hook to access authentication core methods
} from "@particle-network/auth-core-modal";
import { ZetaChainTestnet } from "@particle-network/chains"; // Importing ZetaChainTestnet from Particle Network SDK
import { AAWrapProvider, SmartAccount, SendTransactionMode } from "@particle-network/aa"; // Tools for account abstraction and transaction management
import { ethers } from "ethers"; // Ethers.js for blockchain interactions

// Creating a context to share state across components
const SocialoginAccount = createContext();

// Main AuthContext component that wraps around child components to provide authentication-related context
export const AuthContext = ({ children }) => {
  const chain = ZetaChainTestnet.id; // Getting the chain ID of ZetaChainTestnet
  console.log(chain);

  const { provider } = useEthereum(); // Accessing Ethereum provider
  if (!provider) {
    console.error('Ethereum provider is not available.');
    return null; // Or handle this case appropriately
  }
  // Creating a SmartAccount instance for account abstraction and user operations
  const smartAccount = new SmartAccount(provider, {
    projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,  // Project ID from environment variables
    clientKey: process.env.NEXT_PUBLIC_APP_CLIENT_KEY,  // Client key from environment variables from particle network
    appId: process.env.NEXT_PUBLIC_APP_APP_ID,          // App ID from environment variables from particle network
    aaOptions: {
      accountContracts: {
        SIMPLE: [{ version: "1.0.0", chainIds: [chain] }], // Defining account abstraction options for the ZetaChain
      },
    },
  });

  console.log(smartAccount);

  // Wrapping SmartAccount with AAWrapProvider to enable transaction handling (e.g., Gasless transactions)
  const customProvider = new ethers.providers.Web3Provider(
    new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), 
    "any" // Network is set to "any" for compatibility
  );

  // State variables to store balance, address, and signer information
  const [balance, setBalance] = useState(null);
  const [address, setaddress] = useState(null);
  const [signer, setSigner] = useState(null);

  // Hooks for managing wallet connection and retrieving user info
  const { connect, disconnect, connected } = useConnect();
  const { userInfo } = useAuthCore();

  // Getting the signer from the customProvider
  const signerp = customProvider?.getSigner();
  console.log("signerp", signerp);

  // Effect hook that fetches balance when userInfo, smartAccount, or customProvider changes
  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo, smartAccount, customProvider, provider]);

  console.log(userInfo);
  console.log(balance);

  // Function to fetch user's Ethereum balance and signer info
  const fetchBalance = async () => {
    const addressParticle = await smartAccount.provider.selectedAddress; // Get the selected address from the provider
    console.log(addressParticle);
    setaddress(addressParticle);
    const balanceResponseParticle = await customProvider.getBalance(
      addressParticle
    ); // Fetch balance
    setBalance(ethers.utils.formatEther(balanceResponseParticle)); // Format and set balance
    const signers = customProvider.getSigner(); // Get the signer
    console.log(signers);
    setSigner(signers); // Set the signer in state
  };

  console.log(signer, "signer");

  // Function to handle user login via social authentication
  const handleLogin = async (authType) => {
    if (!userInfo) {
      try {
        await connect({
          socialType: authType,  // Specify the social authentication type
          chain: ZetaChainTestnet,  // Specify the chain to connect to
          prompt: "select_account",  // Prompt the user to select an account
        });
      } catch (error) {
        console.log(error, "lognError"); // Handle login errors
      }
    }
  };

  // Function to execute a user operation, e.g., sending a transaction
  const executeUserOp = async () => {
    try {
      if (!signer) {
        console.error("Signer is not available"); // Ensure the signer is available
        return;
      }
      // Define a transaction object
      const tx = {
        to: "0x9dBa18e9b96b905919cC828C399d313EfD55D800", // Recipient address
        value: ethers.utils.parseEther("0.001"), // Transaction value in Ether
      };
      const txResponse = await signer.sendTransaction(tx); // Send the transaction
      const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
      console.log("Transaction receipt:", txReceipt);
    } catch (error) {
      console.error("Error in executeUserOp:", error); // Handle errors during transaction execution
    }
  };

  // Providing the context values to child components
  return (
    <SocialoginAccount.Provider
      value={{
        handleLogin,
        userInfo,
        balance,
        connect,
        disconnect,
        address,
        customProvider,
        executeUserOp,
        signer,
        signerp,
      }}
    >
      {children} {/* Render child components */}
    </SocialoginAccount.Provider>
  );
};

export default SocialoginAccount;

// Custom hook to consume the context in child components
export const useAuth = () => {
  return useContext(SocialoginAccount);
};
