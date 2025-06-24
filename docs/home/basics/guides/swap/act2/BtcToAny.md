---
id: btc-to-any
---

# Swap Bitcoin to any asset

Bridge Bitcoin to any asset on Garden by following these steps.

1. Open Garden's swap interface and connect both your **EVM wallet** and **Bitcoin wallet**.

![step 1](../../../../images/swap/btc-to-any-1.png)

2. Choose **Bitcoin (BTC)** as the **Send** asset and your desired asset and chain in **Receive** (e.g., cbBTC on Base).

3. Input the amount you wish to send or receive and hit the **Swap** button.

![step 3](../../../../images/swap/btc-to-any-2.png)

4. You’ll first be prompted to approve the transaction in your EVM wallet, then in your Bitcoin wallet to approve and send the Bitcoin.

![step 4](../../../../images/swap/btc-to-any-3.png)

5. Keep the browser open while the swap is in progress. You’ll receive a notification once it’s successful.

![step 5](../../../../images/swap/btc-to-any-4.png)

For subsequent swaps during an app session, you only need to sign once from the **Send** wallet.

You can bridge Bitcoin with just your EVM wallet connected, and the process is mostly the same. The key differences are: after hitting the **Swap** button, you must manually copy the **Deposit address** and send the exact Bitcoin amount from your Bitcoin wallet. Additionally, you need to provide a **Bitcoin Recovery address** to ensure refunds if a solver isn’t matched.

1. Enter your Bitcoin refund address manually. This is the address where your Bitcoin will be refunded in the case of failure, so make sure to enter it correctly.

   ![step 1](../../../../images/swap/swap_screen_without_btc_connection.png)

2. After creating the swap order, you’ll see a Bitcoin destination address on the screen. To initiate the swap, you must send the exact amount of Bitcoin from your wallet to this address. Once the funds are received, the swap will begin automatically.

   ![step 2](../../../../images/swap/swap_in_awaiting_deposit_btc_manual.png)