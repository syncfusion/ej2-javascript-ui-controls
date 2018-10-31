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
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('header renderer module', () => {

    describe('grid header element testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
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
            (<any>gridObj).headerModule.helper(eve);

        });

        afterAll(() => {
            destroy(gridObj);
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
            destroy(gridObj)
        });
    });

});
