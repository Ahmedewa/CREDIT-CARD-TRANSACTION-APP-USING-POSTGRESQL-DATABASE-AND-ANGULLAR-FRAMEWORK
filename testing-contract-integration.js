       TESTING-CONTRACTS-INTEGRATION

## **3. Testing**

Testing ensures the reliability of smart contracts and Web3.js integrations.

### **3.1 Smart Contract Testing**

Use **Truffle** or **Hardhat** for testing.

#### **Truffle Test**
```javascript
const CreditCard = artifacts.require('CreditCardTransaction');

contract('CreditCardTransaction', (accounts) => {
  it('should create a transaction', async () => {
    const contract = await CreditCard.deployed();
    await contract.createTransaction(100, { from: accounts[0] });
    const transaction = await contract.transactions(1);
    assert.equal(transaction.amount, 100, 'Transaction amount should be 100');
  });
});
```

---

### **3.2 Web3.js Testing**

Test wallet interactions and transaction flows using tools like **Jest**.

#### ** Wallet Connection Test**
```javascript
test('connectWallet should connect to MetaMask', async () => {
  const web3Service = new Web3Service();
  await web3Service.connectWallet();
  expect(web3Service.account).not.toBeNull();
});
```

---

