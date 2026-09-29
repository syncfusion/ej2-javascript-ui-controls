/**
 * internal/index.ts — barrel for command execution infrastructure.
 *
 * INTERNAL ONLY. Do not re-export from src/commands/index.ts or src/index.ts.
 * Only executor files and src/commands/builtins/** may import from here.
 */
export { PMCommandContext, PMCommandInternal, asPMCommandContext } from './pm-command-context';
export { DispatchRecorder } from './dispatch-recorder';
