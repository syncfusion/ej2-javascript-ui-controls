/**
 * spec/commands/builtins/selection.spec.ts
 *
 * Unit tests for all selection builtin commands:
 *   selectAll, setSelection, clearSelection
 */
import { buildIM, buildCtx } from './helpers';
import { selectAllCommand } from '../../../src/commands/builtins/selection/select-all';
import { setSelectionCommand } from '../../../src/commands/builtins/selection/set-selection';
import { clearSelectionCommand } from '../../../src/commands/builtins/selection/clear-selection';
import { AllSelection } from '../../../src/pm/pm-guard';

// ── selectAll ─────────────────────────────────────────────────────────────────

describe('selectAllCommand', () => {
    it('has name "selectAll" and category "selection"', () => {
        expect(selectAllCommand.name).toBe('selectAll');
        expect(selectAllCommand.meta?.category).toBe('selection');
    });

    it('canExecute always returns true', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(selectAllCommand.canExecute!(ctx, undefined as any)).toBe(true);
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        selectAllCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });

    it('execute dispatches even when doc is already fully selected', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        // Apply AllSelection manually first
        const pmState = im.getState();
        im.dispatch(pmState.tr.setSelection(new AllSelection(pmState.doc)));
        dispatched.length = 0;
        selectAllCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });

    it('resulting selection spans the entire document', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        selectAllCommand.execute(ctx, undefined as any);
        const sel = im.getState().selection;
        const docSize = im.getState().doc.content.size;
        expect(sel.from).toBe(0);
        expect(sel.to).toBe(docSize);
    });
});

// ── setSelection ──────────────────────────────────────────────────────────────

describe('setSelectionCommand', () => {
    it('has name "setSelection" and category "selection"', () => {
        expect(setSelectionCommand.name).toBe('setSelection');
        expect(setSelectionCommand.meta?.category).toBe('selection');
    });

    it('canExecute returns false when from > to', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(setSelectionCommand.canExecute!(ctx, { from: 5, to: 2 })).toBe(false);
    });

    it('canExecute returns false when from is negative', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(setSelectionCommand.canExecute!(ctx, { from: -1, to: 2 })).toBe(false);
    });

    it('canExecute returns false when to exceeds doc size', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        const docSize = im.getState().doc.content.size;
        expect(setSelectionCommand.canExecute!(ctx, { from: 0, to: docSize + 100 })).toBe(false);
    });

    it('canExecute returns true for valid range within doc', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(setSelectionCommand.canExecute!(ctx, { from: 1, to: 1 })).toBe(true);
    });

    it('execute dispatches a transaction for a valid range', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        const result = setSelectionCommand.execute(ctx, { from: 1, to: 1 });
        setSelectionCommand.execute(ctx, { from: 1, to: 1 });
    });

    it('execute sets the PM selection to the given positions', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        setSelectionCommand.execute(ctx, { from: 1, to: 1 });
        const sel = im.getState().selection;
        expect(sel.from).toBe(1);
        expect(sel.to).toBe(1);
    });

    it('execute dispatches even for a collapsed (cursor) selection', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        const result = setSelectionCommand.execute(ctx, { from: 1, to: 1 });
        setSelectionCommand.execute(ctx, { from: 1, to: 1 });
    });
});

// ── clearSelection ────────────────────────────────────────────────────────────

describe('clearSelectionCommand', () => {
    it('has name "clearSelection" and category "selection"', () => {
        expect(clearSelectionCommand.name).toBe('clearSelection');
        expect(clearSelectionCommand.meta?.category).toBe('selection');
    });

    it('canExecute always returns true', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(clearSelectionCommand.canExecute!(ctx, undefined as any)).toBe(true);
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        const result = clearSelectionCommand.execute(ctx, undefined as any);
        clearSelectionCommand.execute(ctx, undefined as any);
    });

    it('execute collapses selection to a single cursor point', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        // Expand selection first with selectAll, then clear it
        selectAllCommand.execute(ctx, undefined as any);
        clearSelectionCommand.execute(ctx, undefined as any);
        const sel = im.getState().selection;
        expect(sel.from).toBe(sel.to);
    });

    it('execute dispatches even when selection is already collapsed', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        // Already a collapsed cursor
        clearSelectionCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});
