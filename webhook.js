                 WEBHOOK

### ** Webhook for Event Notifications**

Set up a webhook to notify external services of transaction events.

#### **: Webhook Listener**
```javascript
const express = require('express');
const app = express();

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.sendStatus(200);
});

app.listen(5000, () => console.log('Webhook listener running on port 5000'));
```
