/**
 * spec/commands/shared/node-resolver.spec.ts
 *
 * Tests for NodeResolver — the pure-TS, PM-free document tree traversal
 * utility consumed by structural built-in commands (duplicateNode, wrapNode,
 * transformNode, etc.).
 *
 * Every test feeds a real `DocumentRoot` tree (the same model type the editor
 * emits via `getDocument()`) and asserts resolver output. No mocks, no PM.
 */
import { NodeResolver } from '../../../src/commands/shared/node-resolver';
import { DocumentRoot, EditorNode, TextNode } from '../../../src/model/editor-node';

// ── Fixture tree ──────────────────────────────────────────────────────────────
//
// Mirrors a realistic editor document: a document root containing two
// paragraphs, the second of which contains nested blocks (block-quote +
// listItem) so depth-first traversal has work to do.
//
//   document
//   ├── paragraph "p-root-1"   → text "Hello"
//   └── paragraph "p-root-2"
//       ├── text "World"
//       └── blockquote "bq-1"
//           └── paragraph "p-in-bq"
//               └── text "Nested"
const ROOT_ID: string = 'doc-root-id';
const P1_ID: string = 'p-root-1';
const P2_ID: string = 'p-root-2';
const BQ_ID: string = 'bq-1';
const P_IN_BQ_ID: string = 'p-in-bq';
const T_HELLO_ID: string = 't-hello';
const T_WORLD_ID: string = 't-world';
const T_NESTED_ID: string = 't-nested';
const GHOST_ID: string = 'does-not-exist';

function buildSampleDocument(): DocumentRoot {
    return {
        id: ROOT_ID,
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [
            {
                id: P1_ID,
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: [
                    {
                        id: T_HELLO_ID,
                        type: 'text',
                        text: 'Hello',
                        attrs: {},
                        marks: [],
                        children: [] as never[]
                    } as TextNode
                ]
            },
            {
                id: P2_ID,
                type: 'paragraph',
                attrs: {},
                marks: [],
                children: [
                    {
                        id: T_WORLD_ID,
                        type: 'text',
                        text: 'World',
                        attrs: {},
                        marks: [],
                        children: [] as never[]
                    } as TextNode,
                    {
                        id: BQ_ID,
                        type: 'blockquote',
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                id: P_IN_BQ_ID,
                                type: 'paragraph',
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        id: T_NESTED_ID,
                                        type: 'text',
                                        text: 'Nested',
                                        attrs: {},
                                        marks: [],
                                        children: [] as never[]
                                    } as TextNode
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

// ── findNodeById ─────────────────────────────────────────────────────────────

describe('NodeResolver.findNodeById', () => {
    it('returns the document root when the root id is requested', () => {
        const root: DocumentRoot = buildSampleDocument();
        const found: EditorNode | undefined = NodeResolver.findNodeById(root, ROOT_ID);
        expect(found).toBeDefined();
        expect(found?.id).toBe(ROOT_ID);
        expect(found?.type).toBe('document');
    });

    it('returns a top-level child by id', () => {
        const root: DocumentRoot = buildSampleDocument();
        const found: EditorNode | undefined = NodeResolver.findNodeById(root, P1_ID);
        expect(found).toBeDefined();
        expect(found?.id).toBe(P1_ID);
        expect(found?.type).toBe('paragraph');
    });

    it('returns a deeply-nested child (blockquote inside a paragraph)', () => {
        const root: DocumentRoot = buildSampleDocument();
        const found: EditorNode | undefined = NodeResolver.findNodeById(root, BQ_ID);
        expect(found).toBeDefined();
        expect(found?.id).toBe(BQ_ID);
        expect(found?.type).toBe('blockquote');
    });

    it('returns a leaf text node by id', () => {
        const root: DocumentRoot = buildSampleDocument();
        const found: EditorNode | undefined = NodeResolver.findNodeById(root, T_NESTED_ID);
        expect(found).toBeDefined();
        expect(found?.id).toBe(T_NESTED_ID);
        expect(found?.type).toBe('text');
        expect((found as TextNode).text).toBe('Nested');
    });

    it('returns undefined for an unknown id', () => {
        const root: DocumentRoot = buildSampleDocument();
        const found: EditorNode | undefined = NodeResolver.findNodeById(root, GHOST_ID);
        expect(found).toBeUndefined();
    });
});

// ── findNodesByType ──────────────────────────────────────────────────────────

describe('NodeResolver.findNodesByType', () => {
    it('collects every paragraph in the document (including the one nested in blockquote)', () => {
        const root: DocumentRoot = buildSampleDocument();
        const paragraphs: EditorNode[] = NodeResolver.findNodesByType(root, 'paragraph');
        // Two top-level paragraphs + one inside blockquote = 3
        expect(paragraphs.length).toBe(3);
        const ids: string[] = paragraphs.map((n: EditorNode) => n.id);
        expect(ids).toContain(P1_ID);
        expect(ids).toContain(P2_ID);
        expect(ids).toContain(P_IN_BQ_ID);
    });

    it('collects every text leaf', () => {
        const root: DocumentRoot = buildSampleDocument();
        const texts: EditorNode[] = NodeResolver.findNodesByType(root, 'text');
        expect(texts.length).toBe(3);
        const rendered: string = texts
            .map((n: EditorNode) => (n as TextNode).text)
            .join('|');
        expect(rendered).toBe('Hello|World|Nested');
    });

    it('collects the single blockquote', () => {
        const root: DocumentRoot = buildSampleDocument();
        const blockquotes: EditorNode[] = NodeResolver.findNodesByType(root, 'blockquote');
        expect(blockquotes.length).toBe(1);
        expect(blockquotes[0].id).toBe(BQ_ID);
    });

    it('returns an empty array when no node matches the requested type', () => {
        const root: DocumentRoot = buildSampleDocument();
        const tables: EditorNode[] = NodeResolver.findNodesByType(root, 'table');
        expect(tables).toEqual([]);
    });

    it('matches the document root itself when requested', () => {
        const root: DocumentRoot = buildSampleDocument();
        const documents: EditorNode[] = NodeResolver.findNodesByType(root, 'document');
        expect(documents.length).toBe(1);
        expect(documents[0].id).toBe(ROOT_ID);
    });
});

// ── findParent ───────────────────────────────────────────────────────────────

describe('NodeResolver.findParent', () => {
    it('returns undefined when the target id is the root (no parent above it)', () => {
        const root: DocumentRoot = buildSampleDocument();
        const parent: EditorNode | undefined = NodeResolver.findParent(root, ROOT_ID);
        expect(parent).toBeUndefined();
    });

    it('returns the document root for a top-level paragraph', () => {
        const root: DocumentRoot = buildSampleDocument();
        const parent: EditorNode | undefined = NodeResolver.findParent(root, P1_ID);
        expect(parent).toBeDefined();
        expect(parent?.id).toBe(ROOT_ID);
        expect(parent?.type).toBe('document');
    });

    it('returns the containing paragraph for a leaf text node', () => {
        const root: DocumentRoot = buildSampleDocument();
        const parent: EditorNode | undefined = NodeResolver.findParent(root, T_HELLO_ID);
        expect(parent).toBeDefined();
        expect(parent?.id).toBe(P1_ID);
        expect(parent?.type).toBe('paragraph');
    });

    it('returns the correct ancestor at depth 3 (text → paragraph → blockquote → paragraph)', () => {
        const root: DocumentRoot = buildSampleDocument();
        const parent: EditorNode | undefined = NodeResolver.findParent(root, T_NESTED_ID);
        expect(parent).toBeDefined();
        expect(parent?.id).toBe(P_IN_BQ_ID);
        expect(parent?.type).toBe('paragraph');
    });

    it('returns undefined for an unknown child id', () => {
        const root: DocumentRoot = buildSampleDocument();
        const parent: EditorNode | undefined = NodeResolver.findParent(root, GHOST_ID);
        expect(parent).toBeUndefined();
    });
});

// ── childIndexOf ─────────────────────────────────────────────────────────────

describe('NodeResolver.childIndexOf', () => {
    it('returns the zero-based index of a top-level paragraph inside the document', () => {
        const root: DocumentRoot = buildSampleDocument();
        expect(NodeResolver.childIndexOf(root, P1_ID)).toBe(0);
        expect(NodeResolver.childIndexOf(root, P2_ID)).toBe(1);
    });

    it('returns the index of a leaf text inside its parent paragraph', () => {
        const root: DocumentRoot = buildSampleDocument();
        const p1: EditorNode | undefined = NodeResolver.findNodeById(root, P1_ID);
        expect(p1).toBeDefined();
        expect(NodeResolver.childIndexOf(p1 as EditorNode, T_HELLO_ID)).toBe(0);
    });

    it('returns the correct index for the second child of paragraph-2 (text + blockquote)', () => {
        const root: DocumentRoot = buildSampleDocument();
        const p2: EditorNode | undefined = NodeResolver.findNodeById(root, P2_ID);
        expect(p2).toBeDefined();
        expect(NodeResolver.childIndexOf(p2 as EditorNode, T_WORLD_ID)).toBe(0);
        expect(NodeResolver.childIndexOf(p2 as EditorNode, BQ_ID)).toBe(1);
    });

    it('returns -1 for an unknown child id', () => {
        const root: DocumentRoot = buildSampleDocument();
        expect(NodeResolver.childIndexOf(root, GHOST_ID)).toBe(-1);
    });

    it('returns -1 when the target is not a direct child (only an indirect descendant)', () => {
        const root: DocumentRoot = buildSampleDocument();
        // t-nested is inside p-in-bq, not a direct child of the document root.
        expect(NodeResolver.childIndexOf(root, T_NESTED_ID)).toBe(-1);
    });
});
