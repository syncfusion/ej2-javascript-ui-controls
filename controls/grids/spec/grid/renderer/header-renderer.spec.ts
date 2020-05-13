/**
 * Header renderer spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { CellType } from '../../../src/grid/base/enum';
import { createGrid, destroy } from '../base/specutil.spec';
import { HeaderCellRenderer } from '../../../src/grid/renderer/header-cell-renderer';
import { data, customerData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('header renderer module', () => {

    describe('grid header element testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
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
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

});
