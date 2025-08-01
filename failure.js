               FAILURE TOLERANCE

## **. Implementing Failure Tolerance**

Failure tolerance ensures your app remains reliable during transient or permanent 
failures.

---

### **2.1 Handling Transient Failures**

#### **Scenario**: Network Issues or Temporary Resource Unavailability

**Solution**: Implement **retry logic** with **exponential backoff**.

#### **Code: Retry with Exponential Backoff**
```javascript
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('All retry attempts failed');
}

fetchWithRetry('https://api.example.com/data')
  .then((data) => console.log('Data:', data))
  .catch((error) => console.error('Error:', error));
```

---

### **2.2 Handling Permanent Failures**

#### **Scenario**: Repeated failures due to a critical issue.

**Solution**:
1. Use a **circuit breaker** to prevent further damage.
2. Implement **exponential backoff with jitter** to avoid congestion.

#### **Code : Circuit Breaker with Jitter**
```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000, // If the function takes longer, trigger failure
  errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
  resetTimeout: 10000, // Wait 10 seconds before trying again
};

const fetchWithCircuitBreaker = new CircuitBreaker(async (url) => {
  const response = await axios.get(url);
  return response.data;
}, options);

fetchWithCircuitBreaker.fallback(() => 'Fallback response');

fetchWithCircuitBreaker
  .fire('https://api.example.com/data')
  .then((data) => console.log('Data:', data))
  .catch((error) => console.error('Error:', error));
```

---

### **2.3 Automating Failure Detection**

#### **Failure Detection with Prometheus and Grafana**

1. **Setup Prometheus**:
   - Monitor API endpoints and system metrics using Prometheus.

2. **Setup Grafana**:
   - Create dashboards to visualize Prometheus metrics.
   - Example: Track error rates, API response times, and retry counts.

#### **Prometheus Configuration**
```yaml
scrape_configs:
  - job_name: 'node_app'
    static_configs:
      - targets: ['localhost:3000']
```

3. **Grafana Alerting**:
   - Configure alerts for high error rates or slow response times.
   - Example Alert Rule:
     - **Condition**: `rate(http_requests_total[5m]) > 100`
     - **Action**: Notify via Slack or PagerDuty.

---

### **2.4 Alerts and Escalation**

#### **Send Alerts via Email, Slack, or PagerDuty**

1. **Email Alerts**:
   - Use **Nodemailer** to send email alerts:
     ```javascript
     const nodemailer = require('nodemailer');

     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: 'your-email@gmail.com',
         pass: 'your-password',
       },
     });

     async function sendEmailAlert() {
       await transporter.sendMail({
         from: 'your-email@gmail.com',
         to: 'admin@example.com',
         subject: 'System Alert',
         text: 'High error rate detected!',
       });
       console.log('Email alert sent');
     }

     sendEmailAlert();
     ```

2. **Slack Alerts**:
   - Use Slack’s webhook API to send alerts:
     ```javascript
     const axios = require('axios');

     async function sendSlackAlert() {
       await axios.post('https://hooks.slack.com/services/your/webhook/url', {
         text: 'High error rate detected!',
       });
       console.log('Slack alert sent');
     }

     sendSlackAlert();
     ```

3. **PagerDuty Alerts**:
   - Use PagerDuty’s API for incident escalation:
     ```javascript
     const axios = require('axios');

     async function sendPagerDutyAlert() {
       await axios.post('https://events.pagerduty.com/v2/enqueue', {
         routing_key: 'your-routing-key',
         event_action: 'trigger',
         payload: {
           summary: 'High error rate detected!',
           severity: 'critical',
           source: 'node-app',
         },
       });
       console.log('PagerDuty alert sent');
     }

     sendPagerDutyAlert();
     ```

---

### **2.5 Task Quarantine After Multiple Retries**

#### **Scenario**: Prevent repeated execution of failing tasks.

**Solution**: Use **retry limits** and quarantine failing tasks.

#### **Code Example: Quarantine Logic**
```javascript
let retryCount = 0;

async function processTask(task) {
  try {
    await task();
    retryCount = 0; // Reset retry count on success
  } catch (error) {
    retryCount++;
    if (retryCount >= 3) {
      console.error('Task quarantined after 3 retries:', error.message);
      return;
    }

    console.error('Task failed. Retrying...', error.message);
    setTimeout(() => processTask(task), 2000); // Retry after delay
  }
}

//  task
processTask(async () => {
  throw new Error('Simulated failure');
});
```

---

### **Best Practices**

1. **Environment Variables**:
   - Use `.env` files for local development and secret managers in production.
   - Rotate secrets regularly.

2. **Failure Tolerance**:
   - Implement **retry logic** for transient failures.
   - Use **circuit breakers** to mitigate cascading failures.
   - Add **jitter** to backoff algorithms to avoid congestion.

3. **Monitoring and Alerts**:
   - Use **Prometheus** and **Grafana** for real-time failure detection.
   - Configure alerts for critical metrics (e.g., error rates, latency).
   - Automate escalation workflows (e.g., PagerDuty).

4. **Task Quarantine**:
   - Limit retries and quarantine failing tasks to prevent resource exhaustion.

---

### **Resources**
1. **Prometheus Docs**: [https://prometheus.io/docs/](https://prometheus.io/docs/)
2. **Grafana Docs**: [https://grafana.com/docs/](https://grafana.com/docs/)
3. **AWS Secrets Manager**: [https://aws.amazon.com/secrets-manager/](https://aws.amazon.com/secrets-manager/)
4. **Azure Key Vault**: [https://learn.microsoft.com/en-us/azure/key-vault/](https://learn.microsoft.com/en-us/azure/key-vault/)
5. **HashiCorp Vault**: [https://www.vaultproject.io/](https://www.vaultproject.io/)

