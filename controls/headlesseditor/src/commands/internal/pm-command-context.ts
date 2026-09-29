/**
 * pm-command-context.ts — PMCommandContext and PMCommandInternal
 *
 * Internal execution context for built-in commands only.
 *
 * VISIBILITY RULE — this file must NEVER be imported by:
 *   - src/commands/types.ts          (public command contract)
 *   - src/commands/registry.ts       (public registry)
 *   - src/commands/facade.ts         (public facades)
 *   - src/commands/typed-surface.d.ts
 *   - Any file outside src/commands/builtins/ or src/commands/internal/
 *     or the executor files (immediate-executor.ts, chain-executor.ts, executor.ts)
 *
 * Extension authors receive only CommandContext (src/commands/types.ts).
 */
import { CommandContext, CommandMeta } from '../types';
import { PMEditorState } from '../../pm/pm-guard';

// ── PMCommandContext ──────────────────────────────────────────────────────────

/**
 * PMCommandContext — extends the public CommandContext with a frozen PM state
 * snapshot captured by the executor at the start of each command invocation.
 *
 * Builtins use ctx.pmState to:
 *   - Read schema: ctx.pmState.schema
 *   - Fork transactions: ctx.pmState.tr
 *   - Read selection: ctx.pmState.selection
 *   - Read document: ctx.pmState.doc
 *
 * This is a snapshot — not the live IntegrationManager state.
 * For ChainExecutor it is the virtual state (reflecting all prior chain steps).
 */
export interface PMCommandContext extends CommandContext {
    /**
     * Frozen PM state snapshot at the start of this command's execution.
     * Use this — do NOT reach for IntegrationManager.
     */
    readonly pmState: PMEditorState;
}

// ── PMCommandInternal ─────────────────────────────────────────────────────────────────

/**
 * PMCommandInternal<TPayload> — internal command interface for built-in commands.
 *
 * Built-in commands implement this instead of Command<TPayload>.
 * canExecute and execute receive PMCommandContext directly — no cast required.
 *
 * PMCommandInternal<T> is structurally compatible with Command<T> because
 * PMCommandContext extends CommandContext. Built-ins can be registered as
 * Command<unknown> without any explicit cast.
 *
 * VISIBILITY RULE:
 *   PMCommandInternal must never be imported by extension authors.
 *   It is only for files inside src/commands/builtins/.
 */
export interface PMCommandInternal<TPayload = void> {
    readonly name: string;
    readonly meta?: CommandMeta;
    canExecute?(context: PMCommandContext, payload: TPayload): boolean;
    execute(context: PMCommandContext, payload: TPayload): void;
}

// ── Type assertion helper (for executor use only) ─────────────────────────────

/**
 * asPMCommandContext — narrow a CommandContext to PMCommandContext inside
 * executor infrastructure.
 *
 * This is the ONE permitted cast location. Executors always build PMCommandContext
 * objects, so this cast is safe by construction. Builtins never call this.
 *
 * @param {CommandContext} ctx - The executor-built context to narrow.
 * @returns {PMCommandContext} The same context, narrowed to PMCommandContext.
 * @internal
 */
export function asPMCommandContext(ctx: CommandContext): PMCommandContext {
    return ctx as PMCommandContext;
}
