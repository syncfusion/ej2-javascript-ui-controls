/**
 * This spec file contains test cases for:
 * - Table Extension
 */

import {
    HeadlessEditor,
    TextNode,
    paragraphExtension,
    undoRedoExtension
} from '../../../src/index';
import { tableExtension } from '../../../src/extensions/builtins/table';
import { DocumentRoot, EditorNode } from '../../../src/model/editor-node';
import { Selection, SelectionType, CellSelection } from '../../../src/model/selection';
import {
    TableService,
    TableContext,
    CellContext,
    findNodeById,
    findAncestorByType,
    getCursorNodeId,
    createCellSelection,
    findTableAncestor,
    asCellSelection
} from '../../../src/extensions/table/services/table-service';

describe('Built-in: table', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'table',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'tableRow',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'tableHeader',
                                        id: crypto.randomUUID(),
                                        attrs: {
                                            colspan: 1,
                                            rowspan: 1
                                        },
                                        marks: [],
                                        children: [
                                            {
                                                type: 'paragraph',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: [
                                                    {
                                                        type: 'text',
                                                        id: crypto.randomUUID(),
                                                        attrs: {},
                                                        children: [],
                                                        text: 'Feature',
                                                        marks: []
                                                    } as TextNode
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'tableHeader',
                                        id: crypto.randomUUID(),
                                        attrs: {
                                            colspan: 1,
                                            rowspan: 1
                                        },
                                        marks: [],
                                        children: [
                                            {
                                                type: 'paragraph',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: [
                                                    {
                                                        type: 'text',
                                                        id: crypto.randomUUID(),
                                                        attrs: {},
                                                        children: [],
                                                        text: 'Status',
                                                        marks: []
                                                    } as TextNode
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'tableRow',
                                id: crypto.randomUUID(),
                                attrs: {},
                                marks: [],
                                children: [
                                    {
                                        type: 'tableCell',
                                        id: crypto.randomUUID(),
                                        attrs: {
                                            colspan: 1,
                                            rowspan: 1
                                        },
                                        marks: [],
                                        children: [
                                            {
                                                type: 'paragraph',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: [
                                                    {
                                                        type: 'text',
                                                        id: crypto.randomUUID(),
                                                        attrs: {},
                                                        children: [],
                                                        text: 'Headless Table Rendering',
                                                        marks: []
                                                    } as TextNode
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'tableCell',
                                        id: crypto.randomUUID(),
                                        attrs: {
                                            colspan: 1,
                                            rowspan: 1
                                        },
                                        marks: [],
                                        children: [
                                            {
                                                type: 'paragraph',
                                                id: crypto.randomUUID(),
                                                attrs: {},
                                                marks: [],
                                                children: [
                                                    {
                                                        type: 'text',
                                                        id: crypto.randomUUID(),
                                                        attrs: {},
                                                        children: [],
                                                        text: 'Operational',
                                                        marks: []
                                                    } as TextNode
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                tableExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should render table content', () => {
        const doc = editor.getDocument();

        expect(doc.children[0].type).toBe('table');

        const table = container.querySelector('table');

        expect(table).not.toBeNull();

        expect(container.textContent).toContain('Feature');
        expect(container.textContent).toContain('Status');
        expect(container.textContent).toContain('Headless Table Rendering');
        expect(container.textContent).toContain('Operational');
    });

    it('should expose the table extension metadata', () => {
        expect(tableExtension.name).toBe('table');
        expect(tableExtension.config.priority).toBe(10);
    });

    it('should contribute the four table node definitions in order', () => {
        expect(tableExtension.config.nodes!().map((node: any) => node.name)).toEqual([
            'table', 'tableRow', 'tableCell', 'tableHeader'
        ]);
    });

    it('should define the table and row content contracts', () => {
        const nodes = tableExtension.config.nodes!() as any[];
        expect(nodes[0].group).toBe('block');
        expect(nodes[0].attrs).toBeUndefined();
        expect(nodes[1].group).toBe('container');
        expect(JSON.stringify(nodes[0].content)).toContain('tableRow');
        expect(JSON.stringify(nodes[1].content)).toContain('tableCell');
        expect(JSON.stringify(nodes[1].content)).toContain('tableHeader');
    });

    it('should define matching cell and header attributes', () => {
        const nodes = tableExtension.config.nodes!() as any[];
        const cellAttrs = nodes[2].attrs.map((attr: any) => attr.name);
        const headerAttrs = nodes[3].attrs.map((attr: any) => attr.name);
        expect(cellAttrs).toEqual([
            'colspan', 'rowspan', 'colwidth', 'align', 'verticalAlign',
            'backgroundColor', 'color', 'borderColor'
        ]);
        expect(headerAttrs).toEqual(cellAttrs);
        expect(nodes[2].attrs[0].default).toBe(1);
        expect(nodes[2].attrs[1].default).toBe(1);
    });

    it('should expose the documented cell enum and color attributes', () => {
        const attrs = (tableExtension.config.nodes!()[2] as any).attrs;
        expect(attrs.find((attr: any) => attr.name === 'align').values)
            .toEqual(['left', 'center', 'right']);
        expect(attrs.find((attr: any) => attr.name === 'verticalAlign').values)
            .toEqual(['top', 'middle', 'bottom']);
        expect(attrs.filter((attr: any) => ['backgroundColor', 'color', 'borderColor'].indexOf(attr.name) !== -1)
            .every((attr: any) => attr.type === 'string' && attr.default === null)).toBe(true);
    });

    it('should register all table commands with table metadata', () => {
        const commands = tableExtension.config.commands!();
        expect(commands.map((command: any) => command.name)).toEqual([
            'insertTable', 'deleteTable', 'insertRowBefore', 'insertRowAfter',
            'deleteRow', 'insertColumnBefore', 'insertColumnAfter', 'deleteColumn',
            'insertParagraphInCell', 'toggleHeaderRow', 'toggleHeaderColumn',
            'setCellAttribute', 'moveToNextCell', 'moveToPreviousCell'
        ]);
        expect(commands.every((command: any) => command.meta.category === 'table')).toBe(true);
    });

    it('should contribute column resize and table editing plugins', () => {
        const plugins = tableExtension.config.plugins.call!({ options: { resize: true } } as any);
        expect(plugins.length).toBe(2);
        expect(plugins[0]).toBeDefined();
        expect(plugins[1]).toBeDefined();
    });

    it('should expose all table DOM descriptors', () => {
        const nodes = tableExtension.config.domSpecs!().nodes!;
        expect(Object.keys(nodes)).toEqual(['table', 'tableRow', 'tableCell', 'tableHeader']);
    });

    it('should serialize table, row, cell, and header descriptors', () => {
        const nodes = tableExtension.config.domSpecs!().nodes!;
        expect(nodes.table.toDOM!({})).toEqual(['table', 0]);
        expect(nodes.tableRow.toDOM!({})).toEqual(['tr', 0]);
        expect(nodes.tableCell.toDOM!({})).toEqual(['td', {}, 0]);
        expect(nodes.tableHeader.toDOM!({})).toEqual(['th', {}, 0]);
    });

    it('should serialize structural and style cell attributes', () => {
        const nodes = tableExtension.config.domSpecs!().nodes!;
        const descriptor: any = nodes.tableCell.toDOM!({
            colspan: 2,
            rowspan: 3,
            align: 'center',
            verticalAlign: 'middle',
            backgroundColor: 'yellow',
            color: 'red',
            borderColor: 'blue'
        });
        expect(descriptor).toEqual(['td', {
            colspan: '2',
            rowspan: '3',
            style: 'text-align: center; vertical-align: middle; background-color: yellow; color: red; border-color: blue'
        }, 0]);
    });

    it('should omit empty and unsupported cell attributes', () => {
        const cell: any = tableExtension.config.domSpecs!().nodes!.tableCell.toDOM!({
            colspan: 1, rowspan: 1, align: null, color: '', unknown: 'ignored'
        });
        expect(cell).toEqual(['td', {}, 0]);
    });

    it('should register a td parseDOM rule with a getAttrs function for tableCell', () => {
        const parse: any = tableExtension.config.domSpecs!().nodes!.tableCell.parseDOM![0];

        expect(parse.tag).toBe('td');
        expect(typeof parse.getAttrs).toBe('function');
    });

    it('should register a th parseDOM rule with a getAttrs function for tableHeader', () => {
        const parse: any = tableExtension.config.domSpecs!().nodes!.tableHeader.parseDOM![0];

        expect(parse.tag).toBe('th');
        expect(typeof parse.getAttrs).toBe('function');
    });

    it('should declare the four table parseDOM rule shapes', () => {
        const nodes: any = tableExtension.config.domSpecs!().nodes!;

        const tableRules: any[] = nodes.table.parseDOM!;
        const tableRowRules: any[] = nodes.tableRow.parseDOM!;
        const tableCellRules: any[] = nodes.tableCell.parseDOM!;
        const tableHeaderRules: any[] = nodes.tableHeader.parseDOM!;

        expect(tableRules.length).toBe(1);
        expect(tableRules[0].tag).toBe('table');
        expect(typeof tableRules[0].getAttrs).not.toBe('function');

        expect(tableRowRules.length).toBe(1);
        expect(tableRowRules[0].tag).toBe('tr');
        expect(typeof tableRowRules[0].getAttrs).not.toBe('function');

        expect(tableCellRules.length).toBe(1);
        expect(tableCellRules[0].tag).toBe('td');
        expect(typeof tableCellRules[0].getAttrs).toBe('function');

        expect(tableHeaderRules.length).toBe(1);
        expect(tableHeaderRules[0].tag).toBe('th');
        expect(typeof tableHeaderRules[0].getAttrs).toBe('function');
    });

    it('should apply a cell style through the mounted editor', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        expect(editor.commands.setCellAttribute({ attribute: 'backgroundColor', value: 'yellow' })).toBe(true);
        expect(container.querySelector('td')!.getAttribute('style')).toContain('background-color: yellow');
    });

    it('should insert and delete rows around the selected row', () => {
        editor.commands.setSelection({ from: 4, to: 4 });
        expect(editor.commands.insertRowBefore()).toBe(true);
        expect(container.querySelectorAll('tr').length).toBe(3);
        expect(editor.commands.insertRowAfter()).toBe(true);
        expect(container.querySelectorAll('tr').length).toBe(4);
        expect(editor.commands.deleteRow()).toBe(true);
        expect(container.querySelectorAll('tr').length).toBe(3);
    });

    it('should move between table cells with public navigation commands', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        expect(editor.commands.moveToNextCell()).toBe(true);
        expect((editor.commands as any).moveToPreviousCell()).toBe(true);
    });

    it('should insert a paragraph inside the selected cell', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        expect(editor.commands.insertParagraphInCell()).toBe(true);
        expect(container.querySelector('td p')).not.toBeNull();
    });

    it('should insert a requested table size through the public command', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        expect(editor.commands.insertTable({ rows: 2, columns: 3 })).toBe(true);
        const tables = container.querySelectorAll('table');
        const inserted = tables[tables.length - 1];
        expect(inserted.querySelectorAll('tr').length).toBe(2);
        expect(inserted.querySelectorAll('td').length).toBe(6);
    });

    it('should clamp non-positive inserted table dimensions to one', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        editor.commands.insertTable({ rows: 0, columns: -1 });
        const tables = container.querySelectorAll('table');
        const inserted = tables[tables.length - 1];
        expect(inserted.querySelectorAll('tr').length).toBe(1);
        expect(inserted.querySelectorAll('td').length).toBe(1);
    });

    it('should delete the table containing the cursor', () => {
        editor.commands.setSelection({ from: 27, to: 27 });
        expect(editor.commands.deleteTable()).toBe(true);
        expect(container.querySelector('table')).toBeNull();
    });

    it('should report table commands unavailable outside a table', () => {
        editor.destroy();
        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [
                        { type: 'text', id: crypto.randomUUID(), attrs: {}, children: [], text: 'Plain', marks: [] } as TextNode
                    ]
                }]
            },
            extensions: [paragraphExtension, tableExtension]
        });
        editor.mount(container);
        expect(editor.commands.deleteTable()).toBe(false);
        expect(editor.commands.deleteRow()).toBe(false);
        expect(editor.getHtml()).toContain('Plain');
    });

    it('should have correct name', () => {
        expect(tableExtension.name).toBe('table');
    });

    it('should expose all table commands through the editor', () => {
        expect(typeof editor.commands.insertTable).toBe('function');
        expect(typeof editor.commands.deleteTable).toBe('function');
        expect(typeof editor.commands.insertRowBefore).toBe('function');
        expect(typeof editor.commands.insertRowAfter).toBe('function');
        expect(typeof editor.commands.deleteRow).toBe('function');
        expect(typeof editor.commands.insertColumnBefore).toBe('function');
        expect(typeof editor.commands.insertColumnAfter).toBe('function');
        expect(typeof editor.commands.deleteColumn).toBe('function');
        expect(typeof editor.commands.insertParagraphInCell).toBe('function');
        expect(typeof editor.commands.toggleHeaderRow).toBe('function');
        expect(typeof editor.commands.toggleHeaderColumn).toBe('function');
        expect(typeof editor.commands.setCellAttribute).toBe('function');
        expect(typeof editor.commands.moveToNextCell).toBe('function');
        expect(typeof editor.commands.moveToPreviousCell).toBe('function');
    });

    it('should assign the table category to every table command', () => {
        const commands = tableExtension.config.commands!();

        commands.forEach((command: any) => {
            expect(command.meta.category).toBe('table');
        });
    });

    it('should return both table plugins by default', () => {
        const plugins = tableExtension.config.plugins.call!({ options: { resize: true } } as any);

        expect(plugins.length).toBe(2);
        expect(plugins[0]).toBeTruthy();
        expect(plugins[1]).toBeTruthy();
    });

    it('should return only table editing plugin when resize is disabled', () => {
        const plugins = tableExtension.config.plugins.call!({ options: { resize: false } } as any);

        expect(plugins.length).toBe(1);
        expect(plugins[0]).toBeTruthy();
    });

    it('should include resize plugin when resize option is true', () => {
        const pluginsEnabled = tableExtension.config.plugins.call!({ options: { resize: true } } as any);
        const pluginsDefault = tableExtension.config.plugins.call!({ options: {} } as any);

        expect(pluginsEnabled.length).toBe(2);
        expect(pluginsDefault.length).toBe(1);
    });

    it('should return table dom specifications', () => {
        const specs = tableExtension.config.domSpecs!();

        expect(specs).toBeDefined();
        expect(specs.nodes).toBeDefined();
        expect(specs.nodes!.table).toBeDefined();
        expect(specs.nodes!.tableRow).toBeDefined();
        expect(specs.nodes!.tableCell).toBeDefined();
        expect(specs.nodes!.tableHeader).toBeDefined();
    });
    // ──────────────────────────────────────────────────────────────────────
    // Regression: Ctrl+A + Ctrl+C on a doc containing a table used to throw
    // "Invalid array passed to renderSpec" from inside DOMSerializer. The
    // table node's toDOM returned a nested array [['table', 0]] instead of
    // a flat spec ['table', 0]. These tests pin the fix at three layers:
    // the spec shape, the serializer path (getHtml), and the user gesture
    // (selectAll + getHtml + clear + re-mount).
    // ──────────────────────────────────────────────────────────────────────

    it('should return a flat DOM output spec for the table node (regression: renderSpec crash)', () => {
        const spec: unknown = tableExtension.config.domSpecs!().nodes!.table.toDOM!({});

        // The fix: was [ ['table', 0] ], which crashed ProseMirror's renderSpec
        // during clipboard serialization. Must be a single spec tuple.
        expect(spec).toEqual(['table', 0]);
        expect(Array.isArray(spec)).toBe(true);
        expect(Array.isArray((spec as any[])[0])).toBe(false);
    });

    it('should serialize the entire document to HTML without throwing (regression: copy-all)', () => {
        // The original bug: Ctrl+A then Ctrl+C on a doc containing a table
        // threw "Invalid array passed to renderSpec" from inside DOMSerializer.
        // getHtml() uses the same serializeFragment path, so it failed too.
        const html: string = editor.getHtml();

        expect(html).not.toBe('');
        expect(html).toContain('<table>');
        expect(html).toContain('<tr>');
        expect(html).toContain('Feature');
        expect(html).toContain('Status');
        expect(html).toContain('Headless Table Rendering');
        expect(html).toContain('Operational');
    });

    it('should serialize the whole document when selection spans a table (regression: Ctrl+A + Ctrl+C)', () => {
        const pmState: any = (editor as any).integration.getState();
        const total: number = pmState.doc.content.size;
        editor.commands.setSelection({ from: 0, to: total });

        let html: string = '';
        expect(() => { html = editor.getHtml(); }).not.toThrow();

        expect(html).toContain('<table>');
        expect(html).toContain('Feature');
        expect(html).toContain('Operational');
    });

    it('should serialize a lone table node without throwing (regression: copy a single table)', () => {
        // Reset to a minimal document containing only a table.
        editor.destroy();
        container.remove();
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document', id: crypto.randomUUID(), schemaVersion: 1, attrs: {}, marks: [],
                children: [{
                    type: 'table', id: crypto.randomUUID(), attrs: {}, marks: [],
                    children: [{
                        type: 'tableRow', id: crypto.randomUUID(), attrs: {}, marks: [],
                        children: [{
                            type: 'tableCell', id: crypto.randomUUID(),
                            attrs: { colspan: 1, rowspan: 1 }, marks: [],
                            children: [{
                                type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [],
                                children: [{
                                    type: 'text', id: crypto.randomUUID(), attrs: {},
                                    children: [], text: 'Solo', marks: []
                                } as TextNode]
                            }]
                        }]
                    }]
                }]
            },
            extensions: [paragraphExtension, tableExtension]
        });
        editor.mount(container);

        let html: string = '';
        expect(() => { html = editor.getHtml(); }).not.toThrow();
        expect(html).toContain('<table>');
        expect(html).toContain('Solo');
    });

    it('should round-trip: select-all, copy, clear, and re-mount a document containing a table', () => {
        // User scenario from the bug report:
        //   1) Ctrl+A the entire editor
        //   2) Ctrl+C (here: read HTML via the same serializeFragment path)
        //   3) Backspace the entire content
        //   4) Paste (here: re-mount a fresh editor with the copied HTML)
        const original: string = editor.getHtml();
        expect(original).toContain('<table>');

        // 1) Ctrl+A — select the whole document
        const pmState0: any = (editor as any).integration.getState();
        const total: number = pmState0.doc.content.size;
        expect(editor.commands.selectAll()).toBe(true);

        // 2) Copy — read the serialized HTML (must not throw)
        let copied: string = '';
        expect(() => { copied = editor.getHtml(); }).not.toThrow();
        expect(copied).toContain('<table>');
        expect(copied).toContain('Feature');
        expect(copied).toContain('Operational');

        // 3) Backspace — clear the document by dispatching a delete over the
        // full range via the integration manager (mirrors holding Backspace
        // until the document is empty).
        const pmState: any = (editor as any).integration.getState();
        const clearTr: any = pmState.tr.delete(0, pmState.doc.content.size);
        (editor as any).integration.dispatch(clearTr);

        const cleared: string = editor.getHtml();
        expect(cleared).not.toContain('<table>');
        expect(cleared).not.toContain('Feature');

        // 4) Paste — re-mount a fresh editor with the copied HTML. The
        // serializer must not throw on the way in OR on the way out.
        editor.destroy();
        container.remove();
        container = document.createElement('div');
        document.body.appendChild(container);

        let restored: HeadlessEditor;
        expect(() => {
            restored = HeadlessEditor.create({
                content: copied,
                extensions: [paragraphExtension, tableExtension, undoRedoExtension]
            });
            restored.mount(container);
        }).not.toThrow();

        const restoredHtml: string = restored!.getHtml();
        expect(restoredHtml).toContain('<table>');
        expect(restoredHtml).toContain('Feature');
        expect(restoredHtml).toContain('Operational');
    });

    });

const P_LEAD_ID: string = 'p-lead';
const TABLE_ID: string = 'tbl-1';
const R1_ID: string = 'r-1';
const R2_ID: string = 'r-2';
const H1_ID: string = 'h-1';
const H2_ID: string = 'h-2';
const C1_ID: string = 'c-1';
const C4_ID: string = 'c-4';

function buildTableDocument(): DocumentRoot {
    return {
        type: 'document', id: 'doc-svc', schemaVersion: 1, attrs: {}, marks: [],
        children: [
            { id: P_LEAD_ID, type: 'paragraph', attrs: {}, marks: [],
              children: [{ id: 't-lead', type: 'text', text: 'Lead', attrs: {}, marks: [], children: [] as never[] } as any] },
            { id: TABLE_ID, type: 'table', attrs: {}, marks: [],
              children: [
                  { id: 'r-0', type: 'tableRow', attrs: {}, marks: [],
                    children: [
                        { id: H1_ID, type: 'tableHeader', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-h1', type: 'paragraph', attrs: {}, marks: [],
                                       children: [{ id: 't-h1', type: 'text', text: 'Feature', attrs: {}, marks: [], children: [] as never[] } as any] }] },
                        { id: H2_ID, type: 'tableHeader', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-h2', type: 'paragraph', attrs: {}, marks: {},
                                       children: [{ id: 't-h2', type: 'text', text: 'Status', attrs: {}, marks: [], children: [] as never[] } as any] }] }
                    ] },
                  { id: R1_ID, type: 'tableRow', attrs: {}, marks: [],
                    children: [
                        { id: C1_ID, type: 'tableCell', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-c1', type: 'paragraph', attrs: {}, marks: [],
                                       children: [{ id: 't-c1', type: 'text', text: 'Render', attrs: {}, marks: [], children: [] as never[] } as any] }] },
                        { id: 'c-2', type: 'tableCell', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-c2', type: 'paragraph', attrs: {}, marks: {},
                                       children: [{ id: 't-c2', type: 'text', text: 'OK', attrs: {}, marks: [], children: [] as never[] } as any] }] }
                    ] },
                  { id: R2_ID, type: 'tableRow', attrs: {}, marks: [],
                    children: [
                        { id: 'c-3', type: 'tableCell', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-c3', type: 'paragraph', attrs: {}, marks: [],
                                       children: [{ id: 't-c3', type: 'text', text: 'Headless', attrs: {}, marks: [], children: [] as never[] } as any] }] },
                        { id: C4_ID, type: 'tableCell', attrs: { colspan: 1, rowspan: 1 }, marks: [],
                          children: [{ id: 'p-c4', type: 'paragraph', attrs: {}, marks: [],
                                       children: [{ id: 't-c4', type: 'text', text: 'Done', attrs: {}, marks: [], children: [] as never[] } as any] }] }
                    ] }
              ] }
        ]
    };
}

/** Resolves the real text-node id the editor assigned anywhere under a structural block. */
function findFirstTextUnder(document: DocumentRoot, blockId: string): EditorNode | null {
    const block = findNodeById(document, blockId);
    if (!block) { return null; }
    const stack: EditorNode[] = [block];
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (current.type === 'text') { return current; }
        for (const child of current.children) { stack.push(child); }
    }
    return null;
}

describe('Built-in: table — TableService (PM-free context resolution)', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;
    let documentRoot: DocumentRoot;
    let service: TableService;

    beforeEach(() => {
        container = globalThis.document.createElement('div');
        globalThis.document.body.appendChild(container);
        editor = HeadlessEditor.create({
            document: buildTableDocument(),
            extensions: [paragraphExtension, tableExtension]
        });
        editor.mount(container);
        documentRoot = editor.getDocument();
        service = new TableService();
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) { editor.destroy(); }
        container.remove();
    });

    it('resolves tree lookups, ancestor lookups, and selection narrowing', () => {
        // findNodeById: text leaves keep their real id when reached via preserved block.
        const textUnderC1 = findFirstTextUnder(documentRoot, C1_ID);
        expect(textUnderC1).not.toBeNull();
        expect(textUnderC1?.type).toBe('text');
        expect((textUnderC1 as any).text).toBe('Render');
        // findAncestorByType: cell → table
        const tableAncestor = findAncestorByType(documentRoot, C1_ID, 'table');
        expect(tableAncestor?.id).toBe(TABLE_ID);
        // getCursorNodeId: cell-selection branch is the one the service relies on.
        const cellSelection: CellSelection = createCellSelection(C1_ID, C4_ID);
        expect(getCursorNodeId(cellSelection)).toBe(C1_ID);
        // createCellSelection: anchor === head round-trips.
        const singleCell = createCellSelection(C1_ID, C1_ID);
        expect(singleCell.anchorCellId).toBe(C1_ID);
        expect(singleCell.headCellId).toBe(C1_ID);
        // findTableAncestor
        expect(findTableAncestor(C1_ID, documentRoot)?.id).toBe(TABLE_ID);
        expect(findTableAncestor(P_LEAD_ID, documentRoot)).toBeNull();
        // asCellSelection: passthrough for cell, null for text.
        expect(asCellSelection(cellSelection)?.anchorCellId).toBe(C1_ID);
        expect(asCellSelection({ type: SelectionType.Text } as Selection)).toBeNull();
    });

    it('getCurrentTable returns the table containing the cursor', () => {
        const textNode = findFirstTextUnder(documentRoot, C1_ID);
        const selection: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: textNode!.id, offset: 0 },
            head:   { nodeId: textNode!.id, offset: 0 }
        };
        const tableContext = service.getCurrentTable(documentRoot, selection);
        expect(tableContext).not.toBeNull();
        expect(tableContext?.nodeId).toBe(TABLE_ID);
        expect(tableContext?.node.type).toBe('table');
    });

    it('getCurrentTable returns null when the cursor is outside any table', () => {
        const leadParagraph = findNodeById(documentRoot, P_LEAD_ID);
        const selection: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: leadParagraph!.id, offset: 0 },
            head:   { nodeId: leadParagraph!.id, offset: 0 }
        };
        expect(service.getCurrentTable(documentRoot, selection)).toBeNull();
    });

    it('getCurrentCell resolves the correct (row, col) for a body cell; headers are out of scope', () => {
        // Body cell C1 lives at (row=1, col=0) — the second row, first column.
        const cOneText = findFirstTextUnder(documentRoot, C1_ID);
        const cOneSelection: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: cOneText!.id, offset: 0 },
            head:   { nodeId: cOneText!.id, offset: 0 }
        };
        const bodyCellContext = service.getCurrentCell(documentRoot, cOneSelection);
        expect(bodyCellContext?.cellNodeId).toBe(C1_ID);
        expect(bodyCellContext?.row).toBe(1);
        expect(bodyCellContext?.col).toBe(0);
        // getCurrentCell only matches tableCell — header cells are out of scope for it.
        const hTwoText = findFirstTextUnder(documentRoot, H2_ID);
        const hTwoSelection: Selection = {
            type: SelectionType.Text,
            anchor: { nodeId: hTwoText!.id, offset: 0 },
            head:   { nodeId: hTwoText!.id, offset: 0 }
        };
        expect(service.getCurrentCell(documentRoot, hTwoSelection)).toBeNull();
    });

    it('getSelectedCells returns the full rectangular range in row-major order', () => {
        const cellSelection: CellSelection = createCellSelection(C1_ID, C4_ID);
        const cellContexts = service.getSelectedCells(documentRoot, cellSelection);
        // C1..C4 spans rows 1..2 × cols 0..1 → 4 cells, row-major.
        expect(cellContexts.length).toBe(4);
        expect(cellContexts.map((context) => `${context.row}.${context.col}`))
            .toEqual(['1.0', '1.1', '2.0', '2.1']);
    });

    it('getSelectedCells returns an empty array for non-cell selections', () => {
        const textSelection: Selection = { type: SelectionType.Text };
        expect(service.getSelectedCells(documentRoot, textSelection)).toEqual([]);
    });

    it('resolveCellCoordinates returns coordinates inside the table and null outside it', () => {
        const cellNode = findNodeById(documentRoot, C1_ID);
        const tableNode = findNodeById(documentRoot, TABLE_ID);
        expect(service.resolveCellCoordinates(cellNode!, tableNode!)).toEqual({ row: 1, col: 0 });
        const otherTable: EditorNode = { id: 'other', type: 'table', attrs: {}, marks: [], children: [] };
        expect(service.resolveCellCoordinates(cellNode!, otherTable)).toBeNull();
    });

});
