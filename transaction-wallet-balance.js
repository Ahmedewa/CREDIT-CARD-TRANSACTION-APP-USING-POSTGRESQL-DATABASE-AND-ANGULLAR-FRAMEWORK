               TRANSACTION-WALLET-BALANCES

### **Transaction History and Wallet Balances**

Allow users to view their transaction history and wallet balances.

#### **Code : Get Wallet Balance**
```typescript
async getWalletBalance() {
  const account = this.getAccount();
  const balance = await this.web3.eth.getBalance(account);
  console.log('Wallet balance:', this.web3.utils.fromWei(balance, 'ether'));
}
```

#### **Code: Fetch Transaction History**
```javascript
app.get('/api/transactions', async (req, res) => {
  const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});
```

---

