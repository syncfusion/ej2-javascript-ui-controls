/**
 * spec/commands/types.spec.ts
 *
 * Unit tests for Task 1.3 and 1.4:
 *  1.3 — Command<void> is satisfiable by a plain object literal
 *  1.4 — Error classes extend Error, have correct .name, preserve .message
 */
import {
    Command,
    CommandContext,
    UnknownCommandError,
    DuplicateCommandError,
    HistoryCommandInChainError
} from '../../src/commands/types';

// ── Task 1.3 — Command<void> assignability ────────────────────────────────────

describe('Command<void> type contract', () => {
    it('accepts a minimal object with name and execute', () => {
        const minimalCommand: Command<void> = {
            name: 'noop',
            execute(_ctx: CommandContext, _payload: void): boolean {
                return false;
            }
        };
        expect(minimalCommand.name).toBe('noop');
        expect(typeof minimalCommand.execute).toBe('function');
    });

    it('accepts an object with optional meta and canExecute', () => {
        const fullCommand: Command<{ value: number }> = {
            name: 'withMeta',
            meta: {
                label: 'With Meta',
                category: 'formatting',
                tags: ['test']
            },
            canExecute(_ctx: CommandContext, _payload: { value: number }): boolean {
                return true;
            },
            execute(_ctx: CommandContext, _payload: { value: number }): boolean {
                return true;
            }
        };
        expect(fullCommand.meta!.category).toBe('formatting');
        expect(fullCommand.meta!.tags).toEqual(['test']);
    });
});

// ── Task 1.4 — Error classes ──────────────────────────────────────────────────

describe('UnknownCommandError', () => {
    it('extends Error', () => {
        const err = new UnknownCommandError('toggleFoo');
        expect(err instanceof Error).toBe(true);
    });

    it('has .name === "UnknownCommandError"', () => {
        const err = new UnknownCommandError('toggleFoo');
        expect(err.name).toBe('UnknownCommandError');
    });

    it('preserves .message containing the command name', () => {
        const err = new UnknownCommandError('toggleFoo');
        expect(err.message).toContain('toggleFoo');
    });
});

describe('DuplicateCommandError', () => {
    it('extends Error', () => {
        const err = new DuplicateCommandError('toggleBold');
        expect(err instanceof Error).toBe(true);
    });

    it('has .name === "DuplicateCommandError"', () => {
        const err = new DuplicateCommandError('toggleBold');
        expect(err.name).toBe('DuplicateCommandError');
    });

    it('preserves .message containing the command name', () => {
        const err = new DuplicateCommandError('toggleBold');
        expect(err.message).toContain('toggleBold');
    });
});

describe('HistoryCommandInChainError', () => {
    it('extends Error', () => {
        const err = new HistoryCommandInChainError('undo');
        expect(err instanceof Error).toBe(true);
    });

    it('has .name === "HistoryCommandInChainError"', () => {
        const err = new HistoryCommandInChainError('undo');
        expect(err.name).toBe('HistoryCommandInChainError');
    });

    it('preserves .message containing the command name', () => {
        const err = new HistoryCommandInChainError('undo');
        expect(err.message).toContain('undo');
    });
});
