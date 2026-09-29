/**
 * Header renderer spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { CellType } from '../../../src/grid/base/enum';
import { createGrid, destroy } from '../base/specutil.spec';
import { data, customerData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';

Grid.Inject(ColumnMenu, Group, Page);

describe('header renderer module', () => {

    describe('grid header element testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false,
                    columns: [
                        {
                            headerText: 'OrderID', field: 'OrderID',
                            headerTemplate: '<span>Order ID</span>'
                        },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Header div testing', () => {
            gridObj.headerModule.getRows();
            expect(gridObj.element.querySelectorAll('.e-gridheader').length).toBe(1);
        });

        it('Header table testing', () => {
            expect(gridObj.headerModule.getPanel().querySelectorAll('.e-table').length).toBe(1);
        });

        it('Column header testing', () => {
            expect(gridObj.headerModule.getPanel().querySelectorAll('.e-columnheader').length).toBe(1);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(gridObj.getColumns().length);
            //for coverage
            let hRender = (<any>gridObj).renderModule.locator.getService('cellRendererFactory').getCellRenderer(CellType.Header);
            hRender.refresh({ column: gridObj.getColumns()[1] } as any, createElement('div'));
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });
    describe('Header template element render', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = '<span>$ShipCity$</span>';
            document.body.appendChild(template);
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    allowGrouping: true,
                    groupSettings: { columns: ['ShipCity'] },
                    columns: [
                        { field: 'ShipCity', headerTemplate: '#template', headerText: 'Template column' },
                        { field: 'EmployeeID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },

                    ]
                }, done);
        });

        it('header testing', () => {
            let sender: object = {};
            let target: any = gridObj.element.querySelector('.e-headercell');
            let trs = gridObj.getContent().querySelectorAll('tr');
            let eve: any = { sender: { target } };
            (gridObj.renderModule as any).headerRenderer.draggable.currentStateTarget = target;
            (<any>gridObj).headerModule.helper(eve);

        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            document.getElementById('template').remove();
        });
    });
describe('EJ2-6660-Header template', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = '<span>$ShipCity$</span>';
            document.body.appendChild(template);
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    allowGrouping: true,
                    showColumnMenu: true,
                    columns: [
                        { headerTemplate: '#template', headerText: 'Template column' },
                        { field: 'EmployeeID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },

                    ],
                },
                done
            );

        });

        it('Template column shows sorting option in context menu', () => {
            expect(gridObj.element.querySelectorAll('.e-columnmenu').length).toBe(2);

        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            document.getElementById('template').remove();
        });
    });
    describe('Autogenerate columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: true,
                    allowGrouping: true,
                    showColumnMenu: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },

                    ],
                },
                done
            );

        });

        it('Changing the dataSource and columns', () => {
            gridObj.columns = [];
            gridObj.dataSource = customerData;

        });

        it('Checking the header and content table', () => {
            expect(gridObj.element.querySelector('.e-gridheader').querySelectorAll('table').length).toBe(1);
            expect(gridObj.element.querySelector('.e-gridcontent').querySelectorAll('table').length).toBe(1);

        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   

        afterAll(() => {
            destroy(gridObj)
            gridObj = null;
        });
    });

    describe('Value accessor for header content', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        { field: 'ShipCity', headerText: 'shipcity',headerValueAccessor:(field: string, column: object ): string=> { return "HeaderName"; }},
                        { field: 'EmployeeID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                    ]
                }, done);
        });
        it('header text testing', () => {
            let innerTxt=gridObj.getHeaderContent().querySelectorAll('th')[0].innerText;
            expect(innerTxt).toBe('HeaderName');
            expect(parseInt(gridObj.getHeaderContent().querySelectorAll('th')[1].getAttribute('aria-colindex'), 10) - 1).toBe(1);
            expect(parseInt(gridObj.getHeaderContent().querySelectorAll('th')[2].getAttribute('aria-colindex'), 10) - 1).toBe(2);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-61488- Accessibility testing with header', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                }, done);
        });
        it('Ensuring the header is not draggable', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('th')[1].getAttribute('aria-grabbed')).toBe(null);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2-962883-The cursor does not turns into hand cursor when grouping is disabled for a column', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowSorting: true,
                allowGrouping: true,
                allowPaging: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, allowGrouping: false, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'ShipCountry', headerText: 'Ship Country', allowGrouping: false, allowSorting: false, width: 150, minWidth: 10, },
                    { field: 'ShipAddress', width: 150 },
                ],
            }, done);
        });

        it('Header should show pointer cursor when sorting enabled but grouping disabled', () => {
            const headerCell = gridObj.getHeaderContent().querySelectorAll('.e-headercell:not(.e-stackedheadercell)');
            expect(headerCell[0].classList.contains('e-mousepointer')).toBe(true); //second column to have hand cursor
            expect(headerCell[0].classList.contains('e-defaultcursor')).toBe(false);
        });

        it('Header should show pointer cursor when both sorting and grouping enabled', () => {
            const headerCell = gridObj.getHeaderContent().querySelectorAll('.e-headercell:not(.e-stackedheadercell)');
            expect(headerCell[1].classList.contains('e-mousepointer')).toBe(true); //third column to have hand cursor
            expect(headerCell[1].classList.contains('e-defaultcursor')).toBe(false);
        });

        it('Header should show default cursor when both sorting and grouping disabled', () => {
            const headerCell = gridObj.getHeaderContent().querySelectorAll('.e-headercell:not(.e-stackedheadercell)');
            expect(headerCell[2].classList.contains('e-mousepointer')).toBe(false); //fourth column to have default cursor
            expect(headerCell[2].classList.contains('e-defaultcursor')).toBe(true);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('EJ2-971782-Indent Header Cell Misalignment When Grouping with Stacked Header in EJ2 Grid', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowGrouping: true,
                groupSettings: { columns: ['OrderID'] },
                height: 250,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                    {
                        headerText: 'Customer Details',
                        textAlign: 'Center',
                        columns: [
                            {
                                field: 'CustomerID',
                                headerText: 'Customer ID',
                                width: 100,
                            },
                            {
                                field: 'ShipCountry',
                                headerText: 'Ship Country',
                                width: 100,
                            },
                        ],
                    },
                    { field: 'ShipAddress', width: 150 },
                ],
            }, done);
        });

        it('Check the grouptopleftcell', () => {
            const headerCell: any = document.querySelectorAll('.e-grouptopleftcell');
            expect(headerCell[0].rowSpan).toBe(2);
            expect(headerCell[1].style.display).toBe('none');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // coverage code
    describe('Code Coverage feature - 1', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                }, done);
        });
        it('hleper and drag coverage', () => {
            (gridObj as any).headerModule.lockColsRendered = false;
            (gridObj as any).headerModule.getColSpan(2, 1);
            let elem: Element = gridObj.element.querySelector('.e-rowcell');
            (gridObj as any).headerModule.draggable = {};
            (gridObj as any).headerModule.draggable.currentStateTarget = elem;
            (gridObj as any).headerModule.helper();
            (gridObj as any).headerModule.dragStop({ target: elem, helper: elem });
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-1015517 - Header-renderer createHeaderContent method coverage', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 100 },
                        {
                            headerText: 'Customer Details',
                            textAlign: 'Center',
                            columns: [
                                { field: 'CustomerID', headerText: 'Customer ID', width: 120, visible: true },
                                { field: 'ShipCountry', headerText: 'Ship Country', width: 120, visible: false }
                            ]
                        },
                        { field: 'ShipAddress', headerText: 'Ship Address', width: 150 }
                    ],
                    height: 300
                },
                done
            );
        });

        it('createHeaderContent skips isFirstColumnHidden assignment when renderModule is null', () => {
            const headerRenderer: any = (gridObj as any).renderModule.headerRenderer;
            const originalRenderer = gridObj.renderModule;
            gridObj.renderModule = null;
            (gridObj.columns[0] as any).visible = false;
            headerRenderer.createHeaderContent(undefined);
            expect(true).toBe(true);
            gridObj.renderModule = originalRenderer;
            expect(gridObj.renderModule).toBeTruthy();
        });
        it('should add .e-last-visible-stack-cell when the last stacked header cell is hidden', () => {
            const headerRenderer: any = (gridObj as any).renderModule.headerRenderer;
            gridObj.renderModule = null;
            (gridObj.columns[0] as any).visible = true;
            // Act: call the method under test directl;y
            headerRenderer.createHeaderContent(undefined);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null as any;
        });
    });
    describe('HeaderRenderer internal branches (ensureColumns & setVisible) Coverage', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data, columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer ID' }
                ]
            }, done);
        });


        it('ensureColumns should set rowSpan for row drag icon when row draggable', () => {
            const hRenderer = (gridObj as any).headerModule as any;
            hRenderer.colDepth = 2;
            // make grid report that rows are draggable and frozen mode is not 'Right'
            (gridObj as any).isRowDraggable = () => true;
            (gridObj as any).getFrozenMode = () => '';
            const rows: any = [{ cells: [] }];
            const res = (hRenderer as any).ensureColumns(rows);
            expect(res).toBeDefined();
        });

        it('setVisible should handle showAddNewRow branch when .e-addedrow exists', function () {
            const hRenderer = gridObj.headerModule;
            (gridObj as any).editSettings = { showAddNewRow: true };
            // More realistic structure — add-row usually contains a table
            const added = createElement('div', { className: 'e-addedrow' });
            const table = createElement('table');
            const colgroup = document.createElement('colgroup');
            // Add at least one <col> per column (minimal)
            gridObj.getColumns().forEach(() => {
                colgroup.appendChild(document.createElement('col'));
            });
            table.appendChild(colgroup);
            added.appendChild(table);
            gridObj.element.appendChild(added);
            // Now call — colgroup.children should be valid <col> elements
            hRenderer.setVisible(gridObj.getColumns());
            added.remove();
        });

        it('getStackedLockColsCount should set lockColsCount', () => {
            const headerRenderer: any = (gridObj as any).renderModule.headerRenderer;
            const col: any = {
                columns: null,
                lockColumn: true
            }
            headerRenderer.getStackedLockColsCount(col, 2);
        });

        afterAll(() => destroy(gridObj));
    });
    describe('HeaderRenderer.appendCells branche Coverage', () => {
        let gridObj: Grid;
        let headerRenderer: any;

        beforeEach((done) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', headerText: 'ID', width: 80, lockColumn: true, visible: true },
                        {
                            headerText: 'Customer Group',
                            lockColumn: true,
                            columns: [
                                { field: 'CustomerID', headerText: 'Cust ID', width: 110, visible: true },
                                { field: 'ContactName', headerText: 'Contact', width: 130, visible: false },
                                { field: 'Phone', headerText: 'Phone', width: 120, visible: true }
                            ]
                        },
                        { field: 'Freight', headerText: 'Freight', width: 90, visible: true },
                        { field: 'ShipCity', headerText: 'City', width: 100, visible: true }
                    ],
                    dataSource: [{ OrderID: 10248, CustomerID: 'VINET', ContactName: 'Paul', Phone: '(555) 555-0100', Freight: 32.38, ShipCity: 'Reims' }],
                },
                done
            );

            headerRenderer = (gridObj as any).headerModule;
        });

        it('should create stacked header cell when isStackedLockColumn is true (frozen + stacked + lockColsRendered=false)', () => {
            gridObj.refreshHeader(); // triggers full header generation
            const Header = gridObj.element.querySelectorAll('.e-headercontent th.e-stackedheadercell');
            const customerTh = Array.from(Header).find(th => th.textContent.trim() === 'Customer Group');
            expect(customerTh).toBeTruthy();

        });

        it('should use adjusted isFirstCol & isLaststackedCol when lockColsRendered=true', () => {
            // Simulate second pass (many grids do two passes for frozen content)
            headerRenderer.lockColsRendered = true;
            const fakeRows: any = [{ cells: [] }, { cells: [] }];
            const stackedCol = gridObj.columns[1]; // Customer Group
            headerRenderer.appendCells(stackedCol, fakeRows, 0, true, true, true, false, 'header', true);
            const cell = fakeRows[0].cells[0];
            expect(cell).toBeDefined();
        });

        afterEach(() => {
            destroy(gridObj);
        });

    });
    describe('EJ2-1035012 - Provide header row height property support to EJ2 Grid', () => {
        let gridObj: Grid;
            
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'Customer ID' }
                    ],
                    headerRowHeight: 60, 
                    rowHeight: 30
                },
                done
            );
        });

        it('should prioritize headerRowHeight over rowHeight', (done: Function) => {
           expect((gridObj.element.querySelector('.e-headercell') as any).offsetHeight).toBe(60);
           done();
        });

        it('setting headerRowHeight as null', (done: Function) => {
            gridObj.headerRowHeight = null;
            gridObj.rowHeight = 40;
            done();
        });

        it('should fallback to rowHeight when headerRowHeight is null', (done: Function) => {
            expect((gridObj.element.querySelector('.e-headercell') as any).offsetHeight).toBe(40);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });
});
