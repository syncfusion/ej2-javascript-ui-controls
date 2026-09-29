/**
 * spec/commands/builtins/history.spec.ts
 *
 * Unit tests for history builtin commands: undo, redo
 *
 * The history plugin must be included in the IntegrationManager plugins
 * for undo/redo to function. buildIM() in helpers.ts passes history().
 */
import { buildIM, buildCtx } from './helpers';
import { undoCommand } from '../../../src/commands/builtins/history/undo';
import { redoCommand } from '../../../src/commands/builtins/history/redo';
import { insertTextCommand } from '../../../src/commands/builtins/content/insert-text';
import { undoDepth, redoDepth } from '../../../src/pm/pm-guard';

// ── undo ──────────────────────────────────────────────────────────────────────

describe('undoCommand', () => {
    it('has name "undo" and category "history"', () => {
        expect(undoCommand.name).toBe('undo');
        expect(undoCommand.meta?.category).toBe('history');
    });

    it('canExecute returns false when undo stack is empty', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(undoCommand.canExecute!(ctx, undefined as any)).toBe(false);
    });

    it('execute returns false when nothing to undo', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        undoCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });
});

// ── redo ──────────────────────────────────────────────────────────────────────

describe('redoCommand', () => {
    it('has name "redo" and category "history"', () => {
        expect(redoCommand.name).toBe('redo');
        expect(redoCommand.meta?.category).toBe('history');
    });

    it('canExecute returns false when redo stack is empty', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(redoCommand.canExecute!(ctx, undefined as any)).toBe(false);
    });

    it('execute returns false when nothing to redo', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        redoCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(0);
    });

    it('undo → redo → undo depth is restored to original', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        insertTextCommand.execute(ctx, { text: 'A' });
        insertTextCommand.execute(ctx, { text: 'B' });
        const originalDepth = undoDepth(im.getState());

        undoCommand.execute(ctx, undefined as any);
        redoCommand.execute(ctx, undefined as any);
        expect(undoDepth(im.getState())).toBe(originalDepth);
    });
});
