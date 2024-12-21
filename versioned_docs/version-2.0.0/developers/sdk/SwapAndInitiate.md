---
id: swap-and-initiate
---

# Swap and Initiate  

The `swapAndInitiate` function is at the core of executing swaps in the Garden SDK. This process involves creating a swap order, initializing the HTLC (Hashed Timelock Contract), and starting the swap on the source chain.

## Overview  

- **What it does**:  
  Combines quoting, HTLC initialization, and order creation in one seamless action.  
- **Key features**:  
  - Automatically calculates the swap parameters based on the selected quote.  
  - Manages HTLC setup and execution for secure atomic swaps.  
  - Abstracts complex logic for a smooth integration.  

## Setup  

First, import the required functions from the Garden SDK:  

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { swapAndInitiate, getQuote, initializeSecretManager } = useGarden();
```

## How to use  

### 1. Fetch a quote  

Fetch the quote details using the `getQuote` function:  

```tsx
const quote = await getQuote({
  fromAsset: inputToken,
  toAsset: outputToken,
  amount: sendAmount,
});

const [_strategy, quoteAmount] = Object.entries(quote.val.quotes)[0];
```

### 2. Initialize the secret manager  

Ensure that the Secret Manager is ready for managing the atomic swap secrets:  

```tsx
const secretManager = await initializeSecretManager();

if (!secretManager.ok || !secretManager.val.getMasterPrivKey()) {
  throw new Error("Secret Manager initialization failed.");
}
```

### 3. Execute the swap  

Use the `swapAndInitiate` function to create and execute the swap:  

```tsx
const res = await swapAndInitiate({
  fromAsset: inputToken,
  toAsset: outputToken,
  sendAmount: sendAmount.toString(),
  receiveAmount: quoteAmount.toString(),
  additionalData: {
    btcAddress,
    strategyId: _strategy,
  },
});

if (res.error) {
  throw new Error(res.error);
}

console.log("Swap initiated successfully!", res);
```

## Heads-up  

:::note  
The user must remain online during the swap process. If they leave, the transaction will pause and resume once they're back online.  
:::

## Tips  

- **Error handling**: Always validate responses and handle errors gracefully to ensure a smooth user experience.  
- **React hooks**: If you're using our **React hooks**, this process is already streamlined for you. Just call `swapAndInitiate` with the necessary parameters and let it handle the rest.
