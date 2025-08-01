                  SECURITY

## **1. Security**

Security is critical when dealing with payment systems. 
Below are steps to secure our app:

### **1.1 Use Trusted Wallet Providers**

To manage **private keys** securely, integrate trusted wallets like **MetaMask**. 
Never store private keys in the app or backend.

#### **Code : Wallet Connection with MetaMask**
Add a wallet connection feature to your Angular app:
```typescript
import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  public account: string | null = null;

  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else {
      alert('Please install MetaMask!');
    }
  }

  async connectWallet() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.account = accounts[0];
      console.log('Connected wallet:', this.account);
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }

  getAccount() {
    return this.account;
  }
}
```

---

### **1.2 Implement Nonce and Gas Management**

Nonces prevent **replay attacks**, and gas optimization minimizes transaction costs.

#### **Code Example: Nonce and Gas Management**
```typescript
async sendTransaction(amount: number) {
  const account = this.getAccount();
  const nonce = await this.web3.eth.getTransactionCount(account, 'latest'); // Get the latest nonce

  const transaction = {
    to: 'RECIPIENT_ADDRESS',
    value: this.web3.utils.toWei(amount.toString(), 'ether'),
    gas: 21000,
    nonce: nonce,
  };

  const txHash = await this.web3.eth.sendTransaction(transaction);
  console.log('Transaction sent:', txHash);
}
```

---

### **1.3 Sanitize and Validate Inputs**

Use parameterized queries in **PostgreSQL** to prevent **SQL injection**.

#### **Code Example: Secure SQL Queries**
```javascript
const result = await pool.query(
  'INSERT INTO transactions (user_id, amount, ethereum_tx_id) VALUES ($1, $2, $3)',
  [userId, amount, ethereumTxId]
);
```

---

