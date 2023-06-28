/**
 * Grid search spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { Search } from '../../../src/grid/actions/search';
import { Page } from '../../../src/grid/actions/page';
import { createGrid, destroy } from '../base/specutil.spec';
import { data } from '../base/datasource.spec';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Edit } from '../../../src/grid/actions/edit';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Column } from '../../../src/grid/models/column';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { select } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';

Grid.Inject(Search, Page, Toolbar, Edit);

describe('Search module=>', () => {
    describe('Search methods testing=>', () => {
        let gridObj: Grid;
        let actionComplete: (args?: Object) => void;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' },
                    { field: 'EmployeeID' },
                    { field: 'ShipCity' }],
                    actionComplete: actionComplete
                }, done);
        });

        it('Search method testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'searching') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('10249');
        });

        it('Search method same key testing', () => {
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
        });

        it('Search method empty string testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'searching') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(12);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
        });

        it('Search method ignorecase testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'searching') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('ViNet');
        });

        it('Search clear testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'searching') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(12);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
        });

        it('goToPage testing for search', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'paging') {
                    expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 2;
            gridObj.dataBind();
        });

        it('Search method from last page testing testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'paging') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('TOMSP');
        });

        it('EJ2-7184- Script error resolved when empty search through method', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType == 'searching') {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toBe(12);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    //scenario - goto last page and search a value, check grid render with first page
    //then check clear searching case.

    describe('Search methods testing with paging', () => {
        let gridObj: Grid;
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }],
                    actionComplete: actionComplete,
                    pageSettings: { pageSize: 6, pageCount: 3 }
                }, done);
        });
        it('go to last page', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toBe('3');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 3;
            gridObj.dataBind();
        });
        it('search a value', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toBe('1');
                expect(gridObj.pageSettings.totalRecordsCount).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('VINET');
        });
        it('clear search value', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toBe('1')
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
        });
        afterAll((done) => {
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = actionComplete = null;
        });
    });

    describe('Search methods testing after editing a column ', () => {
        let gridObj: Grid;
        let actionComplete: (args?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.map(data => data),
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID' },
                        { field: 'EmployeeID' },
                        { field: 'ShipCity',allowSearching:false }
                        ],
                    actionComplete: actionComplete,
                    pageSettings: { pageSize: 6, pageCount: 3 },
                    editSettings: {allowEditing: true, mode: 'Normal' },
                    toolbar: ['edit', 'update'],
                }, done);
        });

        it('EJ2-7286==>Searching TOMSP', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('TOMSP');
        });

        it('EJ2-7286==>Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('EJ2-7286==>Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeFalsy();
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;            
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('EJ2-7286==>Again Searching TOMSP', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('TOMSP');
        });

        it('EJ2-16724==>allowSearching', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('Reims');
        });

        it('EJ2-16724==>allowSearching as true', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;  
            (gridObj.columns[3] as Column).allowSearching = true;
            gridObj.searchModule.search('Münster');
        });

        it('EJ2-16724==>allowSearching as false', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;  
            (gridObj.columns[1] as Column).allowSearching = false;
            gridObj.searchModule.search('VICTE');
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

    describe('EJ2-60560 - Scroller thumb is shown when empty record displayed in the Virtualization Grid => ', () => {
        let gridObj: Grid;
        let actionComplete: (args?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 100),
                    enableVirtualization: true,
                    toolbar: ['Search'],
                    columns: [
                        { type: "checkbox", width: "60" },
                        { field: "OrderID", isPrimaryKey: true, headerText: "Order ID", width: "110" },
                        { field: "ShipName", headerText: "Ship Name", width: "140" },
                        { field: "Freight", headerText: "Freight", width: "110" },
                        { field: "OrderDate", headerText: "Order Date", width: "180", type: "date", format: "yMd" }
                    ],
                    height: 350,
                    actionComplete: actionComplete,
                }, done);
        });

        it('search invalid data', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll(".e-virtualtrack")[0].clientHeight).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('TOMSP');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-62074 - Header checkbox selected automatically while doing searching and filtering=>', () => {
        let gridObj: Grid;
        let dataStateChange: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    toolbar: ['Search'],
                    dataSource: { result: data, count: data.length},
                    allowFiltering: true,
                    allowPaging: true,
                    selectionSettings: { persistSelection: true },
                    columns: [
                        { type: "checkbox", width: "60" },
                        { field: "OrderID", isPrimaryKey: true, headerText: "Order ID", width: "110" },
                        { field: "ShipName", headerText: "Ship Name", width: "140" },
                        { field: "Freight", headerText: "Freight", width: "110" },
                        { field: "OrderDate", headerText: "Order Date", width: "180", type: "date", format: "yMd" }
                    ],
                    dataStateChange: dataStateChange,
                },
                done);
        });
        it('Rendering Grid with custom binding =>', (done: Function) => {
            dataStateChange = (args?: any): void => {
                var result = new DataManager(data).executeLocal(
                    new Query().search(args.search[0].key, args.search[0].fields));
                    gridObj.dataSource = {
                      result: result,
                      count: result.length,
                    };
                    done();
            };
            gridObj.dataStateChange = dataStateChange;
            gridObj.searchModule.search('10249');
        });
        it('checking the header checkbox =>', () => {
            let cBox: HTMLElement = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
            expect(cBox.classList.contains('e-check')).toBeFalsy();
            gridObj.dataStateChange = null;
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-71070 - Grid Searching is not working as expected when have date type columns => ', () => {
        let gridObj: Grid;
        let actionComplete: (args?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 3),
                    toolbar: ['Search'],
                    columns: [
                        {
                            field: 'OrderID',
                            headerText: 'Order ID',
                            width: 140,
                        },
                        {
                            field: 'CustomerID',
                            headerText: 'Customer ID',
                            width: 140,
                        },
                        {
                            field: 'OrderDate',
                            headerText: 'OrderDate',
                            type: 'date',
                            format: 'yMd',
                            width: 140,
                        },
                    ],
                    height: 350,
                    actionComplete: actionComplete,
                }, done);
        });

        it('search invalid data', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.currentViewData.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('ndia');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-71340 - Boolean value(false) search is not working properly for Data Grid => ', () => {
        let gridObj: Grid;
        let actionComplete: (args?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    toolbar: ['Search'],
                    columns: [
                        {
                            field: 'OrderID',
                            headerText: 'OrderID',
                            width: 140,
                        },
                        {
                            field: 'CustomerID',
                            headerText: 'Customer Name',
                            width: 140,
                        },
                        {
                            field: 'Verified',
                            headerText: 'Verified', 
                            width: 150,
                            displayAsCheckBox: true, 
                            type: 'boolean'
                        },
                    ],
                    height: 350,
                    actionComplete: actionComplete,
                }, done);
        });
        it('Search boolean value(false)', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.currentViewData.length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;            
            gridObj.searchModule.search('false');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
});
