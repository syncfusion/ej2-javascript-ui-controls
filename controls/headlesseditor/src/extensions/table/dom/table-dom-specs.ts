/**
 * table-dom-specs.ts — PM-free DOM rendering descriptors for table nodes.
 *
 * Defines how `table`, `tableRow`, `tableCell`, and `tableHeader` nodes render
 * to the DOM. The five declared cell style attributes (`align`,
 * `verticalAlign`, `backgroundColor`, `color`, `borderColor`) are serialized
 * as inline `style` declarations; structural attributes (`colspan`, `rowspan`)
 * remain HTML attributes.
 *
 * `DOMOutputDescriptor` uses the same tag-name / array spec format as
 * ProseMirror's `DOMOutputSpec` — the compiler converts them before passing
 * to PM.
 */
import type { ExtensionDOMSpecs, NodeDOMDescriptor, DOMOutputDescriptor } from '../../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse cell attributes from a DOM element's HTML attributes and inline styles.
 *
 * Extracts colspan, rowspan, and style properties (align, verticalAlign,
 * backgroundColor, color, borderColor) from the DOM element.
 *
 * @param {HTMLTableCellElement} dom - The table cell DOM element.
 * @returns {Record<string, unknown>} Attributes for the cell node.
 */
function parseCellAttrs(dom: HTMLTableCellElement): Record<string, unknown> {
    const attrs: Record<string, unknown> = {
        colspan: +(dom.getAttribute('colspan') || '1'),
        rowspan: +(dom.getAttribute('rowspan') || '1'),
        align: null,
        verticalAlign: null,
        backgroundColor: null,
        color: null,
        borderColor: null
    };

    const style: string = dom.getAttribute('style') || '';
    if (style) {
        const styleMap: Record<string, string> = {
            'text-align': 'align',
            'vertical-align': 'verticalAlign',
            'background-color': 'backgroundColor',
            'color': 'color',
            'border-color': 'borderColor'
        };

        const declarations: string[] = style.split(';');
        for (const decl of declarations) {
            const trimmed: string = decl.trim();
            if (!trimmed) { continue; }

            const colonIdx: number = trimmed.indexOf(':');
            if (colonIdx === -1) { continue; }

            const prop: string = trimmed.substring(0, colonIdx).trim().toLowerCase();
            const value: string = trimmed.substring(colonIdx + 1).trim();

            // styleMap/attrs are plain records keyed by CSS property / attr names; dynamic access is safe here.
            // eslint-disable-next-line security/detect-object-injection
            const attrName: string | undefined = styleMap[prop];
            if (attrName && value) {
                // eslint-disable-next-line security/detect-object-injection
                attrs[attrName] = value;
            }
        }
    }

    return attrs;
}

/**
 * Build the DOM attribute map shared by both cell types.
 *
 * Merges structural attributes (`colspan`, `rowspan`) and emits a single
 * `style` attribute from the five declared style attributes. Any attribute
 * whose value is `null` / `undefined` / empty-string is omitted.
 *
 * @param {Record<string, unknown>} attrs - The PM node attribute bag.
 * @returns {Record<string, string>} DOM attributes ready to spread into a spec tuple.
 */
function buildCellDOMAttrs(attrs: Record<string, unknown>): Record<string, string> {
    const domAttrs: Record<string, string> = {};

    // ── Structural attributes ─────────────────────────────────────────────────
    const colspan: number = typeof attrs['colspan'] === 'number' ? (attrs['colspan'] as number) : 1;
    const rowspan: number = typeof attrs['rowspan'] === 'number' ? (attrs['rowspan'] as number) : 1;
    if (colspan !== 1) { domAttrs['colspan'] = String(colspan); }
    if (rowspan !== 1) { domAttrs['rowspan'] = String(rowspan); }

    // ── Style attributes → inline `style` ─────────────────────────────────────
    // Each entry is (attr-name, CSS-property). Only declared attrs are read;
    // anything else is intentionally ignored.
    const styleMap: ReadonlyArray<readonly [string, string]> = [
        ['align',           'text-align'],
        ['verticalAlign',   'vertical-align'],
        ['backgroundColor', 'background-color'],
        ['color',           'color'],
        ['borderColor',     'border-color']
    ];

    const stylePairs: string[] = [];
    for (let i: number = 0; i < styleMap.length; i++) {
        const entry: readonly [string, string] = styleMap[i as number];
        const attrName: string = entry[0];
        const cssProp: string  = entry[1];
        const v: unknown = attrs[`${attrName}`];
        if (v !== null && v !== undefined && v !== '') {
            stylePairs.push(`${cssProp}: ${String(v)}`);
        }
    }
    if (stylePairs.length > 0) {
        domAttrs['style'] = stylePairs.join('; ');
    }

    return domAttrs;
}

// ── Node descriptors ──────────────────────────────────────────────────────────

const tableDescriptor: NodeDOMDescriptor = {
    /**
     * Render a table node as a `<table>` element.
     *
     * @param {Record<string, unknown>} _attrs - Table node attributes (unused).
     * @returns {DOMOutputDescriptor} DOM output spec for the table element.
     */
    toDOM(_attrs: Record<string, unknown>): DOMOutputDescriptor {
        return ['table', 0];
    },
    parseDOM: [{ tag: 'table' }]
};

const tableRowDescriptor: NodeDOMDescriptor = {
    /**
     * Render a tableRow node as a `<tr>` element.
     *
     * @param {Record<string, unknown>} _attrs - Row node attributes (unused).
     * @returns {DOMOutputDescriptor} DOM output spec for the row element.
     */
    toDOM(_attrs: Record<string, unknown>): DOMOutputDescriptor {
        return ['tr', 0];
    },
    parseDOM: [{ tag: 'tr' }]
};

const tableCellDescriptor: NodeDOMDescriptor = {
    /**
     * Render a tableCell node as `<td>`.
     *
     * Emits `colspan`/`rowspan` as HTML attributes, plus a single inline
     * `style` declaration built from the five declared cell style attributes
     * (`align`, `verticalAlign`, `backgroundColor`, `color`, `borderColor`).
     *
     * @param {Record<string, unknown>} attrs - Cell node attributes.
     * @returns {DOMOutputDescriptor} DOM output spec for the cell element.
     */
    toDOM(attrs: Record<string, unknown>): DOMOutputDescriptor {
        return ['td', buildCellDOMAttrs(attrs), 0];
    },
    parseDOM: [
        {
            tag: 'td',
            getAttrs: (dom: any) => parseCellAttrs(dom as HTMLTableCellElement)
        }
    ]
};

const tableHeaderDescriptor: NodeDOMDescriptor = {
    /**
     * Render a tableHeader node as `<th>`.
     *
     * Emits `colspan`/`rowspan` as HTML attributes, plus a single inline
     * `style` declaration built from the five declared cell style attributes.
     *
     * @param {Record<string, unknown>} attrs - Header cell node attributes.
     * @returns {DOMOutputDescriptor} DOM output spec for the header cell element.
     */
    toDOM(attrs: Record<string, unknown>): DOMOutputDescriptor {
        return ['th', buildCellDOMAttrs(attrs), 0];
    },
    parseDOM: [
        {
            tag: 'th',
            getAttrs: (dom: any) => parseCellAttrs(dom as HTMLTableCellElement)
        }
    ]
};

// ── Composite spec ────────────────────────────────────────────────────────────

/**
 * DOM rendering specs contributed by the table extension.
 *
 * Contributed via `domSpecs()` in `table-extension.ts`.
 */
export const tableDOMSpecs: ExtensionDOMSpecs = {
    nodes: {
        table: tableDescriptor,
        tableRow: tableRowDescriptor,
        tableCell: tableCellDescriptor,
        tableHeader: tableHeaderDescriptor
    }
};
