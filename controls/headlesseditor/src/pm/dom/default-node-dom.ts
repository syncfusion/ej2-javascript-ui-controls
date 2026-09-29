import { DOMOutputSpec, PMNode } from '../pm-guard';
import { NodeDOMSpec, NodeToDOMFn } from './dom-spec-registry';

/**
 * default-node-dom.ts
 *
 * Defines the NodeDOMSpec entries for all built-in node types.
 *
 * Design rules:
 * - One entry per built-in node name.
 * - Each entry contains a `toDOM` function that receives a PMNode and returns
 *   a DOMOutputSpec (semantic HTML only — no product-specific styling).
 * - `text` is intentionally absent: ProseMirror handles text nodes natively
 *   and must not have a toDOM spec.
 * - `document` is included so DOMSerializer can serialize the full tree even
 *   though EditorView never calls toDOM on the topNode during rendering.
 * - Attribute-driven nodes (heading, tableCell, image, callout, etc.) read
 *   from node.attrs to produce the correct output.
 * - `parseDOM` slots are reserved for clipboard/HTML-import support (future).
 */

// ─── Structural ───────────────────────────────────────────────────────────────

const documentToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['div', 0];

const paragraphToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['p', 0];

const headingToDOM: NodeToDOMFn = (node: PMNode): DOMOutputSpec => {
    const level: number = (node.attrs['level'] as number) ?? 1;
    const tag: string = `h${Math.max(1, Math.min(6, level))}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return [tag, 0];
};

const blockquoteToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['blockquote', 0];

// ─── Lists ────────────────────────────────────────────────────────────────────

const bulletListToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['ul', 0];

const orderedListToDOM: NodeToDOMFn = (node: PMNode): DOMOutputSpec => {
    const start: number = node.attrs['start'] as number;
    return start != null && start !== 1
        ? ['ol', { start: String(start) }, 0]
        : ['ol', 0];
};

const listItemToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['li', 0];

// ─── Code ─────────────────────────────────────────────────────────────────────

const codeBlockToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['pre', ['code', 0]];

// ─── Media / Embeds ───────────────────────────────────────────────────────────

const horizontalRuleToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['hr'];

const imageToDOM: NodeToDOMFn = (node: PMNode): DOMOutputSpec => {
    const attrs: Record<string, string> = { src: (node.attrs['src'] as string) ?? '' };
    const alt: string = node.attrs['alt'] as string;
    const title: string = node.attrs['title'] as string;
    const width: number = node.attrs['width'] as number;
    const height: number = node.attrs['height'] as number;
    if (alt) { attrs['alt'] = alt; }
    if (title) { attrs['title'] = title; }
    if (width != null) { attrs['width'] = String(width); }
    if (height != null) { attrs['height'] = String(height); }
    return ['img', attrs];
};

// ─── Table ────────────────────────────────────────────────────────────────────

const tableToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['table', ['tbody', 0]];

const tableRowToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec => ['tr', 0];

const tableCellToDOM: NodeToDOMFn = (node: PMNode): DOMOutputSpec => {
    const isHeader: boolean = node.attrs['isHeader'] as boolean;
    return isHeader ? ['th', 0] : ['td', 0];
};

// ─── Rich blocks ──────────────────────────────────────────────────────────────

const calloutToDOM: NodeToDOMFn = (node: PMNode): DOMOutputSpec => {
    const variant: string = (node.attrs['variant'] as string) ?? 'info';
    return ['div', { 'data-type': 'callout', 'data-variant': variant }, 0];
};

const collapsibleParagraphToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec =>
    ['div', { 'data-type': 'collapsible-paragraph' }, 0];

const collapsibleHeadingToDOM: NodeToDOMFn = (_node: PMNode): DOMOutputSpec =>
    ['div', { 'data-type': 'collapsible-heading' }, 0];

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Built-in node DOM spec map.
 *
 * Key:   NodeDefinition.name (must match exactly)
 * Value: NodeDOMSpec { toDOM }
 *
 * `text` is intentionally absent — NodeSpecBuilder treats it as a PM special
 * case and never consults the registry for it.
 */
export const DEFAULT_NODE_DOM_MAP: ReadonlyMap<string, NodeDOMSpec> = new Map<string, NodeDOMSpec>([
    ['document',              { toDOM: documentToDOM }],
    ['paragraph',             { toDOM: paragraphToDOM }],
    ['heading',               { toDOM: headingToDOM }],
    ['blockquote',            { toDOM: blockquoteToDOM }],
    ['bulletList',            { toDOM: bulletListToDOM }],
    ['orderedList',           { toDOM: orderedListToDOM }],
    ['listItem',              { toDOM: listItemToDOM }],
    ['codeBlock',             { toDOM: codeBlockToDOM }],
    ['horizontalRule',        { toDOM: horizontalRuleToDOM }],
    ['image',                 { toDOM: imageToDOM }],
    ['table',                 { toDOM: tableToDOM }],
    ['tableRow',              { toDOM: tableRowToDOM }],
    ['tableCell',             { toDOM: tableCellToDOM }],
    ['callout',               { toDOM: calloutToDOM }],
    ['collapsibleParagraph',  { toDOM: collapsibleParagraphToDOM }],
    ['collapsibleHeading',    { toDOM: collapsibleHeadingToDOM }]
]);
