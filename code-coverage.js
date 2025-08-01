                 CODE COVERAGE 

### **A Guide for Code Coverage**

This guide will elaborate on:

1. **Code Coverage** for our Angular Credit Card App with Web3.js, Ethereum, and PostgreSQL.
2. **Developmental Setup** for seamless development and deployment.
3. **Single Tech Stack Diagram** to visualize the architecture.

---

## **1. Code Coverage**

Code coverage measures how much of your codebase is tested by unit, integration, and end-to-end (E2E) tests. A high code coverage percentage ensures fewer bugs, better reliability, and more maintainable code.

### **1.1 Tools for Code Coverage**

Tools for  use for different parts of the app:

| **Layer**            | **Testing Tool**            | **Purpose**                     |
|-----------------------|-----------------------------|---------------------------------|
| **Frontend (Angular)**| Karma + Jasmine (built-in)  | Unit and integration testing    |
| **Backend (Node.js)** | Jest, Mocha, Supertest      | API and service testing         |
| **Smart Contracts**   | Hardhat, Truffle, Ganache  | Unit testing for Solidity       |
| **End-to-End Testing**| Cypress, Playwright        | Testing the app's workflows     |

---

### **1.2 Code Coverage for Angular Frontend**

1. **Enable Code Coverage in Angular**:
   - Angular uses **Karma** for running tests and **Istanbul** for code coverage reporting.
   - Run the following command:
     ```bash
     ng test --code-coverage
     ```
   - This generates a `coverage/` folder in your project directory.

2. **View Code Coverage Report**:
   - Open the `coverage/index.html` file in a browser to view the detailed report.

3. **Sample Karma Configuration** (`karma.conf.js`):
   Ensure the `reporters` section includes `coverage`:
   ```javascript
   module.exports = function (config) {
     config.set({
       frameworks: ['jasmine', '@angular-devkit/build-angular'],
       plugins: [
         require('karma-jasmine'),
         require('karma-chrome-launcher'),
         require('karma-coverage'),
       ],
       reporters: ['progress', 'coverage'],
       coverageReporter: {
         type: 'html',
         dir: 'coverage/',
       },
       browsers: ['Chrome'],
       singleRun: true,
     });
   };
   ```

4. **Best Practices for Frontend Testing**:
   - Test **components** (e.g., forms, user actions).
   - Mock **services** to avoid real API calls.
   - Example Unit Test for a Component:
     ```typescript
     it('should call the API on submit', () => {
       spyOn(service, 'createTransaction').and.returnValue(of({ success: true }));
       component.submitForm();
       expect(service.createTransaction).toHaveBeenCalled();
     });
     ```

---

### **1.3 Code Coverage for Backend**

1. **Install Jest for Node.js Testing**:
   ```bash
   npm install jest supertest --save-dev
   ```

2. **Run Tests with Coverage**:
   Add a Jest configuration (`jest.config.js`):
   ```javascript
   module.exports = {
     collectCoverage: true,
     collectCoverageFrom: ['src/**/*.js'],
     coverageDirectory: 'coverage',
   };
   ```

   Run tests with:
   ```bash
   npx jest --coverage
   ```

3. **Best Practices for Backend Testing**:
   - Test APIs using **Supertest**:
     ```javascript
     const request = require('supertest');
     const app = require('../app');

     it('should create a transaction', async () => {
       const response = await request(app)
         .post('/api/transactions')
         .send({ userId: 1, amount: 100 });
       expect(response.status).toBe(201);
       expect(response.body).toHaveProperty('transactionId');
     });
     ```

---

### **1.4 Code Coverage for Smart Contracts**

1. **Install Hardhat Coverage Plugin**:
   ```bash
   npm install --save-dev solidity-coverage
   ```

2. **Run Tests with Coverage**:
   Add the plugin to `hardhat.config.js`:
   ```javascript
   require('solidity-coverage');
   ```

   Execute tests with:
   ```bash
   npx hardhat coverage
   ```

3. **Best Practices for Smart Contract Tests**:
   - Test **all edge cases** (e.g., insufficient balance, invalid input).
   - Example Solidity Test:
     ```javascript
     it('should create a transaction', async () => {
       await contract.createTransaction(100, { from: user });
       const transaction = await contract.transactions(1);
       assert.equal(transaction.amount, 100);
     });
     ```

---

### **1.5 Code Coverage Goals**

| **Layer**            | **Target Coverage** (%) |
|-----------------------|-------------------------|
| Frontend (Angular)    | 80–90%                 |
| Backend (Node.js)     | 85–95%                 |
| Smart Contracts       | 90–100%                |
| End-to-End Workflows  | 70–80%                 |

---

