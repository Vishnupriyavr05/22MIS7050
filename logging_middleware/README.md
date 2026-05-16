# Campus Logging Middleware

This package provides structured logging for the **Campus Notifications** frontend. Use it everywhere you would normally log events — API calls, page loads, filters, errors — instead of `console.log()`.

---

## Who should use this?

If you are setting up or extending the Campus Notifications app (or any frontend that depends on this package), follow the steps below to install the middleware and log messages in the correct format.

---

## Setup

### 1. Install the package

The frontend already links this folder as a local dependency. If you are adding it to a new project, add this to `package.json`:

```json
"dependencies": {
  "@campus/logging-middleware": "file:../logging_middleware"
}
```

Then install from the frontend folder:

```bash
cd notification_app_fe
npm install
```

No separate build step is required — the package runs directly from `src/`.

### 2. Import and use in your code

At the top of any file where you need logging:

```javascript
import { Log } from "@campus/logging-middleware";
```

### 3. Optional: set minimum log level (frontend app)

In the app entry (e.g. `AppProviders.jsx`), you can raise the minimum level so debug noise is hidden:

```javascript
import { configureLogger } from "@campus/logging-middleware";

configureLogger({ minLevel: "info" });
```

---

## How to write a log

Call `Log` with four required arguments and one optional object:

```javascript
Log(stack, level, package, message, context);
```

### Example — successful API call

```javascript
Log("frontend", "info", "api", "Fetched notifications successfully", {
  count: 10,
  page: 1,
});
```

### Example — API error

```javascript
Log("frontend", "error", "api", "API request failed", {
  url: "/notifications",
  status: 401,
  message: "Unauthorized",
});
```

### Example — page load

```javascript
Log("frontend", "info", "page", "Priority inbox page loaded");
```

### Example — filter or state change

```javascript
Log("frontend", "info", "state", "Notification filter changed", {
  filter: "Placement",
});
```

---

## Allowed values

Use only these values so logs stay consistent across the project.

| Parameter | What to pass | Allowed values |
|-----------|----------------|----------------|
| **stack** | Where the log comes from | `frontend`, `backend` |
| **level** | How serious the event is | `debug`, `info`, `warn`, `error`, `fatal` |
| **package** | Which part of the app logged it | `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils` |
| **message** | Short description of what happened | Any clear string |
| **context** | Extra details (optional) | Object, e.g. `{ page: 1, filter: "Event" }` |

### When to use each level

| Level | Use when |
|-------|----------|
| `debug` | Detailed tracing (e.g. outgoing request metadata) |
| `info` | Normal success paths (page loaded, data fetched) |
| `warn` | Recoverable issues (API fallback to mock data) |
| `error` | Failures that need attention |
| `fatal` | Critical failures (rare) |

### Which package name to use

| Package | Use in |
|---------|--------|
| `api` | Axios / fetch layer, interceptors |
| `component` | React components |
| `hook` | Custom hooks |
| `page` | Page-level logic |
| `state` | Filters, pagination, local state updates |
| `auth` | Register, token generation |
| `utils` | Helpers (e.g. priority sorting) |

---

## Important rules

1. **Do not use `console.log()`** in application code. Always use `Log()` instead.  
2. The middleware may use `console.info`, `console.warn`, or `console.error` internally — that is expected.  
3. Keep messages short and actionable so reviewers and evaluators can follow the app flow from logs alone.

---

## Where logging is used in this project

You should add (or maintain) logs in:

- API requests and responses (`api`)
- Authentication (`auth`)
- Page mounts (`page`)
- React Query hooks (`hook`)
- Filter and pagination actions (`state`)
- UI interactions such as the notification bell (`component`)

---

## Extra helpers (optional)

These are mainly useful for debugging or tests:

```javascript
import { configureLogger, getLogBuffer, clearLogBuffer } from "@campus/logging-middleware";

// Only show info and above
configureLogger({ minLevel: "info" });

// Read recent logs in memory
const recent = getLogBuffer();

// Clear the in-memory buffer
clearLogBuffer();
```

---

## Troubleshooting

| Problem | What to do |
|---------|------------|
| `Cannot find module '@campus/logging-middleware'` | Run `npm install` inside `notification_app_fe` and confirm the `file:../logging_middleware` path in `package.json`. |
| Logs not visible in the browser | Check the browser console — logs appear as structured lines, not `console.log`. Ensure level is not filtered out by `configureLogger`. |
| Next.js shows logs as errors | API 401 responses are logged as `warn`, not `error`, to avoid false alarms before a token is configured. |

---

## Quick reference

```javascript
Log("frontend", "info", "component", "Fetched notifications successfully");
```

That is the standard pattern: **stack → level → package → message → optional context**.
