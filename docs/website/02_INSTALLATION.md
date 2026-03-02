# Installation Guide

## System Requirements

### Minimum Requirements

- **OS**: Linux, macOS, or Windows (WSL2)
- **Node.js**: Version 22 or higher
- **RAM**: 2 GB minimum, 4 GB recommended
- **Storage**: 1 GB free space
- **Network**: Internet connection for AI providers

### Recommended Environment

- **OS**: Ubuntu 22.04 LTS or macOS 14+
- **Node.js**: Version 22 LTS
- **RAM**: 8 GB
- **Storage**: SSD with 10 GB free

## Installation Methods

### Method 1: npm (Recommended for Users)

```bash
# Install globally
npm install -g agentme@latest

# Verify installation
agentme --version

# Run onboarding
agentme onboard --install-daemon
```

The `--install-daemon` flag automatically sets up a system service:

- **macOS**: launchd service
- **Linux**: systemd user service
- **Windows**: Windows Service (via WSL)

### Method 2: From Source (Recommended for Developers)

```bash
# Clone the repository
git clone https://github.com/Agentme-AI/Server.git
cd Server

# Install dependencies
npm install

# Build the UI and server
npm run build

# Start development server
npm run dev
```

### Method 3: Docker

```bash
# Pull the image
docker pull agentme/server:latest

# Run with docker-compose
docker-compose up -d
```

**docker-compose.yml:**

```yaml
version: "3.8"
services:
  agentme:
    image: agentme/server:latest
    ports:
      - "18789:18789"
    volumes:
      - agentme-data:/root/.agentme
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

volumes:
  agentme-data:
```

### Method 4: Platform-Specific Scripts

#### macOS

```bash
curl -fsSL https://raw.githubusercontent.com/Agentme-AI/Server/main/scripts/install-agentme-macos.sh | bash
```

#### Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Agentme-AI/Server/main/scripts/install-agentme-linux.sh | bash
```

#### Raspberry Pi

```bash
curl -fsSL https://raw.githubusercontent.com/Agentme-AI/Server/main/scripts/install-agentme-pi.sh | bash
```

## Post-Installation Setup

### 1. Environment Configuration

Create a `.env` file in your working directory:

```env
# Required: AI Provider
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Alternative Providers
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key

# Optional: Channel Tokens
TELEGRAM_BOT_TOKEN=your-telegram-token
WHATSAPP_API_KEY=your-whatsapp-key

# Server Settings
PORT=18789
HOST=0.0.0.0
LOG_LEVEL=info
```

### 2. Initial Configuration

```bash
# Run the configuration wizard
agentme onboard

# Or manually edit config
agentme config edit
```

### 3. Start the Server

```bash
# Start with daemon (if installed)
agentme gateway --daemon

# Or start manually
agentme gateway --port 18789 --verbose

# Or with npm
npm start
```

### 4. Access the Web UI

Open your browser and navigate to:

```
http://localhost:18789
```

Default credentials (if authentication is enabled):

- Check your configuration or run `agentme config get auth`

## Directory Structure

After installation, AgentMe creates the following directory structure:

```
~/.agentme/                 # Main configuration directory
├── config.json            # Main configuration
├── agents/                # Agent workspaces
│   ├── main/              # Default agent
│   │   ├── IDENTITY.md    # Agent identity
│   │   ├── MEMORY.md      # Agent memory
│   │   └── TOOLS.md       # Available tools
│   └── ...
├── channels/              # Channel configurations
├── sessions/              # Session transcripts
├── skills/                # Custom skills
└── logs/                  # Log files
```

## Verification

### Check Installation

```bash
# Verify CLI
agentme --version

# Check health
agentme doctor

# Test connection
curl http://localhost:18789/health
```

### Expected Output

```bash
$ agentme --version
2026.2.9

$ agentme doctor
✓ Node.js version: 22.0.0
✓ Configuration valid
✓ Gateway responding
✓ Web UI accessible
```

## Troubleshooting

### Common Issues

#### "command not found: agentme"

```bash
# Add npm global bin to PATH
export PATH="$PATH:$(npm config get prefix)/bin"

# Or reinstall with proper permissions
npm install -g agentme@latest
```

#### "EACCES: permission denied"

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g agentme@latest
```

#### "Port 18789 already in use"

```bash
# Find and kill process
lsof -ti:18789 | xargs kill -9

# Or use different port
agentme gateway --port 8080
```

#### "Cannot find module"

```bash
# Rebuild from source
npm install
npm run build
```

## Uninstallation

```bash
# Uninstall global package
npm uninstall -g agentme

# Remove configuration
cd ~ && rm -rf .agentme

# Remove data (optional)
cd ~ && rm -rf .local/share/agentme
```

## Next Steps

- [Configuration Guide](./03_CONFIGURATION.md)
- [Creating Your First Agent](./06_FIRST_AGENT.md)
- [Channel Setup](./07_CHANNELS.md)
