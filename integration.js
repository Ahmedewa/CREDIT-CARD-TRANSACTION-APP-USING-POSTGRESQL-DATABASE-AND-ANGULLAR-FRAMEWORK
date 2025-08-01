      INTEGRATION-WEB3.JS-ETHEREUM-WITH-ANGULAR-APP  


**1. Key Features of Integration**

1. **Web3.js**:
   - Connect to the Ethereum blockchain.
   - Interact with smart contracts (e.g., for validating transactions).
   - Monitor Ethereum wallet balances and events.

2. **Ethereum**:
   - Use Ethereum’s decentralized ledger to store transaction details.
   - Implement smart contracts for payment validation and escrow services.

3. **Angular & PostgreSQL**:
   - Use Angular for the frontend (e.g., forms, wallet connections).
   - Use PostgreSQL for storing off-chain data like user profiles and transaction history.

---

### **2. Setting Up the Development Environment**

#### **2.1 Prerequisites**
1. Install **Node.js** and **npm**:
   ```bash
   sudo apt install nodejs npm
   ```

2. Install Angular CLI:
   ```bash
   npm install -g @angular/cli
   ```

3. Install PostgreSQL:
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

4. Install Web3.js:
   ```bash
   npm install web3
   ```

5. Set up a local Ethereum blockchain for development using **Ganache**:
   ```bash
   npm install -g ganache-cli
   ganache-cli
   ```

---

### **3. Smart Contract for Ethereum Integration**

#### **Smart Contract**

Create a Solidity smart contract for validating credit card transactions:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreditCardTransaction {
    address public owner;

    struct Transaction {
        uint id;
        address sender;
        uint amount;
        bool approved;
    }

    mapping(uint => Transaction) public transactions;

    uint public transactionCount = 0;

    event TransactionCreated(uint id, address sender, uint amount);
    event TransactionApproved(uint id);

    constructor() {
        owner = msg.sender;
    }

    function createTransaction(uint amount) public {
        transactionCount++;
        transactions[transactionCount] = Transaction(transactionCount, msg.sender, amount, false);
        emit TransactionCreated(transactionCount, msg.sender, amount);
    }

    function approveTransaction(uint id) public {
        require(msg.sender == owner, "Only the owner can approve transactions");
        transactions[id].approved = true;
        emit TransactionApproved(id);
    }
}
```

---

#### **3.2 Deploy Smart Contract**

1. Use **Truffle** for smart contract deployment:
   ```bash
   npm install -g truffle
   ```

2. Create a Truffle project:
   ```bash
   truffle init
   ```

3. Compile and deploy the contract:
   - Update `truffle-config.js`:
     ```javascript
     module.exports = {
       networks: {
         development: {
           host: "127.0.0.1",
           port: 8545,
           network_id: "*",
         },
       },
       compilers: {
         solc: {
           version: "0.8.0",
         },
       },
     };
     ```

   - Migrate the contract:
     ```bash
     truffle migrate
     ```

4. Note the deployed contract address.

---

### **4. Angular Frontend Integration**

#### **4.1 Install Web3.js**

1. Add `web3.js` to your Angular project:
   ```bash
   npm install web3
   ```

2. Create a **Web3Service** for Ethereum interaction:
   ```typescript
   import { Injectable } from '@angular/core';
   import Web3 from 'web3';

   @Injectable({
     providedIn: 'root'
   })
   export class Web3Service {
     private web3: Web3;
     private contract: any;
     private contractAddress = 'YOUR_CONTRACT_ADDRESS';
     private abi = [
       {
         "inputs": [],
         "stateMutability": "nonpayable",
         "type": "constructor"
       },
       {
         "inputs": [
           { "internalType": "uint256", "name": "amount", "type": "uint256" }
         ],
         "name": "createTransaction",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
       },
       {
         "inputs": [
           { "internalType": "uint256", "name": "id", "type": "uint256" }
         ],
         "name": "approveTransaction",
         "outputs": [],
         "stateMutability": "nonpayable",
         "type": "function"
       }
     ];

     constructor() {
       this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
       this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
     }

     async createTransaction(amount: number, from: string) {
       return await this.contract.methods.createTransaction(amount).send({ from });
     }

     async approveTransaction(id: number, from: string) {
       return await this.contract.methods.approveTransaction(id).send({ from });
     }
   }
   ```

---

#### **4.2 Create Angular Components**

1. **Transaction Component**:
   ```bash
   ng generate component transaction
   ```

2. Update `transaction.component.ts`:
   ```typescript
   import { Component } from '@angular/core';
   import { Web3Service } from '../web3.service';

   @Component({
     selector: 'app-transaction',
     templateUrl: './transaction.component.html',
     styleUrls: ['./transaction.component.css']
   })
   export class TransactionComponent {
     constructor(private web3Service: Web3Service) {}

     async createTransaction(amount: number) {
       const accounts = await this.web3Service.web3.eth.getAccounts();
       await this.web3Service.createTransaction(amount, accounts[0]);
       alert('Transaction created successfully!');
     }

     async approveTransaction(id: number) {
       const accounts = await this.web3Service.web3.eth.getAccounts();
       await this.web3Service.approveTransaction(id, accounts[0]);
       alert('Transaction approved successfully!');
     }
   }
   ```

3. Update `transaction.component.html`:
   ```html
   <div>
     <h1>Credit Card Transactions</h1>
     <label>Transaction Amount:</label>
     <input type="number" #amount />
     <button (click)="createTransaction(amount.value)">Create Transaction</button>

     <label>Transaction ID:</label>
     <input type="number" #id />
     <button (click)="approveTransaction(id.value)">Approve Transaction</button>
   </div>
   ```

---

### **5. Backend Setup with PostgreSQL**

#### **5.1 Database Schema**

Use PostgreSQL to store off-chain data, such as user details and transaction history.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    wallet_address VARCHAR(255) UNIQUE
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    amount DECIMAL(10, 2),
    ethereum_transaction_id VARCHAR(255),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **5.2 Backend API**

1. Install Express.js:
   ```bash
   npm install express pg body-parser
   ```

2. Create a basic API:
   ```javascript
   const express = require('express');
   const bodyParser = require('body-parser');
   const { Pool } = require('pg');

   const app = express();
   app.use(bodyParser.json());

   const pool = new Pool({
     user: 'postgres',
     host: 'localhost',
     database: 'credit_card_app',
     password: 'password',
     port: 5432,
   });

   app.post('/transactions', async (req, res) => {
     const { userId, amount, ethereumTransactionId } = req.body;
     const result = await pool.query(
       'INSERT INTO transactions (user_id, amount, ethereum_transaction_id) VALUES ($1, $2, $3) RETURNING *',
       [userId, amount, ethereumTransactionId]
     );
     res.json(result.rows[0]);
   });

   app.listen(3000, () => console.log('Server running on port 3000'));
   ```

---

### **6. Best Practices**

1. **Security**:
   - Validate all user inputs on the backend.
   - Use HTTPS to secure communication between Angular and the backend.
   - Mask sensitive data like private keys.

2. **Gas Optimization**:
   - Minimize gas usage by optimizing smart contract functions.

3. **Testing**:
   - Write unit tests for smart contracts using **Truffle** or **Hardhat**.
   - Use **Postman** or **Jest** to test backend APIs.

4. **Environment Management**:
   - Use `.env` files for environment-specific configurations.

---

### **Resources**
1. **Web3.js Documentation**: [https://web3js.readthedocs.io/](https://web3js.readthedocs.io/)
2. **Truffle Framework**: [https://trufflesuite.com/](https://trufflesuite.com/)
3. **Ganache CLI**: [https://www.trufflesuite.com/ganache](https://www.trufflesuite.com/ganache)
4. **Angular Docs**: [https://angular.io/docs](https://angular.io/docs)
5. **PostgreSQL Docs**: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

---

