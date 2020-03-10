/**
 * Grid clipMode spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Resize } from '../../../src/grid/actions/resize';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Resize, Reorder, Toolbar);

describe('ClipMode module', () => {

    describe('clipMode testing', () => {
        let gridObj: Grid;
        let row: any;
        let td: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', clipMode: 'Clip' },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: 'Ellipsis' },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order', clipMode: 'EllipsisWithTooltip' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });

        it('Class testing', () => {
            row = [gridObj.contentModule.getTable().children['1'].children];
            row.forEach((element: HTMLElement) => {
                td = element[0].children;
                for (let i: number = 0; i < td.length; i++) {
                    if (gridObj.getColumns()[i].clipMode === 'Clip') {
                        expect(td[i].classList.contains('e-gridclip')).toBeTruthy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeFalsy();
                    } else if (gridObj.getColumns()[i].clipMode === 'Ellipsis') {
                        expect(td[i].classList.contains('e-gridclip')).toBeFalsy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeFalsy();
                    } else if (gridObj.getColumns()[i].clipMode === 'EllipsisWithTooltip') {
                        expect(td[i].classList.contains('e-gridclip')).toBeFalsy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeTruthy();
                    }
                }
            });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = row = td = null;
        });
    });

    describe('clipmode with Resizing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', clipMode: 'Clip' },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: 'Ellipsis' },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order', clipMode: 'EllipsisWithTooltip' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });

        it('Class testing', () => {
            gridObj.autoFitColumns([]);
            let td: NodeListOf<Element> = gridObj.element.querySelectorAll('e-rowcell');
            let td1: Element[] = [];
            for (let i: number = 0; i < td.length; i++) {
                td1[i] = td[i].cloneNode(true) as Element;
            }
            td1.forEach((ele: HTMLElement) => {
                expect(ele.classList.contains('e-tooltip')).toBeFalsy();
            });
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
            gridObj = null;
        });
    });

    describe('EJ2-36833 Checkbox column has empty tooltips when grid level clipMode is EllipsisWithTooltip', () => {
        let gridObj: Grid;
        let row: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    clipMode: 'EllipsisWithTooltip',
                    columns: [
                        { type: 'checkbox', width: 30 },
                        { headerText: 'OrderID', field: 'OrderID'},
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });

        it('Checkbox class testing', () => {
            row = [gridObj.contentModule.getTable().children['1'].children];
            expect(row[0][0].cells[0].classList.contains('e-ellipsistooltip')).toBeFalsy();
            expect(row[0][1].cells[0].classList.contains('e-ellipsistooltip')).toBeFalsy();
            expect(row[0][2].cells[0].classList.contains('e-ellipsistooltip')).toBeFalsy();
            expect((gridObj.getHeaderTable().querySelector('.e-columnheader').children[0]).classList.contains("e-ellipsistooltip")).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});