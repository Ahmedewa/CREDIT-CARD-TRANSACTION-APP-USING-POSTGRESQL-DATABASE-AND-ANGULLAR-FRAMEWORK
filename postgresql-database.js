
   POSTGRESQL-DATABASE-AND-EXTENSIONS

** A Comprehensive Guide for Integrating PostgreSQL with Extensions in
  our Angular Project**  


Integrating **PostgreSQL** with the following extensions in an **Angular project**:  
- **Citus** (for scaling PostgreSQL horizontally),  
- **pg-pool-2** (for connection pooling),  
- **PL/Proxy** (for distributed database logic),  
- **Alembic** (for database migrations).  

---

## **1. Overview of PostgreSQL Extensions**

### **Extensions Overview**  
| **Extension**  | **Purpose**                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| **Citus**       | Scales PostgreSQL horizontally for distributed workloads.                  |
| **pg-pool-2**   | Manages connection pooling for PostgreSQL to improve performance.          |
| **PL/Proxy**    | Facilitates distributed function calls for sharded databases.              |
| **Alembic**     | Handles schema migrations (similar to `FlywayDB` or `Liquibase`).          |

---

## **2. Project Setup**

### **2.1 Install PostgreSQL Extensions**

1. **Install PostgreSQL** (if not already installed):  
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Enable Extensions**:  
   Connect to PostgreSQL and enable extensions:  
   ```sql
   CREATE EXTENSION IF NOT EXISTS citus;
   CREATE EXTENSION IF NOT EXISTS plproxy;
   ```

3. **Install `pg-pool-2`** library for Node.js backend:  
   ```bash
   npm install pg-pool-2
   ```

4. **Install Alembic** for migrations:  
   ```bash
   pip install alembic
   ```

---

### **2.2  Directory Structure**

```plaintext
credit-card-app/
├── backend/
│   ├── migrations/   # Alembic migrations
│   ├── db/           # Database-related scripts
│   ├── index.js      # Backend entry point
│   ├── package.json  # Backend dependencies
├── frontend/
│   ├── src/
│   ├── angular.json  # Angular project configuration
├── docker-compose.yml # Optional: Use Docker for PostgreSQL setup
```

---

## **3. Backend Integration**

The backend is responsible for interacting with PostgreSQL. Below is how to 
  integrate **Citus**, **pg-pool-2**, and **PL/Proxy**.

---

### **3.1 Database Setup**

#### **Step 1: Configure Citus for Distributed Queries**

1. **Create Worker Nodes**:  
   In a distributed environment, Citus requires worker nodes. Add them to your PostgreSQL cluster:  
   ```sql
   SELECT * from master_add_node('worker1', 5432);
   SELECT * from master_add_node('worker2', 5432);
   ```

2. **Create a Distributed Table**:  
   Use Citus to shard a table across worker nodes:  
   ```sql
   CREATE TABLE transactions (
     id SERIAL PRIMARY KEY,
     user_id INT,
     amount DECIMAL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   SELECT create_distributed_table('transactions', 'id');
   ```

---

#### **Step 2: Configure PL/Proxy for Distributed Logic**

PL/Proxy is used to execute functions on sharded data.

1. **Create a PL/Proxy Function**:  
   Define a function that distributes calls across shards:  
   ```sql
   CREATE FUNCTION get_user_transactions(user_id INT)
   RETURNS SETOF transactions AS $$
   BEGIN
       RETURN QUERY EXECUTE 'SELECT * FROM transactions WHERE user_id = $1' USING user_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

   This function routes queries to the relevant shard.

---

#### **Step 3: Backend Code with `pg-pool-2`**

`pg-pool-2` is used to manage database connections.

1. **Install `pg-pool-2`**:  
   ```bash
   npm install pg-pool-2
   ```

2. **Configure `pg-pool-2` in `db.js`**:  
   ```javascript
   const PgPool = require('pg-pool-2');

   const pool = new PgPool({
     user: 'postgres',
     host: 'localhost',
     database: 'credit_card_app',
     password: 'yourpassword',
     port: 5432,
   });

   module.exports = pool;
   ```

3. **Query with Connection Pooling**:  
   ```javascript
   const pool = require('./db');

   // Get user transactions
   async function getUserTransactions(userId) {
     const query = 'SELECT * FROM get_user_transactions($1)';
     const result = await pool.query(query, [userId]);
     return result.rows;
   }

   module.exports = { getUserTransactions };
   ```

---

### **3.2 Alembic for Database Migrations**

Alembic manages schema migrations for your database.

1. **Initialize Alembic**:  
   ```bash
   alembic init backend/migrations
   ```

2. **Configure `alembic.ini`**:  
   Update the `sqlalchemy.url` with your database connection string:  
   ```ini
   sqlalchemy.url = postgresql+psycopg2://postgres:yourpassword@localhost:5432/credit_card_app
   ```

3. **Generate Migrations**:  
   Create a migration script:  
   ```bash
   alembic revision --autogenerate -m "Add transactions table"
   ```

4. **Apply Migrations**:  
   Run the migration to update your database:  
   ```bash
   alembic upgrade head
   ```

---

## **4. Frontend Integration**

Our Angular frontend interacts with the backend using HTTP APIs.

### **4.1 Angular Service**

1. **Create a Service for Transactions**:  
   ```typescript
   import { HttpClient } from '@angular/common/http';
   import { Injectable } from '@angular/core';

   @Injectable({
     providedIn: 'root',
   })
   export class TransactionService {
     private apiUrl = 'http://localhost:3000';

     constructor(private http: HttpClient) {}

     getUserTransactions(userId: number) {
       return this.http.get(`${this.apiUrl}/transactions/${userId}`);
     }
   }
   ```

2. **Consume the Service in a Component**:  
   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { TransactionService } from './transaction.service';

   @Component({
     selector: 'app-transactions',
     template: `
       <div *ngIf="transactions">
         <h3>Your Transactions</h3>
         <ul>
           <li *ngFor="let transaction of transactions">
             {{ transaction.amount }} - {{ transaction.created_at }}
           </li>
         </ul>
       </div>
     `,
   })
   export class TransactionsComponent implements OnInit {
     transactions: any[] = [];

     constructor(private transactionService: TransactionService) {}

     ngOnInit() {
       const userId = 1; // Example user ID
       this.transactionService.getUserTransactions(userId).subscribe((data) => {
         this.transactions = data;
       });
     }
   }
   ```

---

## **5. Best Practices**

1. **For Citus**:
   - Use composite keys for sharded tables to avoid skewed data distribution.
   - Monitor worker nodes with Citus management functions (`pg_stat_activity`, `pg_dist_*`).

2. **For pg-pool-2**:
   - Limit the maximum connection pool size to avoid resource exhaustion.
   - Use `idleTimeoutMillis` to release idle connections:
     ```javascript
     const pool = new PgPool({
       max: 20,
       idleTimeoutMillis: 30000,
     });
     ```

3. **For PL/Proxy**:
   - Use PL/Proxy only for OLTP workloads (e.g., sharded queries). Avoid for OLAP workloads.

4. **For Alembic**:
   - Keep migrations small and incremental.
   - Always test migrations in a staging environment before applying to production.

---

## **6. Resources**

1. **Citus Documentation**:  
   [https://docs.citusdata.com/en/v11.1/](https://docs.citusdata.com/en/v11.1/)

2. **pg-pool-2 GitHub**:  
   [https://github.com/brianc/node-pg-pool](https://github.com/brianc/node-pg-pool)

3. **PL/Proxy Documentation**:  
   [https://plproxy.github.io/](https://plproxy.github.io/)

4. **Alembic Documentation**:  
   [https://alembic.sqlalchemy.org/](https://alembic.sqlalchemy.org/)

---

**This setup integrates PostgreSQL and its powerful extensions with 
our Angular project while ensuring scalability, maintainability,
  and performance. **
 
