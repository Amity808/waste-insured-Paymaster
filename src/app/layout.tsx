"use client";
// The "use client" directive indicates that this file is intended to be used as a client component in Next.js.

// Importing the Inter font from Google Fonts using Next.js built-in support.
import { Inter } from "next/font/google";
// Importing global CSS styles.
import "./globals.css";
// Importing chain configurations for ZetaChainTestnet and EthereumSepolia from Particle Network SDK.
import { zkSyncEraSepolia, zkSyncEra } from "@particle-network/chains";
// Importing AuthCoreContextProvider for providing authentication context using Particle Network SDK.
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
// Importing a custom AuthContext from a local context file.
import { AuthContext } from "@/context/AuthContext";


// Initializing the Inter font with Latin subset, ensuring consistent typography.
const inter = Inter({ subsets: ["latin"] });

// Defining the RootLayout component, which serves as the main layout for the application.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The root HTML element of the page, setting the language to English.
    <html lang="en">
      <body className={inter.className}> {/* Applying the Inter font to the entire body */}
        {/* Wrapping the application in AuthCoreContextProvider to provide authentication and wallet context */}
        <AuthCoreContextProvider
          options={{
            projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID as string || "", // Project ID for Particle Network, from environment variables
            clientKey: process.env.NEXT_PUBLIC_APP_CLIENT_KEY as string || "", // Client key for Particle Network, from environment variables
            appId: process.env.NEXT_PUBLIC_APP_APP_ID as string || "",         // App ID for Particle Network, from environment variables
            erc4337: {
              name: "SIMPLE",     // Name of the account abstraction contract
              version: "1.0.0",   // Version of the account abstraction contract
            },
            wallet: {
              visible: true,      // Indicates if the wallet should be visible
              customStyle: {
                supportChains: [zkSyncEraSepolia, zkSyncEra], // Supported blockchain networks
              },
            },
          }}
        >
          {/* Wrapping children components with custom AuthContext to manage user authentication */}
          <AuthContext>{children}</AuthContext>
        </AuthCoreContextProvider>
      </body>
    </html>
  );
}
