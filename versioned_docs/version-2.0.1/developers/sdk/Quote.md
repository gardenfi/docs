---
id: quote
---

# Quote  

The `Quote` allows you to fetch price details for swaps between supported assets. Here's how you can set it up and use it effectively:  

## Overview  

- **What it does**:  
  Retrieves price quotes for the desired asset pair.  
- **Key features**:  
  - **attested quotes**, which are cryptographically signed for enhanced trust and accuracy during execution.  

## Setup  

First, initialize the `Quote` service using the appropriate API endpoint:  

```tsx
import { Quote } from "@gardenfi/core";

const quoteApi = "https://price.garden.finance";
const quote = new Quote(quoteApi);
```

## Fetching a quote  

To fetch a quote, define your source and destination assets along with the send amount:  

```tsx
const orderPair = constructOrderpair(
  SupportedAssets.testnet.ethereum_sepolia_0x3c6a17b8cd92976d1d91e491c93c98cd81998265,
  SupportedAssets.testnet.bitcoin_testnet_primary
);

const sendAmount = "1000000"; // Amount in the smallest unit (e.g., satoshis for Bitcoin)

const quoteResult = await quote.getQuote(orderPair, +sendAmount);

if (quoteResult.error) {
  throw new Error(quoteResult.error);
}

const firstQuote = Object.entries(quoteResult.val.quotes)[0];
console.log("Strategy ID:", firstQuote[0]);
console.log("Quote Amount:", firstQuote[1]);
```

### Using attested quotes  

You can get attested quotes that come with cryptographic proof:  

```tsx
const attestedQuoteResult = await quote.getAttestedQuote(orderPair, +sendAmount);

if (attestedQuoteResult.error) {
  throw new Error(attestedQuoteResult.error);
}

console.log("Attested Quote:", attestedQuoteResult.val);
```

you can also use `isExactOut` param to handle exact out case;
```tsx

```

## Tips  

- Always validate the response for potential errors, especially on testnets.  
- If you're using our **React hooks**, the `getQuote` function is already abstracted for you—just pass in the necessary parameters and let the magic happen!