# AgentMe Server - Platform Overview

## What is AgentMe Server?

AgentMe Server is a **self-hosted AI agent platform** that enables users to deploy and manage autonomous AI agents across multiple messaging channels. It provides a unified control plane for managing agents, channels, skills, and automations.

## Key Value Propositions

### For Developers

- **Open Source**: Full source code access, MIT licensed
- **Extensible**: Plugin system for custom channels and skills
- **Multi-Provider**: Support for OpenAI, Anthropic, Google, and 20+ providers
- **API-First**: WebSocket and HTTP APIs for integration

### For Operators

- **Self-Hosted**: Run on your own infrastructure
- **Multi-Channel**: WhatsApp, Telegram, Slack, Discord, WebChat, and more
- **Visual Management**: Dashboard for agents, channels, and tasks
- **Automation**: Cron scheduling and webhook triggers

### For End Users

- **Unified Interface**: Chat with all agents from one place
- **Persistent Memory**: Agents remember context across sessions
- **File Handling**: Upload and process documents, images
- **Real-Time**: Streaming responses with live typing

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AgentMe Server                           │
├─────────────────────────────────────────────────────────────┤
│  Web UI (Lit + Vite)                                        │
│  ├── Dashboard (Agent Management)                           │
│  ├── Chat Interface                                         │
│  └── Settings & Configuration                               │
├─────────────────────────────────────────────────────────────┤
│  Gateway (Node.js + WebSocket)                              │
│  ├── Session Management                                     │
│  ├── Channel Router                                         │
│  └── Tool Orchestrator                                      │
├─────────────────────────────────────────────────────────────┤
│  Channels                                                   │
│  ├── WhatsApp Business API                                  │
│  ├── Telegram Bot API                                       │
│  ├── Slack / Discord                                        │
│  ├── WebChat Widget                                         │
│  └── iMessage (macOS)                                       │
├─────────────────────────────────────────────────────────────┤
│  AI Providers                                               │
│  ├── OpenAI (GPT-4, GPT-3.5)                                │
│  ├── Anthropic (Claude)                                     │
│  ├── Google (Gemini)                                        │
│  └── 20+ additional providers                               │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Agents

AI personalities with specific configurations:

- **Identity**: Name, avatar, personality traits
- **Model**: LLM provider and model selection
- **Tools**: Skills and capabilities
- **Memory**: Persistent storage per agent

### Channels

Communication endpoints:

- **Inbound**: Receive messages from users
- **Outbound**: Send responses back
- **Binding**: Connect agents to channels

### Skills

Reusable capabilities:

- **Built-in**: Memory, file operations, web search
- **Custom**: User-defined tools
- **Sandboxed**: Secure execution environment

### Sessions

Conversation contexts:

- **Per-channel**: Isolated by channel + user
- **History**: Persistent message history
- **Context Window**: Managed for token limits

## Technical Specifications

| Feature        | Specification                   |
| -------------- | ------------------------------- |
| **Runtime**    | Node.js ≥ 22                    |
| **Frontend**   | Lit (Web Components) + Vite     |
| **Protocol**   | WebSocket + HTTP REST           |
| **Storage**    | File-based (config, memory)     |
| **Auth**       | API keys, OAuth, Session tokens |
| **Deployment** | Self-hosted, Docker, Cloud      |

## Integration Points

### WebSocket API

```javascript
const client = new GatewayClient("ws://localhost:18789");
await client.connect();
await client.request("chat.send", {
  sessionKey: "agent:main:telegram:dm:123",
  message: "Hello!",
});
```

### HTTP API

```bash
curl -X POST http://localhost:18789/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Support Bot"}'
```

### Webhook

```bash
# Configure webhook URL
curl -X POST http://localhost:18789/api/v1/webhooks \
  -d '{"url": "https://myapp.com/webhook", "events": ["message.received"]}'
```

## Security Model

- **Authentication**: Token-based with session management
- **Authorization**: Per-agent permissions
- **Sandboxing**: Tool execution in isolated contexts
- **Encryption**: TLS for all connections
- **Audit**: Comprehensive logging

## Use Cases

### Customer Support

- Deploy support agents on WhatsApp/Telegram
- Auto-assign tickets based on query type
- Escalate to humans when needed

### Personal Assistant

- Single-user deployment
- Calendar management
- Task reminders and scheduling

### Content Moderation

- Monitor group chats
- Auto-delete spam
- Report violations

### Automation

- Cron-based scheduled tasks
- Webhook-triggered workflows
- API integrations

## Comparison with Alternatives

| Feature           | AgentMe | OpenAI Assistants | Bot Framework |
| ----------------- | ------- | ----------------- | ------------- |
| Self-Hosted       | ✅      | ❌                | ⚠️            |
| Multi-Channel     | ✅      | ❌                | ✅            |
| Visual Dashboard  | ✅      | ❌                | ⚠️            |
| Extensible Skills | ✅      | ⚠️                | ✅            |
| Open Source       | ✅      | ❌                | ⚠️            |

## Next Steps

- [Installation Guide](./02_INSTALLATION.md)
- [Configuration](./03_CONFIGURATION.md)
- [API Reference](./04_API_REFERENCE.md)
- [Troubleshooting](./05_TROUBLESHOOTING.md)
