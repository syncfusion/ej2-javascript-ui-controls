/**
 * Render spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { RowDataBoundEventArgs } from '../../../src/grid/base/interface';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('Render module', () => {
    describe('Grid render', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ]
                }, done);
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(data.length);
            //for coverage
            (gridObj.getColumns() as Column[])[0].type = undefined;
            (gridObj.getColumns() as Column[])[1].type = undefined;
            (gridObj.getColumns() as Column[])[2].type = undefined;
            (gridObj.getColumns() as Column[])[3].type = undefined;
            (gridObj.getColumns() as Column[])[4].type = undefined;
            (<any>gridObj.renderModule).updateColumnType({
                OrderID: new Date(2017, 2, 13, 0, 0, 0, 10),
                EmployeeID: new Date(2017, 2, 13, 0, 0, 10, 0), CustomerID: new Date(2017, 2, 13, 0, 10, 0, 0),
                ShipCity: new Date(2017, 2, 13, 10, 0, 0, 0), ShipCountry: new Date(2017, 2, 13, 0, 0, 0, 0), OrderDate: new Date(2017, 2, 13, 0, 10, 0, 10)
            });
            (<any>gridObj.renderModule).data.removeRows({ indexes: [4, 5], records: data.slice(4, 5)  });
            gridObj.ariaService.setOptions(null, { role: 'grid' });
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('Grid render without columns testing', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false
                }, done);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(gridObj.getColumns().length);
        });

        it('Content cell count testing', () => {
            let cols = gridObj.getColumns();
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(cols.length);
            cols = [];
            (<any>gridObj.renderModule).dataManagerSuccess({ result: {}, count: 0 });//for coverage
			gridObj.isDestroyed = true;
			(<any>gridObj.renderModule).addEventListener();
			gridObj.isDestroyed = false;
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });


    describe('Column type testing with empty data source', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [], allowPaging: false,
                    columns: [
                        { field: 'Column1', type: 'string' },
                        { field: 'Column2' }
                    ]
                }, done);
        });

        it('Column type testing', () => {
            expect((<Column>gridObj.columns[0]).type).toBe('string');
            expect((<Column>gridObj.columns[1]).type).toBeNull();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Row height checking', () => {
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
                    { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                ],
                rowHeight: 50,
                rowDataBound: (args: RowDataBoundEventArgs) => {
                    if ((args.data as Customer).CustomerID === 'VICTE' ) {
                        args.rowHeight = 80;
                    }
                }
            }, done);
    });

    it('Row height API checking  checking', () => {
        expect((gridObj.element.querySelectorAll('.e-row')[0] as HTMLElement).style.height).toBe('50px');
    });
    
    it('Row height on property change checking', () => {
        gridObj.rowHeight = 20;
        gridObj.dataBind();
        expect((gridObj.element.classList.contains('e-grid-min-height'))).toBeTruthy();
        gridObj.rowHeight = null;
        gridObj.dataBind();
        expect((gridObj.element.classList.contains('e-grid-min-height'))).toBeFalsy();
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
        destroy(gridObj);
    });
});
});
interface Customer {
    CustomerID: string;
}