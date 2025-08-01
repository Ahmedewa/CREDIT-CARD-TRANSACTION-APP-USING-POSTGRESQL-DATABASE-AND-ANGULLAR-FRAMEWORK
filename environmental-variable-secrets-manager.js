          ENVIRONMENTAL VARIABLE SECRETS MANAGER
---

## **1. Using Environment Variables with Secret Managers**

Environment variables are a secure way to manage sensitive data (e.g., database credentials, API keys) fetched from secret managers. Below is an implementation guide for **Azure Key Vault**, **HashiCorp Vault**, and **AWS Secrets Manager**.

---

### **1.1 Azure Key Vault and Environment Variables**

#### **Step 1: Store Secrets in Azure Key Vault**
Add secrets to **Azure Key Vault**:
```bash
az keyvault secret set --vault-name MyKeyVault --name MyDatabaseSecret --value '{"username":"dbuser","password":"dbpassword"}'
```

#### **Step 2: Access Secrets in Node.js**
Install the required libraries:
```bash
npm install @azure/keyvault-secrets @azure/identity dotenv
```

#### **Step 3: Fetch Secrets and Set Environment Variables**
Create a script to fetch the secret and load it into environment variables:
```javascript
require('dotenv').config();
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const client = new SecretClient('https://my-key-vault.vault.azure.net', credential);

async function loadSecrets() {
  const secret = await client.getSecret('MyDatabaseSecret');
  const credentials = JSON.parse(secret.value);

  // Set environment variables
  process.env.DB_USERNAME = credentials.username;
  process.env.DB_PASSWORD = credentials.password;

  console.log('Secrets loaded into environment variables');
}

loadSecrets();
```

#### **Step 4: Use Environment Variables in Your App**
```javascript
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

console.log(`Database username: ${username}`);
```

---

### **1.2 HashiCorp Vault and Environment Variables**

#### **Step 1: Store Secrets in HashiCorp Vault**
Write a secret to the Vault:
```bash
vault kv put secret/my-database username=dbuser password=dbpassword
```

#### **Step 2: Fetch Secrets and Set Environment Variables**
Install the **node-vault** library:
```bash
npm install node-vault dotenv
```

Fetch secrets and set environment variables:
```javascript
require('dotenv').config();
const vault = require('node-vault')({
  endpoint: 'http://127.0.0.1:8200',
  token: process.env.VAULT_TOKEN,
});

async function loadSecrets() {
  const secret = await vault.read('secret/my-database');
  process.env.DB_USERNAME = secret.data.username;
  process.env.DB_PASSWORD = secret.data.password;

  console.log('Secrets loaded into environment variables');
}

loadSecrets();
```

---

### **1.3 AWS Secrets Manager and Environment Variables**

#### **Step 1: Store Secrets in AWS Secrets Manager**
```bash
aws secretsmanager create-secret --name MyDatabaseSecret --secret-string '{"username":"dbuser","password":"dbpassword"}'
```

#### **Step 2: Fetch Secrets and Set Environment Variables**
Install the AWS SDK:
```bash
npm install aws-sdk dotenv
```

Fetch secrets and set environment variables:
```javascript
require('dotenv').config();
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });

async function loadSecrets() {
  const data = await secretsManager.getSecretValue({ SecretId: 'MyDatabaseSecret' }).promise();
  const credentials = JSON.parse(data.SecretString);

  process.env.DB_USERNAME = credentials.username;
  process.env.DB_PASSWORD = credentials.password;

  console.log('Secrets loaded into environment variables');
}

loadSecrets();
```

---

