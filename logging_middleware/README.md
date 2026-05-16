# Campus Logging Middleware

Structured logging for the Campus Notifications frontend.

## Usage

```typescript
import { Log } from "@campus/logging-middleware";

Log("frontend", "info", "component", "Fetched notifications successfully");
Log("frontend", "error", "api", "Request failed", { status: 500 });
```

## Parameters

| Param | Values |
|-------|--------|
| stack | `frontend`, `backend` |
| level | `debug`, `info`, `warn`, `error`, `fatal` |
| package | `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils` |
| message | Human-readable string |
| context | Optional metadata object |

## API

- `Log(stack, level, package, message, context?)`
- `configureLogger({ minLevel, sink })`
- `getLogBuffer()` — inspect recent entries in tests
- `clearLogBuffer()`

Application code must not call `console.log()`. The middleware may emit via `console.info` / `warn` / `error` internally.

## Build

```bash
npm install
npm run build
```
