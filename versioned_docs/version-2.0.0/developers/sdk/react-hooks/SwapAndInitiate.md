---
id: swap-and-initiate
---

# Swap & Initiate

The `swapAndInitiate` method in the React Hooks section is a crucial function that simplifies the process of initiating an atomic swap. It combines multiple steps, including order creation, and initiating the transaction on the source chain, all while ensuring secure handling of secrets through the Secret Manager.

---

## Functionality

### Key operations:
1. **Fetching Quotes**:
   `getQuote` is used to retrieve price details from both the `/quote` and `/attested-quote` endpoints simultaneously. This ensures cryptographically secured quote on chain.

2. **Secret Manager Validation**:  
   Before initiating a swap, the availability of the `secretManager` is checked. This ensures that the atomic swap can be securely facilitated.  
   - The `secretManager` is responsible for handling secrets.  
   - GardenProvider manages the `secretManager`, so developers don’t need to worry about its lifecycle or maintenance.

3. **Order Creation and Source Chain Initiation**:  
   After fetching the quote and validating the `secretManager`, `swapAndInitiate` creates the order and initiates the transaction on the source chain (e.g., EVM or Bitcoin).

---

## Retry mechanism

### EVM chains:  
If the initiation fails on EVM chains (e.g., due to insufficient gas or amount), developers can use the `evmInitiate` function to retry the initiation.  
```ts
evmInitiate?: (order: MatchedOrder) => AsyncResult<MatchedOrder, string>;
```

### Bitcoin as the source chain:  
For Bitcoin to Any Asset swaps (BTC -> X), users must manually send funds to the generated bitcoin address , which is derived as `order.source_swap.swap_id`.

---

## Advantages
- **Streamlined Process**: Combines quote retrieval, order creation, and initiation in one step.
- **Developer-Friendly**: Handles complex secret management internally via GardenProvider.
- **Robustness**: Includes fallback mechanisms (`evmInitiate`) to handle failed initiations.

---

## Summary
The `swapAndInitiate` function is designed to simplify the swap process while providing developers with the flexibility to handle edge cases like retrying failed initiations or managing Bitcoin-based orders. Its integration with the Secret Manager ensures security and efficiency throughout the swap lifecycle.