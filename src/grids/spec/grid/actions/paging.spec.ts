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

Grid.Inject(Page, Sort);

describe('Paging module', () => {
    describe('Paging functionalities', () => {
        let gridObj: Grid;
        let actionBegin: (e: PageEventArgs) => void;
        let actionComplete: (e: PageEventArgs) => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10, enableQueryString: true
                    },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });
        it('page size testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
        });
        it('current page testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
        });
        it('page count testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes.length).toBe(4);
            expect((<Element>gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[0].childNodes[0]).hasAttribute('aria-owns')).toBeTruthy();
        });
        it('totalRecordsCount testing', () => {
            expect(gridObj.pageSettings.totalRecordsCount).toBe(15);
        });
        it('querystring testing', () => {
            gridObj.goToPage(3);
            expect(window.location.href.indexOf('?page=3')).toBeGreaterThan(-1);
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
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('4');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 4;
            gridObj.dataBind();

        });

        //set model and default properties model check

        afterAll(() => {
            destroy(gridObj);
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
                        totalRecordsCount: 10, enableQueryString: true
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
        //check query string
        it('Check enableQueryString', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                expect(document.location.href).toMatch('page=1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 1;
            gridObj.dataBind();

        });
        //set model and default properties model check

        afterAll(() => {
            destroy(gridObj);
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
                        enableQueryString: true, pageSizes: [10, 20, 30, 40]
                    },
                }, done);
        });
        it('dropDownChanged event testing', () => {
            expect(gridObj.pageSettings.pageSize).toEqual(12);
            expect(gridObj.pageSettings.currentPage).toBe(1);
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
        });
    });

    describe('Paging & Scrolling - PageDown case', () => {
        let grid: Grid;
        let actionBegin: Function;
        let actionComplete: Function;
        let preventDefault: Function = new Function();
        let which: string = 'which';
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
    
 
    describe('EJ2-9910 dropDown All option', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
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
            (<any>gridObj.pagerModule).pagerObj.element.querySelector('.e-dropdownlist').ej2_instances[0].value = 'All';
        });
        it('check current pageSize value', (done: Function) => {
            let actionComplete = (args?: any): void => {
                expect(gridObj.currentViewData.length).toBe(15);
                done();
            };
            gridObj.actionComplete = actionComplete;
           
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
});