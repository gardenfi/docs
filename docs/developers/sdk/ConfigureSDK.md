---
id: configure-sdk
---

# Configure SDK  

To use the Garden SDK, you’ll need to set up wallets, API clients, and initialize the core components. Follow the steps below:  

## 1. Initialize dependencies

Set up your Ethereum wallet, along with the necessary API clients.  

```typescript
import { Siwe } from "@gardenfi/core";
import { BitcoinProvider, BitcoinNetwork } from "@catalogfi/wallets";
import { privateKeyToAccount, createWalletClient, http, sepolia } from "viem";

// Ethereum Wallet Setup
const account = privateKeyToAccount(privateKey());
const ethereumWalletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

// API Clients
const auth = new Siwe(new URL(orderBookApi), ethereumWalletClient, {
  store: new MemoryStorage(),
});

const quote = new Quote(quoteApi);

const bitcoinProvider = new BitcoinProvider(
  BitcoinNetwork.Testnet,
  bitcoinProviderApi
);
```

---

## 2. Set up wallets and secret manager  

Use the **SecretManager** to securely manage secrets for your Bitcoin wallet.  

```typescript
import { BitcoinWallet } from "@catalogfi/wallets";

const result = await SecretManager.fromWalletClient(ethereumWalletClient);
if (result.error) {
  throw new Error(result.error);
}
const secretManager = result.val;

const btcWallet = BitcoinWallet.fromPrivateKey(
  secretManager.getMasterPrivKey(),
  bitcoinProvider
);
```

---

## 3. Configure Garden core  

Initialize the **Garden** instance with the required components.  

```typescript
import { Garden } from "@gardenfi/core";

const garden = new Garden({
  orderbookURl: orderBookApi,
  secretManager,
  quote,
  auth,
  wallets: {
    evmWallet: ethereumWalletClient,
    btcWallet,
  },
});
```

Your setup is now ready to execute swaps and manage orders!
