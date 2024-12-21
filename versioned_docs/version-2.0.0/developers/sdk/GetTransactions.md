---
id: get-transactions
---

# Get transactions  

Tracking the status of swaps is crucial for providing users with real-time updates about their transactions. The Garden SDK provides tools to monitor and fetch details of orders efficiently.  

## Fetching transactions  

You can fetch the transaction history and statuses directly using the `orderBook` instance.  

### Implementation  

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { orderBook } = useGarden();

const fetchOrders = async () => {
  try {
    const res = await orderBook.fetchOrders(true, false, { per_page: 10 });
    console.log("Fetched Orders:", res);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

fetchOrders();
```

### Parameters  

- **isActive**: Filters orders based on their active status.  
  - `true`: Fetch active orders.  
  - `false`: Fetch completed or inactive orders.  
- **isPending**: Filters orders based on their pending status.  
  - `true`: Fetch pending orders.  
  - `false`: Fetch non-pending orders.  
- **options**: Additional options for pagination or filters.  
  - `per_page`: Number of transactions to fetch per page.  

## Monitoring status  

To provide real-time updates for swaps, you can listen for order events like errors or successes.  

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { garden } = useGarden();

garden.on("error", (order, error) => {
  console.error("Order Error:", order.create_order.create_id, error);
});

garden.on("success", (order, action, txHash) => {
  console.log("Transaction Success! 🎉", txHash);
  console.log(
    "View Bitcoin Transaction: https://mempool.space/testnet4/tx/" + txHash
  );
});
```

### Event types  

- **error**: Triggered when a transaction encounters an issue.  
- **success**: Triggered when a transaction is successfully completed.  

## Best practices  

- **Poll regularly**: For long-running transactions, poll the orderBook periodically to provide accurate updates.  
- **User notifications**: Notify users when their transactions are pending, completed, or require attention.  
- **Leverage react hooks**: Using our **React hooks**, tracking transactions becomes seamless and integrated into your components.  

:::info  
For advanced use cases and configuration options, refer to the [Cookbook](../cookbook/Cookbook.md).  
:::
