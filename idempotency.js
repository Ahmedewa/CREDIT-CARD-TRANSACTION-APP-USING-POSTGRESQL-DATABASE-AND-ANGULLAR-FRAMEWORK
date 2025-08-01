




## **2. Designing for Idempotency**

**Idempotency** ensures that repeated operations produce the same result. This is crucial for:
- **Payment Processing**: Avoid duplicate charges.
- **API Calls**: Retry safely if a request fails.

---

### **2.1 Implementing Idempotency in the Backend**

1. **Use Unique Request Identifiers**:
   Each operation should include a unique **idempotency key** (e.g., UUID).

#### ** Flask Backend**
```python
from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

# Store request states
idempotency_store = {}

@app.route('/transaction', methods=['POST'])
def process_transaction():
    idempotency_key = request.headers.get('Idempotency-Key')
    if not idempotency_key:
        return jsonify({"error": "Idempotency-Key header is required"}), 400

    # Check if the request has been processed
    if idempotency_key in idempotency_store:
        return jsonify({"status": "Duplicate request", "result": idempotency_store[idempotency_key]}), 200

    # Process the transaction
    transaction_id = str(uuid.uuid4())
    amount = request.json.get('amount')

    # Save result for this idempotency key
    result = {"transaction_id": transaction_id, "amount": amount}
    idempotency_store[idempotency_key] = result

    return jsonify(result), 201

if __name__ == '__main__':
    app.run(port=5000)
```

### **2.2 Idempotency in Smart Contracts**

For Ethereum transactions:
- **Use Nonces**: Ethereum’s transaction nonces ensure that each transaction is unique.
- **Gas Refunds**: Ensure failed transactions revert gas fees.

---

### **2.3 Idempotency in the Frontend**

When sending API requests:
- Generate an **idempotency key** in the Angular app:
  ```typescript
  import { v4 as uuidv4 } from 'uuid';

  const idempotencyKey = uuidv4();
  const headers = { 'Idempotency-Key': idempotencyKey };

  this.http.post('/api/transaction', { amount: 100 }, { headers }).subscribe(
    (response) => console.log('Transaction processed:', response),
    (error) => console.error('Error:', error)
  );
  ```

---
