/**
 * Grid base spec 
 */
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Freeze } from '../../../src/grid/actions/freeze';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Page, Freeze);

describe('auto wrap testing', () => {
    describe('auto wrap properties', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
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
                    ],
                    allowTextWrap: true,
                    textWrapSettings: { wrapMode: 'Header' },
                    actionComplete: actionComplete,
                }, done);
        });

        it('class testing for header', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeTruthy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        it('class testing for content', () => {
            gridObj.textWrapSettings.wrapMode = 'Content';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeTruthy();
        });
        it('class testing for both', () => {
            gridObj.textWrapSettings.wrapMode = 'Both';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeTruthy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        it('class testing for auto wrap property as false', () => {
            gridObj.allowTextWrap = false;
            gridObj.textWrapSettings.wrapMode = 'Both';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
    describe('auto wrap properties for stacked headercolumns', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [{
                        headerText: 'Detail of the order', columns: [{ headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                        ]
                    },
                    {
                        headerText: 'Details of shipping', columns: [{ headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' }]
                    }
                    ],
                    allowTextWrap: true,
                    textWrapSettings: { wrapMode: 'Header' },
                    actionComplete: actionComplete,
                }, done);
        });

        it('class testing for header in stackedheadercolumns', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            let headerRows: Element[] = [].slice.call(gridObj.element.querySelectorAll('.e-columnheader'));
            for (let i: number = 0; i < headerRows.length; i++) {
                expect(headerRows[i].classList.contains('e-wrap')).toBeTruthy();
            }
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
    describe('auto wrap properties for GroupedColumns', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [{
                        headerText: 'Detail of the order', columns: [{ headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                        ]
                    },
                    {
                        headerText: 'Details of shipping', columns: [{ headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' }]
                    }
                    ],
                    allowTextWrap: true,
                    textWrapSettings: { wrapMode: 'Header' },
                    actionComplete: actionComplete,
                }, done);
        });
        it('class testing for header with GroupedColumns', () => {
            gridObj.allowGrouping = true;
            gridObj.groupSettings.columns = ['CustomerID'];
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            let headerRows: Element[] = [].slice.call(gridObj.element.querySelectorAll('.e-columnheader'));
            for (let i: number = 0; i < headerRows.length; i++) {
                expect(headerRows[i].classList.contains('e-wrap')).toBeTruthy();
            }
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
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
            gridObj = actionComplete = null;
        });
    });

//     describe('Auto wrap with Freeze', () => {
//         let gridObj: Grid;
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//                 {
//                     dataSource: data,
//                     frozenColumns: 2,
//                     frozenRows: 2,
//                     columns: [{ field: 'OrderID', width: 100, headerText: 'Order IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD' },
//                     { field: 'CustomerID', width: 100, headerText: 'Customer ID' },
//                     { field: 'EmployeeID', width: 100, headerText: 'Employee ID' },
//                     { field: 'ShipName', width: 100, headerText: 'Ship Name' },
//                     { field: 'ShipAddress', width: 100, headerText: 'Ship Address' },
//                     { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
//                     { field: 'Freight', width: 110, format: 'C2', headerText: 'Freight' },
//                     { field: 'ShipCountry', width: 130, headerText: 'Ship Country' },
//                     { field: 'Verified', headerText: 'Verified', width: 190 }
//                     ],
//                     allowTextWrap: true,
//                     textWrapSettings: { wrapMode: 'Header' },
//                 }, done);
//         });

//         it('comparing height', () => {
//             let fHdrTr: HTMLElement = gridObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('tr');
//             let mHdrTr: HTMLElement = gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tr');
//             let fHdrContTr: HTMLElement = gridObj.getHeaderContent()
//                 .querySelector('.e-frozenheader').querySelector('tbody').querySelector('tr');
//             let mHdrContTr: HTMLElement = gridObj.getHeaderContent()
//                 .querySelector('.e-movableheader').querySelector('tbody').querySelector('tr');
//             let fContTr: HTMLElement = gridObj.getContent().querySelector('.e-frozencontent').querySelector('tr');
//             let mContTr: HTMLElement = gridObj.getContent().querySelector('.e-movablecontent').querySelector('tr');
//             gridObj.textWrapSettings.wrapMode = 'Both';
//             gridObj.dataBind();
//             expect(fHdrTr.offsetHeight).toBe(mHdrTr.offsetHeight);
//             expect(fHdrContTr.offsetHeight).toBe(mHdrContTr.offsetHeight);
//             expect(fContTr.offsetHeight).toBe(mContTr.offsetHeight);
//             gridObj.textWrapSettings.wrapMode = 'Header';
//             gridObj.dataBind();
//             expect(fHdrTr.offsetHeight).toBe(mHdrTr.offsetHeight);
//             expect(fHdrContTr.offsetHeight).toBe(mHdrContTr.offsetHeight);
//             expect(fContTr.offsetHeight).toBe(mContTr.offsetHeight);
//             gridObj.textWrapSettings.wrapMode = 'Content';
//             gridObj.dataBind();
//             expect(fHdrTr.offsetHeight).toBe(mHdrTr.offsetHeight);
//             expect(fHdrContTr.offsetHeight).toBe(mHdrContTr.offsetHeight);
//             expect(fContTr.offsetHeight).toBe(mContTr.offsetHeight);
//             expect((gridObj.getHeaderContent().firstChild as Element).classList.contains('e-wrap')).toBeTruthy();
//             gridObj.allowTextWrap = false;
//             gridObj.dataBind();
//             expect(fHdrTr.offsetHeight).toBe(mHdrTr.offsetHeight);
//             expect(fHdrContTr.offsetHeight).toBe(mHdrContTr.offsetHeight);
//             expect(fContTr.offsetHeight).toBe(mContTr.offsetHeight);
//         });

//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });

describe('EJ2-42308: Resize handler height with auto wrap', () => {
    let gridObj: Grid;
    let actionComplete: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data, allowPaging: false,
                width:500,
                allowResizing: true,
                allowTextWrap: true,
                textWrapSettings: { wrapMode: 'Header' },
                columns: [{ field: 'OrderID', headerText: 'OrderID', width: 140 },
                { field: 'About', headerText: 'About', width: 140, maxWidth: 300, minWidth: 200 },
                { field: 'EmployeeID', headerText: 'Employee details example for checking the resize handlers', width: 130 },
                { field: 'Freight', headerText: 'Freight', width: 150, allowResizing: false },
                { field: 'ShipCity', headerText: 'ShipCity', width: 150 }
                ]
            }, done);
    });

    it('checking the resize handlers height', () => {
        expect((gridObj.element.querySelector('.e-rhandler') as HTMLElement).style.height).toBe(
            gridObj.getHeaderTable().querySelector('tr').offsetHeight + 'px');
    });
    it('checking the resize handlers height after dynamically disabling the textWrap property', () => {
        gridObj.allowTextWrap = false;
        expect((gridObj.element.querySelector('.e-rhandler') as HTMLElement).style.height).toBe(
            gridObj.getHeaderTable().querySelector('tr').offsetHeight + 'px');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});

});