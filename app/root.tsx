import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet, megaethTestnet } from "viem/chains";

import type { Route } from "./+types/root";
import "./app.css";
import { Header } from "./components/ui/header";
import { Footer } from "./components/ui/footer";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = () => {
  return {
    paymentAddress: process.env.PAYMENT_ADDRESS,
    envId: process.env.DYNAMIC_ENV,
  };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const config = createConfig({
    chains: [mainnet, megaethTestnet],
    multiInjectedProviderDiscovery: false,
    transports: {
      [mainnet.id]: http(),
      [megaethTestnet.id]: http(),
    },
  });

  const queryClient = new QueryClient();
  return (
    <DynamicContextProvider
      settings={{
        environmentId: loaderData.envId as string,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          onrampOptions: () => {
            return [
              // ...defaultOnrampOptions,
              {
                id: "getMegaETH",
                url: "https://testnet.megaeth.com/#2",
                displayName: "Get Mega ETH",
                iconUrl:
                  "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_2/837846854d834bdebff6dd1354d32b55",
                openMode: "popup",
              },
            ];
          },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <main className="bg-gray-50 min-h-screen overflow-y-scroll relative">
              <Header />
              <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <Outlet />
              </div>
              <Footer />
            </main>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
