<h1 align="center"><a href='https://thirdweb.com/'>thirdweb</a> Real estate marketplace</h1>

<p align="center"><strong>NFT Marketplace using thirdweb</strong></p>


## Installation
### 1. Clone the project
```bash
git clone https://github.com/khushdeep-dhir/Real-estate-marketplace.git
```

### 2. Install the dependencies
```bash
# npm
npm install

# yarn
yarn
```

### 3. Set up environment variables
Change the client ID in `.env.local` (at the root level of your project) with your ID:
```
NEXT_PUBLIC_TW_CLIENT_ID="<your-thirdweb-client-id"
```

### 4. Supported marketplaces

Once the marketplace contract deployment's completed, you need to put the MarketplaceV3 contract address and its respective chain in the file [`/src/consts/marketplace_contracts.ts`](/src/consts/marketplace_contract.ts)

Example:
```typescript
import { yourCustomChain, ethereum } from "./chains";

export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "your-marketplace-contrac-address-on-the-custom-chain",
    chain: yourCustomChain,
  }
];
```

### 5. You're set
You can now run the template in your local machine.
```bash
# npm
npm run dev

# yarn
yarn dev
```


