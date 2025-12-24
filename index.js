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
          stdout: (data) => (stdout += data.toString()),
          stderr: (data) => (stderr += data.toString())
        }
      });

      executionLog = stdout || stderr;
    }

    core.setOutput("execution-log", executionLog);
    core.setOutput("status", "success");

  } catch (error) {
    core.setOutput("status", "failed");
    core.setFailed(error.message);
  }
}

run();
