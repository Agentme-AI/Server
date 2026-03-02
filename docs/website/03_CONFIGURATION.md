# Configuration Guide

## Configuration Methods

AgentMe Server can be configured through three methods:

1. **Web UI** (recommended for beginners)
2. **CLI Commands**
3. **Configuration Files** (JSON)

## Web UI Configuration

Access the configuration editor at `http://localhost:18789`:

1. Navigate to **Settings** → **Config**
2. Edit values using the visual editor
3. Click **Save** to apply changes

### Configurable Sections

| Section      | Description                    |
| ------------ | ------------------------------ |
| **Agents**   | Create and configure AI agents |
| **Channels** | Connect messaging platforms    |
| **Models**   | Set up AI model providers      |
| **Tools**    | Enable/disable skills          |
| **Security** | Authentication and permissions |

## CLI Configuration

### View Configuration

```bash
# Show full config
agentme config show

# Get specific value
agentme config get agents.list[0].name

# Check specific section
agentme config get channels.telegram
```

### Edit Configuration

```bash
# Set a value
agentme config set agents.defaults.model gpt-4o

# Add array element
agentme config set agents.list[+] '{"id": "support", "name": "Support Bot"}'

# Remove a key
agentme config remove agents.list[1]
```

### Environment Variables

```bash
# Set via environment
export OPENAI_API_KEY=sk-...
export TELEGRAM_BOT_TOKEN=...

# Run with env vars
agentme gateway
```

## Configuration File Reference

### Main Configuration (`~/.agentme/config.json`)

```json
{
  "agents": {
    "defaults": {
      "model": "gpt-4o",
      "temperature": 0.7,
      "maxTokens": 4096
    },
    "list": [
      {
        "id": "main",
        "name": "Main Assistant",
        "workspace": "./workspace/main",
        "model": "gpt-4o",
        "identity": {
          "name": "Agent",
          "emoji": "🤖"
        }
      }
    ]
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}"
    },
    "webchat": {
      "enabled": true,
      "port": 18790
    }
  },
  "models": {
    "providers": [
      {
        "id": "openai",
        "enabled": true,
        "apiKey": "${OPENAI_API_KEY}"
      }
    ]
  },
  "tools": {
    "sandbox": {
      "enabled": true,
      "mode": "restricted"
    }
  },
  "auth": {
    "enabled": false,
    "sessionTimeout": 86400
  }
}
```

### Agent Identity (`IDENTITY.md`)

Each agent workspace contains an `IDENTITY.md` file:

```markdown
# Agent Identity

- Name: Support Bot
- Emoji: 🎧
- Avatar: https://example.com/avatar.png
- Vibe: Helpful and professional
- Theme: Blue and white
```

### Agent Memory (`MEMORY.md`)

Persistent memory storage:

```markdown
# Memory

## User Preferences

- Favorite color: blue
- Preferred language: English

## Conversation History

Last discussed: Project timeline
```

## Agent Configuration

### Creating an Agent

**Via Web UI:**

1. Go to **Dashboard**
2. Click **Add Agent**
3. Fill in name, model, and identity
4. Save

**Via CLI:**

```bash
agentme agent create --name "Support Bot" --model gpt-4o
```

**Via Config:**

```json
{
  "id": "support",
  "name": "Support Bot",
  "workspace": "./workspace/support",
  "model": "gpt-4o",
  "temperature": 0.5,
  "systemPrompt": "You are a helpful support assistant...",
  "tools": {
    "allow": ["memory", "web-search"]
  }
}
```

### Agent Options

| Option         | Type   | Description                            |
| -------------- | ------ | -------------------------------------- |
| `id`           | string | Unique identifier                      |
| `name`         | string | Display name                           |
| `model`        | string | AI model (gpt-4o, claude-3-opus, etc.) |
| `temperature`  | number | Creativity (0-2)                       |
| `maxTokens`    | number | Max response length                    |
| `systemPrompt` | string | Base personality                       |
| `workspace`    | string | Data directory path                    |

## Channel Configuration

### Telegram

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
      "webhookUrl": "https://yourdomain.com/webhook/telegram",
      "allowedChats": ["-1001234567890"]
    }
  }
}
```

**Setup Steps:**

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create new bot with `/newbot`
3. Copy the bot token
4. Add to AgentMe config

### WhatsApp

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "apiKey": "your-whatsapp-api-key",
      "phoneNumberId": "123456789",
      "businessAccountId": "987654321"
    }
  }
}
```

**Setup Steps:**

1. Create Meta Developer account
2. Set up WhatsApp Business API
3. Get API credentials
4. Configure webhook URL

### WebChat

```json
{
  "channels": {
    "webchat": {
      "enabled": true,
      "port": 18790,
      "cors": {
        "origins": ["https://yourdomain.com"]
      },
      "widget": {
        "title": "Chat with us",
        "primaryColor": "#3ddc97"
      }
    }
  }
}
```

**Embed Widget:**

```html
<script src="http://localhost:18790/widget.js"></script>
<script>
  AgentMeWidget.init({
    serverUrl: "http://localhost:18789",
    agentId: "main",
  });
</script>
```

## Model Provider Configuration

### OpenAI

```json
{
  "models": {
    "providers": [
      {
        "id": "openai",
        "enabled": true,
        "apiKey": "${OPENAI_API_KEY}",
        "baseUrl": "https://api.openai.com/v1",
        "models": ["gpt-4o", "gpt-4o-mini"]
      }
    ]
  }
}
```

### Anthropic Claude

```json
{
  "models": {
    "providers": [
      {
        "id": "anthropic",
        "enabled": true,
        "apiKey": "${ANTHROPIC_API_KEY}",
        "models": ["claude-3-opus", "claude-3-sonnet"]
      }
    ]
  }
}
```

### Google Gemini

```json
{
  "models": {
    "providers": [
      {
        "id": "google",
        "enabled": true,
        "apiKey": "${GOOGLE_API_KEY}",
        "models": ["gemini-1.5-pro", "gemini-1.5-flash"]
      }
    ]
  }
}
```

### Local Models (Ollama)

```json
{
  "models": {
    "providers": [
      {
        "id": "ollama",
        "enabled": true,
        "baseUrl": "http://localhost:11434",
        "models": ["llama3.2", "mistral"]
      }
    ]
  }
}
```

## Security Configuration

### Authentication

```json
{
  "auth": {
    "enabled": true,
    "type": "jwt",
    "secret": "${JWT_SECRET}",
    "sessionTimeout": 86400,
    "requireAuth": ["/api/admin/*"]
  }
}
```

### API Keys

```bash
# Generate API key
agentme auth key generate --name "Production"

# List keys
agentme auth key list

# Revoke key
agentme auth key revoke <key-id>
```

### Sandbox Settings

```json
{
  "tools": {
    "sandbox": {
      "enabled": true,
      "mode": "restricted",
      "allowedPaths": ["./workspace/*"],
      "deniedPaths": ["~/.ssh", "~/.env"],
      "maxExecutionTime": 30000
    }
  }
}
```

## Advanced Configuration

### Environment Variable Substitution

Use `${VAR_NAME}` syntax for secrets:

```json
{
  "channels": {
    "telegram": {
      "botToken": "${TELEGRAM_BOT_TOKEN}"
    }
  }
}
```

AgentMe automatically substitutes these from:

1. Environment variables
2. `.env` file
3. System keychain (macOS)

### Configuration Validation

```bash
# Validate config
agentme config validate

# Check with schema
agentme config validate --strict

# Get detailed errors
agentme config validate --verbose
```

### Backup and Restore

```bash
# Export configuration
agentme config export > backup.json

# Import configuration
agentme config import backup.json

# Restore defaults
agentme config reset
```

## Next Steps

- [API Reference](./04_API_REFERENCE.md)
- [Creating Your First Agent](./06_FIRST_AGENT.md)
- [Channel Setup](./07_CHANNELS.md)
