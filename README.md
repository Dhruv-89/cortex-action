# Cortex Action

AI-powered GitHub Action that uses natural language to install and manage software packages. Built on top of [Cortex Linux](https://github.com/cortexlinux/cortex), this action understands what you want to install even when you don't know the exact package names.

## Features

- 🤖 **Natural Language Processing**: Describe what you need in plain English
- 🔒 **Secure by Default**: API keys are automatically masked and secured
- 🧪 **Dry-Run Support**: Preview installations before execution
- 🏗️ **Auto-Installation**: Automatically installs Cortex dependencies
- 🔄 **Multi-LLM Support**: Works with OpenAI GPT-4 and Anthropic Claude
- 📝 **Detailed Logging**: Real-time output and comprehensive execution logs

## Inputs

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `command` | ✅ Yes | - | Natural language description of what to install |
| `llm_provider` | ✅ Yes | - | LLM provider to use (`openai` or `anthropic`) |
| `api-key` | ✅ Yes | - | API key for the specified LLM provider |
| `dry-run` | ❌ No | `false` | Preview mode - shows what would be installed without executing |

## Outputs

| Name | Description |
|------|-------------|
| `execution-log` | Complete output from the Cortex command execution |
| `status` | Execution status (`success` or `failed`) |

## Prerequisites

- **Operating System**: Ubuntu 22.04+ or Debian 12+
- **Python**: 3.10 or higher (pre-installed on GitHub runners)
- **API Key**: Valid API key from either:
  - [OpenAI Platform](https://platform.openai.com/) (for GPT-4)
  - [Anthropic Console](https://console.anthropic.com/) (for Claude)

## Setup

### 1. Store API Key as Secret

Add your API key to your repository secrets:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
4. Value: Your API key

### 2. Create Workflow

Create `.github/workflows/cortex.yml`:

```yaml
name: Install Software with Cortex
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  setup-environment:
    runs-on: ubuntu-latest
    steps:
      - name: Setup development environment
        uses: Dhruv-89/cortex-action@main
        with:
          command: "install python3, nodejs, postgresql, and docker"
          llm_provider: "anthropic"
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          dry-run: "false"
```

## Usage Examples

### Basic Installation

```yaml
- name: Install web development tools
  uses: Dhruv-89/cortex-action@main
  with:
    command: "install nginx, nodejs, and pm2"
    llm_provider: "openai"
    api-key: ${{ secrets.OPENAI_API_KEY }}
```

### Dry-Run Mode (Preview Only)

```yaml
- name: Preview installation
  uses: Dhruv-89/cortex-action@main
  with:
    command: "install video editing software and codecs"
    llm_provider: "anthropic"
    api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    dry-run: "true"
```

### Complex Development Environment

```yaml
- name: Setup ML development environment
  uses: Dhruv-89/cortex-action@main
  with:
    command: "install python machine learning tools, jupyter notebook, and cuda drivers"
    llm_provider: "openai"
    api-key: ${{ secrets.OPENAI_API_KEY }}
    dry-run: "false"
```

### Multiple Steps with Different Providers

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - name: Preview system tools
        uses: Dhruv-89/cortex-action@main
        with:
          command: "install system monitoring and performance tools"
          llm_provider: "anthropic"
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          dry-run: "true"
      
      - name: Install development tools
        uses: Dhruv-89/cortex-action@main
        with:
          command: "install git, vim, htop, and curl"
          llm_provider: "openai"
          api-key: ${{ secrets.OPENAI_API_KEY }}
          dry-run: "false"
```

## Natural Language Examples

The action understands various natural language patterns:

| Description | What Cortex Will Install |
|------------|--------------------------|
| `"web server for static sites"` | nginx, apache2, or similar |
| `"python development tools"` | python3, pip, virtualenv, python3-dev |
| `"image editing software"` | gimp, imagemagick, or similar |
| `"database server"` | postgresql, mysql, or sqlite |
| `"video compression tools"` | ffmpeg, handbrake, or similar |
| `"kubernetes tools"` | kubectl, helm, k9s |

## API Key Configuration

### Using OpenAI

```yaml
with:
  llm_provider: "openai"
  api-key: ${{ secrets.OPENAI_API_KEY }}
```

### Using Anthropic Claude

```yaml
with:
  llm_provider: "anthropic" 
  api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Security Features

- 🔒 **Automatic API Key Masking**: API keys are never shown in logs
- 🛡️ **Sandboxed Execution**: All commands run in isolated environment
- 📋 **Audit Trail**: Complete logging of all actions
- 🔍 **Dry-Run Default**: Preview before execution
- ✅ **Command Validation**: Dangerous patterns are blocked

## Troubleshooting

### Common Issues

**Issue**: `RuntimeWarning: 'cortex.cli' found in sys.modules`
- **Solution**: This is a harmless warning during Cortex startup and doesn't affect functionality

**Issue**: `Error: Unable to locate executable file: cortex`
- **Solution**: The action automatically installs Cortex. If this persists, try running with `dry-run: "true"` first

**Issue**: API key authentication failed
- **Solution**: 
  1. Verify API key is valid and has sufficient credits
  2. Ensure secret name matches the `api-key` input
  3. Check that `llm_provider` matches your API key type

**Issue**: Installation fails on specific packages
- **Solution**: Try more specific descriptions or use dry-run to see what Cortex plans to install

### Getting Help

- 📚 [Cortex Documentation](https://github.com/cortexlinux/cortex)
- 💬 [Discord Community](https://discord.gg/uCqHvxjU83)
- 🐛 [Report Issues](https://github.com/Dhruv-89/cortex-action/issues)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## Related Projects

- [Cortex Linux](https://github.com/cortexlinux/cortex) - The core AI package manager
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD platform

---

Built with ❤️ for developers who want smarter package management.
