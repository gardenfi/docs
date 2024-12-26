---
id: usegarden-hook
---

# useGarden

The `useGarden` hook is a comprehensive, pre-packaged React hook that simplifies the integration of Garden SDK into your dApp. It encapsulates the functionality of both `useOrderbook` and `useSecretManager` while exposing a unified API to handle all core interactions, from order management to secret handling.

---

## Properties and methods

| **Property/Method**       | **Description**                                                                                                                                               | **Type**                                                                 |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **orderBookUrl**           | The URL of the orderbook service to be used.                                                                                                                  | `string`                                                                 |
| **initializeSecretManager**| Initializes the Secret Manager, essential for executing orders. Returns an asynchronous result wrapping the Secret Manager instance or an error message.     | `() => AsyncResult<SecretManager, string>`                               |
| **orderBook**              | The current instance of the orderbook service.                                                                                                                | `IOrderbook | undefined`                                                 |
| **swapAndInitiate**        | Creates an order, waits for it to match, and initiates it if the source chain is EVM. Returns the order's ID or an error message.                             | `(params: SwapParams) => AsyncResult<MatchedOrder, string>`              |
| **pendingOrders**          | An array of pending orders for the user. Includes orders awaiting initiation, redemption, or refund.                                                          | `OrderWithStatus[]`                                                     |
| **getQuote**               | Fetches a quote for the provided parameters, including USD values of the assets. Returns the quote details or an error message.                              | `(params: QuoteParams) => AsyncResult<QuoteResponse, string>`            |
| **secretManager**          | The current instance of the Secret Manager, responsible for securely managing secrets.                                                                        | `ISecretManager`                                                        |
| **garden**                 | An instance of the Garden SDK core, offering advanced functionality.                                                                                         | `IGardenJS`                                                              |
| **evmInitiate**            | Used to manually initiate an order on an EVM chain, especially if initiation fails during `swapAndInitiate`. Returns the initiated order or an error message. | `(order: MatchedOrder) => AsyncResult<MatchedOrder, string>`             |
| **isExecuting**            | Indicates whether any orders are currently being executed.                                                                                                   | `boolean`                                                                |
| **quote**                  | The quote instance for programmatically fetching swap price details.                                                                                         | `IQuote`                                                                 |

---

## Summary

`useGarden` consolidates the functionality of `useOrderbook` and `useSecretManager` while exposing additional utilities for swaps, quotes, and order management. It streamlines the integration process, reducing boilerplate code and ensuring a seamless user experience with the Garden SDK.