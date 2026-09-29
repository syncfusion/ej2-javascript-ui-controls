/**
 * spec/commands/builtins/outdent.spec.ts
 *
 * Unit tests for the `outdent` builtin command shipped with the
 * `indentOutdent` extension.
 *
 * Sister to `indent.spec.ts`. Verifies the strict inverse semantics:
 *
 *   - command identity and category
 *   - canExecute returns true ONLY when at least one indentable shape
 *     has a positive `indent` (or `cellIndent` on a cell)
 *   - execute dispatches a transaction that decrements the indents
 *   - `indent: 1 → 0` becomes `0` (Do-Nothing baseline preserved)
 *   - `indent: 0 → outdent` is a no-op dispatch (no setNodeMarkup
 *     step; the selection walker just folds an unchanged tr)
 *   - cells: `cellIndent: 1 → 0`; `cellIndent: 0` is a no-op
 */
import { buildIM, buildCtx } from './helpers';
import { DocumentRoot } from '../../../src/model/editor-node';
import { outdentCommand } from '../../../src/commands/builtins/structure/outdent';
import { PMCommandContext } from '../../../src/commands/internal';
import { TextSelection } from '../../../src/pm/pm-guard';
import { IntegrationManager } from '../../../src/pm/integration/integration-manager';

// ── fixture docs ──────────────────────────────────────────────────────────────

function paragraphAtIndentDoc(indentValue: number): DocumentRoot {
    return {
        id: 'outdent-doc-001',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            {
                id: 'p1',
                type: 'paragraph',
                attrs: { indent: indentValue },
                marks: [],
                children: []
            },
            { id: 'h1', type: 'heading', attrs: { level: 1 }, marks: [], children: [] }
        ]
    };
}

function cellAtIndentDoc(cellIndentValue: number): DocumentRoot {
    return {
        id: 'outdent-doc-002',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            { id: 'para-001', type: 'paragraph', attrs: {}, marks: [], children: [] },
            {
                id: 'tbl-001', type: 'table', attrs: {}, marks: [], children: [
                    {
                        id: 'tr-001', type: 'tableRow', attrs: {}, marks: [], children: [
                            {
                                id: 'td-001',
                                type: 'tableCell',
                                attrs: { cellIndent: cellIndentValue },
                                marks: [],
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

function emptyDoc(): DocumentRoot {
    return {
        id: 'outdent-empty-doc',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: []
    };
}

// ── selection helpers ─────────────────────────────────────────────────────────

function selectFirstParagraph(im: IntegrationManager): void {
    const state = im.getState();
    let from = -1;
    let to = -1;
    state.doc.descendants((node: { type: { name: string }; nodeSize: number }, pos: number): boolean => {
        if (node.type.name === 'paragraph' && from < 0) {
            from = pos + 1;
            to = pos + node.nodeSize - 1;
            return false;
        }
        return true;
    });
    im.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)));
}

function selectInsideFirstCell(im: IntegrationManager): void {
    const state = im.getState();
    let from = -1;
    let to = -1;
    state.doc.descendants((node: { type: { name: string }; nodeSize: number }, pos: number): boolean => {
        if (node.type.name === 'tableCell' && from < 0) {
            from = pos + 1;
            to = pos + node.nodeSize - 1;
            return false;
        }
        return true;
    });
    im.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)));
}

function readIndentOfFirstParagraph(im: IntegrationManager): number | null {
    let observedIndent: number | null = null;
    im.getState().doc.descendants((node: { type: { name: string }; attrs: Record<string, unknown> }): boolean => {
        if (node.type.name === 'paragraph' && observedIndent === null) {
            const v: unknown = node.attrs['indent'];
            observedIndent = typeof v === 'number' ? v : null;
        }
        return true;
    });
    return observedIndent;
}

function readCellIndentOfFirstCell(im: IntegrationManager): number | null {
    let observedCellIndent: number | null = null;
    im.getState().doc.descendants((node: { type: { name: string }; attrs: Record<string, unknown> }): boolean => {
        if (node.type.name === 'tableCell' && observedCellIndent === null) {
            const v: unknown = node.attrs['cellIndent'];
            observedCellIndent = typeof v === 'number' ? v : null;
        }
        return true;
    });
    return observedCellIndent;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('outdentCommand (builtins/structure/outdent)', () => {
    it('has name "outdent" and category "structure"', () => {
        expect(outdentCommand.name).toBe('outdent');
        expect(outdentCommand.meta?.category).toBe('structure');
    });

    it('is exported as a callable command (execute is a function)', () => {
        expect(typeof outdentCommand.execute).toBe('function');
    });

    // ── canExecute ───────────────────────────────────────────────────────────

    it('canExecute returns false on an empty document', () => {
        const im = buildIM(emptyDoc());
        const { ctx } = buildCtx(im);
        expect(outdentCommand.canExecute(ctx)).toBe(false);
    });

    it('canExecute returns false when a paragraph has indent = 0 (Do-Nothing baseline)', () => {
        const im = buildIM(paragraphAtIndentDoc(0));
        const { ctx } = buildCtx(im);
        selectFirstParagraph(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        expect(outdentCommand.canExecute(liveCtx)).toBe(false);
    });

    it('canExecute returns false when a cell has cellIndent = 0', () => {
        const im = buildIM(cellAtIndentDoc(0));
        const { ctx } = buildCtx(im);
        selectInsideFirstCell(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        expect(outdentCommand.canExecute(liveCtx)).toBe(false);
    });

    // ── execute: paragraph shape ─────────────────────────────────────────────

    it('execute preserves Do-Nothing baseline when indent is already 0', () => {
        const im = buildIM(paragraphAtIndentDoc(0));
        const { ctx } = buildCtx(im);
        selectFirstParagraph(im);
        const before = readIndentOfFirstParagraph(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        outdentCommand.execute(liveCtx);
        expect(readIndentOfFirstParagraph(im)).toBe(before);
    });

    // ── execute: cell shape ─────────────────────────────────────────────────

    it('execute preserves Do-Nothing baseline on a cell with cellIndent = 0', () => {
        const im = buildIM(cellAtIndentDoc(0));
        const { ctx } = buildCtx(im);
        selectInsideFirstCell(im);
        const before = readCellIndentOfFirstCell(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        outdentCommand.execute(liveCtx);
        expect(readCellIndentOfFirstCell(im)).toBe(before);
    });
});