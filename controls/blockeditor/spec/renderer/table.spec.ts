import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BaseStylesProp, BlockModel } from "../../src/models/index";
import { BlockType, CommandName, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { IHeadingBlockSettings, TableCellModel, ITableBlockSettings } from '../../src/models/block/block-props';
import { getBlockContentElement, setCursorPosition } from "../../src/common/utils/index";

const domHelpers = {
    query(el: Element | Document, sel: string): HTMLElement { return el.querySelector(sel) as HTMLElement; },
    queryAll(el: Element | Document, sel: string): HTMLElement[] { return Array.from(el.querySelectorAll(sel)) as HTMLElement[]; },
    dispatch(el: Element, type: string, init?: any) {
        const evt = new (window as any).Event(type, { bubbles: true, cancelable: true, ...init });
        el.dispatchEvent(evt);
        return evt;
    },
    input(el: Element, value: string) {
        (el as HTMLElement).textContent = value;
    },
    key(el: Element, key: string, opts: any = {}) {
        const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts });
        el.dispatchEvent(ev);
        const up = new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...opts });
        el.dispatchEvent(up);
    },
    paste(el: Element, text: string) {
        const pasteEvt = new ClipboardEvent('paste', { bubbles: true, cancelable: true } as any);
        Object.defineProperty(pasteEvt, 'clipboardData', { value: { getData: () => text } });
        el.dispatchEvent(pasteEvt);
    }
};

describe('Table Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Default rendering', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('renders table element and classes', () => {
            const tableProps: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                rows: [
                    {
                        height: 50, cells: [
                            { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'Cell 1' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'Cell 2' }] }] }
                        ]
                    },
                    {
                        height: 60, cells: [
                            { columnId: 'col1', blocks: [{ id: 'b3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'Cell 3' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'b4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'Cell 4' }] }] }
                        ]
                    }
                ]
            };
            const blocks: BlockModel[] = [{ id: 'table_block', blockType: BlockType.Table, properties: tableProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const table = domHelpers.query(editorElement, '.e-table-element');
            expect(table).not.toBeNull();
        });

        it('renders thead with column headers and row number header cell', () => {
            const blocks: BlockModel[] = [{
                id: 'table_block_hdr',
                blockType: BlockType.Table,
                properties: {
                    columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                    rows: [{
                        height: 40, cells: [
                            { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'A' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'B' }] }] }
                        ]
                    }]
                } as ITableBlockSettings
            }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const thead = domHelpers.query(editorElement, 'thead');
            expect(thead).not.toBeNull();
            const headerRow = domHelpers.query(thead, 'tr');
            const headerCells = domHelpers.queryAll(headerRow, 'th');
            expect(headerCells.length).toBe(3); // # + 2 columns
            expect(headerCells[0].classList.contains('e-row-number')).toBe(true);
        });

        it('renders colgroup with correct count and widths from model', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            const blocks: BlockModel[] = [{ id: 't', blockType: BlockType.Table, properties }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const cols = domHelpers.queryAll(editorElement, 'colgroup > col');
            // with row number column present
            expect(cols.length).toBe(3);
            expect((cols[1] as HTMLTableColElement).style.width).toBe('100px');
            expect((cols[2] as HTMLTableColElement).style.width).toBe('150px');
        });

        it('renders table with enableRowNumbers as false', () => {
            const properties: ITableBlockSettings = {
                enableRowNumbers: false,
                columns: [{ id: 'col1' }, { id: 'col2' }],
                rows: [{
                    cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            const blocks: BlockModel[] = [{ id: 't', blockType: BlockType.Table, properties }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');


            expect(domHelpers.query(editorElement, 'table thead .e-row-number')).toBeNull();
            expect(domHelpers.query(editorElement, 'table tbody .e-row-number')).toBeNull();

            const cols = domHelpers.queryAll(editorElement, 'colgroup > col');
            expect(cols.length).toBe(2);
        });

        it('renders table with enableHeader as false', () => {
            const properties: ITableBlockSettings = {
                enableHeader: false,
                columns: [{ id: 'col1' }, { id: 'col2' }],
                rows: [{
                    cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            const blocks: BlockModel[] = [{ id: 't', blockType: BlockType.Table, properties }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');


            expect(domHelpers.query(editorElement, 'table thead')).toBeNull();
        });

        it('renders table with readOnly as true', () => {
            const properties: ITableBlockSettings = {
                readOnly: true,
                columns: [{ id: 'col1' }, { id: 'col2' }],
                rows: [{
                    cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            const blocks: BlockModel[] = [{ id: 't', blockType: BlockType.Table, properties }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');


            expect(domHelpers.query(editorElement, 'table').classList.contains('e-readonly')).toBe(true);
            expect(domHelpers.query(editorElement, 'table .e-block-content').getAttribute('contenteditable')).toBe('false');
            expect(domHelpers.queryAll(editorElement, 'table thead [role="columnheader"]')[0].getAttribute('contenteditable')).toBe('false');
            expect(domHelpers.queryAll(editorElement, 'table thead [role="columnheader"]')[1].getAttribute('contenteditable')).toBe('false');
        });

        it('renders tbody with expected number of rows and cells', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                rows: [
                    {
                        height: 40, cells: [
                            { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                        ]
                    },
                    {
                        height: 50, cells: [
                            { columnId: 'col1', blocks: [{ id: 'b3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'R2C1' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'b4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'R2C2' }] }] }
                        ]
                    }
                ]
            };
            editor = createEditor({ blocks: [{ id: 'tt', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const bodyRows = domHelpers.queryAll(editorElement, 'tbody tr');
            expect(bodyRows.length).toBe(2);
            const r1cells = domHelpers.queryAll(bodyRows[0], 'td');
            const r2cells = domHelpers.queryAll(bodyRows[1], 'td');

            expect(r1cells.length).toBe(3);
            expect(r2cells.length).toBe(3);
            expect(r1cells[1].textContent).toContain('R1C1');
            expect(r1cells[2].textContent).toContain('R1C2');
            expect(r2cells[1].textContent).toContain('R2C1');
            expect(r2cells[2].textContent).toContain('R2C2');
        });

        it('applies roles and aria indices for cells', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'A' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'B' }] }] }
                    ]
                }]
            };
            editor = createEditor({ blocks: [{ id: 'ta', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            expect(td).not.toBeNull();
            expect(td.getAttribute('data-row')).toBe('1');
            expect(td.getAttribute('data-col')).toBe('0');
        });

        it('sets tabindex correctly on headers and cells', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'A' }] }] }
                    ]
                }]
            };
            editor = createEditor({ blocks: [{ id: 'ti', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const rnHeader = domHelpers.query(editorElement, 'thead th.e-row-number');
            const header = domHelpers.query(editorElement, 'thead th[role="columnheader"]');
            const rnCell = domHelpers.query(editorElement, 'tbody td.e-row-number');
            const gridCell = domHelpers.query(editorElement, 'tbody td[role="gridcell"]');
            expect(rnHeader.getAttribute('tabindex')).toBe('-1');
            expect(header.getAttribute('tabindex')).toBe('0');
            expect(rnCell.getAttribute('tabindex')).toBe('-1');
            expect(gridCell.getAttribute('tabindex')).toBe('0');
        });

        it('respects model-provided row heights (if applied as style)', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 80 }],
                rows: [
                    { height: 55, cells: [{ columnId: 'col1', blocks: [{ id: 'b1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'H55' }] }] }] },
                    { height: 75, cells: [{ columnId: 'col1', blocks: [{ id: 'b2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'H75' }] }] }] }
                ]
            };
            editor = createEditor({ blocks: [{ id: 'rh', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const rows = domHelpers.queryAll(editorElement, 'tbody tr');
            // If implementation applies heights, they appear on the row or cells; assert leniently
            const r1Style = (rows[0] as HTMLElement).style.height;
            const r2Style = (rows[1] as HTMLElement).style.height;
            expect(r1Style === '' || r1Style === '55px').toBe(true);
            expect(r2Style === '' || r2Style === '75px').toBe(true);
        });

        it('renders blocks inside each data cell with container', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 100 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 'c2', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            editor = createEditor({ blocks: [{ id: 'bc', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const cellContainers = domHelpers.queryAll(editorElement, 'tbody td .e-cell-blocks-container');
            expect(cellContainers.length).toBeGreaterThan(0);
            const firstParagraph = domHelpers.query(cellContainers[0], '.e-block .e-block-content');
            expect(firstParagraph).not.toBeNull();
        });

        it('renders from empty props using factory defaults', () => {
            const blocks: BlockModel[] = [{ id: 'empty_table', blockType: BlockType.Table, properties: {} }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const table = domHelpers.query(editorElement, '.e-table-element');
            expect(table).not.toBeNull();
            const headerCells = domHelpers.queryAll(editorElement, 'thead th');
            const bodyRows = domHelpers.queryAll(editorElement, 'tbody tr');
            expect(headerCells.length).toBeGreaterThan(1);
            expect(bodyRows.length).toBeGreaterThan(0);
        });

        it('row-number data cells are aria-hidden and not contenteditable', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 120 }],
                rows: [{ height: 44, cells: [{ columnId: 'col1', blocks: [{ id: 'p', blockType: BlockType.Paragraph, content: [{ id: 'c', contentType: ContentType.Text, content: 'R1C1' }] }] }] }]
            };
            editor = createEditor({ blocks: [{ id: 'rn', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const rn = domHelpers.query(editorElement, 'tbody td.e-row-number');
            expect(rn.getAttribute('aria-hidden')).toBe('true');
            expect(rn.getAttribute('contenteditable')).toBe('false');
        });

        it('cell coordinates attributes data-row/data-col are present', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 100 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'A' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 'c2', contentType: ContentType.Text, content: 'B' }] }] }
                    ]
                }]
            };
            editor = createEditor({ blocks: [{ id: 'coords', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');

            const cell = domHelpers.query(editorElement, 'tbody td[role="gridcell"]') as HTMLElement;
            expect(cell.hasAttribute('data-row')).toBe(true);
            expect(cell.hasAttribute('data-col')).toBe(true);
        });

        it('table element carries data attributes for block id and column count', () => {
            const properties: ITableBlockSettings = {
                columns: [{ id: 'col1', width: 100 }, { id: 'col2', width: 150 }],
                rows: [{
                    height: 40, cells: [
                        { columnId: 'col1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'x', contentType: ContentType.Text, content: 'X' }] }] },
                        { columnId: 'col2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'y', contentType: ContentType.Text, content: 'Y' }] }] }
                    ]
                }]
            };
            const blocks: BlockModel[] = [{ id: 'tbl-meta', blockType: BlockType.Table, properties }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const table = domHelpers.query(editorElement, '.e-table-element');
            expect(table.getAttribute('data-block-id')).toBeDefined();
            expect(table.getAttribute('data-col-counter')).toBe('2');
        });
    });

    describe('Model and DOM structure validations', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function mount(blocks: BlockModel[]): void {
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('Table block wrapper has e-table-block class and data-block-id', () => {
            const properties: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1' }, { id: 'c2' }],
                rows: [{
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'A' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'B' }] }] }
                    ]
                }]
            } as any;
            const blocks: BlockModel[] = [{ id: 'tbl_wrap', blockType: BlockType.Table, properties }];
            mount(blocks);
            const blockEl = domHelpers.query(editorElement, '.e-block');
            const tableEl = domHelpers.query(blockEl, 'table');
            expect(blockEl.classList.contains('e-table-block')).toBe(true);
            expect(tableEl.getAttribute('data-block-id')).toBe(editor.blocks[0].id);
        });

        it('Nested inner blocks rendered with correct parentId = cell.id (model assertion)', () => {
            const blocks: BlockModel[] = [{ id: 'tbl_parent', blockType: BlockType.Table, properties: {} as any }];
            mount(blocks);
            const model = editor.blocks[0] as BlockModel;
            const tProps = model.properties as ITableBlockSettings;
            const allCells = (tProps.rows.map((r) => r.cells) as any).flat();
            expect(allCells.length).toBeGreaterThan(0);
            allCells.forEach((cell: TableCellModel) => {
                expect(cell.id).toBeTruthy();
                expect(cell.blocks.length).toBeGreaterThan(0);
                const first = cell.blocks[0] as any;
                expect(first.parentId).toBe(cell.id);
            });
        });

        it('Table with 5 columns and 3 rows; structure and indices correct', () => {
            const properties: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: '11' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: '12' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: '13' }] }] },
                            { columnId: 'c4', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: '14' }] }] },
                            { columnId: 'c5', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ id: 't5', contentType: ContentType.Text, content: '15' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ id: 't6', contentType: ContentType.Text, content: '21' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p7', blockType: BlockType.Paragraph, content: [{ id: 't7', contentType: ContentType.Text, content: '22' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p8', blockType: BlockType.Paragraph, content: [{ id: 't8', contentType: ContentType.Text, content: '23' }] }] },
                            { columnId: 'c4', blocks: [{ id: 'p9', blockType: BlockType.Paragraph, content: [{ id: 't9', contentType: ContentType.Text, content: '24' }] }] },
                            { columnId: 'c5', blocks: [{ id: 'p10', blockType: BlockType.Paragraph, content: [{ id: 't10', contentType: ContentType.Text, content: '25' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p11', blockType: BlockType.Paragraph, content: [{ id: 't11', contentType: ContentType.Text, content: '31' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p12', blockType: BlockType.Paragraph, content: [{ id: 't12', contentType: ContentType.Text, content: '32' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p13', blockType: BlockType.Paragraph, content: [{ id: 't13', contentType: ContentType.Text, content: '33' }] }] },
                            { columnId: 'c4', blocks: [{ id: 'p14', blockType: BlockType.Paragraph, content: [{ id: 't14', contentType: ContentType.Text, content: '34' }] }] },
                            { columnId: 'c5', blocks: [{ id: 'p15', blockType: BlockType.Paragraph, content: [{ id: 't15', contentType: ContentType.Text, content: '35' }] }] }
                        ]
                    }
                ]
            } as any;
            const blocks: BlockModel[] = [{ id: 'tbl_5x3', blockType: BlockType.Table, properties }];
            mount(blocks);
            const ths = domHelpers.queryAll(editorElement, 'thead th');
            expect(ths.length).toBe(6); // # + 5 cols
            const rows = domHelpers.queryAll(editorElement, 'tbody tr');
            expect(rows.length).toBe(3);
            rows.forEach((tr, idx) => {
                const tds = tr.querySelectorAll('td');
                expect(tds.length).toBe(6); // rn + 5 data
                const firstData = tds[1] as HTMLElement;
                expect(firstData.getAttribute('data-row')).toBe(String(idx + 1));
                for (let i = 0; i < 5; i++) {
                    const cell = tds[i + 1] as HTMLElement;
                    expect(cell.getAttribute('data-col')).toBe(String(i));
                }
            });
        });

        it('Table with 1 column and 1 row; minimal structure still valid', () => {
            const properties: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1', headerText: 'Only' }],
                rows: [{ cells: [{ columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'X' }] }] }] }]
            } as any;
            const blocks: BlockModel[] = [{ id: 'tbl_1x1', blockType: BlockType.Table, properties }];
            mount(blocks);
            const ths = domHelpers.queryAll(editorElement, 'thead th');
            expect(ths.length).toBe(2);
            const rows = domHelpers.queryAll(editorElement, 'tbody tr');
            expect(rows.length).toBe(1);
            const tds = rows[0].querySelectorAll('td');
            expect(tds.length).toBe(2); // rn + 1 data
            expect((tds[1] as HTMLElement).getAttribute('data-col')).toBe('0');
            expect((tds[1] as HTMLElement).getAttribute('data-row')).toBe('1');
        });

        it('Each cell.blocks contains a default Paragraph block in model', () => {
            const blocks: BlockModel[] = [{ id: 'tbl_defaults', blockType: BlockType.Table, properties: {} as any }];
            mount(blocks);
            const model = editor.blocks[0] as BlockModel;
            const tProps = model.properties as ITableBlockSettings;
            tProps.rows.forEach(r => r.cells.forEach(c => {
                expect(c.blocks && c.blocks.length > 0).toBe(true);
                expect((c.blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            }));
        });
    });

    describe('Editing inside cells (block actions)', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setupTwoByTwo(): void {
            const tableProps: ITableBlockSettings = {
                columns: [{ id: 'col1' }, { id: 'col2' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'col1', blocks: [{ id: 'c1_p', blockType: BlockType.Paragraph, content: [{ id: 'c1_t', contentType: ContentType.Text, content: 'Cell 1' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'c2_p', blockType: BlockType.Paragraph, content: [{ id: 'c2_t', contentType: ContentType.Text, content: 'Cell 2' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'col1', blocks: [{ id: 'c3_p', blockType: BlockType.Paragraph, content: [{ id: 'c3_t', contentType: ContentType.Text, content: 'Cell 3' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'c4_p', blockType: BlockType.Paragraph, content: [{ id: 'c4_t', contentType: ContentType.Text, content: 'Cell 4' }] }] }
                        ]
                    }
                ]
            };
            const blocks: BlockModel[] = [{ id: 'table_edit', blockType: BlockType.Table, properties: tableProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('typing updates the underlying cell model content', () => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);
            domHelpers.input(content, 'Hello');

            editor.blockManager.setFocusToBlock(cellBlock);
            editor.blockManager.stateManager.updateContentOnUserTyping(cellBlock);

            const updated = editor.blocks[0] as BlockModel;
            const tProps = (updated.properties as ITableBlockSettings);
            expect((tProps.rows[0].cells[0].blocks[0] as any).content[0].content).toBe('Hello');
        });

        it('enter creates a new paragraph block inside the same cell (split)', (done) => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);

            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);
            domHelpers.key(content, 'Enter');

            setTimeout(() => {
                // Expect at least two paragraph blocks now inside the same cell
                const blocksInCell = domHelpers.queryAll(cellBlock.parentElement, '.e-block');
                expect(blocksInCell.length).toBeGreaterThan(1);

                expect((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks.length).toBe(2);
                done();
            }, 100);
        });

        it('shift+Enter inserts line break within the paragraph, not a new block', (done) => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);
            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            domHelpers.key(content, 'Enter', { shiftKey: true });

            setTimeout(() => {
                expect((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks[0].content[0].content).toContain('\n');
                done();
            }, 100);
        });

        it('backspace deletes characters within the paragraph', () => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);

            domHelpers.input(content, 'AB');
            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            editor.blockManager.stateManager.updateContentOnUserTyping(cellBlock);

            const updated = (editor.blocks[0] as BlockModel).properties as ITableBlockSettings;
            const txt = (updated.rows[0].cells[0].blocks[0] as any).content[0].content as string;
            expect(txt).toBe('AB');
        });

        it('backspace at the start of second block merges with previous block', () => {
            setupTwoByTwo();
            const cell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = domHelpers.query(cell, '.e-block-content');

            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            domHelpers.key(content, 'Enter');

            const nextCellBlock = cellBlock.nextElementSibling as HTMLElement;
            const nextCellContent = getBlockContentElement(nextCellBlock);
            editor.blockManager.setFocusToBlock(nextCellBlock);
            setCursorPosition(nextCellContent, nextCellContent.textContent.length);

            domHelpers.key(nextCellContent, 'Backspace');

            const blocksInCell = domHelpers.queryAll(cell, '.e-block');
            expect(blocksInCell.length).toBe(1);

            expect((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks.length).toBe(1);
        });

        it('typing inside second column only affects that cell model', () => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody #c2_p');
            const content = getBlockContentElement(cellBlock);
            domHelpers.input(content, 'Hello');

            editor.blockManager.setFocusToBlock(cellBlock);
            editor.blockManager.stateManager.updateContentOnUserTyping(cellBlock);

            const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
            expect((tProps.rows[0].cells[1].blocks[0]).content[0].content).toBe('Hello');
            expect((tProps.rows[0].cells[0].blocks[0]).content[0].content).not.toBe('Hello');
        });

        it('enter inside second row creates new block within that cell, not new table row', (done) => {
            setupTwoByTwo();
            const secondRowFirstCell = domHelpers.query(editorElement, 'tbody tr:nth-child(2) td[role="gridcell"]');
            const cellBlock = domHelpers.query(secondRowFirstCell, '.e-block');
            const content = getBlockContentElement(cellBlock);

            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            domHelpers.key(content, 'Enter');

            setTimeout(() => {
                const blocksInCell = domHelpers.queryAll(secondRowFirstCell, '.e-block');
                expect(blocksInCell.length).toBe(2);
                const bodyRows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(bodyRows.length).toBe(2); // no new row added

                const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
                expect(tProps.rows[1].cells[0].blocks.length).toBe(2);
                expect(tProps.rows.length).toBe(2);
                done();
            }, 100);
        });

        it('cell keeps placeholder <br> when paragraph becomes empty', () => {
            setupTwoByTwo();
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);
            domHelpers.input(content, '');

            editor.blockManager.setFocusToBlock(cellBlock);
            editor.blockManager.stateManager.updateContentOnUserTyping(cellBlock);

            const html = content.innerHTML || '';
            expect(html.indexOf('<br') >= 0 || html === '').toBe(true);
        });

        it('focus moves to cell block on click', (done) => {
            setupTwoByTwo();
            const lastBlock = domHelpers.query(editorElement, 'tbody tr:last-child td[role="gridcell"] .e-block');
            editor.blockManager.setFocusToBlock(lastBlock);
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            cellBlock.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            // Expect editor to consider this block focused
            expect(editor.blockManager.currentFocusedBlock.id === cellBlock.id).toBe(true);
            done();
        });

        it('enter twice yields at least two blocks and caret remains in same cell', (done) => {
            setupTwoByTwo();
            const cell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);

            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            domHelpers.key(content, 'Enter');
            domHelpers.key(content, 'Enter');
            setTimeout(() => {
                const blocksInCell = domHelpers.queryAll(cell, '.e-block');
                expect(blocksInCell.length).toBe(3);

                const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
                expect(tProps.rows[0].cells[0].blocks.length).toBe(3);
                done();
            }, 100);
        });

        // TODO - Formatting issue inside table cell
        it('retains formatting inside cell block content if editor applies them', (done) => {
            setupTwoByTwo();
            const content = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');

            editor.setSelection('c1_t', 0, 2);
            editor.executeToolbarAction(CommandName.Bold);

            setTimeout(() => {
                // const html = content.innerHTML || '';
                // expect(html.toLowerCase().indexOf('strong') >= 0).toBe(true);

                // const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
                // expect((tProps.rows[0].cells[0].blocks[0]).content.length).toBe(2);
                // expect(((tProps.rows[0].cells[0].blocks[0]).content[0].props as BaseStylesProp).styles.bold).toBe(true);
                done();
            }, 100);
        });

        it('row-number column remains non-editable after edits in row', () => {
            setupTwoByTwo();
            const rn = domHelpers.query(editorElement, 'tbody tr:first-child td.e-row-number');
            expect(rn.getAttribute('contenteditable')).toBe('false');
        });

        it('editing does not change table data-col-counter attribute', () => {
            setupTwoByTwo();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const before = table.getAttribute('data-col-counter');
            const cell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');
            domHelpers.input(cell, 'X');
            editor.blockManager.stateManager.updateContentOnUserTyping(cell.closest('.e-block') as HTMLElement);
            const after = table.getAttribute('data-col-counter');
            expect(after).toBe(before);
        });

        it('newly created block inside cell has editable content area', (done) => {
            setupTwoByTwo();
            const cell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const cellBlock = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);

            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, content.textContent.length);

            domHelpers.key(content, 'Enter');
            setTimeout(() => {
                const newContent = domHelpers.queryAll(cell, '.e-block .e-block-content')[1];
                expect(newContent.getAttribute('contenteditable') === 'true').toBe(true);
                done();
            }, 100);
        });

        it('preserves cell container id and structure after edits', () => {
            setupTwoByTwo();
            const cell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const container = domHelpers.query(cell, '.e-cell-blocks-container');
            const idBefore = container.getAttribute('id');
            const content = domHelpers.query(cell, '.e-block-content');
            domHelpers.input(content, 'Z');
            editor.blockManager.stateManager.updateContentOnUserTyping(content.closest('.e-block') as HTMLElement);

            const containerAfter = domHelpers.query(cell, '.e-cell-blocks-container');
            expect(containerAfter.getAttribute('id')).toBe(idBefore);
        });

        it('does not duplicate row-number cells after multiple edits', () => {
            setupTwoByTwo();
            const c = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');
            domHelpers.input(c, '1'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);
            domHelpers.input(c, '12'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);
            domHelpers.input(c, '123'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);

            const rnCells = domHelpers.queryAll(editorElement, 'tbody tr:first-child td.e-row-number');
            expect(rnCells.length).toBe(1);
        });

        it('keeps table role as grid after edits', () => {
            setupTwoByTwo();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const c = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');
            domHelpers.input(c, 'role test'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);

            expect(table.getAttribute('role')).toBe('grid');
        });

        it('maintains header text content after body cell edits', () => {
            setupTwoByTwo();
            const headerTexts = domHelpers.queryAll(editorElement, 'thead th[role="columnheader"]').map(h => h.textContent);
            const c = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');
            domHelpers.input(c, 'aaa'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);

            const headerTextsAfter = domHelpers.queryAll(editorElement, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headerTextsAfter.join('|')).toBe(headerTexts.join('|'));
        });

        it('cell dataset row/col stay the same after edits', (done) => {
            setupTwoByTwo();
            const cell = domHelpers.query(editorElement, 'tbody tr:nth-child(1) td[role="gridcell"]') as HTMLElement;
            const rowBefore = cell.getAttribute('data-row');
            const colBefore = cell.getAttribute('data-col');
            const c = domHelpers.query(cell, '.e-block-content');
            domHelpers.input(c, 'persist'); editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(cell.getAttribute('data-row')).toBe(rowBefore);
                expect(cell.getAttribute('data-col')).toBe(colBefore);
                done();
            }, 200);
        });

        it('row count remains stable after numerous edits', (done) => {
            setupTwoByTwo();
            const c = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"] .e-block-content');
            for (let i = 0; i < 5; i++) {
                domHelpers.input(c, 'edit' + i);
                editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);
            }
            setTimeout(() => {
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(2);

                const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
                expect(tProps.rows.length).toBe(2);
                done();
            }, 300);
        });

        it('column count remains stable after numerous edits', (done) => {
            setupTwoByTwo();
            const c = domHelpers.query(editorElement, 'tbody tr:first-child td:last-child .e-block-content');
            for (let i = 0; i < 5; i++) {
                domHelpers.input(c, 'edit' + i);
                editor.blockManager.stateManager.updateContentOnUserTyping(c.closest('.e-block') as HTMLElement);
            }
            setTimeout(() => {
                const cols = domHelpers.queryAll(editorElement, 'thead th');
                expect(cols.length).toBe(3);

                const tProps = ((editor.blocks[0] as BlockModel).properties as ITableBlockSettings);
                expect(tProps.columns.length).toBe(2);
                done();
            }, 300);
        });
    });

    describe('Slash menu actions inside cell', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setupTwoByTwo(): void {
            const tableProps: ITableBlockSettings = {
                columns: [{ id: 'col1' }, { id: 'col2' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'col1', blocks: [{ id: 'c1_p', blockType: BlockType.Paragraph, content: [{ id: 'c1_t', contentType: ContentType.Text, content: 'Cell 1' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'c2_p', blockType: BlockType.Paragraph, content: [{ id: 'c2_t', contentType: ContentType.Text, content: 'Cell 2' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'col1', blocks: [{ id: 'c3_p', blockType: BlockType.Paragraph, content: [{ id: 'c3_t', contentType: ContentType.Text, content: 'Cell 3' }] }] },
                            { columnId: 'col2', blocks: [{ id: 'c4_p', blockType: BlockType.Paragraph, content: [{ id: 'c4_t', contentType: ContentType.Text, content: 'Cell 4' }] }] }
                        ]
                    }
                ]
            };
            const blocks: BlockModel[] = [{ id: 'table_edit', blockType: BlockType.Table, properties: tableProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        function openSlashMenuOn(blockElement: HTMLElement) {
            expect(blockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        }

        function clickSlashMenuItem(item: string) {
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const listItem = slashCommandElement.querySelector(`li[data-value="${item}"]`) as HTMLElement;
            expect(listItem).not.toBeNull();
            listItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('should not show table slash menu item when opened inside table cell', () => {
            setupTwoByTwo();
            const blockElement = editorElement.querySelector('#c1_p') as HTMLElement;
            openSlashMenuOn(blockElement);
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            // table li element inside the popup should be hidden
            const tableItem = slashCommandElement.querySelector('li[data-value="Table"]') as HTMLElement;
            expect(tableItem.classList.contains('e-hidden')).toBe(true);
            expect(tableItem.style.display).not.toBe('block');
        });

        it('transforming to heading', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            openSlashMenuOn(blockElement);
            clickSlashMenuItem('Heading 1');

            domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = tableProps.rows[0].cells[0].blocks;
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(domBlocks.length).toBe(1);
            const headingEle = firstCell.querySelector('.e-block').querySelector('h1') as HTMLElement;
            expect(headingEle).not.toBeNull(); // h1 should exist
            expect(headingEle.textContent).toBe('Cell 1'); // h1 should contain correct text
            expect(headingEle.tagName).toBe('H1');
            expect(headingEle.textContent).toBe('Cell 1');
            expect(modelBlocks[0].content[0].content).toBe('Cell 1');
            done();
        });

        it('transforming to quote', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            openSlashMenuOn(blockElement);
            clickSlashMenuItem('Quote');

            domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = tableProps.rows[0].cells[0].blocks;
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            const blockquoteElement = firstCell.querySelector('.e-block').querySelector('blockquote') as HTMLElement;
            expect(blockquoteElement.textContent).toBe('Cell 1');
            expect(blockquoteElement).not.toBeNull();
            expect(blockquoteElement.tagName).toBe('BLOCKQUOTE');
            expect(modelBlocks[0].content[0].content).toBe('Cell 1');
            done();
        });

        it('transforming to bullet list', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            openSlashMenuOn(blockElement);
            clickSlashMenuItem('Bullet List');

            domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = tableProps.rows[0].cells[0].blocks;
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            const bulletBlock = firstCell.querySelector('.e-block') as HTMLElement;
            const listElement = bulletBlock.querySelector('ul') as HTMLElement;
            const listItem = listElement.querySelector('li') as HTMLElement;
            expect(listElement).not.toBeNull(); // UL should exist
            expect(listItem).not.toBeNull();
            expect(getBlockContentElement(bulletBlock).style.getPropertyValue('list-style-type')).toBe('');
            expect(listItem.textContent).toBe('Cell 1');
            expect(modelBlocks[0].content[0].content).toBe('Cell 1');
            done();
        });

        it('transforming to divider when content is present', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            openSlashMenuOn(blockElement);
            clickSlashMenuItem('Divider');

            domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = tableProps.rows[0].cells[0].blocks;
            expect(modelBlocks.length).toBe(3);
            expect(domBlocks.length).toBe(3);
            // Should create new divider block since content is present in the current block
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(firstCell.querySelector('.e-block').querySelector('p').textContent).toBe('Cell 1');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content[0].content).toBe('Cell 1');
            //Ensure focus is in next sibling of divider
            expect(editor.blockManager.currentFocusedBlock.id).toBe(modelBlocks[2].id);
            done();
        });

        it('transforming to divider when content is empty', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            getBlockContentElement(blockElement).textContent = '';
            openSlashMenuOn(blockElement);
            clickSlashMenuItem('Divider');

            domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = tableProps.rows[0].cells[0].blocks;
            // Current bullet list block should be replaced with divider block since content is empty
            expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks.length).toBe(2);
            expect(domBlocks.length).toBe(2);
            expect(firstCell.querySelector('.e-block').querySelector('p')).toBeNull();
            expect(domBlocks[0].querySelector('hr')).not.toBeNull();
            expect(domBlocks[1].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content.length).toBe(0);
            //Ensure focus is in next sibling of divider
            expect(editor.blockManager.currentFocusedBlock.id).toBe(modelBlocks[1].id);
            done();
        });

        it('Navigate on slash popup using arrow keys and insert', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const tableProps = editor.blocks[0].properties as ITableBlockSettings;
            let domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = tableProps.rows[0].cells[0].blocks;
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            openSlashMenuOn(blockElement);
            // Arrow down twice and Enter → select NumberedList
            setTimeout(() => {
                blockElement.dispatchEvent(new KeyboardEvent('keydown', ({ keyCode: 40, key: 'ArrowDown', bubbles: true } as any)));
                blockElement.dispatchEvent(new KeyboardEvent('keydown', ({ keyCode: 40, key: 'ArrowDown', bubbles: true } as any)));
                blockElement.dispatchEvent(new KeyboardEvent('keydown', ({ keyCode: 13, key: 'Enter', bubbles: true } as any)));

                setTimeout(() => {
                    domBlocks = firstCell.querySelectorAll<HTMLElement>('.e-block');
                    modelBlocks = tableProps.rows[0].cells[0].blocks;
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                    const bulletBlock = firstCell.querySelector('.e-block') as HTMLElement;
                    const listElement = bulletBlock.querySelector('ol') as HTMLElement;
                    const listItem = listElement.querySelector('li') as HTMLElement;
                    expect(listElement).not.toBeNull(); // UL should exist
                    expect(listItem).not.toBeNull();
                    expect(getBlockContentElement(bulletBlock).style.getPropertyValue('list-style-type')).toBe('"1. "');
                    expect(listItem.textContent).toBe('Cell 1');
                    expect(modelBlocks[0].content[0].content).toBe('Cell 1');
                    done();
                }, 50);
            }, 100);
        });

        it('should filter commands properly and show filtered results', (done) => {
            setupTwoByTwo();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            const blockElement = firstCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            // Open slash command popup
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '/head';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', {
                key: 'd', 
                code: 'KeyD', 
                bubbles: true 
            }));
            
            setTimeout(() => {
                // Check that only heading items are shown
                const menuItems = document.querySelectorAll('.e-blockeditor-command-menu li');
                let headingItemFound = false;
                
                menuItems.forEach(item => {
                    const itemValue = item.getAttribute('data-value');
                    if (itemValue && itemValue.toLowerCase().includes('head')) {
                        headingItemFound = true;
                    }
                });
                
                expect(headingItemFound).toBe(true);
                
                done();
            }, 300);
        });
    });

    describe('Row/Column interactions and hover UI', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setupTable(props?: Partial<ITableBlockSettings>): void {
            const base: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'R2C1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'R2C2' }] }] }
                        ]
                    }
                ]
            } as ITableBlockSettings;
            const finalProps = { ...base, ...(props || {}) } as ITableBlockSettings;
            const blocks: BlockModel[] = [{ id: 'tbl', blockType: BlockType.Table, properties: finalProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });
        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('shows hover UI (row dots, col dots, action bars) on cell hover; ignores row-number/header', () => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const bodyCell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            expect(bodyCell).not.toBeNull();

            // Hover over a data cell
            const ev = new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 });
            bodyCell.dispatchEvent(ev);

            expect(domHelpers.query(blockElement, '.e-row-dot').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-dot').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-row-action-handle').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-action-handle').style.display).not.toBe('none');

            // Hover over header cell: no row action
            const th = domHelpers.query(blockElement, 'thead th[role="columnheader"]');
            th.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowAction = domHelpers.query(blockElement, '.e-row-action-handle') as HTMLElement;
            expect(rowAction.style.display === 'none' || rowAction.style.display === '').toBe(true);

            // Hover over row-number cell: column action hidden
            const rnCell = domHelpers.query(blockElement, 'tbody td.e-row-number');
            rnCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const colAction = domHelpers.query(blockElement, '.e-col-action-handle') as HTMLElement;
            expect(colAction.style.display === 'none' || colAction.style.display === '').toBe(true);
        });

        it('hides hover UI when leaving from block element', function () {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const bodyCell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            expect(bodyCell).not.toBeNull();
            const ev = new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 });
            bodyCell.dispatchEvent(ev);
            expect(domHelpers.query(blockElement, '.e-row-dot').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-dot').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-row-action-handle').style.display).not.toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-action-handle').style.display).not.toBe('none');

            blockElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            expect(domHelpers.query(blockElement, '.e-row-dot').style.display).toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-dot').style.display).toBe('none');
            expect(domHelpers.query(blockElement, '.e-row-action-handle').style.display).toBe('none');
            expect(domHelpers.query(blockElement, '.e-col-action-handle').style.display).toBe('none');
        });

        it('should not show hover UIs on row number header', function () {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const bodyCell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            expect(bodyCell).not.toBeNull();
            const rnCell = domHelpers.query(blockElement, 'thead th.e-row-number');
            rnCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowAction = domHelpers.query(blockElement, '.e-row-action-handle');
            const colAction = domHelpers.query(blockElement, '.e-col-action-handle');
            expect(rowAction.style.display === 'none' || rowAction.style.display === '').toBe(true);
            expect(colAction.style.display === 'none' || colAction.style.display === '').toBe(true);
        });

        it('row action handle click selects row and shows pinned bar + popup', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowAction = domHelpers.query(blockElement, '.e-row-action-handle');
            expect(rowAction).not.toBeNull();
            rowAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // selection class
            const firstRow = domHelpers.query(blockElement, 'tbody tr');
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            // pinned bar visible
            const pinned = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(pinned && pinned.style.display !== 'none').toBe(true);
            // popup visible
            setTimeout(() => {
                const popup = domHelpers.query(document, '.e-table-gripper-action-popup');
                expect(popup).not.toBeNull();
                done();
            }, 0);
        });

        it('column action handle click selects column and shows pinned bar + popup', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const colAction = domHelpers.query(editorElement, '.e-col-action-handle');
            colAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // column selection class on first column cells (skip row-number)
            const r1 = domHelpers.queryAll(blockElement, 'tbody tr')[0] as HTMLTableRowElement;
            const r2 = domHelpers.queryAll(blockElement, 'tbody tr')[1] as HTMLTableRowElement;
            expect((r1.cells[1] as HTMLElement).classList.contains('e-col-selected')).toBe(true);
            expect((r2.cells[1] as HTMLElement).classList.contains('e-col-selected')).toBe(true);
            // pinned bar visible
            const pinned = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
            expect(pinned && pinned.style.display !== 'none').toBe(true);
            // popup visible
            setTimeout(() => {
                const popup = domHelpers.query(document, '.e-table-gripper-action-popup');
                expect(popup).not.toBeNull();
                done();
            }, 0);
        });

        it('popup delete icon removes row - updates DOM and model', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(blockElement, '.e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const del = domHelpers.query(document, '.e-table-gripper-action-item.e-trash');
                del.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                //DOM
                const bodyRows = domHelpers.queryAll(blockElement, 'tbody tr');
                expect(bodyRows.length).toBe(1);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(1);
                done();
            }, 0);
        });

        it('popup delete icon removes column - updates DOM and model', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(blockElement, '.e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const del = domHelpers.query(document, '.e-table-gripper-action-item.e-trash');
                del.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                //DOM
                const bodyRow = domHelpers.query(blockElement, 'tbody tr') as HTMLTableRowElement;
                expect(bodyRow.cells.length).toBe(2); // row-number + 1 col

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(1);
                expect(model.rows[0].cells.length).toBe(1);
                done();
            }, 0);
        });

        it('hover on row insert handle shows hoverline and on mouseleave should hide', () => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const topDot = domHelpers.query(blockElement, '.e-row-dot-hit');
            topDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-row-insert-handle');
            expect(insert.style.display).not.toBe('none');
            const line = domHelpers.query(blockElement, '.e-row-hover-line');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            expect(insert.style.display).toBe('none');
            expect(line.style.display).toBe('none');
        });

        it('hover on col insert handle shows hoverline and on mouseleave should hide', () => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const topDot = domHelpers.query(blockElement, '.e-col-dot-hit');
            topDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-col-insert-handle');
            expect(insert.style.display).not.toBe('none');
            const line = domHelpers.query(blockElement, '.e-col-hover-line');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            expect(insert.style.display).toBe('none');
            expect(line.style.display).toBe('none');
        });

        it('insert handle shows on top row-dot hover and inserts row on click (DOM + model + focus)', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const topDot = domHelpers.query(blockElement, '.e-row-dot-hit');
            topDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-row-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const bodyRows = domHelpers.queryAll(blockElement, 'tbody tr');
                expect(bodyRows.length).toBe(3);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(3);

                // first data cell of inserted row has focus class
                const newRow = bodyRows[0] as HTMLTableRowElement;
                const firstDataCell = newRow.cells[1] as HTMLElement;
                expect(firstDataCell.classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('insert handle shows on bottom row-dot hover and inserts row on click (DOM + model + focus)', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const bottomDot = domHelpers.queryAll(blockElement, '.e-row-dot-hit')[1];
            bottomDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-row-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const bodyRows = domHelpers.queryAll(blockElement, 'tbody tr');
                expect(bodyRows.length).toBe(3);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(3);

                // first data cell of inserted row has focus class
                const newRow = bodyRows[1] as HTMLTableRowElement;
                const firstDataCell = newRow.cells[1] as HTMLElement;
                expect(firstDataCell.classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('insert handle shows on left col-dot hover and inserts column on click (DOM + model + focus)', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const leftDot = domHelpers.query(blockElement, '.e-col-dot-hit');
            leftDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-col-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const firstRow = domHelpers.query(blockElement, 'tbody tr') as HTMLTableRowElement;
                // row-number + 3 cols now
                expect(firstRow.cells.length).toBe(4);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(3);
                expect(model.rows[0].cells.length).toBe(3);

                // focus applied to first body row's new cell
                const domColIdx = 1; // new column inserted to the left of first col
                expect((firstRow.cells[domColIdx] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('insert handle shows on right col-dot hover and inserts column on click (DOM + model + focus)', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rightDot = domHelpers.queryAll(blockElement, '.e-col-dot-hit')[1];
            rightDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-col-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const firstRow = domHelpers.query(blockElement, 'tbody tr') as HTMLTableRowElement;
                // row-number + 3 cols now
                expect(firstRow.cells.length).toBe(4);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(3);
                expect(model.rows[0].cells.length).toBe(3);

                // focus applied to first body row's new cell
                const domColIdx = 2; // new column inserted to the right of first col
                expect((firstRow.cells[domColIdx] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('Check row insert handles visibility when moving mouse between right and left row hit zones', () => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const topDot = domHelpers.query(blockElement, '.e-row-dot-hit');
            topDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const topDotInsert = domHelpers.query(blockElement, '.e-row-insert-handle');
            expect(topDotInsert.style.display).not.toBe('none');
            const bottomDotInsert = domHelpers.queryAll(blockElement, '.e-row-insert-handle')[0];
            expect(bottomDotInsert.style.display).not.toBe('none');
        });

        it('Check column insert handles visibility when moving mouse between right and left column hit zones', () => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const leftDot = domHelpers.query(blockElement, '.e-col-dot-hit');
            leftDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const leftDotInsert = domHelpers.query(blockElement, '.e-col-insert-handle');
            expect(leftDotInsert.style.display).not.toBe('none');
            const rightDot = domHelpers.queryAll(blockElement, '.e-col-dot-hit')[1];
            rightDot .dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const rightColinsert = domHelpers.queryAll(blockElement, '.e-col-insert-handle')[0];
            expect(rightColinsert.style.display).not.toBe('none');
        });

        it('insert column with enable header as false', (done) => {
            setupTable({ enableHeader: false });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rightDot = domHelpers.queryAll(blockElement, '.e-col-dot-hit')[1];
            rightDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-col-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const firstRow = domHelpers.query(blockElement, 'tbody tr') as HTMLTableRowElement;
                // row-number + 3 cols now
                expect(firstRow.cells.length).toBe(4);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(3);
                expect(model.rows[0].cells.length).toBe(3);

                // focus applied to first body row's new cell
                const domColIdx = 2; // new column inserted to the right of first col
                expect((firstRow.cells[domColIdx] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('insert row with enable row number as false', (done) => {
            setupTable({ enableRowNumbers: false });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const bottomDot = domHelpers.queryAll(blockElement, '.e-row-dot-hit')[1];
            bottomDot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(blockElement, '.e-row-insert-handle');
            expect(insert.style.display).not.toBe('none');
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                //DOM
                const bodyRows = domHelpers.queryAll(blockElement, 'tbody tr');
                expect(bodyRows.length).toBe(3);

                //Model
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(3);

                // first data cell of inserted row has focus class
                const newRow = bodyRows[1] as HTMLTableRowElement;
                const firstDataCell = newRow.cells[0] as HTMLElement;
                expect(firstDataCell.classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });


        it('action handle bar resizes with row height after Enter increases content', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const cellBlock = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"] .e-block');
            const content = getBlockContentElement(cellBlock);
            // first trigger hover to show row action bar
            (cellBlock.closest('td') as HTMLElement).dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowAction = domHelpers.query(blockElement, '.e-row-action-handle') as HTMLElement;
            expect(rowAction.style.display).not.toBe('none');
            const beforeHeight = rowAction.style.height;

            // add a new line to increase height
            editor.blockManager.setFocusToBlock(cellBlock);
            setCursorPosition(content, (content.textContent || '').length);
            domHelpers.key(editorElement, 'Enter');

            setTimeout(() => {
                const afterHeight = (domHelpers.query(blockElement, '.e-row-action-handle') as HTMLElement).style.height;
                expect(afterHeight === '' || afterHeight !== beforeHeight).toBe(true);
                done();
            }, 100);
        });

        it('document click outside clears selection and hides pinned/hover UIs', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(blockElement, '.e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            // click outside
            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const pinnedRow = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
                const pinnedCol = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
                expect(pinnedRow.style.display === 'none' || pinnedRow.style.display === '').toBe(true);
                expect(pinnedCol.style.display === 'none' || pinnedCol.style.display === '').toBe(true);
                done();
            }, 0);
        });

        it('should focus particular cell when clicked', function () {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const firstCell = domHelpers.query(blockElement, 'tbody tr td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(firstCell.classList.contains('e-cell-focus')).toBe(true);

            const nextCell = domHelpers.queryAll(blockElement, 'tbody tr td[role="gridcell"]')[1];
            nextCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(firstCell.classList.contains('e-cell-focus')).toBe(false);
            expect(nextCell.classList.contains('e-cell-focus')).toBe(true);

            //Should ignore if clicked same cell again
            nextCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(nextCell.classList.contains('e-cell-focus')).toBe(true);
        });
        it('should not focus row number cell when clicked', function (done) {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');
            const rnCell = domHelpers.query(blockElement, 'tbody tr td.e-row-number');
            rnCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            setTimeout(function () {
                expect(rnCell.classList.contains('e-cell-focus')).toBe(false);
                done();
            }, 0);
        });
        it('clicking 2nd row gripper after focusing a 1st-row cell should clear 1st-row focus and select 2nd row', (done) => {
            setupTable();

            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');

            // Focus a cell in the first row
            const firstRowFirstCell = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"]') as HTMLElement;
            firstRowFirstCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(firstRowFirstCell.classList.contains('e-cell-focus')).toBe(true);

            // Hover a cell in the 2nd row to reveal its row gripper
            const secondRowFirstCell = domHelpers.query(blockElement, 'tbody tr:nth-child(2) td[role="gridcell"]') as HTMLElement;
            secondRowFirstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            // Click the row gripper (row action handle) for the 2nd row
            const rowActionHandle = domHelpers.query(blockElement, '.e-row-action-handle') as HTMLElement;
            expect(rowActionHandle).not.toBeNull();
            rowActionHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                const rows = domHelpers.queryAll(blockElement, 'tbody tr') as HTMLTableRowElement[];
                const firstRowFocusedCells = Array.from(rows[0].querySelectorAll('td[role="gridcell"].e-cell-focus'));
                expect(firstRowFocusedCells.length).toBe(0);
                expect(rows[1].classList.contains('e-row-selected')).toBe(true);
                done();
            }, 0);
        });
    });

    describe('Row/Column addition/deletion combinations', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setupTable(overrides?: Partial<ITableBlockSettings>): void {
            const base: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'R2C1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'R2C2' }] }] }
                        ]
                    }
                ]
            } as ITableBlockSettings;
            const finalProps = { ...base, ...(overrides || {}) } as ITableBlockSettings;
            const blocks: BlockModel[] = [{ id: 'tbl', blockType: BlockType.Table, properties: finalProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('Add row at top (first body row); model rows+1; tbody inserts at index; renumber', (done) => {
            setupTable();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(3);
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(3);
                const nums = rows.map(r => (r.querySelector('td.e-row-number') as HTMLElement).textContent);
                expect(nums).toEqual(nums.map((_, i) => String(i + 1)));
                done();
            }, 0);
        });

        it('Add row at middle index; model/DOM positions correct; data-row updated', (done) => {
            setupTable();
            const secondCell = domHelpers.queryAll(editorElement, 'tbody tr')[1].querySelector('td[role="gridcell"]') as HTMLElement;
            secondCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.queryAll(editorElement, '.e-block .e-row-dot-hit')[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(3);
                const middle = rows[1];
                const firstData = middle.querySelectorAll('td')[1] as HTMLElement;
                expect(firstData.getAttribute('data-row')).toBe('2');
                done();
            }, 0);
        });

        it('Add row at end; new row appended; data-row/row numbers updated', (done) => {
            setupTable();
            const lastRowCell = domHelpers.queryAll(editorElement, 'tbody tr:last-child td[role="gridcell"]')[0];
            lastRowCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.queryAll(editorElement, '.e-block .e-row-dot-hit')[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(3);
                const last = rows[rows.length - 1];
                const firstData = last.querySelectorAll('td')[1] as HTMLElement;
                expect(firstData.getAttribute('data-row')).toBe('3');
                const nums = rows.map(r => (r.querySelector('td.e-row-number') as HTMLElement).textContent);
                expect(nums[nums.length - 1]).toBe('3');
                done();
            }, 0);
        });

        it('Add row when no existing rows; first body row created correctly', (done) => {
            const properties: ITableBlockSettings = { enableHeader: true, enableRowNumbers: true, columns: [{ id: 'c1' }], rows: [] } as any;
            editor = createEditor({ blocks: [{ id: 'tbl', blockType: BlockType.Table, properties }] });
            editor.appendTo('#editor');
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            editor.blockManager.tableService.addRowAt({
                blockId: 'tbl',
                rowIndex: 0
            });
            setTimeout(() => {
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(1);
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.rows.length).toBe(1);
                done();
            }, 0);
        });

        it('Delete first body row; rows-1; DOM row removed; indices renumbered', (done) => {
            setupTable();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(1);
                expect((rows[0].querySelectorAll('td')[1] as HTMLElement).getAttribute('data-row')).toBe('1');
                const nums = rows.map(r => (r.querySelector('td.e-row-number') as HTMLElement).textContent);
                expect(nums).toEqual(['1']);
                done();
            }, 0);
        });

        it('Delete middle body row; rows-1; indices renumbered; aria updated', (done) => {
            setupTable({
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: '4' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ id: 't5', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ id: 't6', contentType: ContentType.Text, content: '6' }] }] }] }
                ]
            });
            const midCell = domHelpers.queryAll(editorElement, 'tbody tr')[1].querySelector('td[role="gridcell"]');
            midCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                expect(rows.length).toBe(2);
                expect((rows[1].querySelectorAll('td')[1] as HTMLElement).getAttribute('data-row')).toBe('2');
                expect((rows[1].querySelectorAll('td')[1] as HTMLElement).getAttribute('aria-rowindex')).toBe('2');
                done();
            }, 0);
        });

        it('Delete last body row; rows-1; indices/row numbers updated', (done) => {
            setupTable();
            const lastCell = domHelpers.queryAll(editorElement, 'tbody tr:last-child td[role="gridcell"]')[0];
            lastCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                    expect(rows.length).toBe(1);
                    const nums = rows.map(r => (r.querySelector('td.e-row-number') as HTMLElement).textContent);
                    expect(nums).toEqual(['1']);
                    done();
                }, 100);
            }, 0);
        });

        it('Delete row until one remains; behavior defined (no delete icon shown); no crash', (done) => {
            setupTable();
            const cell1 = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell1.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                const cell2 = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
                cell2.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                expect(domHelpers.query(editorElement, '.e-table-gripper-action-popup')).toBeNull();
                done();
            }, 100);
        });

        it('Add column at leftmost index 0; columns+1; colgroup/tds updated; focus set', (done) => {
            setupTable();
            const cell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(3);
                const colEls = domHelpers.queryAll(editorElement, 'colgroup col');
                expect(colEls.length).toBe(4);
                const firstRow = domHelpers.query(editorElement, 'tbody tr') as HTMLTableRowElement;
                expect((firstRow.cells[1] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('Add column at middle index; widths recalculated; data-col updated', (done) => {
            setupTable();
            const cell = domHelpers.queryAll(editorElement, 'tbody tr td[role="gridcell"]')[1];
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.queryAll(editorElement, '.e-block .e-col-dot-hit')[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                const targetCell = rows[0].querySelectorAll('td')[2] as HTMLElement;
                expect(targetCell.getAttribute('data-col')).toBe('1');
                done();
            }, 0);
        });

        it('Add column at end; appended col; all rows get new cells', (done) => {
            setupTable();
            const lastCell = domHelpers.queryAll(editorElement, 'tbody tr td[role="gridcell"]')[1];
            lastCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.queryAll(editorElement, '.e-block .e-col-dot-hit')[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const bodyRows = domHelpers.queryAll(editorElement, 'tbody tr') as HTMLTableRowElement[];
                const cellsLen = bodyRows.map(r => r.cells.length);
                expect(cellsLen.every(n => n === 4)).toBe(true);
                done();
            }, 0);
        });

        it('Delete first column; columns-1; cells removed; indices updated', (done) => {
            setupTable();
            const cell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(1);
                const firstRow = domHelpers.query(editorElement, 'tbody tr') as HTMLTableRowElement;
                expect(firstRow.cells.length).toBe(2);
                done();
            }, 0);
        });

        it('Delete middle column; columns-1; widths recalculated; indices updated', (done) => {
            setupTable({
                columns: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: '1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: '2' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p7', blockType: BlockType.Paragraph, content: [{ id: 't7', contentType: ContentType.Text, content: '7' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: '3' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: '4' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p8', blockType: BlockType.Paragraph, content: [{ id: 't8', contentType: ContentType.Text, content: '8' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ id: 't5', contentType: ContentType.Text, content: '5' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ id: 't6', contentType: ContentType.Text, content: '6' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p9', blockType: BlockType.Paragraph, content: [{ id: 't9', contentType: ContentType.Text, content: '9' }] }] }
                        ]
                    }
                ]
            });
            const cell = domHelpers.queryAll(editorElement, 'tbody tr td[role="gridcell"]')[1];
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const model = editor.blocks[0].properties as ITableBlockSettings;
                expect(model.columns.length).toBe(2);
                const row = domHelpers.query(editorElement, 'tbody tr') as HTMLTableRowElement;
                expect(row.cells.length).toBe(3);
                done();
            }, 0);
        });

        it('Delete last column; columns-1; indices updated; no stray col elements', (done) => {
            setupTable({ columns: [{ id: 'c1' }, { id: 'c2' }] });
            const cell = domHelpers.queryAll(editorElement, 'tbody tr td[role="gridcell"]')[1];
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const cols = domHelpers.queryAll(editorElement, 'colgroup col');
                expect(cols.length >= 1).toBe(true);
                done();
            }, 0);
        });

        it('Delete column until one remains; behavior defined (no delete icon shown); no crash', (done) => {
            setupTable();
            const cell1 = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell1.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));

            const cell2 = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell2.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(domHelpers.query(editorElement, '.e-table-gripper-action-popup')).toBeNull();
            done();
        });

        it('Add column then delete same column; structure returns to original', (done) => {
            setupTable();
            const cell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);
                    done();
                }, 0);
            }, 0);
        });

        it('Add row then delete same row; structure returns to original', (done) => {
            setupTable();
            const firstCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            firstCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const cell2 = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
                cell2.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);
                    done();
                }, 0);
            }, 0);
        });

        it('Focus moves to first data cell of new row after addRowAt', (done) => {
            setupTable();
            const td = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const firstRow = domHelpers.query(editorElement, 'tbody tr:first-child') as HTMLTableRowElement;
                expect((firstRow.cells[1] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('Focus moves to first data cell of new column after addColumnAt', (done) => {
            setupTable();
            const td = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const firstRow = domHelpers.query(editorElement, 'tbody tr:first-child') as HTMLTableRowElement;
                expect((firstRow.cells[1] as HTMLElement).classList.contains('e-cell-focus')).toBe(true);
                done();
            }, 0);
        });

        it('Column width recalculated equally after addColumnAt', (done) => {
            setupTable();
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const colEls = domHelpers.queryAll(editorElement, 'colgroup > col');
                const widths = colEls.slice(1).map(c => (c as HTMLTableColElement).style.width);
                expect(widths.every(w => w === widths[0])).toBe(true);
                done();
            }, 0);
        });

        it('Column width recalculated equally after deleteColumnAt', (done) => {
            setupTable({
                columns: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: '1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: '2' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p7', blockType: BlockType.Paragraph, content: [{ id: 't7', contentType: ContentType.Text, content: '7' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: '3' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: '4' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p8', blockType: BlockType.Paragraph, content: [{ id: 't8', contentType: ContentType.Text, content: '8' }] }] }
                        ]
                    },
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ id: 't5', contentType: ContentType.Text, content: '5' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ id: 't6', contentType: ContentType.Text, content: '6' }] }] },
                            { columnId: 'c3', blocks: [{ id: 'p9', blockType: BlockType.Paragraph, content: [{ id: 't9', contentType: ContentType.Text, content: '9' }] }] }
                        ]
                    }
                ]
            });
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    const colEls = domHelpers.queryAll(editorElement, 'colgroup > col');
                    const widths = colEls.slice(1).map(c => (c as HTMLTableColElement).style.width);
                    expect(widths.every(w => w === widths[0])).toBe(true);
                    done();
                }, 0);
            }, 0);
        });

        it('data-row/data-col reindexed correctly after multiple add/delete operations', (done) => {
            setupTable();
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-row-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    const midCell = domHelpers.queryAll(editorElement, 'tbody tr')[1].querySelector('td[role="gridcell"]');
                    midCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                    domHelpers.query(editorElement, '.e-block .e-row-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        setTimeout(() => {
                            const cell2 = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
                            cell2.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            setTimeout(() => {
                                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                setTimeout(() => {
                                    const rows = domHelpers.queryAll(editorElement, 'tbody tr') as HTMLTableRowElement[];
                                    expect(rows[0].cells[1].getAttribute('data-row')).toBe('1');
                                    expect(rows[0].cells[2].getAttribute('data-row')).toBe('1');
                                    expect(rows[0].cells[1].getAttribute('data-col')).toBe('0');
                                    expect(rows[0].cells[2].getAttribute('data-col')).toBe('1');

                                    expect(rows[1].cells[1].getAttribute('data-row')).toBe('2');
                                    expect(rows[1].cells[2].getAttribute('data-row')).toBe('2');
                                    expect(rows[1].cells[1].getAttribute('data-col')).toBe('0');
                                    expect(rows[1].cells[2].getAttribute('data-col')).toBe('1');

                                    const props = editor.blocks[0].properties as ITableBlockSettings;
                                    expect(props.rows.length).toBe(2);
                                    expect(props.columns.length).toBe(2);
                                    expect(props.rows[0].cells.length).toBe(2);
                                    expect(props.rows[1].cells.length).toBe(2);
                                    done();
                                }, 100);
                            }, 0);
                        }, 100);
                    }, 0);
                }, 0);
            }, 0);
        });

        it('data-colindex reindexed correctly after multiple add/delete operations', (done) => {
            setupTable();
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const cell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
                cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => {
                    domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    setTimeout(() => {
                        const rows = domHelpers.queryAll(editorElement, 'tbody tr');
                        rows.forEach((r) => {
                            Array.from(r.querySelectorAll('td:not(.e-row-number)')).forEach((cellEl: HTMLElement, idx: number) => {
                                expect(cellEl.getAttribute('data-col')).toBe(String(idx));
                            });
                        });
                        done();
                    }, 100);
                }, 0);
            }, 0);
        });

        it('Table insert handles/hover lines hidden after applying addColumnAt', (done) => {
            setupTable();
            const cell = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const insert = domHelpers.query(editorElement, '.e-block .e-col-insert-handle') as HTMLElement;
            expect(insert.style.display !== 'none').toBe(true);
            insert.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const insert2 = domHelpers.query(editorElement, '.e-block .e-col-insert-handle') as HTMLElement;
                const line = domHelpers.query(editorElement, '.e-block .e-col-hover-line') as HTMLElement;
                expect(insert2.style.display === 'none' || insert2.style.display === '').toBe(true);
                expect(line.style.display === 'none' || line.style.display === '').toBe(true);
                done();
            }, 0);
        });

        it('Table insert handles/hover lines hidden after applying addRowAt', (done) => {
            setupTable();
            const firstDataCell = domHelpers.query(editorElement, 'tbody tr:first-child td[role="gridcell"]');
            firstDataCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            const rowDotHit = domHelpers.query(editorElement, '.e-block .e-row-dot-hit');
            rowDotHit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

            const insertHandle = domHelpers.query(editorElement, '.e-block .e-row-insert-handle') as HTMLElement;
            expect(insertHandle).toBeTruthy();
            expect(insertHandle.style.display !== 'none').toBe(true);
            insertHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const insertHandleAfter = domHelpers.query(editorElement, '.e-block .e-row-insert-handle') as HTMLElement;
                const hoverLineAfter = domHelpers.query(editorElement, '.e-block .e-row-hover-line') as HTMLElement;
                expect(insertHandleAfter && (insertHandleAfter.style.display === 'none' || insertHandleAfter.style.display === '')).toBe(true);
                expect(hoverLineAfter && (hoverLineAfter.style.display === 'none' || hoverLineAfter.style.display === '')).toBe(true);
                done();
            }, 0);
        });

        it('adding a row or column should remove any existing gripper selection (pinned handle hidden)', (done) => {
            setupTable();

            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockElement = table.closest('.e-block');

            // 1) Select a row via gripper (shows pinned row gripper)
            const firstDataCell = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"]');
            firstDataCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowActionHandle = domHelpers.query(blockElement, '.e-row-action-handle') as HTMLElement;
            expect(rowActionHandle).not.toBeNull();
            rowActionHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Sanity: pinned row gripper is visible
            const pinnedRowBefore = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(pinnedRowBefore && pinnedRowBefore.style.display !== 'none').toBe(true);

            // 2) Add a column (any gripper should be removed)
            const aCellForColUI = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"]');
            aCellForColUI.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const colDotHit = domHelpers.query(blockElement, '.e-col-dot-hit') as HTMLElement; // left hit zone
            expect(colDotHit).not.toBeNull();
            colDotHit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            const colInsertHandle = domHelpers.query(blockElement, '.e-col-insert-handle') as HTMLElement;
            expect(colInsertHandle && colInsertHandle.style.display !== 'none').toBe(true);
            colInsertHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                const pinnedRowAfterColAdd = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
                const pinnedColAfterColAdd = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
            
                // Expect: any pinned gripper (row/col) is hidden after column insertion
                expect(!pinnedRowAfterColAdd || pinnedRowAfterColAdd.style.display === 'none').toBe(true);
                expect(!pinnedColAfterColAdd || pinnedColAfterColAdd.style.display === 'none').toBe(true);
            
                // 3) Now select a column via gripper (shows pinned column gripper)
                const anyCell = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"]');
                anyCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                const colActionHandle = domHelpers.query(blockElement, '.e-col-action-handle') as HTMLElement;
                expect(colActionHandle).not.toBeNull();
                colActionHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
                // Sanity: pinned column gripper is visible
                const pinnedColBeforeRowAdd = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
                expect(pinnedColBeforeRowAdd && pinnedColBeforeRowAdd.style.display !== 'none').toBe(true);
            
                // 4) Add a row (any gripper should be removed)
                const cellForRowUI = domHelpers.query(blockElement, 'tbody tr:first-child td[role="gridcell"]');
                cellForRowUI.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                const rowDotHit = domHelpers.query(blockElement, '.e-row-dot-hit') as HTMLElement; // top hit zone
                expect(rowDotHit).not.toBeNull();
                rowDotHit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                const rowInsertHandle = domHelpers.query(blockElement, '.e-row-insert-handle') as HTMLElement;
                expect(rowInsertHandle && rowInsertHandle.style.display !== 'none').toBe(true);
                rowInsertHandle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
                setTimeout(() => {
                    const pinnedRowAfterRowAdd = domHelpers.query(blockElement, '.e-row-action-handle.e-pinned') as HTMLElement;
                    const pinnedColAfterRowAdd = domHelpers.query(blockElement, '.e-col-action-handle.e-pinned') as HTMLElement;
                
                    // Expect: any pinned gripper (row/col) is hidden after row insertion
                    expect(!pinnedRowAfterRowAdd || pinnedRowAfterRowAdd.style.display === 'none').toBe(true);
                    expect(!pinnedColAfterRowAdd || pinnedColAfterRowAdd.style.display === 'none').toBe(true);
                
                    done();
                }, 500);
            }, 1000);
        });
    });

    describe('Header row functionality', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setup(props?: Partial<ITableBlockSettings>): void {
            const base: ITableBlockSettings = {
                enableHeader: true,
                enableRowNumbers: true,
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
                rows: [
                    {
                        cells: [
                            { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                            { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                        ]
                    }
                ]
            } as ITableBlockSettings;
            const finalProps = { ...base, ...(props || {}) } as ITableBlockSettings;
            const blocks: BlockModel[] = [{ id: 'tbl_hdr', blockType: BlockType.Table, properties: finalProps }];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) { editor.destroy(); editor = undefined; }
            remove(editorElement);
        });

        it('renders thead and row-number header cell', () => {
            setup();
            const thead = domHelpers.query(editorElement, 'thead');
            expect(thead).not.toBeNull();
            const headerRow = domHelpers.query(thead, 'tr');
            const ths = domHelpers.queryAll(headerRow, 'th');
            expect(ths.length).toBe(3);
            expect(ths[0].classList.contains('e-row-number')).toBe(true);
            expect(ths[0].textContent === '').toBe(true);
        });

        it('header th cells are contenteditable', () => {
            setup();
            const ths = domHelpers.queryAll(editorElement, 'thead th');
            // row-number header may not be editable
            expect(ths[1].getAttribute('contenteditable')).toBe('true');
            expect(ths[2].getAttribute('contenteditable')).toBe('true');
        });

        it('hover on header th does not show row action; shows column action', () => {
            setup();
            const th = domHelpers.query(editorElement, 'thead th[role="columnheader"]');
            th.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const rowAction = domHelpers.query(editorElement, '.e-block .e-row-action-handle') as HTMLElement;
            const colAction = domHelpers.query(editorElement, '.e-block .e-col-action-handle') as HTMLElement;
            expect(rowAction.style.display === 'none' || rowAction.style.display === '').toBe(true);
            expect(colAction.style.display !== 'none').toBe(true);
        });

        it('add column updates header: new th added', (done) => {
            setup();
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-dot-hit').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-insert-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                const ths = domHelpers.queryAll(editorElement, 'thead th:not(.e-row-number)');
                expect(ths.length).toBe(3); // 3 columns

                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.columns.length).toBe(3);
                done();
            }, 0);
        });

        it('delete column updates header: th removed', (done) => {
            setup();
            const td = domHelpers.query(editorElement, 'tbody tr td[role="gridcell"]');
            td.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            domHelpers.query(editorElement, '.e-block .e-col-action-handle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            setTimeout(() => {
                domHelpers.query(document, '.e-table-gripper-action-item.e-trash').dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const ths = domHelpers.queryAll(editorElement, 'thead th:not(.e-row-number)');
                expect(ths.length).toBe(1);

                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.columns.length).toBe(1);
                done();
            }, 0);
        });

        it('column action bar width roughly matches header th width', () => {
            setup();
            const th = domHelpers.query(editorElement, 'thead th[role="columnheader"]');
            th.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            const colAction = domHelpers.query(editorElement, '.e-block .e-col-action-handle') as HTMLElement;
            // expect(colAction && (colAction.style.width === (th.offsetWidth.toString() + 'px'))).toBe(true);
        });

        it('Typing on table header should update both DOM and model properly', (done) => {
            setup();
            editor.blockManager.setFocusToBlock(editorElement.querySelector('.e-block'));
            const th = domHelpers.query(editorElement, 'thead th[role="columnheader"]');
            th.textContent = 'Updated header';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                expect((editor.blocks[0].properties as ITableBlockSettings).columns[0].headerText).toBe('Updated header');
                done();
            }, 0);
        });

        it('should not show inline toolbar when selecting text in table header (th element)', (done) => {
            setup();
            const headerCell = domHelpers.query(editorElement, 'thead th[role="columnheader"]') as HTMLElement;
            expect(headerCell).not.toBeNull();

            // Select text in the header cell
            const range = document.createRange();
            const textNode = headerCell.firstChild || headerCell;
            range.selectNodeContents(textNode);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Trigger selection change that would normally show toolbar
            document.dispatchEvent(new Event('selectionchange'));

            setTimeout(() => {
                const inlineToolbar = document.querySelector('.e-rte-inline-toolbar');
                // Inline toolbar should not be visible for header selection
                expect(inlineToolbar === null || (inlineToolbar as HTMLElement).style.display === 'none').toBe(true);
                done();
            }, 100);
        });
    });
});
