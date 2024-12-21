---
id: auto-redeems
---

# Auto Redeems & Refunds

Auto Redeems provide a seamless way to handle the redemption of funds on the destination chain without developers having to manually intervene. The system is designed to work autonomously, relying on the GardenProvider and our relayer to ensure that the redemption process is handled securely and efficiently.

---

## How Auto Redeems Work

1. **Relayer integration**:  
   Once a swap has completed, the redemption of funds on the destination chain (only Ethereum) is handled by the relayer. This process is fully automated, so developers don’t need to worry about manually triggering the redeem function.

2. **Connection via GardenProvider**:  
   When using React hooks, GardenProvider ensures a seamless connection between the client and the relayer, ensuring that the redemption happens smoothly as soon as the client is active.

3. **Client activity dependency**:  
   For the redemption to happen, the client must be online and active. If the client is inactive at the time of the redemption, the process resumes as soon as the client comes back online.

---

## Working under the hood

The `GardenProvider` will periodically check the `pendingOrders` endpoint to retrieve a list of orders that require redemption on the destination chain. It will then execute the appropriate redemption method—either `btcRedeem` for Bitcoin-based orders or `evmRedeem` for Ethereum-based orders—based on the chain type of each order. Additionally, our relayer will handle all associated fees, so users do not need to worry about them.

```ts
private async evmRedeem(order: MatchedOrder, secret: string): Promise<void>;
```

- **Parameters:**
  - `order`: `MatchedOrder` - The order object that contains all the necessary information for the redeem operation.
  - `secret`: `string` - The secret used to perform the redeem operation on the Ethereum chain.

- **Returns:**
  - `Promise<void>` - Resolves when the redeem operation has been executed, or if an error occurs.

---

### `btcRedeem`

```ts
private async btcRedeem(wallet: IBitcoinWallet, order: MatchedOrder, secret: string): Promise<void>;
```

- **Parameters:**
  - `wallet`: `IBitcoinWallet` - The Bitcoin wallet to be used for redeeming the funds on the Bitcoin chain.
  - `order`: `MatchedOrder` - The order object that contains information about the redemption.
  - `secret`: `string` - The secret used to redeem the funds on the Bitcoin chain.

- **Returns:**
  - `Promise<void>` - Resolves when the redeem operation has been executed, or if an error occurs.