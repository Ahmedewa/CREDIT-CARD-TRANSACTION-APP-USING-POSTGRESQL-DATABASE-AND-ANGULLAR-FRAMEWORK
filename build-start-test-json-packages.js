
     INITIATE BUILDING STARTING TESTING WITH JSON PACKAGES

### **Initiate Build, Start, and Test Your App Using JSON Packages**:

To configure our **`package.json`** files to initiate **build**, **start**, and 
**test** processes for your app's **Frontend** (Angular), **Backend** (Node.js), 
and **Smart Contracts**.

---

## **1. Structure of `package.json`**

The `package.json` file is the central configuration for Node.js projects. It defines:
- **Scripts**: Commands for building, starting, and testing your app.
- **Dependencies**: Required libraries.
- **DevDependencies**: Libraries needed for development (e.g., test frameworks).

---

## **2. Configure `package.json` for Each Component**

### **2.1 Frontend (Angular)**

#### **Example `package.json` for Frontend**
```json
{
  "name": "credit-card-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",                // Start the Angular development server
    "build": "ng build --prod",        // Build the app for production
    "test": "ng test --code-coverage", // Run tests with code coverage
    "lint": "ng lint",                 // Check for linting errors
    "e2e": "ng e2e"                    // Run end-to-end tests
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
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~14.2.0",
    "@angular/cli": "~14.2.0",
    "@angular/compiler-cli": "~14.2.0",
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

#### **How to Use Scripts**
1. **Start the Development Server**:
   ```bash
   npm start
   ```
   This runs `ng serve` and starts the Angular dev server.

2. **Build the App for Production**:
   ```bash
   npm run build
   ```
   This generates a production-ready build in the `dist` folder.

3. **Run Tests**:
   ```bash
   npm test
   ```
   Executes unit tests and generates a code coverage report in the `coverage` folder.

4. **Run End-to-End Tests**:
   ```bash
   npm run e2e
   ```

---

### **2.2 Backend (Node.js)**

#### **`package.json` for Backend**
```json
{
  "name": "credit-card-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",          // Start the backend server
    "dev": "nodemon index.js",         // Start the server in development mode
    "test": "jest --coverage",         // Run unit tests with Jest and generate coverage
    "build": "tsc",                    // Compile TypeScript to JavaScript
    "lint": "eslint . --fix"           // Lint and fix code
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.9.0",
    "dotenv": "^16.0.3",
    "web3": "^1.8.1"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.20",
    "eslint": "^8.25.0",
    "typescript": "^4.9.4"
  }
}
```

#### **How to Use Scripts**
1. **Start the Backend Server**:
   ```bash
   npm start
   ```
   This runs your app using `node index.js`.

2. **Start in Development Mode**:
   ```bash
   npm run dev
   ```
   Uses `nodemon` to restart the server automatically when code changes.

3. **Run Tests**:
   ```bash
   npm test
   ```
   Executes unit tests using Jest and generates a coverage report.

4. **Build the App**:
   ```bash
   npm run build
   ```
   Compiles TypeScript files to JavaScript (if applicable).

5. **Lint Code**:
   ```bash
   npm run lint
   ```
   Checks for code quality issues and fixes them automatically.

---

### **2.3 Smart Contracts**

#### **`package.json` for Smart Contracts**
```json
{
  "name": "credit-card-contracts",
  "version": "1.0.0",
  "scripts": {
    "compile": "npx hardhat compile",   // Compile smart contracts
    "test": "npx hardhat test",         // Run smart contract tests
    "coverage": "npx hardhat coverage", // Generate code coverage for contracts
    "deploy": "npx hardhat run scripts/deploy.js --network localhost"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^4.8.0",
    "dotenv": "^16.0.3",
    "ethers": "^5.7.0"
  },
  "devDependencies": {
    "@nomiclabs/hardhat-ethers": "^2.2.2",
    "@nomiclabs/hardhat-waffle": "^2.0.3",
    "chai": "^4.3.7",
    "hardhat": "^2.12.2",
    "solidity-coverage": "^0.8.0"
  }
}
```

#### **How to Use Scripts**
1. **Compile Smart Contracts**:
   ```bash
   npm run compile
   ```
   Compiles Solidity contracts into the `artifacts` folder.

2. **Run Tests**:
   ```bash
   npm test
   ```
   Executes unit tests for smart contracts.

3. **Generate Code Coverage**:
   ```bash
   npm run coverage
   ```

4. **Deploy Contracts**:
   ```bash
   npm run deploy
   ```

---

## **3. JSON Package Setup for Combined Workflow**

If you want to manage **Frontend**, **Backend**, and **Smart Contracts** together, use a **monorepo** structure.

### **Monorepo `package.json`**
```json
{
  "name": "credit-card-app",
  "version": "1.0.0",
  "scripts": {
    "start:frontend": "cd frontend && npm start",
    "start:backend": "cd backend && npm start",
    "test:frontend": "cd frontend && npm test",
    "test:backend": "cd backend && npm test",
    "test:contracts": "cd contracts && npm test",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "deploy:contracts": "cd contracts && npm run deploy"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

### **How to Use Monorepo Scripts**
1. **Start Frontend and Backend**:
   ```bash
   npm run start:frontend
   npm run start:backend
   ```

2. **Test All Components**:
   ```bash
   npm run test:frontend
   npm run test:backend
   npm run test:contracts
   ```

3. **Build All Components**:
   ```bash
   npm run build:frontend
   npm run build:backend
   ```

4. **Deploy Smart Contracts**:
   ```bash
   npm run deploy:contracts
   ```

---

## **4. Best Practices for JSON Packages**

1. **Use Version Management**:
   - Keep dependencies updated using tools like `npm outdated` or `npm-check-updates`.

2. **Add Predefined Scripts**:
   - Add `pre` or `post` hooks for tasks:
     ```json
     {
       "scripts": {
         "prestart": "npm run build",
         "start": "node index.js",
         "poststart": "echo 'App started successfully!'"
       }
     }
     ```

3. **Integrate with CI/CD**:
   - Link `npm test` and `npm run build` to GitHub Actions for automated builds and testing.

4. **Use `dotenv` for Configurations**:
   - Load environment variables from `.env` files:
     ```bash
     npm install dotenv
     ```

   `index.js`:
   ```javascript
   require('dotenv').config();
   const dbHost = process.env.DB_HOST;
   console.log('Database Host:', dbHost);
   ```

---

**This setup ensures seamless **build**, **start**, and **test** workflows for all
components of our app. **
