---
id: quickstart
---

# Quickstart

:::note  
Users can authenticate using Garden's `Auth` endpoints or the Garden `Dev Dashboard`.
:::

## 1. Authentication

### Nonce

Fetch a unique singe time challange from `Garden`.

```bash
curl -X 'GET' \
  'https://orderbook.garden.finance/auth/nonce' \
  -H 'accept: application/json'
```

### Verify

Sign the nonce and verify with `Garden` for `authentication`.

```bash
curl -X 'POST' \
  'https://orderbook.garden.finance/auth/verify' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "message": "beta.garden.finance wants you to sign in with your Ethereum account:\n0xDda1.........007394611D789EF789a9Aae5CF5\n\nGarden.fi\n\nURI: https://beta.garden.finance\nVersion: 1\nChain ID: 11155111\nNonce: ccecfc7e76a9c1f3d60ed7d7a7f12af7522714ad6e1c3a34980118d0d7866dbb\nIssued At: 2024-12-31T12:07:23.770Z\nNot Before: 2024-12-31T12:12:23.365Z",
  "signature": "0x966de683f1b41097bf5212a0c98a4f422df76b462a81ef45225a9f13bf83c643054126472d1045537f47e26a1f0a3b166e1c46a6a64255044db502e5975cbc691c",
  "nonce": "b8bc718d6af38a0d2cac5085c53f617a52e590b0ff4ad2c4abb0825e9cc39079"
}'
```

## 2. Order creation and progress

### Quote

Fetch the quote for the choosen [Order Pair](../sdk/Enumerations.md#orderpair) and `amount` with optinal `exact_out`.

```bash
curl -X 'GET' \
  'https://quote.garden.finance/price?order_pair=ethereum_sepolia%253A0x3C6a17b8cD92976D1D91E491c93c98cd81998265%253A%253Acitrea_testnet%253A0xaD9d14CA82d9BF97fFf745fFC7d48172A1c0969E&exact_out=false&amount=1000000' \
  -H 'accept: application/json'
```

### Create order

Create order with the signature and `Order` details.

```bash
curl -X 'POST' \
  'https://orderbook.garden.finance/gasless/order' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "source_chain": "ethereum_sepolia",
  "destination_chain": "citrea_testnet",
  "source_asset": "0x3C6a17b8cD92976D1D91E491c93c98cd81998265",
  "destination_asset": "0xaD9d14CA82d9BF97fFf745fFC7d48172A1c0969E",
  "initiator_source_address": "0x5A4b7eD8c2a1F1e34C8e9...6A3C5D2B1f8E7A9C",
  "initiator_destination_address": "0x5A4b7eD8c2a1F1e34C8e9...6A3C5D2B1f8E7A9C",
  "source_amount": "1000000",
  "destination_amount": "9970000000000000",
  "fee": "1",
  "nonce": "5",
  "min_destination_confirmations": 0,
  "timelock": 7200,
  "secret_hash": "c1f286d511fc428a82...e5920f7ff812091cfbee3a5484a087682839",
  "additional_data": {
    "strategy_id": "ea56cte9",
    "input_token_price": 95339.72353861976,
    "output_token_price": 95339.72353861976,
    "deadline": 1735801988,
    "bitcoin_optional_recipient": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "sig": "939c73a014b9a016cbe...7adce0bc76f170a2deaafa1304f572b808341edcd93058b7b60af994b780a12f24dac0c905615d00d8059b6e6326446cc9d61c",
    "instant_refund_tx_bytes": null
  }
}'
```

### Initiate order

Initiates swap with `signature`.

```bash
curl -X 'POST' \
  'https://orderbook.garden.finance/gasless/order/initiate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "order_id": "ee0397d...5aed66ffb0a0ede00e86d0446d468e681cf0b6166fcc413dafe",
  "signature": "0xe71e...22220bb369c7db189d749b6d34d4b444f863b6bafa1ab107b07031e465b652e2959b73de0ea1700d2414734dea44a04eb20b8bf85c178604b6b461b",
  "perform_on": "Source"
}'
```

## 3. Order redemption

### Poll order status

:::note  
`Garden` by default polls the order status for every `10 seconds`.
:::

Poll for order status at regular intervals to check whether the `Orderbook` has picked up the order.

```bash
curl -X 'GET' \
  'https://orderbook.garden.finance/orders/id/dab9648aef33aacbb4324a3874f78f2fa2faaea6ac714fba7028776fc6c96c41/matched' \
  -H 'accept: application/json'
```

### Settle order

Upon order match, settle the order by `redeeming` the funds.

```bash
curl -X 'POST' \
  'https://orderbook.garden.finance/gasless/order/settlement' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "order_id": "dab96...cbb4324a3874f78f2fa2faaea6ac714fba7028776fc6c96c41",
  "secret": "6c5185...68d080073867cf0235f2639162e676a0f099d62236f1a9a22dad",
  "perform_on": "Destination"
}'
```