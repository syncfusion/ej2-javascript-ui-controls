import { Mark } from './mark';


/**
 * EditorNode — base interface for all document nodes.
 * Represents block and container nodes (paragraphs, headings, tables, etc.).
 */
export interface EditorNode {
    /** Stable UUID v4 identifier — assigned at creation, never regenerated for unchanged nodes. */
    id: string;
    /** The node type name, matching a registered NodeDefinition. */
    type: string;
    /** Node attributes (alignment, indent, color, etc.). */
    attrs: Record<string, unknown>;
    /** Child nodes — empty array for leaf nodes. */
    children: EditorNode[];
    /** Marks applied to this node (for block-level mark support). */
    marks: Mark[];
}

/**
 * TextNode — a leaf node carrying inline text content.
 * Extends EditorNode with a text string and inline marks.
 */
export interface TextNode extends EditorNode {
    /** The raw text string. */
    text: string;
    /** Inline marks applied to this text (bold, italic, link, etc.). */
    marks: Mark[];
    /** TextNode has no children. */
    children: never[];
}

/**
 * DocumentRoot — the top-level container for the entire document.
 * Always has type 'document'.
 */
export interface DocumentRoot extends EditorNode {
    /** Always 'document'. */
    type: 'document';
    /** Schema version — used for future migration handling. */
    schemaVersion: number;
}
