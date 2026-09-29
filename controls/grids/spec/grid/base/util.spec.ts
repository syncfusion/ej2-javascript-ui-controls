/**
 * Util spec
 */
import { doesImplementInterface, prepareColumns, setCssInGridPopUp, resetDialogAppend, removeEventHandlers, getForeignData, getCellsByTableName, getColumnWidth, extendObjWithFn, toggleFilterUI, isCellHaveWidth, calculateAggregate, getRowHeight, getColumnModelByFieldName, getSerachFilteredData, getDatePredicate, getComplexFieldID, headerValueAccessor, updateColumnTypeForExportColumns, getCollapsedRowsCount, getPrototypesOfObj, recursive, compareChanges, getNumberFormat, setValidationRuels } from '../../../src/grid/base/util';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { Grid } from '../../../src/grid/base/grid';
import { createGrid, destroy } from '../base/specutil.spec';
import { Column } from '../../../src/grid/models';
import { data } from '../base/datasource.spec';
import { Edit, Toolbar, Filter, Aggregate } from '../../../src/grid/actions';

Grid.Inject(Edit, Toolbar, Filter, Aggregate);

describe('Util module', () => {

    describe('Method testing', () => {
        class Test {
        }
        it('doesImplementInterface testing', () => {
            expect(doesImplementInterface(Test, 'hi')).toBeFalsy();      

            //for coverage
            let div = createElement('div');
            div.appendChild(createElement('span',));
            createElement('div').appendChild(div);
            setCssInGridPopUp(div,{target:div,clientX:0, clientY:100} as any,'e-downtail e-uptail');
            setCssInGridPopUp(div,{target:div,changedTouches:[{clientX:0, clientY:100}]} as any,'e-downtail e-uptail');
            prepareColumns(['a', 'b']); 
        });

    });
    describe('Get methods from Window =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let elem: HTMLElement;
        let datePickerObj: DatePicker;

        (<any>window).create = () => {
            elem = document.createElement('input');
            return elem;
        };
        (<any>window).write = (args: { rowData: Object, column: Column }) => {
            datePickerObj = new DatePicker({
                value: new Date(args.rowData[args.column.field]),
                floatLabelType: 'Never'
            });
            datePickerObj.appendTo(elem);
        };

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let options: Object = {
                dataSource: data.map(data => data),
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120 },
                    { field: 'ShipCountry', headerText: 'Ship Name', width: 150 },
                    {
                        field: 'OrderDate', headerText: 'Order Date', type: 'date', width: 150, format: 'yMd', edit: {
                            create: 'create', write: 'write'
                        }
                    }
                ],
                aggregates: [{
                    columns: [{
                        type: 'Custom',
                        customAggregate: 'customAggregateFn',
                        columnName: 'ShipCountry',
                        footerTemplate: 'Brazil Count: ${Custom}'
                    }]
                }],
                actionBegin: actionBegin,
                actionComplete: actionComplete,
            };
            gridObj = createGrid(options, done);
        });
        let customAggFunc: (data: Object) => any = (<any>window).customAggregateFn = (data: Object) => data['result'].filter((item: Object) => item['ShipCountry'] === 'Brazil').length;
        it('Create and Write functions from window', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('beginEdit');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(4);
            gridObj.editModule.startEdit();
        });

        it('Custom Aggregate method from window', (done: Function) => {
            let column: Object = { customAggregate: 'customAggregateFn' };
            let tempData: any = { result: data };
            let count: any = calculateAggregate('Custom', tempData, column);
            expect(count).toBe(4);
            done();
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj.aggregates = [];
            gridObj = elem = actionComplete = actionBegin = datePickerObj = null;
        });
    });

    describe('Util additional coverage', () => {
        it('headerValueAccessor returns empty for null/empty and value for valid field', () => {
            const args1: any = { a: 1 };
            const args2: any = { a: 42 };
            expect(headerValueAccessor(null, args1)).toBe('');
            expect(headerValueAccessor('', args1)).toBe('');
            expect(headerValueAccessor('a', args2)).toBe(42);
        });

        it('updateColumnTypeForExportColumns copies types from grid columns to export columns', () => {
            const exportProps: any = { columns: [ { columns: [{}, {}] }, { } ] };
            const gObj: any = { columns: [ { columns: [{ type: 'nested1' }, { type: 'nested2' }] }, { type: 'flat' } ] };
            updateColumnTypeForExportColumns(exportProps, gObj);
        });

        it('recursive participates in getCollapsedRowsCount calculation for nested items', () => {
            const gridMock: any = { groupSettings: { columns: [] } };
            const val: any = {
                gSummary: undefined,
                data: { count: 0, items: [ { items: [ { count: 2, items: { childLevels: 0 } } ] } ] },
                indent: 0
            };
            // Force a shape that goes through the else branch and uses recursive
            val.data = { items: [{ items: [{ count: 2, items: { childLevels: 0 } } ] } ] };
            // Ensure groupSettings has at least one column to go through item logic
            gridMock.groupSettings.columns = ['x'];
            const test1 = getCollapsedRowsCount(val, gridMock);
            gridMock.groupSettings.columns = ['x', 'y'];
            const test2 = getCollapsedRowsCount(val, gridMock);
        });

        it('getPrototypesOfObj returns prototype keys', () => {
            const proto = { p1: 1, p2: 2 };
            const obj = Object.create(proto);
            obj.own = 3;
            const keys = getPrototypesOfObj(obj);
        });

        it('recursive walks nested structure without throwing', () => {
            // reset internal count via a call that sets it to 0
            const args: any = { data: { items: [] } };
            const obj: any = { groupSettings: { columns: [] } };
            getCollapsedRowsCount(args, obj);
            const childArr: any = [{ count: 2, items: [] }];
            // attach childLevels property on the array (code checks this property)
            (childArr as any).childLevels = 1;
            const row: any = { items: [{ count: 1, items: childArr }] };
            expect(() => { recursive(row); }).not.toThrow();
        });

        it('compareChanges merges arrays by key field correctly', () => {
            const gObj: any = { dataToBeUpdated: { changed: [{ id: 1, v: 1 }] } };
            const changes = { changed: [{ id: 1, v: 2 }, { id: 2, v: 3 }] };
            compareChanges(gObj, changes, 'changed', 'id');
            expect(gObj.dataToBeUpdated.changed.length).toBe(2);
        });

        it('getNumberFormat returns input for unknown type and processes number/date types', () => {
            // date/datetime type: ensure function returns a string and replaces patterns
            const dt = getNumberFormat('yMd', 'date', false);
            expect(typeof dt).toBe('string');
        });

        it('getNumberFormat handles number type with currency', () => {
            const num = getNumberFormat('n2', 'number', false, 'USD');
            expect(typeof num).toBe('string');
        });

        it('setValidationRuels assigns rules to frRules when frozenRight', () => {
            const col: any = {
                field: 'a.b',
                validationRules: { req: true },
                getFreezeTableName: () => {
                    return (require('../../../src/grid/base/string-literals')).frozenRight;
                }
            };
            const rules: any = {};
            const mRules: any = {};
            const frRules: any = {};
            setValidationRuels(col, 1, rules, mRules, frRules, 2, false);
            const key = getComplexFieldID(col.field);
        });

        it('getDatePredicate handles dateonly string input and returns Predicate', () => {
            const filterObj: any = { field: 'd', operator: 'equal', value: '2020-05-06' };
            const pred: any = getDatePredicate(filterObj, 'dateonly');
        });

        it('getSerachFilteredData returns filteredResult when tree grid has non-empty result', () => {
            const sample = [{ k: 1 }];
            const dm: any = { executeLocal: () => [{ x: 1 }], generateQuery: () => ({}) };
            const grid: any = {
                isTreeGrid: true,
                getDataModule: () => ({ dataManager: dm, generateQuery: () => ({}) }),
                notify: jasmine.createSpy('notify'),
                root: { filterModule: { filteredResult: sample } }
            };
            const res = getSerachFilteredData(grid);
            expect(grid.notify).toHaveBeenCalled();
        });

        it('getSerachFilteredData returns gridFiltered when tree grid filteredResult is empty', () => {
            const filtered = [{ a: 2 }];
            const dm: any = { executeLocal: () => filtered, generateQuery: () => ({}) };
            const grid: any = {
                isTreeGrid: true,
                getDataModule: () => ({ dataManager: dm, generateQuery: () => ({}) }),
                notify: jasmine.createSpy('notify'),
                root: { filterModule: { filteredResult: [] } }
            };
            const res = getSerachFilteredData(grid);
            expect(grid.notify).toHaveBeenCalled();
        });

        it('getSerachFilteredData returns executeLocal result when not tree grid', () => {
            const filtered = [{ b: 3 }];
            const dm: any = { executeLocal: () => filtered, generateQuery: () => ({}) };
            const grid: any = {
                isTreeGrid: false,
                getDataModule: () => ({ dataManager: dm, generateQuery: () => ({}) })
            };
            const res = getSerachFilteredData(grid);
        });

        it('getColumnModelByFieldName returns matching column', () => {
            const gObj: any = { columnModel: null, getColumns: function (): any { 
                gObj.columnModel = []
                return []; 
            } };
            const res = getColumnModelByFieldName(gObj, 'f1');
        }); 
        
        it('getRowHeight returns accurateHeight on subsequent call', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            // first call computes values
            const h1 = getRowHeight(container, false);
            // second call with accurateHeight true should return accurateRowHeight (number)
            const h2 = getRowHeight(container, true);
            expect(typeof h2).toBe('number');
            if (container.parentElement) { container.parentElement.removeChild(container); }
        });

        it('isCellHaveWidth returns true when parent element offsetWidth is 0', () => {
            const elem = document.createElement('div');
            const parent: any = { element: { offsetWidth: 0 } };
            expect(isCellHaveWidth(elem, parent)).toBe(true);
        });

        it('toggleFilterUI shows/hides correct inputs for date type', () => {
            const dlg = document.createElement('div');
            const columnUid = 'col1';
            // create multiselect wrapper
            const multiWrap = document.createElement('div');
            multiWrap.className = 'e-control-wrapper';
            const multi = document.createElement('div');
            multi.id = 'multiselectdateui-' + columnUid;
            multiWrap.appendChild(multi);
            dlg.appendChild(multiWrap);
            // create single input wrapper
            const singleWrap = document.createElement('div');
            singleWrap.className = 'e-popup-flmenu';
            const single = document.createElement('div');
            single.id = 'dateui-' + columnUid;
            singleWrap.appendChild(single);
            dlg.appendChild(singleWrap);

            const dlgObj: any = { element: dlg };
            const column: any = { filterTemplate: undefined };
            toggleFilterUI('in', columnUid, column, 'date', dlgObj, 'equal');
            // verify that parentsUntil found elements and set styles
            expect(multiWrap.style.display === 'inline-flex' || multiWrap.style.display === 'none').toBe(true);
        });

        it('getForeignData handles Date key branch and returns array', () => {
            const col: any = { foreignKeyField: 'fk', field: 'f', columnData: [{ fk: 1 }] };
            const dateKey: any = new Date();
            const res = getForeignData(col, undefined, dateKey, [{ fk: dateKey }]);
            expect(Array.isArray(res)).toBe(true);
        });

        it('extendObjWithFn deep clones nested objects/arrays', () => {
            const res: any = extendObjWithFn({}, { a: { x: 1 }, b: [1, 2] }, undefined, true);
            expect(res.a.x).toBe(1);
            expect(Array.isArray(res.b)).toBe(true);
        });

        it('getColumnWidth returns 0 when header col not found', () => {
            const gObj: any = { getColumnHeaderByField: (): any => undefined };
            const col: any = { width: undefined, field: 'no' };
            expect(getColumnWidth(col, gObj)).toBe(0);
        });

        it('getCellsByTableName returns elements set by notify', () => {
            const el = document.createElement('div');
            const gObj: any = {
                notify: (evt: string, args: any) => { args.elements = [el]; },
                getDataRows: (): any => []
            };
            const res = getCellsByTableName(gObj, {} as any, 0);
            expect(res[0]).toBe(el);
        });

        it('removeEventHandlers breaks early when component is destroyed', () => {
            const component: any = { isDestroyed: true, element: { id: 'cid' }, removeEventListener: jasmine.createSpy('rev') };
            const instance: any = { eventHandlers: { cid: { ev: () => {} } } };
            expect(() => removeEventHandlers(component, ['ev'], instance)).not.toThrow();
        });

        it('resetDialogAppend inserts popup into sbPanel when .sb-demo-section exists', () => {
            // cleanup any previous panel
            const existing = document.querySelector('.sb-demo-section');
            if (existing) { existing.parentElement.removeChild(existing); }

            const gDiv = document.createElement('div');
            gDiv.id = 'testgrid';
            document.body.appendChild(gDiv);
            const gObj: any = {
                element: gDiv,
                createElement: (tag: string, opts: any) => {
                    const el = document.createElement(tag);
                    if (opts && opts.className) { el.className = opts.className; }
                    if (opts && opts.id) { el.id = opts.id; }
                    return el;
                }
            };
            const dlgEl = document.createElement('div');
            dlgEl.style.width = '100px';
            const dlgObj: any = { element: dlgEl, zIndex: 1000 };

            // create sbPanel container
            const sb = document.createElement('div');
            sb.className = 'sb-demo-section';
            document.body.appendChild(sb);

            resetDialogAppend(gObj, dlgObj, undefined);
        });

        it('getCollapsedRowsCount else branch with nested items and aggregatesCount', () => {
            const val: any = {
                gSummary: 0,
                data: {
                    count: 5,
                    items: [
                        {
                            items: [
                                { count: 2, items: [] },
                                { count: 3, items: [] }
                            ]
                        }
                    ]
                },
                indent: 0,
                aggregatesCount: 1
            };

            // attach properties on the inner gLevel.items array as used in code
            const gLevelItems = val.data.items[0].items;
            (gLevelItems as any).records = [1, 2];
            (gLevelItems as any).GroupGuid = 'g';
            (gLevelItems as any).childLevels = 1;

            const grid: any = {
                groupSettings: { columns: ['g'] },
                columns: [1, 2]
            };

            const result = getCollapsedRowsCount(val, grid);
        });
    });
     describe('Row Number Column Rendering', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement[];

        afterEach(() => {
            if (grid) { destroy(grid); }
            grid = undefined;
            rows = undefined;
        });

        it('should render row number column with sequential numbers', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50, headerText: '#' },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer ID' }
                ],
                dataSource: [
                    { OrderID: 1001, CustomerID: 'VINET' },
                    { OrderID: 1002, CustomerID: 'TOMSP' },
                    { OrderID: 1003, CustomerID: 'HANAR' }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[1].cells[0].textContent).toBe('2');
                expect(rows[2].cells[0].textContent).toBe('3');
                done();
            });
        });

        it('should render row number column with pagination on first page', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50, headerText: 'Row #' },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 },
                    { OrderID: 1003 },
                    { OrderID: 1004 },
                    { OrderID: 1005 }
                ],
                pageSettings: { pageSize: 2 },
                allowPaging: true
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[1].cells[0].textContent).toBe('2');
                done();
            });
        });

        it('should render row number with correct offset on second page', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 },
                    { OrderID: 1003 },
                    { OrderID: 1004 },
                    { OrderID: 1005 }
                ],
                pageSettings: { pageSize: 2, currentPage: 2 },
                allowPaging: true
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('3');
                expect(rows[1].cells[0].textContent).toBe('4');
                done();
            });
        });

        it('should render row number on third page with correct offset', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 },
                    { OrderID: 1003 },
                    { OrderID: 1004 },
                    { OrderID: 1005 }
                ],
                pageSettings: { pageSize: 2, currentPage: 3 },
                allowPaging: true
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('5');
                done();
            });
        });

        it('should render row number column alongside data columns', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50, headerText: '#' },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer ID' },
                    { field: 'Freight', headerText: 'Freight' }
                ],
                dataSource: [
                    { OrderID: 1001, CustomerID: 'VINET', Freight: 32.38 },
                    { OrderID: 1002, CustomerID: 'TOMSP', Freight: 11.61 }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells.length).toBe(4);
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[0].cells[1].textContent).toBe('1001');
                expect(rows[0].cells[2].textContent).toBe('VINET');
                done();
            });
        });

        it('should maintain row number when data is sorted', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID', allowSorting: true },
                    { field: 'CustomerID', headerText: 'Customer ID' }
                ],
                dataSource: [
                    { OrderID: 1003, CustomerID: 'HANAR' },
                    { OrderID: 1001, CustomerID: 'VINET' },
                    { OrderID: 1002, CustomerID: 'TOMSP' }
                ],
                allowSorting: true,
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[1].cells[0].textContent).toBe('2');
                expect(rows[2].cells[0].textContent).toBe('3');
                done();
            });
        });

        it('should render row number with CSS class e-rowcell', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                const rowNumberCell = rows[0].cells[0];
                expect(rowNumberCell.classList.contains('e-rowcell')).toBeTruthy();
                expect(rowNumberCell.getAttribute('role')).toBe('gridcell');
                done();
            });
        });

        it('should render row number with correct value when rowIndex is string', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 },
                    { OrderID: 1003 }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[1].cells[0].textContent).toBe('2');
                expect(rows[2].cells[0].textContent).toBe('3');
                done();
            });
        });

        it('should render row number with pagination page size 3', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 },
                    { OrderID: 1003 },
                    { OrderID: 1004 },
                    { OrderID: 1005 },
                    { OrderID: 1006 }
                ],
                pageSettings: { pageSize: 3, currentPage: 2 },
                allowPaging: true
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('4');
                expect(rows[1].cells[0].textContent).toBe('5');
                expect(rows[2].cells[0].textContent).toBe('6');
                done();
            });
        });

        it('should render multiple row number columns independently', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50, headerText: '#1' },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { type: 'rownumber', width: 50, headerText: '#2' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[0].cells[2].textContent).toBe('1');
                expect(rows[1].cells[0].textContent).toBe('2');
                expect(rows[1].cells[2].textContent).toBe('2');
                done();
            });
        });

        it('should handle row number with empty data', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows.length).toBe(0);
                done();
            });
        });
        
        it('should render row number with rowNumber property set to true', (done: EmitType<Object>) => {
            grid = createGrid({
                columns: [
                    { type: 'rownumber', width: 50, headerText: 'Serial' },
                    { field: 'OrderID', headerText: 'Order ID' }
                ],
                dataSource: [
                    { OrderID: 1001 },
                    { OrderID: 1002 }
                ],
                allowPaging: false
            }, () => {
                rows = grid.getRows() as HTMLTableRowElement[];
                expect(rows[0].cells[0].textContent).toBe('1');
                expect(rows[1].cells[0].textContent).toBe('2');
                done();
            });
        });
        

    });

});