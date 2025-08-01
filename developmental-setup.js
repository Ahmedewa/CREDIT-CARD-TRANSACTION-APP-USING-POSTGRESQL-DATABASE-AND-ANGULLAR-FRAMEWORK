        DEVELOPMENTAL SETUP


## ** Developmental Setup**

### **2.1 Prerequisites**

- **Frontend**: Angular CLI, Node.js, npm/yarn.
- **Backend**: Node.js, Express.js, PostgreSQL.
- **Smart Contracts**: Hardhat, Solidity, Ganache.
- **Database**: PostgreSQL.

---

### **2.2 Setup Workflow**

#### **Step 1: Clone the Repository**
```bash
git clone https://github.com/your-repo/credit-card-app.git
cd credit-card-app
```

#### **Step 2: Install Dependencies**

- **Frontend**:
  ```bash
  cd frontend
  npm install
  ```

- **Backend**:
  ```bash
  cd backend
  npm install
  ```

- **Smart Contracts**:
  ```bash
  cd contracts
  npm install
  ```

#### **Step 3: Start Local Development Servers**

- **Frontend**:
  ```bash
  ng serve
  ```

- **Backend**:
  ```bash
  npm run start:dev
  ```

- **Ganache** (For Local Blockchain):
  ```bash
  npx ganache-cli
  ```

#### **Step 4: Configure Environment Variables**

Use `.env` files to manage secrets:
```bash
# Frontend .env
API_URL=http://localhost:3000/api

# Backend .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
ETHEREUM_RPC_URL=http://127.0.0.1:8545
```

#### **Step 5: Database Setup**

- Create a PostgreSQL database:
  ```bash
  psql -U postgres -c "CREATE DATABASE credit_card_app;"
  ```

- Run migrations:
  ```bash
  npm run migrate
  ```

---

### **2.3 CI/CD Pipeline**

Automate testing and deployment with GitHub Actions:

#### **GitHub Actions Workflow**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: |
          cd frontend && npm install
          cd ../backend && npm install
          cd ../contracts && npm install

      - name: Run Tests
        run: |
          cd frontend && npm test --code-coverage
          cd ../backend && npm run test
          cd ../contracts && npx hardhat coverage
```

---



