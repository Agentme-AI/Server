# Troubleshooting Guide

## Common Issues

### Installation Problems

#### npm install fails

**Symptoms:**

```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solutions:**

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.bashrc

# Retry installation
npm install -g agentme@latest
```

#### Node.js version too old

**Symptoms:**

```
Error: Requires Node.js >= 22
```

**Solutions:**

```bash
# Using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22

# Or download from nodejs.org
```

### Server Startup Issues

#### Port already in use

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::18789
```

**Solutions:**

```bash
# Find and kill process
lsof -ti:18789 | xargs kill -9

# Or use different port
agentme gateway --port 8080

# Or check what's using the port
lsof -i :18789
```

#### Cannot find module

**Symptoms:**

```
Error: Cannot find module '...'
```

**Solutions:**

```bash
# Rebuild from source
cd Server
rm -rf node_modules
npm install
npm run build

# For global install
npm uninstall -g agentme
npm install -g agentme@latest
```

#### Permission denied on config

**Symptoms:**

```
EACCES: permission denied, open '/root/.agentme/config.json'
```

**Solutions:**

```bash
# Fix permissions
sudo chown -R $(whoami) ~/.agentme

# Or run as current user
agentme gateway --user $(whoami)
```

### Connection Issues

#### Cannot connect to gateway

**Symptoms:**

- Web UI shows "Disconnected"
- "Connection refused" error

**Solutions:**

```bash
# Check if server is running
curl http://localhost:18789/health

# Check logs
agentme logs

# Restart server
pkill -f "tsx.*src/index.ts"
agentme gateway --verbose
```

#### WebSocket connection drops

**Symptoms:**

- "Event gap detected" messages
- Frequent reconnects

**Solutions:**

1. Check network stability
2. Increase heartbeat interval:
   ```json
   {
     "gateway": {
       "heartbeatInterval": 30000
     }
   }
   ```
3. Check for proxy/firewall blocking WebSocket

### AI Provider Issues

#### API key not recognized

**Symptoms:**

```
Error: 401 Unauthorized - Invalid API key
```

**Solutions:**

```bash
# Verify key is set
echo $OPENAI_API_KEY

# Set in .env file
echo "OPENAI_API_KEY=sk-..." > .env

# Test the key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Model not available

**Symptoms:**

```
Error: Model 'gpt-4o' is not available
```

**Solutions:**

1. Check your API key has access to the model
2. Verify the model name is correct
3. Try alternative model:
   ```bash
   agentme config set agents.defaults.model gpt-4o-mini
   ```

#### Rate limit exceeded

**Symptoms:**

```
Error: 429 Too Many Requests
```

**Solutions:**

1. Wait before retrying
2. Reduce request frequency
3. Configure rate limiting:
   ```json
   {
     "models": {
       "providers": [
         {
           "id": "openai",
           "rateLimit": {
             "requests": 60,
             "window": 60000
           }
         }
       ]
     }
   }
   ```

### Channel Issues

#### Telegram bot not responding

**Symptoms:**

- Bot is online but doesn't reply
- Webhook errors

**Solutions:**

```bash
# Check webhook is set
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Reset webhook
curl -X POST \
  https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d "url=https://yourdomain.com/webhook/telegram"

# Verify token
curl https://api.telegram.org/bot<TOKEN>/getMe
```

#### WhatsApp connection failed

**Symptoms:**

- Cannot connect to WhatsApp Business API
- "Authentication failed" errors

**Solutions:**

1. Verify API credentials in Meta Developer Portal
2. Check phone number ID is correct
3. Ensure webhook URL is accessible
4. Check Meta app is in Live mode (not Development)

#### iMessage not working (macOS)

**Symptoms:**

- Messages not being sent/received

**Solutions:**

1. Grant Accessibility permissions:
   - System Preferences → Security & Privacy → Accessibility
   - Add Terminal or your terminal app
2. Enable Full Disk Access for Terminal
3. Sign in to Messages app
4. Enable iMessage in settings

### Performance Issues

#### High memory usage

**Symptoms:**

- Server becomes slow
- Out of memory errors

**Solutions:**

```bash
# Restart server
pkill -f agentme
agentme gateway

# Enable memory cleanup
agentme config set gateway.gcInterval 300000

# Reduce session history
agentme config set sessions.maxHistory 100
```

#### Slow responses

**Symptoms:**

- AI responses take long time
- Timeouts

**Solutions:**

1. Check network connection to AI provider
2. Use closer region/provider
3. Enable response streaming
4. Reduce context window size:
   ```json
   {
     "agents": {
       "defaults": {
         "contextWindow": 4000
       }
     }
   }
   ```

### Configuration Issues

#### Config validation fails

**Symptoms:**

```
Error: Configuration validation failed
```

**Solutions:**

```bash
# Validate config
agentme config validate

# Check specific error
agentme config validate --verbose

# Reset to defaults
agentme config reset
```

#### Changes not applied

**Symptoms:**

- Config updated but no effect

**Solutions:**

1. Restart the server
2. Check config file path
3. Verify JSON syntax:
   ```bash
   cat ~/.agentme/config.json | jq .
   ```

### Data Issues

#### Lost agent memory

**Symptoms:**

- Agent doesn't remember previous conversations

**Solutions:**

1. Check MEMORY.md file exists:
   ```bash
   ls ~/.agentme/agents/main/MEMORY.md
   ```
2. Verify file permissions
3. Check disk space

#### Cannot upload files

**Symptoms:**

- File upload fails
- "Permission denied" errors

**Solutions:**

```bash
# Check workspace permissions
ls -la ~/.agentme/agents/main/

# Fix permissions
chmod 755 ~/.agentme/agents/main/

# Check disk space
df -h
```

## Diagnostic Commands

### Health Check

```bash
# Quick health check
curl http://localhost:18789/health

# Detailed status
curl http://localhost:18789/api/v1/status

# Check version
agentme --version
```

### Log Analysis

```bash
# View recent logs
agentme logs

# Follow logs in real-time
agentme logs --follow

# Filter by level
agentme logs --level error

# Export logs
agentme logs --export > logs.txt
```

### Doctor Command

```bash
# Run diagnostics
agentme doctor

# Fix common issues automatically
agentme doctor --fix

# Check specific component
agentme doctor --check channels
```

### Debug Mode

```bash
# Start with debug logging
agentme gateway --verbose

# Enable WebSocket debug
DEBUG=websocket:* agentme gateway

# Full debug mode
DEBUG=* agentme gateway
```

## Getting Help

### Collect Information

Before asking for help, collect:

```bash
# System info
agentme doctor > diagnostic.txt

# Logs
agentme logs --last 100 > logs.txt

# Config (redact secrets)
cat ~/.agentme/config.json | jq 'del(.apiKeys)' > config.txt

# Version
agentme --version > version.txt
```

### Support Channels

1. **GitHub Issues**: Bug reports and feature requests
   - https://github.com/Agentme-AI/Server/issues

2. **GitHub Discussions**: Q&A and general discussion
   - https://github.com/Agentme-AI/Server/discussions

3. **Documentation**:
   - https://docs.agentme.ai

### Reporting Bugs

Include in your report:

1. AgentMe version (`agentme --version`)
2. Node.js version (`node --version`)
3. Operating system
4. Steps to reproduce
5. Expected vs actual behavior
6. Error messages (full stack trace)
7. Configuration (with secrets removed)
