       MONITORING-ERROR-TRACKING


## **Monitoring**

Monitoring ensures our app is reliable and errors are caught early.

### **Use Sentry for Error Tracking**

Integrate Sentry into your Angular app for error and performance monitoring.

#### **Code : Angular Sentry Integration**
```bash
npm install @sentry/angular @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', 'https://your-app.com'],
    }),
  ],
  tracesSampleRate: 1.0,
});
```

---

