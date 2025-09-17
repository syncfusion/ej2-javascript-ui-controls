/**
 * Grid Paging spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { PageEventArgs } from '../../../src/grid/base/interface';
import { Page } from '../../../src/grid/actions/page';
import { Sort } from '../../../src/grid/actions/sort';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { rowsAdded } from '../../../src';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';

Grid.Inject(Page, Sort, Edit, Toolbar);

describe('Paging module', () => {
    describe('Paging functionalities', () => {
        let gridObj: Grid;
        let actionBegin: (e: PageEventArgs) => void;
        let actionComplete: (e: PageEventArgs) => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 15),
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10
                    },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });
        it('page size testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
        });
        it('current page testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('data-index')).toBe('2');
        });
        it('page count testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes.length).toBe(4);
        });
        it('totalRecordsCount testing', () => {
            expect(gridObj.pageSettings.totalRecordsCount).toBe(15);
        });
        it('querystring testing', () => {
            gridObj.goToPage(3);
            // expect(window.location.href.indexOf('?page=3')).toBeGreaterThan(-1);
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(1);
        });
        it('navigate page', (done: Function) => {
            let row: string = JSON.stringify(gridObj.currentViewData[0]);
            actionComplete = (args: PageEventArgs): void => {
                //expect(row).not.toBe(JSON.stringify(gridObj.currentViewData[0]));
                expect(1).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[0].childNodes[0] as HTMLElement).click();
        });
        it('pageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('2');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.element.focus();
            let args: any = { action: 'pageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('pageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'pageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('ctrlAltPageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('8');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'ctrlAltPageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('ctrlAltPageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'ctrlAltPageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('altPageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('5');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'altPageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('altPageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toBe('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'altPageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('updateExternalmessage method false testing', () => {
            gridObj.updateExternalMessage('extmsg');
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toBe('extmsg');
        });

        it('updateExternalmessage method true testing', () => {
            gridObj.updateExternalMessage('extmsg1');
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toBe('extmsg1');
        });

        it('current page onproperty changed testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('data-index')).toBe('4');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 4;
            gridObj.dataBind();

        });

        //set model and default properties model check

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Disabled paging', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: false,
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10
                    },
                }, done);
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(0);
        });
        it('allowpaging true setmodel testing', () => {
            gridObj.allowPaging = true;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(1);
        });
        it('allowpaging false setmodel testing', () => {
            gridObj.allowPaging = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(0);
        });
        it('allowpaging true setmodel testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(1);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.allowPaging = true;
            gridObj.dataBind();
        });
        //set model and default properties model check

        it('change pageCount', () => {
            gridObj.pageSettings.pageCount = 3;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-link.e-numericitem.e-spacing.e-pager-default').length).toBe(3);
        });
        // //check query string
        // it('Check enableQueryString', (done: Function) => {
        //     let actionComplete = (args?: Object): void => {
        //         expect(document.location.href).toMatch('page=1');
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.pageSettings.currentPage = 1;
        //     gridObj.dataBind();

        // });
        //set model and default properties model check

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('paging without pageSettings', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    allowSorting: true,
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toBe(1);
            gridObj.pageSettings = { currentPage: 3 };
            gridObj.dataBind();
            gridObj.pagerModule.refresh();

            //for coverage
            gridObj.getContent().firstElementChild.scrollTop = 10;
            let args: any = { action: 'pageDown', preventDefault: () => { } };
            gridObj.keyboardModule.keyAction(args);
        });
        //set model and default properties model check

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('dropDownEvent test', () => {
        let gridObj: Grid;
        let dropDownChanged: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    allowSorting: true,
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: {
                        currentPage: 2, pageCount: 4,
                        pageSizes: [10, 20, 30, 40]
                    },
                }, done);
        });
        it('dropDownChanged event testing', () => {
            expect(gridObj.pageSettings.pageSize).toEqual(12);
            expect(gridObj.pageSettings.currentPage).toBe(2);
        });
        it('pagesizes value changed to 30 and check currentpage', (done: Function) => {
            dropDownChanged = (args?: any): void => {
                expect(gridObj.pageSettings.pageSize).toEqual(30);
                expect(gridObj.pageSettings.currentPage).toEqual(1);
                done();
            };
            gridObj.dataBound = dropDownChanged;
            (<any>gridObj.pagerModule).pagerObj.element.querySelector('.e-dropdownlist').ej2_instances[0].value = 30;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = dropDownChanged = null;
        });
    });

    describe('pagerTemplate test', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    allowSorting: true,
                    pagerTemplate: '<span class ="e-pagenomsg">${currentPage} of ${totalPages} pages</span>',
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });
        it('check pagesettings template property', () => {
            expect(gridObj.pageSettings.template.length).toBeGreaterThan(0);
        });

        afterAll(() => {
            remove(document.getElementsByClassName('e-pagertemplate')[0]);
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Paging & Scrolling - PageDown case', () => {
        let grid: Grid;
        let content: HTMLElement;
        let raiseEvt: Function = (code: number) => {
            let p: Object = { '34': 'pageDown', '33': 'pageUp' };
            (<any>grid.keyboardModule).keyAction({ action: p[code + ''], preventDefault: () => 0 });
        };


        describe('pageDown case', () => {
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                    }, done);
                content = (<HTMLElement>grid.getContent().firstChild);
            });

            it('pageDown check - no page trigger', () => {
                content.focus();
                raiseEvt(34, grid);
                // expect(grid.pageSettings.currentPage).toBe(1);
            });

            it('pageDown check - page trigger', () => {
                content.scrollTop = (content.scrollHeight - content.clientHeight) + 1;
                raiseEvt(34);
                //  expect(grid.pageSettings.currentPage).toBe(2);
            });

            afterAll(() => {
                destroy(grid);
            });
        });
        describe('pageUp case', () => {
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                    }, done);
                content = (<HTMLElement>grid.getContent().firstChild);
            });

            it('pageUp check - no page trigger', () => {
                content.focus();
                grid.goToPage(2);
                content.scrollTop = 10;
                raiseEvt(33, grid);
                //  expect(grid.pageSettings.currentPage).toBe(2);
            });

            it('pageUp check - page trigger', () => {
                content.scrollTop = 0;
                raiseEvt(33, grid);
                //  expect(grid.pageSettings.currentPage).toBe(1);
            });

            afterAll((done) => {
                destroy(grid);
                grid = content = raiseEvt = null;
            });
        });

        // describe('EJ2-9569 Pagesize dropdown value is not refreshed while dynamically change the pagesize test', () => {
        //     let gridObj: Grid;
        //     let actionComplete: () => void;
        //     beforeAll((done: Function) => {
        //         gridObj = createGrid(
        //             {
        //                 allowPaging: true,
        //                 dataSource: data,
        //                 allowSorting: true,
        //                 height: 300,
        //                 actionComplete: actionComplete,
        //                 columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
        //                 { field: 'ShipCity' }],
        //                 pageSettings: {
        //                     currentPage: 2, pageCount: 4,
        //                     totalRecordsCount: 10, enableQueryString: true, pageSizes: [10, 20, 30, 40]
        //                 },
        //             }, done);
        //     });
        //     it('EJ2-9569 Pagesize dropdown value is not refreshed while dynamically change the pagesize test', (done: Function) => {

        //         actionComplete = (args?: Object): void => {
        //             expect((<any>gridObj.pagerModule).pagerObj.pagerdropdownModule.dropDownListObject.value).toEqual(20);
        //             done();
        //         };
        //         gridObj.actionComplete = actionComplete;
        //         gridObj.pageSettings.pageSize = 20;
        //     });

        //     afterAll(() => {
        //         destroy(gridObj);
        //     });
        // });
    });
    describe('EJ2-9910 dropDown  option check', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: { pageSizes: ['2', '8', '12', '32'], pageCount: 3, pageSize: 2 },
                }, done);
        });
        it('check current pageSize value', (done: Function) => {
            let actionComplete = (args?: any): void => {
                expect(gridObj.pageSettings.pageSize).toBe(8);
                expect(gridObj.pageSettings.currentPage).toBe(1);
                done();
            };
            gridObj.pageSettings.currentPage = 8;
            (<any>gridObj.pagerModule).pagerObj.element.querySelector('.e-dropdownlist').ej2_instances[0].value = '8';
            gridObj.actionComplete = actionComplete;
           
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

 
    describe('EJ2-9910 dropDown All option', () => {
        let gridInstance: Grid;
        beforeAll((done: Function) => {
            gridInstance = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: {
                        pageSizes: true
                    },
                }, done);
        });
        it('dropDownChanged to All', () => {
            (<any>gridInstance.pagerModule).pagerObj.element.querySelector('.e-dropdownlist').ej2_instances[0].value = 'All';
        });
        it('check isAllPage value', () => {
            expect(gridInstance.pagerModule.pagerObj.isAllPage).toBeTruthy();
        });
        it('EJ2-57784 - check pagesize value when set to `All` ', () => {
            expect(gridInstance.pageSettings.pageSize).toBe(gridInstance.pageSettings.totalRecordsCount);
        });
        // it('check current pageSize value', (done: Function) => {
        //     let actionComplete = (args?: any): void => {
        //         expect(gridInstance.getRows().length).toBe(15);
        //         done();
        //     };
        //     gridInstance.actionComplete = actionComplete;
           
        // });
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
            destroy(gridInstance);
            gridInstance = null;
        });
    });

    describe('EJ2-31442 Pager Template refresh issue  =>', () => {
        let gridObj: Grid;
        let count: number = 0;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { count++; done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowPaging: true,
                    pagerTemplate: '<span class ="e-pagenomsg">${currentPage} of ${totalPages} pages</span>',
                    dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                });
            gridObj.appendTo('#Grid');
        });

        it('Refresh grid', (done: Function) => {
            let dataBound1 = () => {
                count++;
                done();
            }
            gridObj.dataBound = dataBound1;
            gridObj.refresh();
        });

        it('check count of grid refresh', () => {
            expect(count).toBe(2);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2-43015 Not able to cancel paging action in the Grid', () => {
        let gridInstance: Grid;
        beforeAll((done: Function) => {
            gridInstance = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });
        it('cancel the paging', (done: Function) => {
            let actionBegin = (args?: any): void => {
                if (args.requestType === "paging") {
                    args.cancel = true;
                }
                done();
            };
            gridInstance.actionBegin = actionBegin;
            (gridInstance.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[1].childNodes[0] as HTMLElement).click();
        });
        it('check the active paging element', () => {
            expect(gridInstance.getPager().querySelectorAll('.e-active')[0].textContent).toBe('1');
        });
        it('check the current page of pager', () => {
            gridInstance.goToPage(2);
            expect(gridInstance.pagerModule.pagerObj.currentPage).toBe(1);
        });

        afterAll(() => {
            destroy(gridInstance);
            gridInstance = null;
        });
    });
    describe('Immutable mode paging', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    enableImmutableMode: true,
                    pageSettings: { pageSize: 2 },
                    columns: [{ field: 'OrderID', isPrimaryKey: true }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });
        it('paging', (done: Function) => {
            let actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[1].childNodes[0] as HTMLElement).click();
        });
        it('check row index', () => {
            expect(gridObj.getRowsObject()[1].index).toBe(1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('Pager Focus Test Case', () => {
        let gridObj: Grid;
        let actionBegin: (e: PageEventArgs) => void;
        let actionComplete: (e: PageEventArgs) => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }],
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 2,
                        pageSizes: true
                    },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });
        it('Check pager has focus', function () {
            gridObj.pagerModule.pagerObj.setPagerFocus();
            expect(gridObj.pagerModule.pagerObj.checkPagerHasFocus()).toBeTruthy();
        });
        it('Check first pager focus', function () {
            expect(gridObj.pagerModule.pagerObj.checkFirstPagerFocus()).toBeFalsy();
        });
        it('Set pager focus', () => {
            gridObj.pagerModule.pagerObj.setPagerFocus();
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeTruthy();
            expect((gridObj.pagerModule.pagerObj as any).getFocusedElement()).toBeTruthy();
        });
        it('Set focus class', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            (gridObj.pagerModule.pagerObj as any).addFocus(focusablePagerElements[0], true);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeTruthy();
        });
        it('Remove focus class', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            (gridObj.pagerModule.pagerObj as any).removeFocus(focusablePagerElements[0], true);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('Get element class', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect((gridObj.pagerModule.pagerObj as any).getClass(gridObj.pagerModule.pagerObj.element.querySelector('.e-first'))).toBe('e-first');
        });
        it('Get element by class name', function () {
            expect((gridObj.pagerModule.pagerObj as any).getElementByClass('e-first')).toBeTruthy();
        });
        it('Alt J testing', () => {
            let args: any = { altKey: true, preventDefault: preventDefault, keyCode: 74 };
            (gridObj.pagerModule.pagerObj as any).keyDownHandler(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('Checking onKeyPress for setting focus for pager with no parent', () => {
            (gridObj.pagerModule.pagerObj as any).hasParent = false;
            let args: any = { action: 'tab', preventDefault: preventDefault };
            (gridObj.pagerModule.pagerObj as any).onKeyPress(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('Checking onKeyPress for changing focus with tab with no parent', () => {
            (gridObj.pagerModule.pagerObj as any).hasParent = false;
            gridObj.pagerModule.pagerObj.setPagerFocus();
            let args: any = { action: 'tab', preventDefault: preventDefault, keyCode: 9 };
            (gridObj.pagerModule.pagerObj as any).onKeyPress(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[1].classList.contains('e-focused')).toBeFalsy();
        });
        it('Checking onKeyPress for changing focus with shift tab with no parent', () => {
            (gridObj.pagerModule.pagerObj as any).hasParent = false;
            gridObj.pagerModule.pagerObj.setPagerFocus();
            let tabArgs: any = { action: 'tab', preventDefault: preventDefault, keyCode: 9 };
            (gridObj.pagerModule.pagerObj as any).onKeyPress(tabArgs);
            let args: any = { shiftKey : true, preventDefault: preventDefault, keyCode: 9 };
            (gridObj.pagerModule.pagerObj as any).onKeyPress(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('Checking onKeyPress for changing focus by key', () => {
            gridObj.pagerModule.pagerObj.setPagerFocus();
            let args: any = { preventDefault: preventDefault, keyCode: 37 };
            (gridObj.pagerModule.pagerObj as any).navigateToPageByKey(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('Check first pager focus', () => {
            (gridObj.pagerModule.pagerObj as any).firstPagerFocus = true;
            (gridObj.pagerModule.pagerObj as any).checkFirstPagerFocus();
            expect((gridObj.pagerModule.pagerObj as any).firstPagerFocus).toBeFalsy();
        });
        it('Check pager focus by Enter or Space key', () => {
            gridObj.pagerModule.pagerObj.setPagerFocus();
            let args: any = { preventDefault: preventDefault, keyCode:13 };
            (gridObj.pagerModule.pagerObj as any).navigateToPageByEnterOrSpace(args);
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('check checkFocusInAdaptiveMode, changeFocusInAdaptiveMode Function', function () {
            const adaptiveElement = (gridObj.pagerModule.pagerObj as any).element.querySelector('.e-mfirst');
            expect((gridObj.pagerModule.pagerObj as any).checkFocusInAdaptiveMode(adaptiveElement)).toBeTruthy();
            (gridObj.pagerModule.pagerObj as any).changeFocusInAdaptiveMode(adaptiveElement);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeFalsy();
        });
        it('check setPagerFocusForActiveElement Function', function () {
            (gridObj.pagerModule.pagerObj as any).setPagerFocusForActiveElement();
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            expect(focusablePagerElements[0].classList.contains('e-focused')).toBeFalsy();
        });
        it('check changePagerFocus Function for Tab Action', function () {
            gridObj.pagerModule.pagerObj.setPagerFocus();
            let args: any = { preventDefault: preventDefault, keyCode:9 };
            (gridObj.pagerModule.pagerObj as any).changePagerFocus(args);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeFalsy();
        });
        it('check onFocusOut Function', function () {
            let args: any = { preventDefault: preventDefault };
            (gridObj.pagerModule.pagerObj as any).onFocusOut(args);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeFalsy();
        });
        it('check changePagerFocus Function for Shift-Tab Action', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            (gridObj.pagerModule.pagerObj as any).addFocus(focusablePagerElements[0], true);
            let args: any = { preventDefault: preventDefault, keyCode: 9, shiftKey: true };
            (gridObj.pagerModule.pagerObj as any).changePagerFocus(args);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeTruthy();
        });
        it('check changePagerFocus Function For Enter Action', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            (gridObj.pagerModule.pagerObj as any).addFocus(focusablePagerElements[0], true);
            let args: any = { preventDefault: preventDefault, keyCode: 13 };
            (gridObj.pagerModule.pagerObj as any).changePagerFocus(args);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeTruthy();
        });
        it('check changePagerFocus Function For Key Action', function () {
            const focusablePagerElements: Element[] = (gridObj.pagerModule.pagerObj as any).getFocusablePagerElements(gridObj.pagerModule.pagerObj.element, []);
            (gridObj.pagerModule.pagerObj as any).addFocus(focusablePagerElements[0], true);
            let args: any = { preventDefault: preventDefault, keyCode: 37 };
            (gridObj.pagerModule.pagerObj as any).changePagerFocus(args);
            expect((gridObj.pagerModule.pagerObj as any).element.querySelector('.e-focused')).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });
    describe('EJ2-57783 Need to add selected page size in the page event argument', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    allowPaging: true,
                    dataSource: data,
                    allowSorting: true,
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: {
                        currentPage: 2, pageCount: 4,
                        pageSizes: [10, 20, 30, 40]
                    },
                }, done);
        });
        it('pagesizes value changed to 30 and check pagesize in actionBegin args', (done: Function) => {
            let actionBegin = (args?: any): void => {
                    expect(args.pageSize).toBe(30);
                }
                done();
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.pagerModule).pagerObj.element.querySelector('.e-dropdownlist').ej2_instances[0].value = 30;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});

describe('BUG-830382 - Page count is not increased while adding new records if the Grid has pager dropdown', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 4),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                allowPaging: true,
                pageSettings: { pageSize: 5, pageSizes: [5, 10, 15, 'All'] },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120},
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140},
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2'},
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                ],
                actionComplete: actionComplete,
            }, done);
        });
        
    it('Add first record', (done: Function) => {
        (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
        done();
    });

    it('Add complete', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.currentViewData.length).toBe(5);
                done();
            }
        };       
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10247, CustomerID: 'New updated' });
    });

    it('Check total pages', (done: Function) => {
        expect(gridObj.pagerModule.pagerObj.totalPages).toBe(2);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });

    
    describe('Cancelling paging action not working properly with Pager Dropdown', () => {
        let gridObj: Grid;
        let pagerElements: NodeListOf<HTMLElement>;
        let actionBegin: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 24),
                    allowPaging: true,
                    pageSettings: { pageSize: 12, pageSizes: [5, 10, 12, 'All'] },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120},
                        { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140},
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2'},
                        { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170},
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('change page size action', function (done: Function) {
            gridObj.pageSettings.pageSize = 5;
            actionBegin = (args?: any): void => {
                args.cancel = true;
                done();
            };
            gridObj.actionBegin = actionBegin;
        });

        it ('check pagesize after cancel', () => {
            expect(gridObj.pageSettings.pageSize).toBe(12);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
        });
    });

    describe('CR869647 - Changing page Size from second page is continuously triggering event', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 30),
                    allowPaging: true,
                    pageSettings: { pageSizes: true, currentPage: 2 },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('change page size action', function (done: Function) {
            gridObj.pageSettings.pageSize = 5;
            actionBegin = (args?: any): void => {
                args.cancel = true;
                done();
            };
            gridObj.actionBegin = actionBegin;
        });

        it ('check pagesize after cancel', () => {
            expect(gridObj.pageSettings.pageSize).toBe(12);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
        });
    });

    describe('Feature - EJ2-850006 - Implementation of pager dropdownlist in adaptive / mobile pager', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 24),
                    allowPaging: true,
                    rowRenderingMode: 'Vertical',
                    enableAdaptiveUI: true,
                    height: '100%',
                    width: 600,
                    pageSettings: { pageSize: 12, pageSizes: true },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120},
                        { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140},
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2'},
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('Setting adaptive mode CSS to trigger mimic media query css for code coverage purpose', function () {
            (gridObj.element.querySelector('.e-pager') as HTMLElement).style.borderStyle = 'solid'; //code to trigger pager resizing.
            (gridObj.element.querySelector('.e-mfirst') as HTMLElement).style.display = 'block';
            (gridObj.element.querySelector('.e-mfirst') as HTMLElement).style.setProperty('--mq-type', 'small');
            gridObj.pagerModule.refresh();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
        });
    });
    
    describe('Grid Not Showing All Records when Filter is Cleared', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 15),
                    pageSettings: {pageSizes: true, pageSize: 5},
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: {columns: [{field: 'OrderID', matchCase: false, operator: 'equal', predicate: 'and', value: 10248, }]},
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    ],
                }, done);
        });

        it('set pagesize all', (done: Function) => {
            (gridObj.pageSettings.pageSize as any) = "All";
            done();
        });

        it('clear Filtering testing', function (done: Function) {
            gridObj.clearFiltering();
            gridObj.actionComplete = (args?: any): void => {
                if (args.requestType === "paging") {
                    gridObj.actionComplete = null;
                    done();
                }  
            };
        });

        it ('check pagesize after clearing', () => {
            expect(gridObj.pageSettings.pageSize).toBe(15);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('code coverage - Page', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 7),
                    pageSettings: { pageSizes: true, pageSize: 5 },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', isPrimaryKey: true },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    ],
                }, done);
        });

        it('Edit record', () => {
            gridObj.editModule.editCell(0, 'Freight');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '1';
            (gridObj.pagerModule.pagerObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0].showPopup();
        });

        it('Set page size', () => {
            (document.querySelectorAll('.e-list-item')[2] as HTMLElement).click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('code coverage - Page - React', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 7),
                    pageSettings: { pageSizes: true, pageSize: 5 },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    allowPaging: true,
                    pagerTemplate: () => {
                        return '<div></div>';
                    },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', isPrimaryKey: true },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    ],
                }, done);
        });

        it('Render pager template in React ', () => {
            gridObj.isReact = true;
            (gridObj.pagerModule as any).isInitialRender = true;
            (gridObj.pagerModule as any).enableAfterRender({ module: 'pager', enable: true });

        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-922763: Grid Pager with custom pageSizes displays all records on a single page after clearing the filter', function () {
        let gridObj: Grid;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data.slice(0,2),
                pageSettings: { pageSize: 1, pageSizes: ['1', '10', '20', '50', '100']},
                allowFiltering: true,
                allowPaging: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerName', headerText: 'Customer Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                    { field: 'ShippedDate', headerText: 'Shipped Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                ],
            }, done);
        });
        it('Apply filter', function (done) {
            gridObj.filterByColumn("OrderID", 'equal', 10248);
            done();
        });
        it('clear Filtering', function (done) {
            gridObj.clearFiltering();
            done();
        });
        it('check pagesize after clearing', function () {
            expect(gridObj.pageSettings.pageSize).toBe(1);
        });
        afterAll(function () {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-935128: Script Error Occurs When Accessing pageSize in the actionComplete Event', function () {
        let gridObj: Grid;
        let actionBegin: (e: PageEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 24),
                    allowPaging: true,
                    pageSettings: { pageSize: 12, pageSizes: [5, 10, 12, 'All'] },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                        { field: 'OrderDate', headerText: 'Order Date', format: 'yMd', width: 170 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('change page size action', function (done: Function) {
            actionBegin = (args: PageEventArgs): void => {
                expect(args.pageSize).toBeDefined();
                done();
            };
            gridObj.actionBegin = actionBegin;
            gridObj.pageSettings.pageSize = 5;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
        });
    });

    describe('EJ2-978669: Pagination Dropdown Incorrectly Switches to "All" When Filtered Result Count Equals Page Size', function () {
        let gridObj: Grid;
        let actionBegin: (e: PageEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                dataSource: [
                    { EmployeeID: 1, FirstName: 'Nancy', Country: 'USA' },
                    { EmployeeID: 2, FirstName: 'Andrew', Country: 'USA' },
                    { EmployeeID: 3, FirstName: 'Janet', Country: 'USA' },
                    { EmployeeID: 4, FirstName: 'John', Country: 'UK' }
                ],
                allowFiltering: true,
                filterSettings: {
                    columns: [{ field: 'Country', matchCase: false, operator: 'startswith', predicate: 'and', value: 'USA' },]
                },
                allowPaging: true,
                pageSettings: {
                    pageCount: 5,
                    pageSize: 3,
                    pageSizes: [3, 5, 10, 'All'],
                },
                toolbar: ['Search'],
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Country', headerText: 'Country', width: 110 }
                ],
                }, done);
        });

        it('Cler filtering with pageSize All', function (done: Function) {
            expect(gridObj.currentViewData.length).toBe(3);
            gridObj.clearFiltering();
            done();
        });

        it ('check pagesize after clearing', () => {
            expect(gridObj.pageSettings.pageSize).toBe(3);
            expect(gridObj.currentViewData.length).toBe(3);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
        });
    });
});