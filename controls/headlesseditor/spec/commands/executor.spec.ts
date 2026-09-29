/**
 * spec/commands/executor.spec.ts
 *
 * Unit tests for Tasks 3.3–3.6: CommandExecutor single execution algorithm.
 */
import { CommandExecutor, ExecutionTarget } from '../../src/commands/executor';
import { Command, CommandContext, EditorTransaction, ChainResult } from '../../src/commands/types';
import { DocumentRoot } from '../../src/model/editor-node';
import { EditorState } from '../../src/model/editor-state';
import { Selection, SelectionType } from '../../src/model/selection';

// ── Stub helpers ──────────────────────────────────────────────────────────────

function makeTransaction(): EditorTransaction {
    return { brand: 'EditorTransaction' } as EditorTransaction;
}

function makeEditorState(): EditorState {
    const doc: DocumentRoot = {
        id: 'doc-1',
        type: 'document',
        attrs: {},
        children: [],
        marks: [],
        schemaVersion: 1
    };
    const selection: Selection = { type: SelectionType.Text };
    return { document: doc, selection, isMounted: false };
}

function makeTarget(onDispatchedSpy?: (tr: EditorTransaction) => void): ExecutionTarget {
    return {
        buildContext(): CommandContext {
            return {
                editorState: makeEditorState(),
                selection: makeEditorState().selection,
                document: makeEditorState().document,
                editor: { commandRegistry: null },
                dispatch(_tr: EditorTransaction): void {
                    // no-op base; dispatch tracking in executor wraps this
                }
            };
        },
        onDispatched(tr: EditorTransaction): void {
            if (onDispatchedSpy) {
                onDispatchedSpy(tr);
            }
        }
    };
}

// ── Task 3.3 — canExecute returning false blocks execute ──────────────────────

describe('CommandExecutor.run() — canExecute returns false', () => {
    it('never calls execute() and returns false', () => {
        const executor = new CommandExecutor();
        let executeCalled = false;

        const cmd: Command<void> = {
            name: 'blockedCmd',
            canExecute(): boolean { return false; },
            execute(_ctx: CommandContext, _payload: void): boolean {
                executeCalled = true;
                return false;
            }
        };

        const onDispatchedSpy = jasmine.createSpy('onDispatched');
        const target = makeTarget(onDispatchedSpy);
        const result = executor.run(cmd, undefined, target);

        expect(result).toBe(false);
        expect(executeCalled).toBe(false);
        expect(onDispatchedSpy).not.toHaveBeenCalled();
    });
});

// ── Task 3.4 — no canExecute defined always proceeds to execute ───────────────

describe('CommandExecutor.run() — no canExecute defined', () => {
    it('always calls execute()', () => {
        const executor = new CommandExecutor();
        let executeCalled = false;

        const cmd: Command<void> = {
            name: 'noGuardCmd',
            execute(_ctx: CommandContext, _payload: void): boolean {
                executeCalled = true;
                return false;
            }
        };

        executor.run(cmd, undefined, makeTarget());
        expect(executeCalled).toBe(true);
    });
});

// ── Task 3.5 — execute() dispatching triggers exactly one onDispatched ────────

describe('CommandExecutor.run() — execute dispatches', () => {
    it('triggers exactly one call to target.onDispatched with the transaction', () => {
        const executor = new CommandExecutor();
        const onDispatchedSpy = jasmine.createSpy('onDispatched');

        const cmd: Command<void> = {
            name: 'dispatchingCmd',
            execute(ctx: CommandContext, _payload: void): boolean {
                ctx.dispatch(makeTransaction());
                return true;
            }
        };

        const result = executor.run(cmd, undefined, makeTarget(onDispatchedSpy));

        expect(result).toBe(true);
        expect(onDispatchedSpy).toHaveBeenCalledTimes(1);
    });
});

// ── Task 3.6 — execute() without dispatch returns false, no onDispatched ──────

describe('CommandExecutor.run() — execute does not dispatch', () => {
    it('returns false and never calls target.onDispatched()', () => {
        const executor = new CommandExecutor();
        const onDispatchedSpy = jasmine.createSpy('onDispatched');

        const cmd: Command<void> = {
            name: 'noDispatchCmd',
            execute(_ctx: CommandContext, _payload: void): boolean {
                return false; // never calls ctx.dispatch
            }
        };

        const result = executor.run(cmd, undefined, makeTarget(onDispatchedSpy));

        expect(result).toBe(false);
        expect(onDispatchedSpy).not.toHaveBeenCalled();
    });
});
