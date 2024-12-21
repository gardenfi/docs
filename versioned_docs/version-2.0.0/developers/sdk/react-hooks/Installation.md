---
id: installation
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation  

Get started by installing the necessary dependencies for **Garden SDK v2**. Use your preferred package manager (`npm`, `yarn`, or `pnpm`).  

---

### Garden dependencies  

Add the core Garden packages:  

<Tabs>
    <TabItem value="npm" label="npm">
    
    ```bash
    npm install @gardenfi/core@^0.2.0-beta.81 @gardenfi/orderbook@^0.2.0-beta.24 @gardenfi/react-hooks@^0.0.1-beta.103
    ```

    </TabItem>
    <TabItem value="yarn" label="yarn">
    
    ```bash
    yarn add @gardenfi/core@^0.2.0-beta.81 @gardenfi/orderbook@^0.2.0-beta.24 @gardenfi/react-hooks@^0.0.1-beta.103
    ```

    </TabItem>
    <TabItem value="pnpm" label="pnpm">
    
    ```bash
    pnpm add @gardenfi/core@^0.2.0-beta.81 @gardenfi/orderbook@^0.2.0-beta.24 @gardenfi/react-hooks@^0.0.1-beta.103
    ```

    </TabItem>
</Tabs>

### Wagmi dependencies

For a seamless integration with wagmi, install the following versions (feel free to experiment with lower versions if necessary, but these have been tested):
```bash
yarn add @tanstack/react-query@^5.59.20 wagmi@^2.12.29
```

Now you're ready to integrate Garden SDK into your dApp! 🚀