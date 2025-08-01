               APACHE SPARK


### ** Apache Spark for Data Processing**

Use **Apache Spark** for processing large datasets (e.g., transaction logs).

#### **Process Transactions with PySpark**
```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("TransactionProcessor").getOrCreate()

# Load transaction data
data = spark.read.csv("transactions.csv", header=True, inferSchema=True)

# Filter approved transactions
approved = data.filter(data.approved == True)

# Save results
approved.write.csv("approved-transactions.csv")
```

---

