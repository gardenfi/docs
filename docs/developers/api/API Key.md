---
id: api-key
---

# API Key

You can use API key as an alternative to the Sign-In with Ethereum ([SIWE](https://eips.ethereum.org/EIPS/eip-4361)) protocol for authentication when integrating Garden. If the API key is passed during Garden initialization, the SIWE flow is skipped, and the key is used directly for authentication. 

API keys can be generated from the [Dev Dashboard](https://dev.garden.finance/). You can register your app and create a key with a custom expiration period. Once generated, this key can be used during integration without requiring the user to sign a message or go through the SIWE flow. If a valid API key is present, it will be used for all further authenticated steps in the Garden flow.

## Generating an API Key from the Dev Dashboard

- Go to [Dev Dashboard](https://dev.garden.finance/) and click on `Connect` to link your wallet.

![Dev Dashboard Landing page](../images/dev-dashboard/dashboard-landing-image.png)

- Click on `Create new app` button to open modal. Enter your app name (here "demo app") and app icon to register it.

![create your app modal](../images/dev-dashboard/create-app-modal.png)

- Once app is created, you’ll be able to see all your registered apps on the dashboard.

![your apps](../images/dev-dashboard/your-apps-image.png)

- Click on your newly created app to open its dashboard.

![demo app dashboard](../images/dev-dashboard/demo-app-image.png)

- Click the “Create New Key” button. A modal will open to configure the API key.

![generate api-key modal](../images/dev-dashboard/generate-api-key-modal.png)

- Provide a name for the API key and choose its validity period from the dropdown.

![api-key modal with app name and expiry dropdown](../images/dev-dashboard/generate-api-key-modal-with-values.png)

- Click on `Proceed` to trigger a signature pop-up. Confirm the signature to continue.

![signature pop-up for api-key generation](../images/dev-dashboard/signature-pop-up.png)

- The API key will be generated successfully. Click on `Copy API key & Save` to save it securely.

![api-key generated successfully](../images/dev-dashboard/api-key-creation-image.png)

- The generated API key will now be visible on your app's dashboard.

![demo app dashboard with api-key](../images/dev-dashboard/demo-app-with-apikey.png)