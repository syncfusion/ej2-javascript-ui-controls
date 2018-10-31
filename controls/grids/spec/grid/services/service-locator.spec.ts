/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';

describe('ServiceLocator module', () => {
    let servFunc: Function = () => {
        return 'hi';
    };
    describe('Register and get service', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
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

        afterAll(() => {
           destroy(gridObj);
        });
    });

});