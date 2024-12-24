---
id: get-transactions
---

# Get transactions  

Tracking the status of swaps is crucial for providing users with real-time updates about their transactions. The Garden SDK provides tools to monitor and fetch details of orders efficiently.

You can fetch the transaction history and statuses directly using the `orderBook` instance.

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

- **isActive**: Filters orders based on their active status.  
  - `true`: Fetch active orders.  
  - `false`: Fetch completed or inactive orders.  
- **isPending**: Filters orders based on their pending status.  
  - `true`: Fetch pending orders.  
  - `false`: Fetch non-pending orders.  
- **options**: Additional options for pagination or filters.  
  - `per_page`: Number of transactions to fetch per page.
  