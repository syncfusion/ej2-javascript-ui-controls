/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { ICellRenderer } from '../../../src/grid/base/interface';
import { Cell } from '../../../src/grid/models/cell';
import { CellRendererFactory } from '../../../src/grid/services/cell-render-factory';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('CellRendererFactory module', () => {
    describe('Register and get service', () => {
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
                    ]
                }, done);
        });

        it('Check fallback', () => {
            expect(() => gridObj.serviceLocator.getService<CellRendererFactory>('cellRendererFactory')
                .getCellRenderer('hi')).toThrow('The cellRenderer hi is not found');
        });

        it('Check string register', () => {
            class CellMock implements ICellRenderer<{}> {
                public render(cell: Cell<{}>, data: Object, attributes?: { [x: string]: string }): Element {
                    return createElement('td');
                }
            }

            class DupCellMock extends CellMock { }
            let factory: CellRendererFactory = gridObj.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
            factory.addCellRenderer('hi', new CellMock);
            factory.addCellRenderer('hi', new DupCellMock);
            expect('hi' in factory.cellRenderMap).toBeTruthy();
            expect(factory.getCellRenderer('hi') instanceof CellMock).toBeTruthy();
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