---
id: auth
---

# Authentication

Garden uses the **Sign-In with Ethereum (SIWE)** protocol to authenticate users. Developers can integrate this directly into their apps or obtain a JWT token from the developer dashboard for making authorized API calls.

:::note
A valid authentication token is required for all protected API calls.
:::

## Authentication options

1. **Developer dashboard**:  
   Use the [dashboard](https://sdk-frontend.162.55.81.185.sslip.io/) to generate a JWT token for API requests.

2. **Sign-in with ethereum (SIWE)**:  
   Implement SIWE in your app using the Garden Auth API. This process involves two key steps to retrieve a JWT token:

### Step 1: Fetch a nonce

A unique, one-time-use nonce is required to sign a message. Use the `/auth/nonce` endpoint to fetch this nonce.

**Endpoint**: `/auth/nonce`  
**Response**:

```json
{
  "status": "Ok",
  "result": "d2ea8a7ce1d18f50db51de1f7522e45706330cf3a2dcf269930b5d38b5461fcb"
}
```

### Step 2: Sign and verify

Sign the message containing the nonce and required metadata with your Ethereum private key. Then, submit the signed message to the `/auth/verify` endpoint for verification.

**Request**: `/auth/verify`  
**Payload**:

```json
{
  "message": "garden.finance wants you to sign in with your Ethereum account: 0x8F4f2B8ab0341Af0cAe29e3C0F35C30eE00A3dE9 DeFiHub URI: http://garden.finance/ Version: 2 Chain ID: 3 Nonce: b8bc718d6af38a0d2cac5085c53f617a52e590b0ff4ad2c4abb0825e9cc39079 Issued At: 2024-12-24T14:15:30.123Z",
  "signature": "6fe3d5d62b9b0137b1747b2a9dbb227b09d547c1a10f0455efb2584b459f9b24",
  "nonce": "b8bc718d6af38a0d2cac5085c53f617a52e590b0ff4ad2c4abb0825e9cc39079"
}
```

**Response**:  
Upon successful verification, a JWT token is issued.  

```json
{
  "status": "Ok",
  "result": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.CwQHc49-QhP9O-d78b6oAAGv1FlMY_MBOxxr06vNPSgTSOx40HpNqTTlLwFExC-U-KajJZ2izwSKVhNlD2DqTf-V2M-wQTZsG9Ucqg-QZ-V_L02ePyyJ8mn5vJUtTfxmf_WyytvjxIRkPqKkPmu3tJl00cRVt4kFiD_F_XRhPT8QNmEodf5Q9jcByq5J3eyVgfge4wZA9V5nYBz9N-i_AcDttXQmsxtzvthlwszi5Sscw4yIbw1lnz_fHxuK6-lpoIh8IbOdPfGMlg_Mc0AzVObrhMKbT0OnNfbtk9tI0vErzOnoD7A2vDdBz01XccFZ36txcxQ95JZ-_WNs7g"
}
```

## How it works

The Auth API ensures secure authentication by using a nonce to prevent replay attacks. Users sign this nonce with their Ethereum private key, and the signed message is verified to confirm the user’s identity. This approach ensures security without exposing private keys.

For more details on integrating SIWE or using the developer dashboard, refer to [API](../api/GardenAPI.md) section.
