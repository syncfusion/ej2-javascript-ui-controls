/**
 * Cell renderer spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { ICellFormatter } from '../../../src/grid/base/interface';
import { RowRenderer } from '../../../src/grid/renderer/row-renderer';
import { Row } from '../../../src/grid/models/row';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Custom Atrributes and html encode module', () => {

    describe('Column attributes', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid({
                columns: [
                    {
                        field: 'data.a', headerText: '<i>A</i>', headerTextAlign: 'Center',
                        disableHtmlEncode: false, textAlign: 'Right', customAttributes: {
                            class: 'hi',
                            style: { color: 'green', 'background-color': 'wheat' },
                            'data-id': 'grid-cell'
                        }
                    },
                    { headerText: 'B' },
                    { field: 'c', headerText: 'C', displayAsCheckBox: false, type: 'boolean', visible: false },
                    { field: 'c', headerText: 'Cc', displayAsCheckBox: true, type: 'boolean' },
                    {
                        headerText: 'D', valueAccessor: (field: string, data: Object, column: Column) => {
                            return '<span style="color:' + (data['c'] ? 'green' : 'red') + '"><i>GO</i><span>';
                        },
                    }
                ],
                dataSource: [{ data: { a: '<i>VINET</i>' }, b: '<i>TOMSP</i>', c: true, d: new Date() },
                { data: { a: 2 }, b: 2, c: false, d: new Date() }],
                allowPaging: false
            }, done);
        });

        it('ClassName testing', () => {
            expect(gridObj.element.classList.contains('e-grid')).toBeTruthy();
        });

        it('Attribute testing', () => {
            let rows: Element[] = gridObj.getRows();
            let hRow: Element = gridObj.element.querySelector('.e-columnheader');
            for (let i: number = 0; i < rows[0].children.length; i++) {
                expect(rows[0].children[i].hasAttribute('tabindex')).toBeTruthy();
                expect(rows[0].children[i].hasAttribute('aria-label')).toBeTruthy();
            }
            for (let i: number = 0; i < hRow.children.length; i++) {
                expect(hRow.children[i].hasAttribute('tabindex')).toBeTruthy();
            }
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });


    class ExtendedFormatter implements ICellFormatter {
        public getValue(column: Column, data: Object): Object {
            return (<number>data[column.field]).toFixed(2);
        }
    }

    describe('Custom Formatter - implements ICellFormatter', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done: EmitType<Object>) => {
            grid = createGrid(
                {
                    columns: [
                        { field: 'data.a' },
                        { field: 'b', formatter: ExtendedFormatter }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false
                }, done);
        });
        it('Check custom Formatter return value', () => {
            rows = ((grid.getContentTable() as any).tBodies[0]).rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].innerHTML).toBe('5.00');
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Custom Formatter -  as Object implements ICellFormatter', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done: EmitType<Object>) => {
            grid = createGrid(
                {
                    columns: [
                        { field: 'data.a' },
                        { field: 'b', formatter: new ExtendedFormatter() }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false
                }, done);
        });
        it('Check custom Formatter return value', () => {
            rows = ((grid.getContentTable() as any).tBodies[0]).rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].innerHTML).toBe('5.00');
        });
        afterAll(() => {
            destroy(grid);
        });
    });


    describe('Custom Formatter as Function', () => {
        let customFn: { fn: Function } = {
            fn: (column: Column, data: Object) => {
                return (data[column.field] as number).toFixed(2);
            }
        };

        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { field: 'data.a' },
                    { field: 'b', formatter: customFn.fn },
                    { field: 'd', format: 'yMd' }
                ],
                dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                { data: { a: 2 }, b: 6, c: false, d: null }],
                allowPaging: false
            }, done);
        });

        it('Check custom Formatter return value', () => {
            rows = ((grid.getContentTable() as any).tBodies[0]).rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].innerHTML).toBe('5.00');
            let rows1 = ((grid.getContentTable() as any).tBodies[0]).rows[1] as HTMLTableRowElement;
            expect(rows1.cells[2].innerHTML).toBe('');
        });

        it('Row Rendeder functionality object to attribute conversion checking', () => {
            let render: RowRenderer<Column> = new RowRenderer<Column>(grid.serviceLocator, null, grid);
            let tr: HTMLElement = <HTMLElement>render.render(<Row<Column>>{ isSelected: true, visible: false, rowSpan: 1, cells:[] }, []);
            expect(tr.classList.contains('e-hide')).toBeTruthy();
            expect(tr.getAttribute('aria-selected')).not.toBeNull();
        });

        afterAll(() => {
            destroy(grid);
        });
    });

});
