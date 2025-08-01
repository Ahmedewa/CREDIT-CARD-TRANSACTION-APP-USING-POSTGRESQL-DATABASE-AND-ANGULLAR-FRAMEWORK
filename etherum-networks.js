              MULTIPLE ETHERERUM NETWORKS

## ** Handle Different Ethereum Network Environments**

Ethereum uses multiple networks (e.g., Mainnet, Rinkeby, Polygon, etc.). 
our app should support switching between these networks dynamically.

---

### **2.1 Define Network Configurations**

Create a configuration file `ethereum-networks.ts`:
```typescript
export const NETWORKS = {
  mainnet: {
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    chainId: 1,
  },
  rinkeby: {
    rpcUrl: 'https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    chainId: 4,
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
  },
};
```

---

### **2.2 Switch Networks Dynamically**

Update the `Web3Service` to support dynamic network switching:
```typescript
import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { NETWORKS } from './ethereum-networks';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  private currentNetwork = NETWORKS.mainnet;

  constructor() {
    this.web3 = new Web3(this.currentNetwork.rpcUrl);
  }

  switchNetwork(network: string) {
    if (NETWORKS[network]) {
      this.currentNetwork = NETWORKS[network];
      this.web3.setProvider(this.currentNetwork.rpcUrl);
      console.log(`Switched to ${network}:`, this.currentNetwork);
    } else {
      console.error('Unsupported network:', network);
    }
  }

  getNetwork() {
    return this.currentNetwork;
  }
}
```

---

### **2.3 Switch Networks in the UI**

Add a dropdown to select the network in your Angular component:
```html
<select (change)="changeNetwork($event.target.value)">
  <option value="mainnet">Mainnet</option>
  <option value="rinkeby">Rinkeby</option>
  <option value="polygon">Polygon</option>
</select>
```

Update the component logic:
```typescript
import { Component } from '@angular/core';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-network-switcher',
  templateUrl: './network-switcher.component.html',
})
export class NetworkSwitcherComponent {
  constructor(private web3Service: Web3Service) {}

  changeNetwork(network: string) {
    this.web3Service.switchNetwork(network);
  }
}
```

---

