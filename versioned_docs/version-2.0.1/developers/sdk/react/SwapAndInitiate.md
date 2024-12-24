---
id: swap-and-initiate
---

# Swap and initiate

The `swapAndInitiate` method in the React Hooks section is a crucial function that simplifies the process of initiating an atomic swap. It combines multiple steps, including order creation, and initiating the transaction on the source chain, all while ensuring secure handling of secrets through the Secret Manager.

## Initiate

### EVM chains

If the initiation fails on EVM chains (e.g., due to insufficient gas or amount), developers can use the `evmInitiate` function to retry the initiation.

```ts
evmInitiate?: (order: MatchedOrder) => AsyncResult<MatchedOrder, string>;
```

### Bitcoin as the source chain

For Bitcoin to Any Asset swaps (BTC -> X), users must manually send funds to the generated bitcoin address , which is derived as `order.source_swap.swap_id`.
