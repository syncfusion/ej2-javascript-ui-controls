/**
 * editor-state-adapter.ts — Builds Syncfusion EditorState from PM state.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ imports from here.
 * This is the only place where PM state is mapped to the PM-free `EditorState`.
 */
import { PMEditorState, PMTransaction } from '../pm-guard';
import { DocumentMapper } from './document-mapper';
import { SelectionAdapter } from './selection-adapter';
import { PositionAdapter } from './position-adapter';
import { EditorState } from '../../model/editor-state';
import { EditorTransaction } from '../../model/editor-transaction';
import { DefaultIdGenerator } from '../../utils/id-generator';
import { Selection, SelectionType } from '../../model/selection';
import { DocumentRoot } from '../../model/editor-node';

const idGen: DefaultIdGenerator = new DefaultIdGenerator();
const positionAdapter: PositionAdapter = new PositionAdapter();
const selectionAdapter: SelectionAdapter = new SelectionAdapter(positionAdapter);

/**
 * Build a Syncfusion `EditorState` snapshot from a live `PMEditorState`.
 * No PM types appear on the returned value.
 *
 * @param {PMEditorState} pmState - The current PM editor state to snapshot.
 * @param {boolean} isMounted - Whether the editor view is currently mounted.
 * @returns {EditorState} A PM-free editor state snapshot.
 */
export function buildEditorState(pmState: PMEditorState, isMounted: boolean): EditorState {
    const document: DocumentRoot = DocumentMapper.fromPMDoc(pmState.doc, idGen);
    const selection: Selection =
        selectionAdapter.fromPMSelection(pmState.selection, pmState.doc) ??
        { type: SelectionType.Text };

    return { document, selection, isMounted };
}

// ── EditorTransaction implementation ─────────────────────────────────────────

/**
 * PmEditorTransaction — the concrete, PM-backed implementation of
 * `EditorTransaction`. The `brand` ensures structural compatibility.
 *
 * Only created inside `src/pm/`. The rest of the codebase sees only the
 * opaque `EditorTransaction` interface.
 */
export class PmEditorTransaction implements EditorTransaction {
    public readonly brand: 'EditorTransaction' = 'EditorTransaction' as const;

    /** Accessible only within src/pm/. */
    public readonly pmTransaction: PMTransaction;

    constructor(pmTransaction: PMTransaction) {
        this.pmTransaction = pmTransaction;
    }
}

/**
 * Wrap a PM transaction in the opaque `EditorTransaction` interface.
 *
 * @param {PMTransaction} pmTr - The PM transaction to wrap.
 * @returns {EditorTransaction} The wrapped, PM-free transaction.
 */
export function wrapTransaction(pmTr: PMTransaction): EditorTransaction {
    return new PmEditorTransaction(pmTr);
}

/**
 * Unwrap a `EditorTransaction` to its underlying PM transaction.
 * Throws if the value is not a `PmEditorTransaction`.
 *
 * @param {EditorTransaction} tr - The transaction to unwrap.
 * @returns {PMTransaction} The underlying PM transaction.
 */
export function unwrapTransaction(tr: EditorTransaction): PMTransaction {
    if (!(tr instanceof PmEditorTransaction)) {
        throw new Error('EditorTransaction is not a PmEditorTransaction — cannot unwrap');
    }
    return tr.pmTransaction;
}
