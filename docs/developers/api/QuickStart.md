---
id: quickstart
---

# Quickstart

Garden’s API allows you to integrate our trustless Bitcoin bridge with flexible levels of control. This guide walks through the fastest way to set up a working integration, For advanced use cases and customization options, refer to our [Cookbook](../cookbook/APITerminalApp.md). If you are new to atomic swaps, read our [intent flow](../../home/fundamentals/how-it-works/IntentFlow.md) to get started.

## High level flow

1. Fetch a quote for an asset pair and amount.

2. Authenticate using an API key or wallet signature.

3. Create the order with selected quote.

4. Initiate the order by sending funds to the HTLC.
  
5. Track order status to confirm completion.

## Fetch quote
To get started, fetch a quote using the `/quote` endpoint. This returns one or more available strategies from Garden's solver network, along with corresponding rates. Choose a strategy and save its `strategy_id` for order creation.

```bash
curl -X 'GET' \
 'https://api.garden.finance/quote/?order_pair=<source_chain>:<source_asset>::<destination_chain>:<destination_asset>&amount=<amount>&exact_out=<true/false>&affiliate_fee=<affiliate_fee_in_bps>' \
  -H 'accept: application/json'
```

**Parameters:**

- `order_pair`: Build the order pair in the above format using chain and `atomicSwapAddress` of the required assets from the `/info` endpoint.
- `amount`: In smallest units based on the `exact_out` flag.
- `exact_out`: Indicates whether the quote should be fetched for an exact output amount. If set to `true`, the quote will calculate the required input amount to achieve the specified output. If set to `false`, the quote will calculate the expected output for a given input amount.
- `affiliate_fee`:The total affiliate fee in basis points (bps), more details [here](../AffiliateFee.md).

## Authenticate

Authentication is required before you can interact with the Garden protocol.

**Option 1: API key (recommended)**

This is the simplest method. Contact the Garden team in the [townhall](https://discord.gg/dZwSjh9922) to request an API key.  Once you receive it, include it in the request headers using "api-key" as the key and your API key as the value for all authenticated requests.

**Option 2: Wallet-based auth (SIWE)**

You can also authenticate via Sign-In With Ethereum (SIWE). This flow returns a JWT for use in subsequent requests. Refer to [Authentication](../sdk/Authentication.md) for more details.

## Create order

With authentication in place and a quote selected, you can now create the order. Include all order details, along with the `strategy_id` from the previous step.


```bash
curl -X 'POST' \
  'https://api.garden.finance/relayer/create-order' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <authorization_token>' \ # in the case of SIWE
  -H 'api-key: <API-key>' \ # in the case of API keys
  -d '{
    "source_chain": "<source_chain>",
    "source_asset": "<source_asset>",
    "source_amount": "<source_amount>",
    "initiator_source_address": "<initiator_source_address>",
    "destination_chain": "<destination_chain>",
    "destination_asset": "<destination_asset>",
    "destination_amount": "<destination_amount>",
    "initiator_destination_address": "<initiator_destination_address>",
    "nonce": "<nonce>",
    "affiliate_fees": [
      {
        "address": "<affiliate_address_1>",
        "chain": "<chain_1>",
        "asset": "<asset_1>",
        "fee": <affiliate_fee_1>
      },
      {
        "address": "<affiliate_address_2>",
        "chain": "<chain_2>",
        "asset": "<asset_2>",
        "fee": <affiliate_fee_2>
      },
      ...
    ],
    "additional_data": {
      "strategy_id": "<strategy_id>",
      "bitcoin_optional_recipient": "<user_bitcoin_address>",
    }
  }'
```
Your affiliate fee can be split and sent to multiple addresses as shown above. You can define `nonce` as any random string that is unique to the order.

For **non-Bitcoin** swaps, provide both `initiator_source_address` and `initiator_destination_address`.

For **Bitcoin** swaps:
 - If Bitcoin is the source chain, set **initiator_source_address** to **null**.
 - If Bitcoin is the destination chain, set **initiator_destination_address** to **null**.

The order is considered successfully created and matched if you receive a valid order object response from the [`getOrder`](#get-order) endpoint.

## Initiate order

Once matched, the user must initiate the swap. The process differs slightly depending on the source chain. For **Bitcoin**, the user must send the exact amount of funds to the `order.source_swap.swap_id` address.

For **EVM** chains, initiation can be done directly via [smart contract](../contracts/HTLCEVM.md) or Garden's API.

To initiate, the user must sign the HTLC initiation message using their wallet provider's EIP-712 typed data signing method. This signature authorizes the HTLC contract to lock tokens in escrow with the specified parameters. The signature is used for contract initialization.


1. The user must call the `eip712domain()` function on the HTLC contract that returns the eip712 domain data.
  Sample EIP712domain data:

```
  [ eip712Domain method Response ]
  name                string    :  HTLC
  version             string    :  1
  chainId             uint256   :  42161
  verifyingContract   address   :  0x6b6303fAb8eC7232b4f2a7b9fa58E5216F608fcb
```

2. The initiation message must be in the following format:

HTLC initiation message format: 

```ts
{
    address redeemer;
    uint256 timelock;
    uint256 amount;
    bytes32 secretHash;
}
```

3. The message, along with the domain data, must be signed with the wallet, and the signature is sent with the initiate request to the relayer.


```bash
curl -X 'POST' \
  'https://api.garden.finance/relayer/initiate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <authorization_token>' \
  -d '{
  "order_id": "<order_id>",
  "signature": "<signature>",
  "perform_on": "Source"
}'
```

On success, the response contains the transaction hash of the initiate event.

Expected response:

```json
{
  "result": "<tx_id>",
  "status": "Ok"
}
```

## Get order


Use the `orders` endpoint to track the order status.
```bash
curl -X 'GET' \
  'https://api.garden.finance/orders/id/<order_id>
```
If `order.destination_swap.redeem_tx_hash` is populated with a tx hash, the swap has completed successfully and the destination asset has been redeemed on the user’s behalf.

