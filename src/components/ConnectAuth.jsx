"use client";
// The "use client" directive indicates that this component is a client-side component in Next.js.

import React from "react";
// Importing the useConnect hook from the Particle Network SDK for managing wallet connections.
import { useConnect } from "@particle-network/auth-core-modal";

// Importing custom hooks and utilities.
import { useAuth } from "@/context/AuthContext"; // Custom hook to access authentication context.
import { truncateAddress } from "@/utils/truncateAddress"; // Utility function to truncate long Ethereum addresses.

// Define the ConnectAuth component, which handles wallet connection and displays wallet information.
const ConnectAuth = () => {
  // Destructuring properties from the useConnect hook to manage connection state and disconnect functionality.
  const { connected, disconnect } = useConnect();
  
  // Destructuring properties from the custom useAuth hook to handle login, display balance, address, and logout functionality.
  const { handleLogin: login, balance: balanceInfo, address, disconnect: logout, walletAddress } = useAuth();

  // Returning JSX that conditionally renders based on the connection state.
  return (
    <div>
      {connected ? (
        // If the user is connected, display the wallet information.
        <>
          <div className="dropdown dropdown-bottom dropdown-end">
            {/* Button to view wallet details */}
            <div tabIndex={0} role="button" className="btn m-1">
              View Wallet
            </div>
            {/* Dropdown menu with wallet information */}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>
                  {/* Display the user's balance */}
                  <p>{balanceInfo}</p>
                </a>
              </li>
              <li>
                <a>
                  {/* Display the truncated wallet address */}
                  <p>{truncateAddress(address)}</p>
                </a>
              </li>
              <li>
                <a>
                  {/* Button to disconnect the wallet */}
                  <button className="" onClick={() => disconnect()}>
                    Disconnect
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        // If the user is not connected, display options to connect with different social accounts.
        <>
          <div className="dropdown dropdown-bottom dropdown-end">
            {/* Button to initiate wallet connection */}
            <div tabIndex={0} role="button" className="btn m-1">
              Connect Wallet
            </div>
            {/* Dropdown menu with options to connect via different social platforms */}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>
                  {/* Button to connect using Twitter */}
                  <button className="" onClick={() => login("twitter")}>
                    Connect with Twitter
                  </button>
                </a>
              </li>
              <li>
                <a>
                  {/* Button to connect using Google */}
                  <button className="" onClick={() => login("google")}>
                    Connect with Google
                  </button>
                </a>
              </li>
              <li>
                <a>
                  {/* Button to connect using GitHub */}
                  <button className="" onClick={() => login("github")}>
                    Connect with Github
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

// Exporting the ConnectAuth component as the default export.
export default ConnectAuth;
