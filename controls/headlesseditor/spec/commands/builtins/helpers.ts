/**
 * spec/commands/builtins/helpers.ts
 *
 * Shared test utilities for all builtin command spec files.
 * Provides a real IntegrationManager wired to the built-in schema,
 * plus a CommandContext factory that mimics what Editor.create() injects.
 */
import { IntegrationManager } from '../../../src/pm/integration/integration-manager';
import { PMSchemaAdapter } from '../../../src/pm/adapters/pm-schema-adapter';
import { DocumentMapper } from '../../../src/pm/adapters/document-mapper';
import { CommandContext, EditorTransaction } from '../../../src/commands/types';
import { DocumentRoot } from '../../../src/model/editor-node';
import { Selection, SelectionType } from '../../../src/model/selection';
import { builtInNodeDefs } from '../../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../../fixtures/built-in-markdefs';
import { history } from '../../../src/pm/pm-guard';
import { PMCommandContext } from '../../../src/commands/internal';
import { buildEditorState, unwrapTransaction } from '../../../src/pm/adapters/editor-state-adapter';
import { DefaultDOMSpecRegistry } from '../../../src/pm/dom/dom-spec-registry';
import { DiagnosticsService } from '../../../src/diagnostics/index';
import { EventBus } from '../../../src/events/event-bus';

// ── Integration bootstrap ─────────────────────────────────────────────────────

export function buildIM(doc?: DocumentRoot): IntegrationManager {
    const diagnostics = new DiagnosticsService();
    const domRegistry = DefaultDOMSpecRegistry.createDefault();
    const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
    const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });
    const sourceDoc = doc ?? emptyEditorDoc();
    const pmDoc = DocumentMapper.toPMDoc(sourceDoc, pmSchema);
    const im = new IntegrationManager(new EventBus(diagnostics));
    im.create({ schema: pmSchema, doc: pmDoc, plugins: [history()] });
    return im;
}

// ── CommandContext factory ────────────────────────────────────────────────────
export function buildCtx(im: IntegrationManager): {
    ctx: PMCommandContext;
    dispatched: EditorTransaction[];
} {
    const dispatched: EditorTransaction[] = [];

    const pmState = im.getState();
    const editorState = buildEditorState(pmState, im.isMounted);

    const ctx: PMCommandContext = {
        editorState,
        selection: editorState.selection,
        document: editorState.document,
        editor: {
            commandRegistry: null
        },
        pmState,
        dispatch(tr: EditorTransaction): void {
            dispatched.push(tr);
            im.dispatch(unwrapTransaction(tr));
        }
    };

    return { ctx, dispatched };
}

// ── Minimal editor doc ────────────────────────────────────────────────────────

export function emptyEditorDoc(): DocumentRoot {
    return {
        id: 'doc-spec-001',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            {
                id: 'para-spec-001',
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: []
            }
        ]
    };
}

// ── Document with text content ────────────────────────────────────────────────

/**
 * Builds a one-paragraph document whose paragraph contains the given text.
 * Used by range-command specs that need real document positions.
 */
export function textEditorDoc(text: string): DocumentRoot {
    return {
        id: 'doc-spec-001',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            {
                id: 'para-spec-001',
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: text.length > 0
                    ? [{ id: 'text-spec-001', type: 'text', text, attrs: {}, marks: [], children: [] } as any]
                    : []
            }
        ]
    };
}

/**
 * Builds a two-paragraph document with one text node per paragraph.
 * Used by range-command specs that need ranges spanning nodes/blocks.
 */
export function buildTwoParagraphDoc(text1: string, text2: string): DocumentRoot {
    return {
        id: 'doc-spec-001',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            {
                id: 'para-spec-001',
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: [
                    { id: 'text-spec-001', type: 'text', text: text1, attrs: {}, marks: [], children: [] } as any
                ]
            },
            {
                id: 'para-spec-002',
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: [
                    { id: 'text-spec-002', type: 'text', text: text2, attrs: {}, marks: [], children: [] } as any
                ]
            }
        ]
    };
}

// ── Node count helper ─────────────────────────────────────────────────────────

export function countNodesOfType(im: IntegrationManager, typeName: string): number {
    let count = 0;
    im.getState().doc.descendants((node) => {
        if (node.type.name === typeName) { count++; }
        return true;
    });
    return count;
}

// ── Find node by attr id ──────────────────────────────────────────────────────

export function findNodeId(im: IntegrationManager): string | null {
    let found: string | null = null;
    im.getState().doc.descendants((node) => {
        if (node.attrs && node.attrs['id'] && !found) {
            found = node.attrs['id'] as string;
        }
        return true;
    });
    return found;
}

export function findNodeIdByType(im: IntegrationManager, typeName: string): string | null {
    let found: string | null = null;
    im.getState().doc.descendants((node) => {
        if (node.type.name === typeName && node.attrs && node.attrs['id'] && !found) {
            found = node.attrs['id'] as string;
        }
        return true;
    });
    return found;
}
