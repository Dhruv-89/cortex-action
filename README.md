# Cortex Action

Executes environment setup commands with optional dry-run support.

## Inputs

| Name | Required | Description |
|----|----|----|
| command | yes | Command to execute |
| dry-run | no | true / false |
| api-key | yes | API key |

## Outputs

| Name | Description |
|----|----|
| execution-log | Execution or dry-run output |
| status | success / failed |

## Example Usage

```yaml
- name: Setup environment
  uses: cortexlinux/cortex-action@v1
  with:
    command: "install python3, nodejs, and postgresql"
    dry-run: "false"
    api-key: ${{ secrets.API_KEY }}
