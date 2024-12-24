---
id: redeem-and-refund
---

# Redeem and refund  

Redeem and refund manage the completion or recovery of funds on the destination chain based on the state of the swap.  

## Redeem

Redeeming a swap finalizes the transaction on the destination chain, allowing the user to claim their funds.  

### How it works  

- **HTLC completion**: The secret generated during the initiation phase is used to unlock the HTLC and complete the transaction.  
- **Funds transfer**: The redeemed funds are sent to the specified wallet on the destination chain.  

### Implementation  

Here's how to handle a redeem operation:  

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { redeem } = useGarden();

const redeemResult = await redeem({
  orderId: "your-order-id",
  btcAddress: "destination-bitcoin-address",
});

if (redeemResult.error) {
  throw new Error(redeemResult.error);
}

console.log("Redeem successful:", redeemResult);
```

## Refund

Refunds allow users to recover their funds if a swap fails or the time lock expires.  

### How It Works  

- **HTLC Expiry**: Refunds become available after the time lock in the HTLC expires without a successful redeem.  
- **Funds Recovery**: The original funds are returned to the user on the source chain.  

Here's how to handle a refund operation:  

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { refund } = useGarden();

const refundResult = await refund({
  orderId: "your-order-id",
});

if (refundResult.error) {
  throw new Error(refundResult.error);
}

console.log("Refund successful:", refundResult);
```

:::info  
For detailed examples and troubleshooting tips, refer to the [Cookbook](../cookbook/Cookbook.md) or reach out to us.  
:::
