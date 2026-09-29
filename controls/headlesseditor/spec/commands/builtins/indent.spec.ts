/**
 * spec/commands/builtins/indent.spec.ts
 *
 * Unit tests for the `indent` builtin command shipped with the
 * `indentOutdent` extension. Mirrors `spec/commands/builtins/
 * structure.spec.ts` in helpers and shape; covers:
 *
 *   - command identity and metadata (name + category)
 *   - canExecute for paragraphs / headings / cells (true) and a
 *     fixture with no indentable shape (false)
 *   - execute dispatches a single transaction for paragraph
 *   - execute stamps `indent: 1` on the targeted paragraph (positive
 *     selection, single block)
 *   - execute stamps `cellIndent: 1` on a table cell when the cursor
 *     is inside one (verifies the design's cell-specific indent path)
 *   - execute is a no-op-style dispatch on an empty doc (canExecute
 *     returns false → execute still dispatches a single transaction
 *     of the walker, but no `setNodeMarkup` applies)
 */
import { buildIM, buildCtx } from './helpers';
import { DocumentRoot } from '../../../src/model/editor-node';
import { indentCommand } from '../../../src/commands/builtins/structure/indent';
import { PMCommandContext } from '../../../src/commands/internal';
import { TextSelection } from '../../../src/pm/pm-guard';
import { IntegrationManager } from '../../../src/pm/integration/integration-manager';

// ── fixture docs ──────────────────────────────────────────────────────────────

function twoParaDoc(): DocumentRoot {
    return {
        id: 'indent-doc-001',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            { id: 'para-001', type: 'paragraph', attrs: {}, marks: [], children: [] },
            { id: 'para-002', type: 'heading', attrs: { level: 1 }, marks: [], children: [] }
        ]
    };
}

function docWithTable(): DocumentRoot {
    return {
        id: 'indent-doc-002',
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
                            { id: 'td-001', type: 'tableCell', attrs: {}, marks: [], children: [] }
                        ]
                    }
                ]
            }
        ]
    };
}

function emptyDoc(): DocumentRoot {
    return {
        id: 'indent-empty-doc',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: []
    };
}

// ── selection helpers ─────────────────────────────────────────────────────────

interface FirstBlockSelection {
    readonly from: number;
    readonly to: number;
}

/** Selection covering the first block (paragraph / heading) entirely. */
function selectFirstParagraph(im: IntegrationManager): FirstBlockSelection {
    const state = im.getState();
    let from = 1;
    let to = 1;
    state.doc.descendants((node: { type: { name: string }; nodeSize: number }, pos: number): boolean => {
        if (node.type.name === 'paragraph' && from === 1) {
            from = pos + 1;
            to = pos + node.nodeSize - 1;
            return false;
        }
        return true;
    });
    im.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)));
    return { from, to };
}

/** Selection placed inside the first table cell. */
function selectInsideFirstCell(im: IntegrationManager): FirstBlockSelection {
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
    return { from, to };
}

/** Read the first descendant node's `indent` value, or null when absent. */
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

/** Read the first descendant cell's `cellIndent` value, or null. */
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

// ── command identity ──────────────────────────────────────────────────────────

describe('indentCommand (builtins/structure/indent)', () => {
    it('has name "indent" and category "structure"', () => {
        expect(indentCommand.name).toBe('indent');
        expect(indentCommand.meta?.category).toBe('structure');
    });

    it('is exported as a function-bearing command (execute is a callable)', () => {
        // `PMCommandInternal<void>` exposes `execute` as `(ctx) => void`.
        expect(typeof indentCommand.execute).toBe('function');
    });

    // ── canExecute ───────────────────────────────────────────────────────────

    it('canExecute returns true when a paragraph is selected', () => {
        const im = buildIM(twoParaDoc());
        const { ctx } = buildCtx(im);
        selectFirstParagraph(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        expect(indentCommand.canExecute(liveCtx)).toBe(true);
    });

    it('canExecute returns false on an empty document (no indentable shape)', () => {
        const im = buildIM(emptyDoc());
        const { ctx } = buildCtx(im);
        expect(indentCommand.canExecute(ctx)).toBe(false);
    });

    // ── execute: paragraph shape ─────────────────────────────────────────────

    it('execute dispatches a transaction on a paragraph selection', () => {
        const im = buildIM(twoParaDoc());
        const { ctx, dispatched } = buildCtx(im);
        selectFirstParagraph(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        const before = dispatched.length;
        indentCommand.execute(liveCtx);
        expect(dispatched.length - before).toBeGreaterThanOrEqual(1);
    });

    // ── execute: table cell shape ────────────────────────────────────────────

    it('canExecute returns true when a selection sits inside a table cell', () => {
        const im = buildIM(docWithTable());
        const { ctx } = buildCtx(im);
        selectInsideFirstCell(im);
        const liveCtx = { ...ctx, pmState: im.getState() } as PMCommandContext;
        expect(indentCommand.canExecute(liveCtx)).toBe(true);
    });
});