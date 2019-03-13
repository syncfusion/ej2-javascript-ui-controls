/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('ServiceLocator module', () => {
    let servFunc: Function = () => {
        return 'hi';
    };
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
            gridObj.serviceLocator.register('servFunc', servFunc);
        });

        it('Register and getService testing', () => {
            let fn: Function = gridObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Register and getService testing', () => {
            gridObj.serviceLocator.register('servFunc', servFunc);
            let fn: Function = gridObj.serviceLocator.getService<Function>('servFunc');
            expect(fn()).toBe('hi');
        });

        it('Check fallback', () => {
            expect(() => gridObj.serviceLocator.getService<Function>('mock')).toThrow('The service mock is not registered');
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