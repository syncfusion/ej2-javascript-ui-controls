import { DOMOutputSpec, PMMark } from '../pm-guard';
import { MarkDOMSpec, MarkToDOMFn } from './dom-spec-registry';

/**
 * default-mark-dom.ts
 *
 * Defines the MarkDOMSpec entries for all built-in mark types.
 *
 * Design rules:
 * - One entry per built-in mark name.
 * - Each entry contains a `toDOM` function that receives a PMMark and returns
 *   a DOMOutputSpec (semantic HTML only — no product-specific styling).
 * - Attribute-driven marks (link, color, highlight) read from mark.attrs.
 * - `parseDOM` slots are reserved for clipboard/HTML-import support (future).
 */

// ─── Inline formatting ────────────────────────────────────────────────────────

const boldToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['strong', 0];

const italicToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['em', 0];

const underlineToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['u', 0];

const strikeToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['s', 0];

const codeMarkToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['code', 0];

// ─── Rich inline marks ────────────────────────────────────────────────────────

const linkToDOM: MarkToDOMFn = (mark: PMMark, _inline: boolean): DOMOutputSpec => {
    const attrs: Record<string, string> = { href: (mark.attrs['href'] as string) ?? '' };
    const title: string = mark.attrs['title'] as string;
    const target: string = mark.attrs['target'] as string;
    if (title) { attrs['title'] = title; }
    if (target) { attrs['target'] = target; }
    return ['a', attrs, 0];
};

const colorToDOM: MarkToDOMFn = (mark: PMMark, _inline: boolean): DOMOutputSpec => {
    const color: string = (mark.attrs['color'] as string) ?? '';
    return ['span', { style: `color: ${color}` }, 0];
};

const highlightToDOM: MarkToDOMFn = (_mark: PMMark, _inline: boolean): DOMOutputSpec => ['mark', 0];

const backgroundColorToDOM: MarkToDOMFn = (mark: PMMark, _inline: boolean): DOMOutputSpec => {
    const color: string = (mark.attrs['color'] as string) ?? '';
    return ['span', { style: `background-color: ${color}` }, 0];
};

const fontSizeToDOM: MarkToDOMFn = (mark: PMMark, _inline: boolean): DOMOutputSpec => {
    const size: string = (mark.attrs['size'] as string) ?? '';
    return ['span', { style: `font-size: ${size}` }, 0];
};

// ─── Registry ─────────────────────────────────────────────────────────────────

/**
 * Built-in mark DOM spec map.
 *
 * Key:   MarkDefinition.name (must match exactly)
 * Value: MarkDOMSpec { toDOM }
 *
 * `strikethrough` is an alias for `strike` — both map to <s>.
 */
export const DEFAULT_MARK_DOM_MAP: ReadonlyMap<string, MarkDOMSpec> = new Map<string, MarkDOMSpec>([
    ['bold',            { toDOM: boldToDOM }],
    ['italic',          { toDOM: italicToDOM }],
    ['underline',       { toDOM: underlineToDOM }],
    ['strike',          { toDOM: strikeToDOM }],
    ['strikethrough',   { toDOM: strikeToDOM }],   // alias — both names map to <s>
    ['code',            { toDOM: codeMarkToDOM }],
    ['link',            { toDOM: linkToDOM }],
    ['color',           { toDOM: colorToDOM }],
    ['highlight',       { toDOM: highlightToDOM }],
    ['backgroundColor', { toDOM: backgroundColorToDOM }],
    ['fontSize',        { toDOM: fontSizeToDOM }]
]);
