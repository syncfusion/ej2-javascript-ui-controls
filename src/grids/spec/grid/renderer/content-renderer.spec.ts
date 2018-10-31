/**
 * Content renderer spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';

describe('Content renderer module', () => {

    describe('grid content element testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false, enableAltRow: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Content div testing', () => {
            expect(gridObj.element.querySelectorAll('.e-gridcontent').length).toBe(1);
        });

        it('Content table testing', () => {
            expect(gridObj.contentModule.getPanel().querySelectorAll('.e-table').length).toBe(1);
        });

        it('Content cell count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(gridObj.getColumns().length);
        });

        it('getRows', () => {
            expect(gridObj.contentModule.getRows().length).toBe(5);
            //for coverage 
            (<any>gridObj.contentModule).setColGroup(undefined);
            (<any>gridObj.contentModule).colGroupRefresh();
        });
        afterAll(() => {
            destroy(gridObj);
        });

    });

});