---
id: integrate
---

# Integrate with Garden API

:::note
If you get stuck during implementation, reach out in our [Townhall](https://discord.com/invite/kqMBgeAKAh)—our dev team is ready to help!
:::

This cookbook guides you through integrating Garden into your wallet backend, bridge aggregator, or infrastructure service using our API. You'll learn how to authenticate users, create and initiate cross-chain swaps, and track and redeem them on the destination chain. If you're unsure whether to use the SDK or APIs, see this [comparison](../Overview.md#choosing-between-sdk-and-api).

We'll demonstrate a complete swap flow from Bitcoin Testnet4 (tBTC) to Arbitrum Sepolia (WBTC), showing how to coordinate with Garden APIs at each step.

For a full reference implementation, see this [page](https://github.com/gardenfi/api-cookbook-demo)—a working terminal UI in Rust that demonstrates these steps in a real application.

## Authentication
Before placing or interacting with orders, your system must authenticate the user. Garden supports two authentication methods:

### Option 1: Direct SIWE authentication
Garden uses Sign-In with Ethereum (SIWE) to verify wallet ownership.

1. **Request a nonce**  
Generate a unique, single-use nonce as a challenge.

Endpoint:
```bash
POST /auth/siwe/challenges
```

Expected response:
```json
{
  "status": "Ok",
  "result": "a34f6521d29cb6f0febbef3c0799f1b8213f85162fa206a535e5e11424c87b43"
}
```

2. **Sign the nonce**  
The user signs the nonce with their EVM wallet, generating a structured SIWE message. This is done by creating a local signer instance (e.g., using 'PrivateKeySigner' from the Alloy crate in Rust), which uses the user's private key to sign the message. The signed message ensures:

- The nonce is unique and prevents replay attacks.
- The user's private key remains secure.

SIWE message format:
```bash
<domain> wants you to sign in with your Ethereum account:
<account_address>
Garden.fi
URI: <url>
Version: 1
Chain ID: <chain_id>
Nonce: <the unique nonce from the previous step>
Issued At: <current_time>
```

Example for testnet:
```bash
localhost:4361 wants you to sign in with your Ethereum account:
0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
Garden.fi
URI: http://localhost:4361
Version: 1
Chain ID: 11155111
Nonce: a34f6521d29cb6f0febbef3c0799f1b8213f85162fa206a535e5e11424c87b43
Issued At: 2025-04-09T07:29:20.203Z
```

3. **Verify the signed message**  
Send the signed message to obtain a JSON web token (JWT).

Endpoint:
```bash
POST /auth/siwe/tokens
```

Request:
```json
{
 "message": "<message_string>",
 "signature": "<hex_encoded_signature>",
 "nonce": "<unique_nonce_message>"
}
```

Expected response:
```json
{
    "status": "Ok",
    "result": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMHhlOTg5MmE4QTNENTk4MTREYjE0OTkxOEFEOWZGNDI4MmMyRDk5MUU4IiwiZXhwIjoxNzQ0MzYyMDIwfQ.iHiPUkeaNBkoUPhDQLqYkP6-6F3NtdmqrfozpafX8oM"
}
```

### Option 2: API key authentication
API keys offer a convenient way to authenticate if you prefer to manage authentication in-house or need persistent access without requiring users to sign messages repeatedly.

1. Visit Garden’s [SDK dashboard](https://dev.garden.finance/).
2. Authenticate using SIWE.
3. Create an application by providing:
   - Application name
   - (Optional) application icon
4. Generate an API key by specifying:
   - Key name
   - Expiration date

Include the API key in your request headers as "api-key" with the generated key as its value. This replaces JWT bearer tokens for authentication.

```ts
api-key: <your_api_key>
```

## Order lifecycle

This section outlines the swap lifecycle and how each step maps to specific [API](../api/GardenAPI.md) calls.

When a user requests to swap assets, start by retrieving a price quote for the order pair (source chain, source asset, destination chain, destination asset, and amount). After confirming the quote, the order is attested and validated by Garden's API, then created via the `/relayer/create-order` endpoint.

For a detailed breakdown of the [order lifecycle](../core/OrderLifecycle.md), including status transitions, see the order lifecycle. For a deeper understanding of the Garden protocol, read the [intent flow](../../home/fundamentals/introduction/Intents.md).

### Get supported pairs

The first step is to display all available options. Use the `/quote/strategies` endpoint to get all supported pairs from Garden. Each pair has a unique ‘id’.

Endpoint:
```bash
GET /quote/strategies
```

Example response:
```json
{
  "status": "Ok",
  "result": {
    "btyrasac": {
      "id": "btyrasac",
      "source_chain_address": "1db36714896afaee20c2cc817d170689870858b5204d3b5a94d217654e94b2fb",
      "dest_chain_address": "0x29f72597ca8a21F9D925AE9527ec5639bAFD5075",
      "source_chain": "bitcoin_testnet",
      "dest_chain": "arbitrum_sepolia",
      "source_asset": {
        "asset": "primary",
        "token_id": "bitcoin",
        "decimals": 8
      },
      "dest_asset": {
        "asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
        "token_id": "bitcoin",
        "decimals": 8
      },
      "makers": [],
      "min_amount": "10000",
      "max_amount": "100000",
      "min_source_timelock": 12,
      "min_source_confirmations": 1,
      "min_price": 1.0001,
      "fee": 30
    },
    ... other supported pairs ...
  }
}
```
Define the `order pair` based on user selection in this format:
`source_chain:source_asset::destination_chain:destination_asset`

For our tBTC to WBTC (Arbitrum) example:
 ```ts
bitcoin_testnet:primary::arbitrum_sepolia:0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA
```

### Get quote

Request solver quotes for the expected output (or required input) amount using the selected `order pair` and specifying the `amount` in sats.

Endpoint:
```bash
GET /quote/?order_pair=<source_chain:source_asset::dest_chain::dest_asset>&amount=<desired_in_amount>&exact_out=boolean
```
`exact_out` lets you choose whether to specify what you want to spend or what you want to receive.

- exact_out=false: Specify input amount (e.g., send 0.01 BTC → get X WBTC)
- exact_out=true: Specify desired output (e.g., get 10 WBTC → send X BTC)

For our tBTC to WBTC (Arbitrum) example:

```ts
price?order_pair=bitcoin_testnet:primary::arbitrum_sepolia:0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA&amount=10000&exact_out=false
```

Example response:
```json
{
  "status": "Ok",
  "result": {
    "quotes": {
      "btyrasac": "9970"
    },
    "input_token_price": 77328.3666062084,
    "output_token_price": 77328.3666062084
  }
}
```
The response provides asset prices (in USD) from market oracles and solver quotes for the specified amount. If `exact_out` is `false`, the quote reflects the output (receive) amount for the user.

:::tip
After receiving a quote, you can proceed with either a [**Garden-managed secret**](#garden-managed-secret) or a [**Developer-managed secret**](#developer-managed-secret) flow. Choose the approach that best fits your integration needs. Both options are described below.
:::

## Garden managed secret
### Create order

When ready, create an order by sending a request to `/relayer/create-order`. This creates the order in Garden's orderbook. The response includes the unique `order ID` for tracking and managing the order.

Endpoint:
```bash
POST /relayer/create-order
```

Example request for tBTC to WBTC:

```json
{
  "source_chain": "bitcoin_testnet",
  "destination_chain": "arbitrum_sepolia",
  "source_asset": "primary",
  "destination_asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
  "initiator_source_address": "", // empty for bitcoin
  "initiator_destination_address": "0x753Cf575A0224c590ACF3587031E88b238261f7a",
  "source_amount": "10000",
  "destination_amount": "9970",
  "nonce": "1743337081630",
  "secret_hash": "" , // managed by Garden if not provided
  "additional_data": {
    "strategy_id": "btyrasac",
    "bitcoin_optional_recipient": "tb1qz0pnh98kfynptg9dtkj06f7sqnlxl3dxnmnjw4",
    "input_token_price": 81945.33486018311,
    "output_token_price": 81945.33486018311,
    "deadline": 1744265309
  }
}
```
Expected response:
```ts
{
  "result": <order-id>,
  "status":   "Ok",
}
```

### Get order data

To retrieve order data for an order ID:

Endpoint:
```bash
GET /orders/id/:id/
```

Expected response:
```json
{
  "status": "Ok",
  "result": {
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "deleted_at": null,
    "source_swap": {
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": null,
      "swap_id": "<swap_id_hash>", /* the htlc script address */
      "chain": "<chain_name>",
      "asset": "<asset_type>",
      "initiator": "<initiator_address>",
      "redeemer": "<redeemer_address>",
      "timelock": "<timelock_value>",
      "filled_amount": "<amount>",
      "amount": "<amount>",
      "secret_hash": "<secret_hash>",
      "secret": "",
      "initiate_tx_hash": "<transaction_hash>",
      "redeem_tx_hash": "",
      "refund_tx_hash": "<transaction_hash>",
      "initiate_block_number": "<block_number>",
      "redeem_block_number": "0",
      "refund_block_number": "<block_number>",
      "required_confirmations": "<number>",
      "current_confirmations": "<number>"
    },
    "destination_swap": {
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": null,
      "swap_id": "<swap_id_hash>", /* the htlc script address */
      "chain": "<chain_name>",
      "asset": "<asset_type>",
      "initiator": "<initiator_address>",
      "redeemer": "<redeemer_address>",
      "timelock": "<timelock_value>",
      "filled_amount": "<amount>",
      "amount": "<amount>",
      "secret_hash": "<secret_hash>",
      "secret": "",
      "initiate_tx_hash": "<transaction_hash>",
      "redeem_tx_hash": "",
      "refund_tx_hash": "<transaction_hash>",
      "initiate_block_number": "<block_number>",
      "redeem_block_number": "0",
      "refund_block_number": "<block_number>",
      "required_confirmations": "<number>",
      "current_confirmations": "<number>"
    },
    "create_order": {
      
    }
  }
}
```
If the order is not matched, this endpoint returns null.

### Initiate order
The order initiation process begins when the user initiates the swap on the source chain. For EVM-based chains, use the `/relayer/initiate` endpoint. The process differs for Bitcoin, which uses scripts.

**Initiation on EVM:**

To initiate, the user must sign the HTLC initiation message using their wallet provider's EIP-712 typed data signing method. This signature authorizes the HTLC contract to lock tokens in escrow with the specified parameters. The signature is used for contract initialization.

HTLC initiation message format: 

```ts
{
    address redeemer;
    uint256 timelock;
    uint256 amount;
    bytes32 secretHash;
}
```

Endpoint:
```bash
POST /relayer/initiate
```

Example request:

```json
{
    "order_id" : "<order_id>",
    "signature": "<signature_hex_string>",
    "perform_on": "Source"
}
```

On success, the response contains the transaction hash of the initiate event.

Expected response:

```json
{
  "result": "<tx_id>",
  "status": "Ok"
}
```

### Redemption

Redemption is handled automatically for the user. No manual action is required to redeem tokens.

You now have everything needed to integrate Garden swaps into your application using our APIs.

## Developer managed secret

### Generating Secret and Secret Hash

The secret hash is a SHA-256 hash of a randomly generated secret in the Garden environment.

You can generate your own secret.

The **secret** must be **hashed using the SHA-256 algorithm**. This hash is used for initiating and redeeming swaps.

### Create order

When ready, create an order by sending a request to `/relayer/create-order`. This creates the order in Garden's orderbook. The response includes the unique `order ID` for tracking and managing the order.

Endpoint:
```bash
POST /relayer/create-order
```

Example request for tBTC to WBTC:

```json
{
  "source_chain": "bitcoin_testnet",
  "destination_chain": "arbitrum_sepolia",
  "source_asset": "primary",
  "destination_asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
  "initiator_source_address": "", // empty for bitcoin
  "initiator_destination_address": "0x753Cf575A0224c590ACF3587031E88b238261f7a",
  "source_amount": "10000",
  "destination_amount": "9970",
  "nonce": "1743337081630",
  "secret_hash": "" , // managed by Garden if not provided
  "additional_data": {
    "strategy_id": "btyrasac",
    "bitcoin_optional_recipient": "tb1qz0pnh98kfynptg9dtkj06f7sqnlxl3dxnmnjw4",
    "input_token_price": 81945.33486018311,
    "output_token_price": 81945.33486018311,
    "deadline": 1744265309
  }
}
```
Expected response:
```ts
{
  "result": <order-id>,
  "status":   "Ok",
}
```

### Get order data

To retrieve order data for an order ID:

Endpoint:
```bash
GET /orders/id/:id/
```

Expected response:
```json
{
  "status": "Ok",
  "result": {
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "deleted_at": null,
    "source_swap": {
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": null,
      "swap_id": "<swap_id_hash>", /* the htlc script address */
      "chain": "<chain_name>",
      "asset": "<asset_type>",
      "initiator": "<initiator_address>",
      "redeemer": "<redeemer_address>",
      "timelock": "<timelock_value>",
      "filled_amount": "<amount>",
      "amount": "<amount>",
      "secret_hash": "<secret_hash>",
      "secret": "",
      "initiate_tx_hash": "<transaction_hash>",
      "redeem_tx_hash": "",
      "refund_tx_hash": "<transaction_hash>",
      "initiate_block_number": "<block_number>",
      "redeem_block_number": "0",
      "refund_block_number": "<block_number>",
      "required_confirmations": "<number>",
      "current_confirmations": "<number>"
    },
    "destination_swap": {
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": null,
      "swap_id": "<swap_id_hash>", /* the htlc script address */
      "chain": "<chain_name>",
      "asset": "<asset_type>",
      "initiator": "<initiator_address>",
      "redeemer": "<redeemer_address>",
      "timelock": "<timelock_value>",
      "filled_amount": "<amount>",
      "amount": "<amount>",
      "secret_hash": "<secret_hash>",
      "secret": "",
      "initiate_tx_hash": "<transaction_hash>",
      "redeem_tx_hash": "",
      "refund_tx_hash": "<transaction_hash>",
      "initiate_block_number": "<block_number>",
      "redeem_block_number": "0",
      "refund_block_number": "<block_number>",
      "required_confirmations": "<number>",
      "current_confirmations": "<number>"
    },
    "create_order": {
      
    }
  }
}
```
If the order is not matched, this endpoint returns null.

### Initiate order
The order initiation process begins when the user initiates the swap on the source chain. For EVM-based chains, use the `/relayer/initiate` endpoint. The process differs for Bitcoin, which uses scripts.

**Initiation on EVM:**

To initiate, the user must sign the HTLC initiation message using their wallet provider's EIP-712 typed data signing method. This signature authorizes the HTLC contract to lock tokens in escrow with the specified parameters. The signature is used for contract initialization.

HTLC initiation message format: 

```ts
{
    address redeemer;
    uint256 timelock;
    uint256 amount;
    bytes32 secretHash;
}
```

Endpoint:
```bash
POST /relayer/initiate
```

Example request:

```json
{
    "order_id" : "<order_id>",
    "signature": "<signature_hex_string>",
    "perform_on": "Source"
}
```

On success, the response contains the transaction hash of the initiate event.

Expected response:

```json
{
  "result": "<tx_id>",
  "status": "Ok"
}
```

**Initiation on Bitcoin:**

On Bitcoin, there are two ways to initiate:

1. Fund the HTLC script address directly using a Bitcoin wallet. 
2. Construct a transaction paying the required amount to the HTLC script address and broadcast it.

The HTLC script address is the swap ID of the source chain swap, found in the `source_swap` field in the `/orders/id/:id` response.

### Bitcoin Instant-Refund

Instant refund is triggered automatically in these scenarios:

1. **Order Expiry**: User initiates swap → Filler fills → User fails to redeem before expiry → Instant refund triggered
2. **Partial Fill**: User initiates swap → Filler confirms partial fill → Remaining unfilled portion triggers instant refund

To enable instant refund when the source swap is bitcoin, make the following API calls.

#### a. Generate Signature Hashes

**Endpoint**: `POST /relayer/bitcoin/instant-refund-hash`

Generates the transaction digest(s) that must be signed to enable instant refund.

**Request Body**:

```json
{
  "order_id": "<order_id>"
}
```

**Response**:

```json
{
  "sighashes": [
    "<hex_encoded_sighash_to_sign>"
  ]
}
```

**Requirements**:

- Sign each sighash using **Schnorr signature** with **SIGHASH_SINGLE | ANYONECANPAY**

#### b. Submit Instant Refund Transaction

**Endpoint**: `POST relayer/bitcoin/instant-refund`

Accepts user signatures and stores the prepared SACP (Single + AnyoneCanPay) transaction for future use.

**Request Body**:

```json
{
  "order_id": "<order_id>",
  "signatures": [
    "<schnorr_signature_in_hex>"
  ]
}
```

**Response**:

```json
{
  "status": "ok",
  "result": "<transaction_hex>"
}
```

**Validation**:

- Signatures are verified against generated sighashes
- Public key must match swap initiator
- Schnorr signature format with correct SIGHASH type enforced

With this, bitcoin swaps can be refunded instantly to the user if the order expires or is partially filled.

### Redeem asset

The redemption step finalizes the swap, allowing the user to claim assets on the destination chain after the order is successfully initiated and confirmed.

**Prerequisites:**

- The swap must be complete on the `source chain`, and assets must be ready on the `destination chain`.
- The destination chain must show an `initiate_tx_hash` under `destination_swap`.
- The `secret` generated during order creation must be revealed.

**Retrieving order details:**

Poll the `/orders/id/:id` endpoint to fetch the latest order status. Once `destination_swap.initiate_tx_hash` is present, the destination HTLC is funded and ready for redemption.

Redemption on **EVM** chain:

Use the `/relayer/redeem` endpoint to submit the redemption request, including the secret that proves the user can claim the funds.

Endpoint:
```bash
POST /relayer/redeem
```

Example request:

```json
{
    "order_id" : "<order_id>",
    "secret": "<secret>",
    "perform_on": "Destination"
}
```

Expected response:
```json
{
  status: "Ok",
  result: "<redeem_transaction_hash>"
}
```

**Redemption on Bitcoin:**

For Bitcoin-based swaps, redemption involves constructing and signing a transaction with the appropriate witness data.

Option 1: The HTLC on Bitcoin is constructed using the `destination_swap` details from `/orders/id/:id`.

To redeem:
- Use the secret from order creation.
- Generate the required witness data:
  - Secret value
  - Redeem leaf bytes
  - Control block bytes
- Construct and sign the Bitcoin transaction.
- Submit the transaction to the Bitcoin network.

Option 2: If you prefer not to handle Bitcoin fees, you can use Garden’s relayer service for gasless redemption by sending the transaction hex bytes in the specified format.

Endpoint:
```bash
POST /bitcoin/redeem
```

Example request:

```json
{
  "order_id": "<order_id>",
  "redeem_tx_bytes": "<transaction_hex_of_the_constructed_redeem_txn>"
}
```
Expected response:
```json
{
  status: "Ok",
  result: "<redeem_transaction_hash>"
}
```

You have now everything needed to integrate Garden swaps into your application using our APIs...