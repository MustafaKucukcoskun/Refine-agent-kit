# cli-tool Domain Rules

## Activation Condition

package.json "bin" field OR pyproject.toml [project.scripts] OR setup.py entry_points present.

## Primary Agent

backend-specialist

## Library Preferences

Node.js:

- commander.js or yargs (argument parsing)
- inquirer (interactive prompt)
- picocolors or chalk (color — prefer lightweight)
- ora (spinner), execa (subprocess execution)

Python:

- Click (recommended) or Typer (type-hint based)
- rich (terminal formatting)

## UX Rules

- --help must always work
- --version flag mandatory
- Error messages to stderr (process.stderr / sys.stderr)
- Output to stdout
- Exit code: 0 = success, 1+ = error
- Offer --dry-run for destructive operations
