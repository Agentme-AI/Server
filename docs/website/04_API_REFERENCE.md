# API Reference

## Base URLs

| Environment | URL                      |
| ----------- | ------------------------ |
| Local       | `http://localhost:18789` |
| WebSocket   | `ws://localhost:18789`   |

## Authentication

### API Key Authentication

Include the API key in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:18789/api/v1/agents
```

### Session Authentication

For WebSocket connections:

```javascript
const ws = new WebSocket("ws://localhost:18789", [], {
  headers: { Authorization: "Bearer YOUR_TOKEN" },
});
```

## REST API Endpoints

### Agents

#### List Agents

```http
GET /api/v1/agents
```

**Response:**

```json
{
  "agents": [
    {
      "id": "main",
      "name": "Main Assistant",
      "status": "online"
    }
  ],
  "count": 1,
  "defaultId": "main"
}
```

#### Create Agent

```http
POST /api/v1/agents
Content-Type: application/json

{
  "id": "support",
  "name": "Support Bot",
  "model": "gpt-4o"
}
```

#### Get Agent

```http
GET /api/v1/agents/:id
```

#### Update Agent

```http
PUT /api/v1/agents/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.png"
}
```

#### Delete Agent

```http
DELETE /api/v1/agents/:id
```

### Channels

#### List Channels

```http
GET /api/v1/channels
```

#### Configure Channel

```http
POST /api/v1/channels/:type
Content-Type: application/json

{
  "enabled": true,
  "botToken": "your-token"
}
```

### Chat

#### Send Message

```http
POST /api/v1/chat/send
Content-Type: application/json

{
  "sessionKey": "agent:main:telegram:dm:123",
  "message": "Hello!",
  "attachments": []
}
```

**Response:**

```json
{
  "messageId": "msg_123",
  "status": "sent",
  "timestamp": "2026-03-02T12:00:00Z"
}
```

#### Get Chat History

```http
GET /api/v1/chat/history?sessionKey=agent:main:telegram:dm:123&limit=50
```

### Sessions

#### List Sessions

```http
GET /api/v1/sessions
```

#### Get Session

```http
GET /api/v1/sessions/:sessionKey
```

#### Clear Session

```http
DELETE /api/v1/sessions/:sessionKey
```

### Configuration

#### Get Config

```http
GET /api/v1/config
```

#### Update Config

```http
PUT /api/v1/config
Content-Type: application/json

{
  "path": "agents.defaults.model",
  "value": "gpt-4o"
}
```

### Health & Status

#### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "version": "2026.2.9",
  "uptime": 3600
}
```

#### Server Status

```http
GET /api/v1/status
```

**Response:**

```json
{
  "status": "running",
  "agents": 5,
  "channels": 3,
  "sessions": 12,
  "memory": {
    "used": 128,
    "total": 512
  }
}
```

## WebSocket Protocol

### Connection

```javascript
const ws = new WebSocket("ws://localhost:18789");

ws.onopen = () => {
  // Authenticate
  ws.send(
    JSON.stringify({
      type: "auth",
      token: "YOUR_API_KEY",
    }),
  );
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
```

### Request Format

```json
{
  "id": "req_123",
  "method": "agents.list",
  "params": {}
}
```

### Response Format

```json
{
  "id": "req_123",
  "result": {
    "agents": []
  },
  "error": null
}
```

### Error Format

```json
{
  "id": "req_123",
  "result": null,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with id 'xyz' not found"
  }
}
```

## WebSocket Methods

### Agents

#### agents.list

```json
{
  "method": "agents.list",
  "params": {}
}
```

#### agents.create

```json
{
  "method": "agents.create",
  "params": {
    "name": "New Agent",
    "workspace": "./workspace/new"
  }
}
```

#### agents.update

```json
{
  "method": "agents.update",
  "params": {
    "agentId": "main",
    "name": "Updated Name",
    "avatar": "https://example.com/avatar.png"
  }
}
```

#### agents.delete

```json
{
  "method": "agents.delete",
  "params": {
    "agentId": "support"
  }
}
```

### Chat

#### chat.send

```json
{
  "method": "chat.send",
  "params": {
    "sessionKey": "agent:main:telegram:dm:123",
    "message": "Hello!",
    "attachments": []
  }
}
```

#### chat.history

```json
{
  "method": "chat.history",
  "params": {
    "sessionKey": "agent:main:telegram:dm:123",
    "limit": 50
  }
}
```

### Sessions

#### sessions.list

```json
{
  "method": "sessions.list",
  "params": {}
}
```

#### sessions.preview

```json
{
  "method": "sessions.preview",
  "params": {
    "keys": ["agent:main:telegram:dm:123"]
  }
}
```

### Files

#### agents.files.list

```json
{
  "method": "agents.files.list",
  "params": {
    "agentId": "main"
  }
}
```

#### agents.files.get

```json
{
  "method": "agents.files.get",
  "params": {
    "agentId": "main",
    "name": "IDENTITY.md"
  }
}
```

#### agents.files.set

```json
{
  "method": "agents.files.set",
  "params": {
    "agentId": "main",
    "name": "MEMORY.md",
    "content": "# Memory\n\nUser likes blue."
  }
}
```

### Identity

#### agent.identity.get

```json
{
  "method": "agent.identity.get",
  "params": {
    "agentId": "main"
  }
}
```

## Webhooks

### Configure Webhook

```http
POST /api/v1/webhooks
Content-Type: application/json

{
  "url": "https://yourapp.com/webhook",
  "events": ["message.received", "agent.response"],
  "secret": "webhook-secret"
}
```

### Webhook Events

#### message.received

```json
{
  "event": "message.received",
  "timestamp": "2026-03-02T12:00:00Z",
  "data": {
    "sessionKey": "agent:main:telegram:dm:123",
    "message": {
      "id": "msg_123",
      "text": "Hello",
      "from": "user_456"
    }
  }
}
```

#### agent.response

```json
{
  "event": "agent.response",
  "timestamp": "2026-03-02T12:00:01Z",
  "data": {
    "sessionKey": "agent:main:telegram:dm:123",
    "response": {
      "text": "Hello! How can I help?",
      "agentId": "main"
    }
  }
}
```

### Webhook Signature

Verify webhook authenticity:

```javascript
const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

## Error Codes

| Code              | Description                  |
| ----------------- | ---------------------------- |
| `INVALID_REQUEST` | Malformed request            |
| `UNAUTHORIZED`    | Authentication failed        |
| `AGENT_NOT_FOUND` | Agent does not exist         |
| `CHANNEL_ERROR`   | Channel communication failed |
| `MODEL_ERROR`     | AI provider error            |
| `RATE_LIMITED`    | Too many requests            |
| `CONFIG_ERROR`    | Invalid configuration        |

## Rate Limits

| Endpoint  | Limit                 |
| --------- | --------------------- |
| REST API  | 100/minute            |
| WebSocket | 1000/minute           |
| Chat Send | 60/minute per session |

## SDK Examples

### JavaScript/TypeScript

```typescript
import { AgentMeClient } from "@agentme/sdk";

const client = new AgentMeClient("http://localhost:18789");
await client.connect("YOUR_API_KEY");

// List agents
const agents = await client.agents.list();

// Send message
await client.chat.send({
  sessionKey: "agent:main:telegram:dm:123",
  message: "Hello!",
});
```

### Python

```python
import agentme

client = agentme.Client("http://localhost:18789")
client.connect("YOUR_API_KEY")

# List agents
agents = client.agents.list()

# Send message
client.chat.send(
    session_key="agent:main:telegram:dm:123",
    message="Hello!"
)
```

### cURL

```bash
# Send a message
curl -X POST http://localhost:18789/api/v1/chat/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionKey": "agent:main:telegram:dm:123",
    "message": "Hello!"
  }'
```
