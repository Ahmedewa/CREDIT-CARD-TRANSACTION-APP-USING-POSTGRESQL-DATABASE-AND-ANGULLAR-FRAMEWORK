             PACKAGE.JSON[DEPENDANCIES MANAGEMENT]

Using **`package.json`** to list and manage all dependencies for our 
**Angular app (Frontend)** and **Node.js app (Backend)** 
(with Web3.js and Ethereum integration), follow this comprehensive guide.

---

## **1. Understanding `package.json`**

The **`package.json`** file is a configuration file for Node.js applications that contains:
- The **dependencies** your app needs to run.
- The **devDependencies** required for development and testing.
- **Scripts** to automate processes like building, testing, and starting your app.

When you install a package via `npm install <package-name>`, it is automatically added to your `package.json` under `dependencies` or `devDependencies`.

---

## **2. Angular App (Frontend)**

### **2.1 Key Dependencies for Angular**

| **Dependency**         | **Purpose**                                          |
|-------------------------|-----------------------------------------------------|
| `@angular/core`         | Core library for Angular functionalities.           |
| `rxjs`                  | Reactive programming library for handling streams.  |
| `zone.js`               | Tracks asynchronous operations for Angular.         |
| `web3.js`               | Ethereum JavaScript API for blockchain integration. |
| `@angular/material`     | Optional: Angular Material for UI components.       |

---

### **2.2 Example `package.json` for Angular**

A **`package.json`** that includes all essential dependencies for an Angular app 
integrated with Web3.js:

```json
{
  "name": "credit-card-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build --prod",
    "test": "ng test --code-coverage",
    "lint": "ng lint"
  },
  "dependencies": {
    "@angular/animations": "~14.2.0",
    "@angular/common": "~14.2.0",
    "@angular/compiler": "~14.2.0",
    "@angular/core": "~14.2.0",
    "@angular/forms": "~14.2.0",
    "@angular/platform-browser": "~14.2.0",
    "@angular/platform-browser-dynamic": "~14.2.0",
    "@angular/router": "~14.2.0",
    "rxjs": "~7.5.0",
    "zone.js": "~0.11.4",
    "web3": "^1.8.2" // Web3.js for Ethereum integration
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~14.2.0",
    "@angular/cli": "~14.2.0",
    "@angular/compiler-cli": "~14.2.0",
    "@angular/language-service": "~14.2.0",
    "jasmine-core": "~4.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~4.1.0",
    "karma-jasmine-html-reporter": "~1.7.0",
    "typescript": "~4.7.0"
  }
}
```

---

### **2.3 Installing Dependencies in Angular**

To install all required dependencies:
1. Navigate to your Angular project directory.
2. Run:
   ```bash
   npm install
   ```

To add **Web3.js** specifically (if not already installed):
```bash
npm install web3
```

---

### **2.4 Using Web3.js in Angular**

1. **Import Web3.js in Your Component**:
   ```typescript
   import Web3 from 'web3';

   const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
   ```

2. **Use Web3.js to Interact with Ethereum**:
   ```typescript
   async function getAccountBalance(address: string) {
     const balance = await web3.eth.getBalance(address);
     console.log('Account Balance:', web3.utils.fromWei(balance, 'ether'));
   }
   ```

---

## **3. Node.js App (Backend)**

### **3.1 Key Dependencies for Node.js**

| **Dependency**             | **Purpose**                                          |
|-----------------------------|-----------------------------------------------------|
| `express`                  | Web framework for Node.js.                          |
| `dotenv`                   | Load environment variables from `.env` file.        |
| `pg`                       | PostgreSQL client for database integration.         |
| `web3.js`                  | Ethereum JavaScript API for blockchain integration. |
| `body-parser`              | Parse incoming request bodies (optional).           |

---

### **3.2  `package.json` for Node.js**

A **`package.json`** file for a Node.js backend integrated with Web3.js and PostgreSQL:

```json
{
  "name": "credit-card-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest --coverage",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "pg": "^8.9.0",
    "web3": "^1.8.2",
    "body-parser": "^1.20.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.20",
    "eslint": "^8.25.0",
    "typescript": "^4.9.4"
  }
}
```

---

### **3.3 Installing Dependencies in Node.js**

To install dependencies:
```bash
npm install
```

To add **Web3.js** and PostgreSQL client:
```bash
npm install web3 pg
```

---

### **3.4 Using Web3.js in Node.js**

1. **Set Up Web3.js**:
   ```javascript
   const Web3 = require('web3');
   const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
   ```

2. **Fetch Ethereum Account Balance**:
   ```javascript
   app.get('/balance/:address', async (req, res) => {
     const address = req.params.address;
     try {
       const balance = await web3.eth.getBalance(address);
       res.send({ balance: web3.utils.fromWei(balance, 'ether') });
     } catch (error) {
       res.status(500).send({ error: error.message });
     }
   });
   ```

3. **Integrate PostgreSQL**:
   Use `pg` to connect with the database:
   ```javascript
   const { Pool } = require('pg');
   const pool = new Pool({
     user: 'postgres',
     host: 'localhost',
     database: 'credit_card_app',
     password: 'yourpassword',
     port: 5432,
   });

   app.get('/transactions', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM transactions');
       res.send(result.rows);
     } catch (error) {
       res.status(500).send({ error: error.message });
     }
   });
   ```

---

## **4. Combine Frontend and Backend**

For a **monorepo setup**, where both the frontend and backend share a single `package.json`, you can use the following structure:

### **4.1 Monorepo `package.json`**

```json
{
  "name": "credit-card-app",
  "version": "1.0.0",
  "scripts": {
    "start:frontend": "cd frontend && npm start",
    "start:backend": "cd backend && npm start",
    "build:frontend": "cd frontend && npm run build",
    "test:frontend": "cd frontend && npm test",
    "test:backend": "cd backend && npm test"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

### **4.2 Running Scripts in Monorepo**

- **Start Frontend**:
  ```bash
  npm run start:frontend
  ```

- **Start Backend**:
  ```bash
  npm run start:backend
  ```

- **Build Frontend**:
  ```bash
  npm run build:frontend
  ```

---

## **5. Best Practices for Dependencies**

1. **Version Pinning**:
   Always specify versions for dependencies to avoid unexpected updates:
   ```json
   "web3": "^1.8.2"
   ```

2. **Use `.env` for Secrets**:
   Store API keys and sensitive data in a `.env` file:
   ```bash
   INFURA_API_KEY=your_infura_key
   ```

3. **Automate Dependency Updates**:
   Use `npm-check-updates` to identify and upgrade outdated dependencies:
   ```bash
   npx npm-check-updates -u
   ```

4. **Separate Dev and Prod Dependencies**:
   Install development tools as devDependencies:
   ```bash
   npm install --save-dev jest eslint
   ```

---

**This setup ensures our **Angular frontend** and **Node.js backend** are integrated 
  with **Web3.js** and Ethereum while being easily manageable via `package.json`.** 
    
