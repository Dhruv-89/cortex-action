const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
  try {
    const command = core.getInput("command");
    const dryRun = core.getInput("dry-run") === "true";
    const apiKey = core.getInput("api-key");
    const llmProvider = core.getInput("llm_provider");

    // Mask API key
    core.setSecret(apiKey);

    // Determine the correct API key environment variable name
    const apiKeyEnvName = llmProvider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY";

    // Install Cortex if not already available
    core.info("Setting up Cortex...");
    
    // Check if cortex is already installed
    let cortexInstalled = false;
    try {
      await exec.exec("which cortex", [], { silent: true });
      cortexInstalled = true;
      core.info("Cortex is already installed.");
    } catch (error) {
      core.info("Cortex not found, proceeding with installation...");
    }

    if (!cortexInstalled) {
      // Clone Cortex repository
      core.info("Cloning Cortex repository...");
      await exec.exec("git clone https://github.com/cortexlinux/cortex.git /tmp/cortex");
      
      // Create virtual environment and install
      core.info("Installing Cortex...");
      await exec.exec("python3 -m venv /tmp/cortex/venv");
      await exec.exec("bash -c 'source /tmp/cortex/venv/bin/activate && cd /tmp/cortex && pip install -e .'");
      
      // Make cortex available in PATH by creating a wrapper script
      await exec.exec("sudo mkdir -p /usr/local/bin");
      await exec.exec(`sudo tee /usr/local/bin/cortex > /dev/null << 'EOF'
#!/bin/bash
source /tmp/cortex/venv/bin/activate
cd /tmp/cortex
python -m cortex.cli "$@"
EOF`);
      await exec.exec("sudo chmod +x /usr/local/bin/cortex");
      
      core.info("Cortex installation completed.");
    }

    // Export API key as environment variable
    core.info(`Setting up ${apiKeyEnvName} environment variable...`);
    await exec.exec(`export ${apiKeyEnvName}="${apiKey}"`);

    let executionLog = "";
    const fullCommand = `cortex ${command}${dryRun ? ' --dry-run' : ''}`;

    if (dryRun) {
      executionLog = `[DRY-RUN] ${fullCommand}`;
      core.info(executionLog);
    } else {
      core.info(`Executing: ${fullCommand}`);

      let stdout = "";
      let stderr = "";

      await exec.exec(fullCommand, [], {
        env: {
          ...process.env,
          [apiKeyEnvName]: apiKey
        },
        listeners: {
          stdout: (data) => {
            const output = data.toString();
            stdout += output;
            core.info(output.trim());
          },
          stderr: (data) => {
            const output = data.toString();
            stderr += output;
            core.error(output.trim());
          }
        }
      });

      executionLog = stdout || stderr;
      
      if (executionLog) {
        core.info(`Command completed. Full output: ${executionLog.trim()}`);
      }
    }

    core.setOutput("execution-log", executionLog);
    core.setOutput("status", "success");

  } catch (error) {
    core.setOutput("status", "failed");
    core.setFailed(error.message);
  }
}

run();
