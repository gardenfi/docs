---
id: quickstart
title: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InstallAlert from "./\_install-alert.mdx";

## 1. Installation

<InstallAlert/>

<Tabs>  

<TabItem value="npm" label="npm">  

```bash
npm install @gardenfi/core @gardenfi/utils
```  

</TabItem>  

<TabItem value="yarn" label="yarn">  

```bash
yarn add @gardenfi/core @gardenfi/utils
```  

</TabItem>  

<TabItem value="pnpm" label="pnpm">  

```bash
pnpm add @gardenfi/core @gardenfi/utils
```  

</TabItem>  

</Tabs>  

**Additional dependencies**

<Tabs>  

<TabItem value="npm" label="npm">  

```bash
npm install viem @catalogfi/wallets
```  

</TabItem>  

<TabItem value="yarn" label="yarn">  

```bash
yarn add viem @catalogfi/wallets
```  

</TabItem>  

<TabItem value="pnpm" label="pnpm">  

```bash
pnpm add viem @catalogfi/wallets
```  

</TabItem>  

</Tabs>  

To use the Garden SDK, you’ll need to set up wallets, API clients, and initialize the core components. Follow the steps below:  

## 2. Initialize dependencies

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
const ORDERBOOK_API = https://orerbookv2.garden.finance/
const auth = new Siwe(new URL(ORDERBOOK_API), ethereumWalletClient, {
  store: new MemoryStorage(),
});

const QUOTE_API = https://pricev2.garden.finance/
const quote = new Quote(QUOTE_API);

const bitcoinProvider = new BitcoinProvider(
  BitcoinNetwork.Testnet,
  bitcoinProviderApi
);
```

---

## 3. Set up wallets and secret manager  

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

## 4. Configure Garden core  

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
