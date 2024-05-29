import { utils,  Wallet, BrowserProvider } from "zksync-ethers";
import dotenv from "dotenv"

dotenv.config()

export const getWallet = (privateKey) => {

    let provider;

  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new BrowserProvider(window.ethereum)
  }
    if (!privateKey) {
    //   // Get wallet private key from .env file
      if (!process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY)
        throw "⛔️ Wallet private key wasn't found in .env file!";
    }
  
      
    // Initialize zkSync Wallet
    const wallet = new Wallet(
      privateKey ?? process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY,
      provider,
    );
  
    return wallet;
  };