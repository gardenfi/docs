---
id: developers
---

# Garden Overview

Garden lets you integrate Bitcoin into your dApp in two flexible ways: through our API or SDK.  
Before exploring the developer section, make sure to review the [fundamentals](../home/fundamentals/introduction/Introduction.md).

Garden operates using [intents](../home/fundamentals/introduction/Intents.md), which define the parameters of a swap. These intents are then processed by the [auction house](../home/fundamentals/introduction/Auctions.md), where they are matched with a [solver](../home/fundamentals/introduction/Solvers.md) willing to fulfill the trade. The swap is completed using [atomic swaps](../home/fundamentals/introduction/AtomicSwaps.mdx) to securely bridge funds across chains.

---

## How a swap works  

**Intent creation:** The user specifies the swap details, including source and destination assets, amounts, secretHash and the unique intent parameters.

**Matching via auction house:** The intent is matched with a solver in the auction house, ensuring the trade can be fulfilled efficiently.  

**Atomic swap execution:** The swap leverages atomic swap protocols to securely transfer funds between chains without the need for trust.  

**Settlement:** Funds are redeemed or withdrawn on the destination chain, completing the process.  

With these components working in harmony, Garden ensures a seamless cross-chain experience for developers and users alike.

### Integrating BTC to cbBTC swap on Base:

<figure><img src="/assets/btc-cbbtc.png" alt=""/><figcaption></figcaption></figure>

1. Start by creating a 32-byte random secret. Calculate its SHA-256 hash (`secretHash`), which will serve as the key identifier for the swap.  

2. Use the `secretHash` to create an intent specifying Bitcoin as the source, cbBTC on Base as the destination, and the amount to swap.

3. Subscribe to the WebSocket. When the auction house matches the intent with a solver, you’ll receive a notification containing the match details, including a **Bitcoin script address**.
For additional security, calculate the script address locally using the intent and solver details.

4. Deposit the specified BTC amount to the script address.  

5. The solver will wait for the confirmation of the BTC deposit before proceeding. Once confirmed, cbBTC on Base will be deposited using the same `secretHash`.  

6. Monitor the WebSocket for a notification confirming the solver’s deposit of **cbBTC on Base**. Alternatively, verify this deposit on-chain if needed.

7. Use the **Gasless API** to finalize the swap by revealing the original secret on Base. This action unlocks the cbBTC for withdrawal, completing the settlement.  

8. Once the process is completed, the solver receives the Bitcoin deposit and your application can access the cbBTC on Base, ready for further use in your dApp.
