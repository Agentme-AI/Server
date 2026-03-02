# Feature Guide

## Dashboard Overview

The AgentMe Dashboard is your central command center for managing AI agents, channels, and automations.

### Accessing the Dashboard

Navigate to `http://localhost:18789` in your browser.

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Logo    Dashboard  Chat  Settings                   User  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Agent Overview                                     │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                  │   │
│  │  │ Agent 1│ │ Agent 2│ │ Agent 3│  + Add Agent     │   │
│  │  │  🤖    │ │  🎧    │ │  📊    │                  │   │
│  │  └────────┘ └────────┘ └────────┘                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │ Recent Activity     │  │ Task Results                │  │
│  │ • Task completed    │  │ ✓ Backup (2 min ago)       │  │
│  │ • Message received  │  │ ✓ Report (1 hour ago)      │  │
│  │ • Agent updated     │  │ ✗ Error (3 hours ago)      │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Agent Cards

### Card Layout

Each agent is displayed as a profile card:

```
┌───────────────────┐
│  ┌─────────────┐  │
│  │    🤖       │  │  ← Avatar (emoji or image)
│  │  📷 Change  │  │  ← Click to edit
│  └─────────────┘  │
│                   │
│  Support Bot      │  ← Agent Name
│  Agent ID: support│  ← Role/ID
│  Click to configure│ ← Hint
└───────────────────┘
```

### Card Actions

| Action          | How to Access            |
| --------------- | ------------------------ |
| **Edit Agent**  | Click the avatar         |
| **Configure**   | Click the card body      |
| **Delete**      | Right-click → Delete     |
| **Set Default** | Settings → Default Agent |

### Inline Editing

Click any agent avatar to edit inline:

```
┌───────────────────┐
│                   │
│  [Avatar Preview] │
│                   │
│  Avatar: 🤖       │  ← Emoji or URL input
│  [Upload Image]   │  ← Image upload button
│  Name: Support Bot│  ← Name input
│                   │
│  [Save] [Cancel]  │
│                   │
└───────────────────┘
```

## Chat Interface

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Sessions    │  Chat Area                          │ Tools   │
│             │                                     │         │
│ Main Agent  │  ┌─────────────────────────────┐   │ 🛠️     │
│ Telegram    │  │ Assistant                   │   │ 📎     │
│ WhatsApp    │  │ Hello! How can I help?      │   │ 🔊     │
│             │  └─────────────────────────────┘   │         │
│ + New       │                                     │         │
│             │  ┌─────────────────────────────┐   │         │
│             │  │ User                        │   │         │
│             │  │ What's the weather?         │   │         │
│             │  └─────────────────────────────┘   │         │
│             │                                     │         │
│             │  [Type a message...]     [Send]   │         │
└─────────────────────────────────────────────────────────────┘
```

### Features

| Feature               | Description                                 |
| --------------------- | ------------------------------------------- |
| **Session Switching** | Left sidebar shows all active conversations |
| **File Attachments**  | Drag & drop or click attachment button      |
| **Voice Messages**    | Click microphone to record (if enabled)     |
| **Tool Output**       | Click tool results to expand details        |
| **Markdown Support**  | Responses support formatting, code blocks   |
| **Streaming**         | Real-time response streaming                |

### Keyboard Shortcuts

| Shortcut        | Action          |
| --------------- | --------------- |
| `Enter`         | Send message    |
| `Shift + Enter` | New line        |
| `Escape`        | Stop generation |
| `/`             | Focus search    |
| `Ctrl + N`      | New session     |

## Agent Manager

### Creating an Agent

1. Click **Add Agent** on Dashboard
2. Fill in the form:
   - **ID**: Unique identifier (e.g., `support`)
   - **Name**: Display name (e.g., "Support Bot")
   - **Model**: AI model (GPT-4, Claude, etc.)
   - **Avatar**: Emoji or image URL
3. Click **Create**

### Agent Configuration

Navigate to an agent to configure:

#### Identity Tab

```
Name:         Support Bot
Emoji:        🎧
Avatar URL:   https://... (optional)
Vibe:         Helpful and professional
Theme:        Blue
```

#### Model Tab

```
Provider:     OpenAI
Model:        gpt-4o
Temperature:  0.7
Max Tokens:   4096
Context:      8000
```

#### Tools Tab

```
☑ Memory
☑ File Operations
☑ Web Search
☐ Browser Automation
☐ Code Execution
```

#### Channels Tab

```
Telegram:     ☑ Enabled
WhatsApp:     ☐ Enabled
WebChat:      ☑ Enabled
```

## Channels

### Channel List

View all connected channels:

```
┌──────────────────────────────────┐
│ Channels              [+ Add]   │
├──────────────────────────────────┤
│                                  │
│ Telegram Bot        🟢 Online   │
│ @my_bot                         │
│                                  │
│ WhatsApp Business   🟡 Warning  │
│ +1234567890                     │
│                                  │
│ WebChat Widget      🟢 Online   │
│ Port: 18790                     │
│                                  │
└──────────────────────────────────┘
```

### Adding a Channel

1. Click **+ Add Channel**
2. Select channel type
3. Enter credentials
4. Test connection
5. Save

### Channel Status

| Status      | Meaning               |
| ----------- | --------------------- |
| 🟢 Online   | Connected and working |
| 🟡 Warning  | Connected with issues |
| 🔴 Offline  | Not connected         |
| ⚪ Disabled | Manually disabled     |

## Cron & Scheduling

### Task List

```
┌─────────────────────────────────────────────┐
│ Scheduled Tasks                  [+ New]   │
├─────────────────────────────────────────────┤
│                                             │
│ Daily Report                       Enabled │
│ Cron: 0 9 * * *                   ┌───┐   │
│ Agent: Main Agent                 │Run│   │
│                                   └───┘   │
│                                             │
│ Weekly Backup                     Disabled │
│ Cron: 0 0 * * 0                   ┌───┐   │
│ Agent: System Agent               │Run│   │
│                                   └───┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Creating a Task

1. Click **+ New Task**
2. Configure:
   - **Name**: Task identifier
   - **Cron**: Schedule expression
   - **Agent**: Which agent runs it
   - **Prompt**: Instructions for the agent
3. Save

### Cron Expressions

| Expression    | Schedule         |
| ------------- | ---------------- |
| `0 9 * * *`   | Daily at 9 AM    |
| `0 */6 * * *` | Every 6 hours    |
| `0 0 * * 0`   | Weekly on Sunday |
| `0 0 1 * *`   | Monthly on 1st   |

## Usage & Analytics

### Dashboard Metrics

```
┌─────────────────────────────────────────────┐
│ Usage Overview                              │
├─────────────────────────────────────────────┤
│                                             │
│  Sessions:        1,234                     │
│  Messages:        5,678                     │
│  Tokens:          2.3M                      │
│  Cost:            $12.50                    │
│                                             │
│  [View Details]                             │
│                                             │
└─────────────────────────────────────────────┘
```

### Per-Agent Stats

| Metric       | Description                  |
| ------------ | ---------------------------- |
| **Sessions** | Active conversation count    |
| **Messages** | Total messages sent/received |
| **Tokens**   | LLM token usage              |
| **Cost**     | Estimated API cost           |
| **Latency**  | Average response time        |

## Settings

### General Settings

```
Theme:           [Dark ▼]
Language:        [English ▼]
Timezone:        [UTC ▼]
Auto-save:       [☑]
Notifications:   [☑]
```

### Configuration Editor

Edit raw JSON configuration:

```json
{
  "agents": { ... },
  "channels": { ... },
  "models": { ... }
}
```

### Backup & Restore

```
[Export Config]  → Download JSON
[Import Config]  → Upload JSON
[Reset Defaults] → Restore factory settings
```

## Search & Filter

### Global Search

Press `/` or click search icon:

```
┌──────────────────────────┐
│ 🔍 Search...            │
├──────────────────────────┤
│ Recent                   │
│ • Main Agent             │
│ • Telegram Channel       │
│ • Daily Report Task      │
│                          │
│ Suggestions              │
│ • Go to Dashboard        │
│ • Open Chat              │
│ • View Logs              │
└──────────────────────────┘
```

### Agent Filtering

On Dashboard:

- **Search by name**: Type in search box
- **Sort by**: Name, ID, Last active
- **Filter by**: Status, Channel

## Notifications

### Toast Notifications

Appear in bottom-right corner:

```
┌─────────────────────┐
│ ✅ Task Completed   │
│ Backup finished     │
│              [View] │
└─────────────────────┘
```

### Types

| Icon | Type    |
| ---- | ------- |
| ✅   | Success |
| ⚠️   | Warning |
| ❌   | Error   |
| ℹ️   | Info    |

## Mobile Responsiveness

The dashboard adapts to mobile screens:

```
┌─────────────────┐
│ ≡  AgentMe   ⚙️ │
├─────────────────┤
│                 │
│ ┌─────────────┐ │
│ │   🤖        │ │
│ │  Main Agent │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │   🎧        │ │
│ │ Support Bot │ │
│ └─────────────┘ │
│                 │
│    [+ Add]      │
│                 │
└─────────────────┘
```

## Keyboard Navigation

| Key           | Action           |
| ------------- | ---------------- |
| `Tab`         | Next element     |
| `Shift + Tab` | Previous element |
| `Enter`       | Activate         |
| `Escape`      | Close/Cancel     |
| `Ctrl + /`    | Show shortcuts   |
