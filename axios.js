             AXIOS.JS

### **3.4 Axios.js for API Communication**

Use **Axios.js** for making API calls in Angular.

#### **Fetch Transactions**
```typescript
import axios from 'axios';

async fetchTransactions() {
  try {
    const response = await axios.get('/api/transactions');
    console.log('Transactions:', response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}
```

---

