import Image from "next/image";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getWallet } from "../utils/getwallet";
import { utils, BrowserProvider, Contract } from "zksync-ethers";
import { bank } from "../abi/bank"
import { useAccount } from "wagmi";
import { parseEther, formatEther} from 'viem'
export default function Home() {

  const [amount, setAmount] = useState('')
  const [smartBalance, setSmartBalance] = useState('')
  const [paymasterBalance, setPaymasterBalance] = useState('')

  const { address } = useAccount()
  //  paymaster = 
  // to interact with the paymaster we need the deploy payamaster address which we already deployed
  const paymasterAddress = "0xA5C8CFbc2B6D8618D5E307d76531fAdc6a1BB531"

  let provider;

  if (typeof window !== "undefined" && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
  }

  

  const wallet = getWallet(process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY);


  const bankContract = new Contract(bank.address, bank.abi, wallet)

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "General",
    innerInput: new Uint8Array(),
  });



  const withdrawSavings = async (e) => {
    e.preventDefault();
    console.log("clicked withdraw")

    try {
    let paymasterBalance = await provider.getBalance(paymasterAddress);
      setPaymasterBalance(paymasterBalance)
    console.log("Balance paymaster ", paymasterBalance.toString());
    // const convertToEthers = ethers.parseEther(amount.toString() || 0)
    const tx = await bankContract.withdraw({
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: paymasterParams,
      },
    });

    await tx.wait();
    toast.success(`successfully withdraw balance`)
    console.log("Afer paymaster ", paymasterBalance.toString());
    } catch (error) {
      toast.error("Gas limit too low in paymaster contract address")
            console.log(error?.message);
    }
  }

  const saveMoney = async (e) => {
    e.preventDefault();


    try {
    let paymasterBalance = await provider.getBalance(paymasterAddress);

    console.log("Balance paymaster ", paymasterBalance.toString());
    const convertToEthers = parseEther(amount.toString() || "0")
    
    console.log(convertToEthers);
    const tx = await bankContract.deposit({
      value: convertToEthers,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: paymasterParams,
      },
    });

    await tx.wait();
    toast.success(`Successfully deposit transaction ${convertToEthers.toString()}`)
    console.log("Afer paymaster ", paymasterBalance.toString());
    } catch (error) {
      console.log(error?.message);
    }
  }

  // const {data: readBalance } = useReadContract({
  //   abi: BankAbi.abi,
  //   address: BankAbi.address,
  //   functionName: 'balance',
  //   args: [address]
  // })
  // const formatBalance = ethers.formatEther(smartBalance?.toString() || "0")

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bankBalance = await bankContract.balance(address)
      console.log(bankBalance);
      const balance = ethers.formatEther(bankBalance)
      let paymasterBalance = await provider.getBalance(paymasterAddress);
      const payBalance = ethers.formatEther(paymasterBalance)
      setPaymasterBalance(payBalance)
      setSmartBalance(balance)
      } catch (error) {
        console.log(error);
        
      }

    }
    
    fetchBalance()
  },[])

  

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <ConnectButton />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className=" text-white">Contract balance is {smartBalance}</p>
        <p>Set Paymaster Balance {paymasterBalance}</p>
        <form onSubmit={saveMoney}>
          <input type="text" placeholder="Enter Eth amount" className=" text-black font-medium text-[16px] p-4" onChange={(e) => setAmount(e.target.value)} />
          <button className="rounded-md border-2 border-white p-2" type="submit">Send</button>
        </form>
        <button onClick={withdrawSavings} className=" rounded-md border-2 border-white p-2">Withdraw</button>
      </div>
    </main>
  );
}
