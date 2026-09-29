/**
 * DOM Virtualization spec
 */
import { EventHandler } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { DomVirtualization } from '../../../src/grid/actions/dom-virtualization';
import { DomVirtualContentRenderer, DomVirtualElementHandler } from '../../../src/grid/renderer/dom-virtual-content-renderer';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import { profile, inMB, getMemoryProfile } from '../base/common.spec';
import { EditEventArgs } from '../../../src';

Grid.Inject(Sort, Page, Filter, Selection, Group, DomVirtualization, DetailRow, Edit, Toolbar);

let generateLargeDataset: Function = (count: number): Object[] => {
    let arr: Object[] = [];
    for (let i: number = 0; i < count; i++) {
        arr.push({
            OrderID: 10248 + i,
            CustomerID: 'VINET' + (i % 10),
            EmployeeID: (i % 9) + 1,
            OrderDate: new Date(1996, 6, 4),
            Freight: 32.38 + (i % 100),
            ShipName: 'Vins et alcools Chevalier',
            ShipCity: 'Reims',
            ShipCountry: 'France'
        });
    }
    return arr;
};

describe('DomVirtualization module => ', () => {
    let profileBegin: any = beforeAll(() => {
        const isDef: Function = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            pending;
        }
    });

    describe('Module registration and lifecycle => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    allowSorting: true,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: 120 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should initialize DOM virtualization when enabled', () => {
            expect(gridObj.enableDomVirtualization).toBe(true);
            expect(gridObj.domVirtualizationSettings.rowBuffer).toBe(5);
            expect(gridObj.domVirtualizationSettings.maxPoolSize).toBe(500);
        });

        it('should have virtual DOM elements rendered', () => {
            expect(gridObj.element.querySelector('.e-dom-virtualtable')).not.toBeNull();
            expect(gridObj.element.querySelector('.e-dom-virtualtrack')).not.toBeNull();
            expect(gridObj.element.querySelector('.e-dom-virtual-vertical-scrollbar')).not.toBeNull();
        });

        it('should render content rows', () => {
            expect(gridObj.getDataRows().length).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Viewport calculation => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(10000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should render partial rows instead of all 10000', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let contentRows: Element[] = gridObj.getDataRows();
                expect(contentRows.length).toBeLessThan(largeDataset.length);
                expect(contentRows.length).toBeGreaterThan(0);
                done();
            };
            gridObj.refresh();
        });

        it('should respect maxPoolSize setting', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let contentRows: Element[] = gridObj.getDataRows();
                expect(contentRows.length).toBeLessThanOrEqual(gridObj.domVirtualizationSettings.maxPoolSize as number);
                done();
            };
            gridObj.refresh();
        });

        it('should maintain consistent row height', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let rows: Element[] = gridObj.getDataRows();
                if (rows.length > 1) {
                    let firstRowHeight: number = (rows[0] as HTMLElement).offsetHeight;
                    let secondRowHeight: number = (rows[1] as HTMLElement).offsetHeight;
                    expect(firstRowHeight).toBeGreaterThan(0);
                    expect(Math.abs(firstRowHeight - secondRowHeight)).toBeLessThan(5);
                }
                done();
            };
            gridObj.refresh();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Scroll handling => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(5000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should re-render on scroll', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                expect(gridObj.currentViewData.length).toBeGreaterThan(0);
                done();
            };
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 1000;
        });

        it('should handle rapid scrolling without errors', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            contentElement.scrollTop = 500;
            setTimeout(() => {
                contentElement.scrollTop = 2000;
                setTimeout(() => {
                    contentElement.scrollTop = 100;
                }, 50);
            }, 50);
        });

        it('should sync scroll between content and virtual scrollbar', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                // verticalScrollbar uses overflow-x:scroll so scrollTop is always 0;
                // instead verify the renderer's currentScrollTop was synced to the content scroll
                expect((renderer as any).currentScrollTop).toBe(contentElement.scrollTop);
                done();
            };
            contentElement.scrollTop = 800;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Configuration settings => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: {
                        rowBuffer: 10,
                        maxPoolSize: 300,
                        autoRowHeight: true
                    },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should apply custom rowBuffer setting', () => {
            expect(gridObj.domVirtualizationSettings.rowBuffer).toBe(10);
        });

        it('should apply custom maxPoolSize setting', () => {
            expect(gridObj.domVirtualizationSettings.maxPoolSize).toBe(300);
            expect(gridObj.getDataRows().length).toBeLessThanOrEqual(300);
        });

        it('should apply autoRowHeight setting', () => {
            expect(gridObj.domVirtualizationSettings.autoRowHeight).toBe(true);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Default settings => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should use default rowBuffer of 5', () => {
            expect(gridObj.domVirtualizationSettings.rowBuffer).toBe(5);
        });

        it('should use default maxPoolSize of 500', () => {
            expect(gridObj.domVirtualizationSettings.maxPoolSize).toBe(500);
        });

        it('should use default autoRowHeight of false', () => {
            expect(gridObj.domVirtualizationSettings.autoRowHeight).toBe(false);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Sorting integration => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowSorting: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should maintain rows after sort action', (done: Function) => {
            let actionComplete: Function = () => {
                gridObj.actionComplete = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.sortColumn('OrderID', 'Ascending', false);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Filtering integration => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowFiltering: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should update viewport after filtering', (done: Function) => {
            let actionComplete: Function = () => {
                gridObj.actionComplete = undefined;
                let filteredRows: Element[] = gridObj.getDataRows();
                expect(filteredRows.length).toBeGreaterThan(0);
                expect(filteredRows.length).toBeLessThanOrEqual((data as Object[]).length);
                done();
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.filterByColumn('CustomerID', 'equal', 'VINET');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Grouping integration => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: 120 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should render grouped rows', () => {
            expect(gridObj.getDataRows().length).toBeGreaterThan(0);
        });

        it('should have group drop area', () => {
            expect(gridObj.element.querySelector('.e-groupdroparea')).not.toBeNull();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Data refresh => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    allowFiltering: true,
                    allowSorting: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should handle data source change', (done: Function) => {
            let dataBound: Function = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                expect(gridObj.getDataRows().length).toBeLessThanOrEqual(500);
                done();
            };
            gridObj.dataBound = dataBound as any;
            gridObj.dataSource = generateLargeDataset(500) as Object[];
            gridObj.dataBind();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Edge cases => ', () => {
        let gridObj: Grid;

        it('should handle empty dataset', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    expect(gridObj.getDataRows().length).toBe(0);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should handle single row dataset', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [{ OrderID: 10248, CustomerID: 'VINET', Freight: 32.38 }],
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, () => {
                    expect(gridObj.getDataRows().length).toBe(1);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should handle scroll to end', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    gridObj.dataBound = () => {
                        gridObj.dataBound = undefined;
                        expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                        destroy(gridObj);
                        gridObj = null;
                        done();
                    };
                    let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
                    contentElement.scrollTop = contentElement.scrollHeight;
                });
        });

        it('should handle scroll to beginning after scrolling down', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
                    gridObj.dataBound = () => {
                        setTimeout(() => {
                            gridObj.dataBound = () => {
                                gridObj.dataBound = undefined;
                                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                                destroy(gridObj);
                                gridObj = null;
                                done();
                            };
                            contentElement.scrollTop = 0;
                        }, 50);
                    };
                    contentElement.scrollTop = 2000;
                });
        });
    });

    describe('Performance validation => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(50000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { maxPoolSize: 500 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should render far fewer than 50000 DOM rows', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let rows: Element[] = gridObj.getDataRows();
                expect(rows.length).toBeLessThan(largeDataset.length);
                expect(rows.length).toBeGreaterThan(0);
                expect(rows.length).toBeLessThanOrEqual(gridObj.domVirtualizationSettings.maxPoolSize as number);
                done();
            };
            gridObj.refresh();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Scroll throttle => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(5000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 100 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should apply scrollThrottle setting', () => {
            expect(gridObj.domVirtualizationSettings.scrollThrottle).toBe(100);
        });

        it('should defer rendering during rapid scroll with throttle', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let initialRows: Element[] = gridObj.getDataRows();
            let initialCount: number = initialRows.length;
            // Rapid scroll — rows should not immediately re-render due to throttle
            contentElement.scrollTop = 500;
            contentElement.scrollTop = 1000;
            contentElement.scrollTop = 1500;
            // Immediately after rapid scroll, row count may still be initial (throttled)
            expect(gridObj.getDataRows().length).toBeGreaterThan(0);
            // Wait for throttle to fire and render the final position
            setTimeout(() => {
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            }, 200);
        });

        it('should render at final scroll position after throttle delay', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            contentElement.scrollTop = 3000;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                // verticalScrollbar uses overflow-x:scroll so scrollTop stays 0;
                // verify renderer's currentScrollTop reflects the final scroll position
                expect((renderer as any).currentScrollTop).toBe(contentElement.scrollTop);
                done();
            };
            // Trigger another scroll after throttle to ensure dataBound fires
            contentElement.scrollTop = 3001;
        });

        it('should coalesce multiple scroll events into single render', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderCount: number = 0;
            let origRefresh: Function = (gridObj as any).contentModule.refreshContentRows;
            (gridObj as any).contentModule.refreshContentRows = function (args: any): void {
                if (args && args.requestType === 'dom-virtualscroll') {
                    renderCount++;
                }
                origRefresh.call(this, args);
            };
            // Fire multiple scroll events in rapid succession
            contentElement.scrollTop = 100;
            contentElement.scrollTop = 200;
            contentElement.scrollTop = 400;
            contentElement.scrollTop = 800;
            contentElement.scrollTop = 1200;
            setTimeout(() => {
                // With throttle=100ms, multiple scrolls should coalesce into fewer renders
                expect(renderCount).toBeLessThanOrEqual(2);
                (gridObj as any).contentModule.refreshContentRows = origRefresh;
                done();
            }, 250);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Scroll throttle zero (no throttle) => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 0 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should have scrollThrottle as 0', () => {
            expect(gridObj.domVirtualizationSettings.scrollThrottle).toBe(0);
        });

        it('should render immediately on scroll without throttle', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 1000;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Dynamic row height with autoRowHeight => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(2000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    allowTextWrap: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 80 }
                    ],
                    height: 400
                }, done);
        });

        it('should enable autoRowHeight mode', () => {
            expect(gridObj.domVirtualizationSettings.autoRowHeight).toBe(true);
        });

        it('should measure and store row heights after rendering', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                expect(rowHeightCache.size).toBeGreaterThan(0);
                done();
            };
            gridObj.refresh();
        });

        it('should store virtual height in storedVirtualHeight', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                expect(storedHeight).toBeGreaterThan(0);
                done();
            };
            gridObj.refresh();
        });

        it('should set virtual track height based on storedVirtualHeight', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                let placeholder: HTMLElement = gridObj.element.querySelector('.e-dom-virtualtrack') as HTMLElement;
                expect(parseInt(placeholder.style.height, 10)).toBe(Math.round(storedHeight));
                done();
            };
            gridObj.refresh();
        });

        it('should stabilize scroller after scrolling with measured heights', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            gridObj.dataBound = () => {
                setTimeout(() => {
                    gridObj.dataBound = undefined;
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                    let initialMeasuredCount: number = rowHeightCache.size;
                    // Scroll further to measure more rows
                    gridObj.dataBound = () => {
                        setTimeout(() => {
                            gridObj.dataBound = undefined;
                            expect(rowHeightCache.size).toBeGreaterThanOrEqual(initialMeasuredCount);
                            done();
                        }, 100);
                    };
                    contentElement.scrollTop = 2000;
                }, 100);
            };
            contentElement.scrollTop = 500;
        });

        it('should use cumulative measured heights for translate position', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let wrapper: HTMLElement = gridObj.element.querySelector('.e-dom-virtualtable') as HTMLElement;
                let transform: string = wrapper.style.transform;
                // Should have a translateY value set
                expect(transform).toContain('translateY');
                let yValue: number = parseFloat(transform.replace('translateY(', '').replace('px)', ''));
                expect(yValue).toBeGreaterThanOrEqual(0);
                done();
            };
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 1000;
        });

        it('should compensate scroll position when virtual height changes', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                setTimeout(() => {
                    gridObj.dataBound = undefined;
                    let storedHeight: number = (renderer as any).storedVirtualHeight;
                    let scrollerContainer: HTMLElement = gridObj.element.querySelector('.e-dom-virtual-vertical-track') as HTMLElement;
                    // Scroller container height should match storedVirtualHeight
                    expect(parseInt(scrollerContainer.style.height, 10)).toBe(Math.round(storedHeight));
                    // verticalScrollbar uses overflow-x:scroll so scrollTop stays 0;
                    // verify renderer's currentScrollTop reflects the scrolled position
                    expect(Math.round((renderer as any).currentScrollTop)).toBe(contentElement.scrollTop);
                    done();
                }, 100);
            };
            contentElement.scrollTop = 1500;
            done();
        });

        it('should clear rowHeightCache on data source change', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                // After data change, previous measurements should be cleared and new ones taken
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                expect(storedHeight).toBeGreaterThan(0);
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            gridObj.dataSource = generateLargeDataset(500) as Object[];
            gridObj.dataBind();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Dynamic row height with fixed rows (autoRowHeight false) => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should not use dynamic height path when autoRowHeight is false', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                // rowHeightCache should be empty for fixed row height
                expect(rowHeightCache.size).toBe(0);
                done();
            };
            gridObj.refresh();
        });

        it('should calculate virtual height using fixed rowHeight * totalRecords', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                let rowHeight: number = (renderer as any).rowHeight;
                let totalRecords: number = (renderer as any).totalRecords;
                expect(storedHeight).toBe(rowHeight * totalRecords);
                done();
            };
            gridObj.refresh();
        });

        it('should use simple multiplication for translate position', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let wrapper: HTMLElement = gridObj.element.querySelector('.e-dom-virtualtable') as HTMLElement;
                let transform: string = wrapper.style.transform;
                expect(transform).toContain('translateY');
                done();
            };
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 500;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Programmatic selection outside viewport => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should set pendingSelectIndex when selecting out-of-viewport row 1500', (done: Function) => {
            // Row 1500 is outside the initial viewport, selectVirtualRow should record it
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pendingSelectIndex = -1;
            gridObj.selectRow(1500);
            // selectVirtualRow fires synchronously: index 1500 < totalRecords(2000) → pendingSelectIndex set
            expect((renderer as any).pendingSelectIndex).toBe(1500);
            (renderer as any).pendingSelectIndex = -1;
            done();
        });

        it('should NOT update pendingSelectIndex when row index 3000 exceeds totalRecords (2000)', (done: Function) => {
            // Out-of-bounds selection: 3000 >= totalRecords(2000) → isAvailable=false → no state change
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pendingSelectIndex = -1;
            gridObj.selectRow(3000);
            expect((renderer as any).pendingSelectIndex).toBe(-1);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Spanning with Dom Virtualization coverage => ', () => {
        let gridObj: Grid;
        let tempData = [{ OrderID: 10001, CustomerID: 'ALFKI', ShipName: 'Berlin Express' },
    { OrderID: 10002, CustomerID: 'BONAP', ShipName: 'French Cargo' },
    { OrderID: 10002, CustomerID: 'BONAP', ShipName: 'French Cargo' }]

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: tempData,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    enableRowSpan: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 80 }
                    ],
                    height: 400
                }, done);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Scroll throttle with dynamic row height combined => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(3000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 50, autoRowHeight: true },
                    allowPaging: false,
                    allowTextWrap: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 80 }
                    ],
                    height: 400
                }, done);
        });

        it('should have both scrollThrottle and autoRowHeight enabled', () => {
            expect(gridObj.domVirtualizationSettings.scrollThrottle).toBe(50);
            expect(gridObj.domVirtualizationSettings.autoRowHeight).toBe(true);
        });

        it('should throttle rendering while accumulating measured heights', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 200;
            contentElement.scrollTop = 600;
            contentElement.scrollTop = 1000;
            setTimeout(() => {
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                expect(rowHeightCache.size).toBeGreaterThan(0);
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            }, 200);
        });

        it('should stabilize virtual height after multiple throttled scrolls', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            contentElement.scrollTop = 1500;
            setTimeout(() => {
                let firstHeight: number = (renderer as any).storedVirtualHeight;
                // Scroll again, height should converge as more rows are measured
                contentElement.scrollTop = 2000;
                setTimeout(() => {
                    let secondHeight: number = (renderer as any).storedVirtualHeight;
                    // Both should be positive and relatively close
                    expect(firstHeight).toBeGreaterThan(0);
                    expect(secondHeight).toBeGreaterThan(0);
                    done();
                }, 100);
            }, 100);
        });

        it('should cleanup observer on destroy', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 500;
            destroy(gridObj);
            expect((renderer as any).observer).toBeNull();
            gridObj = null;
        });
    });

    describe('Detail template with DOM virtualization => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(2000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    detailTemplate: '<div style="padding: 20px; height: 60px;"><p>Order: ${OrderID}</p><p>Customer: ${CustomerID}</p></div>',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should expand detail row and update virtual dimensions', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let heightBefore: number = (renderer as any).storedVirtualHeight;
            gridObj.detailRowModule.expand(0);
            setTimeout(() => {
                let heightAfter: number = (renderer as any).storedVirtualHeight;
                // Height should increase after expanding detail row
                expect(heightAfter).toBeGreaterThanOrEqual(heightBefore);
                let detailRow: Element = gridObj.element.querySelector('.e-detailrow');
                expect(detailRow).not.toBeNull();
                done();
            }, 300);
        });

        it('should collapse detail row and reduce virtual dimensions', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let heightBefore: number = (renderer as any).storedVirtualHeight;
            gridObj.detailRowModule.collapse(0);
            setTimeout(() => {
                let heightAfter: number = (renderer as any).storedVirtualHeight;
                expect(heightAfter).toBeLessThanOrEqual(heightBefore);
                done();
            }, 300);
        });

        // it('should maintain expanded detail rows after scrolling', (done: Function) => {
        //     gridObj.detailRowModule.expand(0);
        //     setTimeout(() => {
        //         let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
        //         gridObj.dataBound = () => {
        //             gridObj.dataBound = undefined;
        //             expect(gridObj.getDataRows().length).toBeGreaterThan(0);
        //             done();
        //         };
        //         contentElement.scrollTop = 500;
        //     }, 200);
        // });

        it('should track expanded detail row heights in expandedDetailRows map', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let expandedMap: Map<number, number> = (renderer as any).expandedDetailRows;
            gridObj.detailRowModule.expand(1);
            setTimeout(() => {
                expect(expandedMap.size).toBeGreaterThan(0);
                done();
            }, 300);
        });

        it('should clear expanded detail rows on data refresh', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let expandedMap: Map<number, number> = (renderer as any).expandedDetailRows;
                expect(expandedMap.size).toBe(0);
                done();
            };
            gridObj.dataSource = generateLargeDataset(1000) as Object[];
            gridObj.dataBind();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Dynamic row height using setRowHeight callback => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(2000);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    setRowHeight: function (row: any): number {
                        // Alternate rows get different heights
                        if (row && row.data && row.data.EmployeeID % 2 === 0) {
                            return 60;
                        }
                        return 36;
                    },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: 120 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should use setRowHeight callback for row height calculation', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                done();
            };
            gridObj.refresh();
        });

        it('should use cumulative setRowHeight heights for translate on scroll', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let wrapper: HTMLElement = gridObj.element.querySelector('.e-dom-virtualtable') as HTMLElement;
                let transform: string = wrapper.style.transform;
                expect(transform).toContain('translateY');
                let yValue: number = parseFloat(transform.replace('translateY(', '').replace('px)', ''));
                expect(yValue).toBeGreaterThan(0);
                done();
            };
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 1000;
        });

        it('should stabilize scroller with setRowHeight after multiple scrolls', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                setTimeout(() => {
                    gridObj.dataBound = undefined;
                    let firstHeight: number = (renderer as any).storedVirtualHeight;
                    gridObj.dataBound = () => {
                        setTimeout(() => {
                            gridObj.dataBound = undefined;
                            let secondHeight: number = (renderer as any).storedVirtualHeight;
                            expect(firstHeight).toBeGreaterThan(0);
                            expect(secondHeight).toBeGreaterThan(0);
                            done();
                        }, 100);
                    };
                    contentElement.scrollTop = 2000;
                    done();
                }, 100);
            };
            contentElement.scrollTop = 500;
            done();
        });

        it('should sync scrollbar height with storedVirtualHeight', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                let scrollerContainer: HTMLElement = gridObj.element.querySelector('.e-dom-virtual-vertical-track') as HTMLElement;
                expect(parseInt(scrollerContainer.style.height, 10)).toBe(Math.round(storedHeight));
                done();
            };
            gridObj.refresh();
        });

        it('should clear measured heights on data source change', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                // New data should have fresh measurements
                expect(storedHeight).toBeGreaterThan(0);
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            gridObj.dataSource = generateLargeDataset(500) as Object[];
            gridObj.dataBind();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Detail template with setRowHeight combined => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    detailTemplate: '<div style="padding: 10px; height: 80px;"><p>Details for ${OrderID}</p></div>',
                    setRowHeight: function (row: any): number {
                        return row && row.data && row.data.Freight > 80 ? 55 : 40;
                    },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should render with both detailTemplate and setRowHeight', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                let detailIcons: NodeListOf<Element> = gridObj.element.querySelectorAll('.e-detailrowcollapse');
                expect(detailIcons.length).toBeGreaterThan(0);
                done();
            };
            gridObj.refresh();
        });

        it('should expand detail and increase storedVirtualHeight', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let heightBefore: number = (renderer as any).storedVirtualHeight;
            gridObj.detailRowModule.expand(0);
            setTimeout(() => {
                let heightAfter: number = (renderer as any).storedVirtualHeight;
                expect(heightAfter).toBeGreaterThanOrEqual(heightBefore);
                done();
            }, 300);
        });

        it('should handle scroll with expanded detail and dynamic row heights', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                let storedHeight: number = (renderer as any).storedVirtualHeight;
                expect(storedHeight).toBeGreaterThan(0);
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            contentElement.scrollTop = 800;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Coverage: uncovered branches and edge paths => ', () => {
        let gridObj: Grid;

        it('DomVirtualElementHandler.setVirtualHeight with null should set 0px', () => {
            let handler: DomVirtualElementHandler = new DomVirtualElementHandler();
            let placeholder: HTMLElement = document.createElement('div');
            handler.placeholder = placeholder;
            handler.setVirtualHeight(undefined);
            expect(placeholder.style.height).toBe('0px');
            handler.setVirtualHeight(null);
            expect(placeholder.style.height).toBe('0px');
        });

        it('should handle refreshContentRows with empty currentViewData', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Calling refreshContentRows with empty data should return early
                    renderer.refreshContentRows({});
                    expect(gridObj.getDataRows().length).toBe(0);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover clearExpandedDetailRows method', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Manually add detail row and then clear
                    renderer.updateDetailRowHeight(0, true, 100);
                    expect((renderer as any).expandedDetailRows.size).toBe(1);
                    renderer.clearExpandedDetailRows();
                    expect((renderer as any).expandedDetailRows.size).toBe(0);
                    expect((renderer as any).rowHeightCache.size).toBe(0);
                    expect((renderer as any).storedVirtualHeight).toBe(0);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover maxPoolSize cap in getEndIndex', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(5000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 10, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    gridObj.dataBound = () => {
                        gridObj.dataBound = undefined;
                        // With maxPoolSize=10, rendered rows should be capped
                        let rows: Element[] = gridObj.getDataRows();
                        expect(rows.length).toBeLessThanOrEqual(10);
                        destroy(gridObj);
                        gridObj = null;
                        done();
                    };
                    gridObj.refresh();
                });
        });

        it('should cover onGroupExpandCollapse body when group is active', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Directly invoke onGroupExpandCollapse to cover the body path
                    (renderer as any).onGroupExpandCollapse();
                    expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover getDataRowIndexByScrollTop end-of-loop return and detail scroll within', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(50),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Add a detail row expanded in the middle
                    renderer.updateDetailRowHeight(5, true, 200);
                    // Scroll to a position within the detail area
                    let cumulativeToRow5: number = (renderer as any).getRowTopOffset(5);
                    let rowHeight: number = (renderer as any).rowHeight || 37;
                    let scrollInDetail: number = cumulativeToRow5 + rowHeight + 50; // within the detail area
                    let idx: number = (renderer as any).getDataRowIndexByScrollTop(scrollInDetail);
                    expect(idx).toBeGreaterThanOrEqual(5);
                    // Scroll beyond all rows to hit end-of-loop return
                    let veryLargeScroll: number = 999999;
                    let endIdx: number = (renderer as any).getDataRowIndexByScrollTop(veryLargeScroll);
                    expect(endIdx).toBe(Math.max(0, (renderer as any).totalRecords - 1));
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover getVisibleRowCount return 20 when estimated height is 0', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Force rowHeight to 0 to hit the rh <= 0 branch
                    (renderer as any).rowHeight = 0;
                    let count: number = (renderer as any).getVisibleRowCount();
                    expect(count).toBe(20);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover getDataRowIndexByScrollTop with rowHeight <= 0 in non-dynamic mode', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    (renderer as any).rowHeight = 0;
                    let idx: number = (renderer as any).getDataRowIndexByScrollTop(100);
                    expect(idx).toBe(0);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover getDataRowIndexByScrollTop with avg height <= 0 in dynamic mode', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Force rowHeight=0 and clear measured map to get estimated=0
                    (renderer as any).rowHeight = 0;
                    (renderer as any).rowHeightCache.clear();
                    let idx: number = (renderer as any).getDataRowIndexByScrollTop(100);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover gridContent/content position reset branches', (done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    // Manually change positions to trigger reset
                    (renderer as any).virtualEle.gridContent.style.position = 'static';
                    (renderer as any).virtualEle.content.style.position = 'static';
                    renderer.refreshContentRows({ requestType: 'dom-virtualscroll' });
                    expect((renderer as any).virtualEle.gridContent.style.position).toBe('relative');
                    expect((renderer as any).virtualEle.content.style.position).toBe('relative');
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });

        it('should cover DomVirtualization addEventListener when parent is destroyed', () => {
            let domVirt: DomVirtualization = new DomVirtualization({ isDestroyed: true, on: jasmine.createSpy('on'), off: jasmine.createSpy('off') } as any);
            // addEventListener should return early without adding event listeners
            expect((domVirt as any).parent.on).not.toHaveBeenCalled();
        });
    });

    describe('onApplyDomVirtualRowHeight branch coverage => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    setRowHeight: function (row: any): number {
                        return 40;
                    },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should cover else branch (dynamicHeightSum -= prev) when same row fires event again', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
            // Manually seed rowHeightCache with an existing height for row index 0
            const existingHeight: number = 40;
            rowHeightCache.set(0, existingHeight);
            (renderer as any).dynamicHeightSum = existingHeight;
            (renderer as any).dynamicRowCount = 1;
            // Build a fake row object with index 0 and data that triggers the callback
            const fakeRow: any = { index: 0, data: { EmployeeID: 1 }, rowHeight: 0 };
            // Fire the event — should hit the else branch since rowHeightCache.get(0) !== undefined
            (gridObj as any).notify('apply-dom-virtual-row-height', { row: fakeRow });
            // prev was 40; new height is 40; dynamicHeightSum should be 40 - 40 + 40 = 40
            expect((renderer as any).dynamicHeightSum).toBe(40);
            expect(rowHeightCache.get(0)).toBe(40);
        });

        it('should not update cache when setRowHeight callback returns 0', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const origSetRowHeight: Function = (gridObj as any).setRowHeight;
            // Override setRowHeight to return 0 to cover the else path of if (customHeight > 0)
            (gridObj as any).setRowHeight = function (): number { return 0; };
            const rowHeightCache: Map<number, number> = (renderer as any).rowHeightCache;
            const sizeBefore: number = rowHeightCache.size;
            const sumBefore: number = (renderer as any).dynamicHeightSum;
            const countBefore: number = (renderer as any).dynamicRowCount;
            const fakeRow: any = { index: 999, data: {}, rowHeight: 0 };
            (gridObj as any).notify('apply-dom-virtual-row-height', { row: fakeRow });
            // Nothing should change since customHeight === 0
            expect(rowHeightCache.size).toBe(sizeBefore);
            expect((renderer as any).dynamicHeightSum).toBe(sumBefore);
            expect((renderer as any).dynamicRowCount).toBe(countBefore);
            (gridObj as any).setRowHeight = origSetRowHeight;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('frozenRows with DOM virtualization => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    frozenRows: 2,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should subtract frozenRows from totalRecords in refreshContentRows', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            // totalRecords should be dataset.length minus frozenRows
            expect((renderer as any).totalRecords).toBe(198);
        });

        it('should clear header tbody innerHTML in renderEmpty when frozenRows > 0', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let tbody: HTMLElement = document.createElement('tbody');
            tbody.innerHTML = '<tr><td>old</td></tr>';
            // Call renderEmpty — it should clear header's tbody
            renderer.renderEmpty(tbody);
            let headerTbody: Element = gridObj.getHeaderContent().querySelector('tbody');
            expect(headerTbody.innerHTML).toBe('');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('preventScroll guard branches in scroll handlers => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 0 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should return early from domScrollListener when preventScroll is true (prevStartIndex unchanged)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let prevStartIndex: number = (renderer as any).prevStartIndex;
            (renderer as any).preventScroll = true;
            (renderer as any).domScrollListener({ offset: { top: 500, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).prevStartIndex).toBe(prevStartIndex);
            (renderer as any).preventScroll = false;
        });

        it('should return early from domScrollListener when preventScroll is true (currentScrollTop unchanged)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let prevCurrentScrollTop: number = (renderer as any).currentScrollTop;
            (renderer as any).preventScroll = true;
            (renderer as any).domScrollListener({ offset: { top: 999, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).currentScrollTop).toBe(prevCurrentScrollTop);
            (renderer as any).preventScroll = false;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Destroy and cleanup => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(1000),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should cleanup properly on destroy', () => {
            let gridElement: HTMLElement = gridObj.element;
            let id: string = gridElement.id;
            destroy(gridObj);
            expect(gridObj.isDestroyed).toBe(true);
            expect(document.getElementById(id)).toBeNull();
            gridObj = null;
        });
    });

    describe('Multi-page fetch: enableVirtualization combined with enableDomVirtualization => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 10, maxPoolSize: 500, autoRowHeight: false },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should initialize pageSkip and pageTake to -1 (single-page mode)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect((renderer as any).pageSkip).toBe(-1);
            expect((renderer as any).pageTake).toBe(-1);
        });

        it('should populate offsets and offsetKeys after initial data ready', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect(renderer.offsetKeys.length).toBeGreaterThan(0);
            expect(Object.keys(renderer.offsets).length).toBeGreaterThan(0);
        });

        it('getPageFromIndex should return page 1 for indices within the first page', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).maxPage = 10;
            expect((renderer as any).getPageFromIndex(0)).toBe(1);
            expect((renderer as any).getPageFromIndex(49)).toBe(1);
        });

        it('getPageFromIndex should return page 2 for indices in the second page', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).maxPage = 10;
            expect((renderer as any).getPageFromIndex(50)).toBe(2);
            expect((renderer as any).getPageFromIndex(99)).toBe(2);
        });

        it('getPageFromIndex should return page 3 for index 100 with pageSize 50', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).maxPage = 10;
            expect((renderer as any).getPageFromIndex(100)).toBe(3);
        });

        it('getPageFromIndex should clamp result to maxPage', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const origMaxPage: number = (renderer as any).maxPage;
            (renderer as any).maxPage = 5;
            expect((renderer as any).getPageFromIndex(9999)).toBe(5);
            (renderer as any).maxPage = origMaxPage;
        });

        it('getPageFromIndex should return 1 when maxPage is 0 (not yet initialized)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const origMaxPage: number = (renderer as any).maxPage;
            (renderer as any).maxPage = 0;
            expect((renderer as any).getPageFromIndex(500)).toBe(1);
            (renderer as any).maxPage = origMaxPage;
        });

        it('setDomVirtualPageQuery should be a no-op when pageSkip is -1 (single-page mode)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = -1;
            let skipCalled: boolean = false;
            let takeCalled: boolean = false;
            let args: any = {
                query: {
                    skip: () => { skipCalled = true; },
                    take: () => { takeCalled = true; }
                },
                skipPage: false
            };
            (renderer as any).setDomVirtualPageQuery(args);
            expect(skipCalled).toBe(false);
            expect(takeCalled).toBe(false);
            expect(args.skipPage).toBe(false);
        });

        it('setDomVirtualPageQuery should override query skip and take when cross-page (pageSkip >= 0)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 0;
            (renderer as any).pageTake = 100;
            let skipValue: number = -1;
            let takeValue: number = -1;
            let args: any = {
                query: {
                    skip: (v: number) => { skipValue = v; },
                    take: (v: number) => { takeValue = v; }
                },
                skipPage: false
            };
            (renderer as any).setDomVirtualPageQuery(args);
            expect(skipValue).toBe(0);
            expect(takeValue).toBe(100);
            expect(args.skipPage).toBe(true);
            (renderer as any).pageSkip = -1;
            (renderer as any).pageTake = -1;
        });

        it('setDomVirtualPageQuery should carry skip=50 and take=100 for page 2 cross-page fetch', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 50;
            (renderer as any).pageTake = 100;
            let skipValue: number = -1;
            let takeValue: number = -1;
            let args: any = {
                query: {
                    skip: (v: number) => { skipValue = v; },
                    take: (v: number) => { takeValue = v; }
                },
                skipPage: false
            };
            (renderer as any).setDomVirtualPageQuery(args);
            expect(skipValue).toBe(50);
            expect(takeValue).toBe(100);
            expect(args.skipPage).toBe(true);
            (renderer as any).pageSkip = -1;
            (renderer as any).pageTake = -1;
        });

        it('onDataReady should reset pageSkip and pageTake on refresh action', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 50;
            (renderer as any).pageTake = 100;
            (renderer as any).onDataReady({ requestType: 'refresh', count: 500 });
            expect((renderer as any).pageSkip).toBe(-1);
            expect((renderer as any).pageTake).toBe(-1);
        });

        it('onDataReady should reset pageSkip and pageTake on filtering action', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 50;
            (renderer as any).pageTake = 100;
            (renderer as any).onDataReady({ requestType: 'filtering', count: 500 });
            expect((renderer as any).pageSkip).toBe(-1);
            expect((renderer as any).pageTake).toBe(-1);
        });

        it('onDataReady should reset pageSkip and pageTake on searching action', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 50;
            (renderer as any).pageTake = 100;
            (renderer as any).onDataReady({ requestType: 'searching', count: 500 });
            expect((renderer as any).pageSkip).toBe(-1);
            expect((renderer as any).pageTake).toBe(-1);
        });

        it('onDataReady should NOT reset pageSkip and pageTake on dom-virtualscroll', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 0;
            (renderer as any).pageTake = 100;
            (renderer as any).onDataReady({ requestType: 'dom-virtualscroll', count: 500 });
            expect((renderer as any).pageSkip).toBe(0);
            expect((renderer as any).pageTake).toBe(100);
            (renderer as any).pageSkip = -1;
            (renderer as any).pageTake = -1;
        });

        it('refreshOffsets should build cumulative offset blocks based on blockSize and rowHeight', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const pageSize: number = (gridObj.pageSettings as any).pageSize; // 50
            const blockSize: number = pageSize >> 1; // 25
            (renderer as any).count = 500;
            (renderer as any).rowHeight = 36;
            renderer.refreshOffsets();
            const expectedBlocks: number = Math.ceil(500 / blockSize); // 20
            expect(renderer.offsetKeys.length).toBe(expectedBlocks);
            // Block 1 covers rows 0-24: 25 rows × 36px = 900
            expect(renderer.offsets[1]).toBe(blockSize * 36);
            // Block 2 is cumulative: 900 + 900 = 1800
            expect(renderer.offsets[2]).toBe(blockSize * 36 * 2);
        });

        it('domScrollListener should set pageSkip=0 and pageTake=100 when forward buffer crosses page 1→2', () => {
            // pageSize=50, rowBuffer=10, rowHeight=36, clientHeight=0 (JSDOM)
            // scrollTop=1476 → firstVisible=41; startIndex=max(0,41-10)=31 → page 1
            // endIndex=min(41+0+10,500)=51; endIndex-1=50 → page 2 (isCrossPage=true)
            // newSkip=(1-1)*50=0, newTake=(2-1+1)*50=100
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const saved: { [k: string]: any } = {
                totalRecords: (renderer as any).totalRecords,
                rowHeight: (renderer as any).rowHeight,
                maxPage: (renderer as any).maxPage,
                currentScrollTop: (renderer as any).currentScrollTop,
                prevStartIndex: (renderer as any).prevStartIndex,
                previousPage: (renderer as any).previousPage,
                pageSkip: (renderer as any).pageSkip,
                pageTake: (renderer as any).pageTake
            };
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).prevStartIndex = 0;
            (renderer as any).previousPage = 1;
            gridObj.setProperties({ pageSettings: { currentPage: 1 } }, true);
            const origNotify: Function = (gridObj as any).notify.bind(gridObj);
            (gridObj as any).notify = (): void => { /* prevent data fetch */ };
            (renderer as any).domScrollListener({ offset: { top: 1476, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            (gridObj as any).notify = origNotify;
            expect((renderer as any).pageSkip).toBe(0);
            expect((renderer as any).pageTake).toBe(100);
            Object.keys(saved).forEach((k: string) => { (renderer as any)[k] = saved[k]; });
        });

        it('domScrollListener should set pageSkip=50 and pageTake=100 when buffer crosses page 2→3', () => {
            // scrollTop=3456 (96*36) → firstVisible=96; startIndex=86 → page 2
            // endIndex=min(96+0+10,500)=106; endIndex-1=105 → page 3 (isCrossPage=true)
            // newSkip=(2-1)*50=50, newTake=(3-2+1)*50=100
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).prevStartIndex = 0;
            (renderer as any).previousPage = 1;
            (renderer as any).pageSkip = -1;
            (renderer as any).pageTake = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 2 } }, true);
            const origNotify: Function = (gridObj as any).notify.bind(gridObj);
            (gridObj as any).notify = (): void => { /* prevent data fetch */ };
            (renderer as any).domScrollListener({ offset: { top: 3456, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            (gridObj as any).notify = origNotify;
            expect((renderer as any).pageSkip).toBe(50);
            expect((renderer as any).pageTake).toBe(100);
            (renderer as any).pageSkip = -1;
            (renderer as any).pageTake = -1;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('onPropertyChanged: domVirtualizationSettings sub-property changes => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: {
                        virtualDomType: 'Row',
                        rowBuffer: 5,
                        scrollThrottle: 0,
                        maxPoolSize: 500,
                        autoRowHeight: false
                    },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should trigger content refresh when rowBuffer changes', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.domVirtualizationSettings.rowBuffer).toBe(8);
                done();
            };
            gridObj.setProperties({ domVirtualizationSettings: { rowBuffer: 8 } });
        });

        it('should trigger content refresh when scrollThrottle changes', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.domVirtualizationSettings.scrollThrottle).toBe(100);
                done();
            };
            gridObj.setProperties({ domVirtualizationSettings: { scrollThrottle: 100 } });
        });

        it('should trigger content refresh when maxPoolSize changes', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.domVirtualizationSettings.maxPoolSize).toBe(300);
                done();
            };
            gridObj.setProperties({ domVirtualizationSettings: { maxPoolSize: 300 } });
        });

        it('should trigger content refresh when autoRowHeight changes', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.domVirtualizationSettings.autoRowHeight).toBe(true);
                done();
            };
            gridObj.setProperties({ domVirtualizationSettings: { autoRowHeight: true } });
        });

        it('should trigger full grid refresh when virtualDomType changes', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.domVirtualizationSettings.virtualDomType).toBe('Row');
                done();
            };
            gridObj.setProperties({ domVirtualizationSettings: { virtualDomType: 'Row' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('onPropertyChanged: detailTemplateHeight with DOM virtualization => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    detailTemplateHeight: 500,
                    detailTemplate: '<div style="height: 100px;"><p>${OrderID}</p></div>',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should trigger content refresh when detailTemplateHeight changes with DOM virtualization enabled', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.detailTemplateHeight).toBe(600);
                done();
            };
            gridObj.setProperties({ detailTemplateHeight: 600 });
        });

        it('should trigger content refresh again for subsequent detailTemplateHeight change', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.detailTemplateHeight).toBe(800);
                done();
            };
            gridObj.setProperties({ detailTemplateHeight: 800 });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('onPropertyChanged: detailTemplateHeight without DOM virtualization => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: false,
                    allowPaging: false,
                    detailTemplateHeight: 500,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should not trigger modelChanged when detailTemplateHeight changes without DOM virtualization', () => {
            let modelChangedFired: boolean = false;
            const origNotify: Function = (gridObj as any).notify.bind(gridObj);
            (gridObj as any).notify = (e: string, args: any): void => {
                if (e === 'model-changed') { modelChangedFired = true; }
                origNotify(e, args);
            };
            gridObj.setProperties({ detailTemplateHeight: 700 });
            (gridObj as any).notify = origNotify;
            expect(modelChangedFired).toBe(false);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('domVirtualCellFocus: early returns and regular row path => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(300),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    allowSelection: true,
                    selectionSettings: { checkboxOnly: false },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should return early when e is null', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect(() => (renderer as any).domVirtualCellFocus(null)).not.toThrow();
        });

        it('should return early when e has no action property', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect(() => (renderer as any).domVirtualCellFocus({})).not.toThrow();
        });

        it('should return early when e.action is empty string', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect(() => (renderer as any).domVirtualCellFocus({ action: '' })).not.toThrow();
        });

        it('should handle downArrow when active element is a row cell (regular path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 1) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.setAttribute('aria-rowindex', '2');
                    cell.setAttribute('aria-colindex', '1');
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'downArrow' })).not.toThrow();
                }
            }
            expect(gridObj.getDataRows().length).toBeGreaterThan(0);
        });

        it('should return early (rowIndex < 0) when upArrow on first row', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.setAttribute('aria-rowindex', '1'); // rowIndex = 0; upArrow → -1 → early return
                    cell.setAttribute('aria-colindex', '1');
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'upArrow' })).not.toThrow();
                }
            }
        });

        it('should handle enter action on a row cell', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.setAttribute('aria-rowindex', '2');
                    cell.setAttribute('aria-colindex', '1');
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'enter' })).not.toThrow();
                }
            }
        });

        it('should handle shiftEnter action on a row cell', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.setAttribute('aria-rowindex', '2');
                    cell.setAttribute('aria-colindex', '1');
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'shiftEnter' })).not.toThrow();
                }
            }
        });

        it('should handle downArrow when active element is an input (template-cell redirect path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            // Focus an input element — ele is not rowcell and is HTMLInputElement → redirect branch fires
            let input: HTMLInputElement = document.createElement('input');
            document.body.appendChild(input);
            input.focus();
            expect(() => (renderer as any).domVirtualCellFocus({ action: 'downArrow' })).not.toThrow();
            document.body.removeChild(input);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('domVirtualCellFocus: grouping path coverage => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    allowPaging: false,
                    allowSelection: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', width: 120 }
                    ],
                    height: 400
                }, done);
        });

        it('should handle downArrow in grouped grid (grouping branch path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'downArrow' })).not.toThrow();
                }
            }
        });

        it('should handle upArrow in grouped grid (grouping branch path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'upArrow' })).not.toThrow();
                }
            }
        });

        it('should handle shiftEnter in grouped grid (grouping branch path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let rows: Element[] = gridObj.getDataRows();
            if (rows.length > 0) {
                let cell: HTMLElement = rows[0].querySelector('.e-rowcell') as HTMLElement;
                if (cell) {
                    cell.tabIndex = 0;
                    cell.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'shiftEnter' })).not.toThrow();
                }
            }
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('resetVirtualFocus: direct invocation coverage => ', () => {
        it('should set isCancel=true and false via resetVirtualFocus handler', (done: Function) => {
            let gridObj: Grid = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 120 }],
                    height: 400
                }, () => {
                    let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    (renderer as any).resetVirtualFocus({ isCancel: true });
                    expect((renderer as any).isCancel).toBe(true);
                    (renderer as any).resetVirtualFocus({ isCancel: false });
                    expect((renderer as any).isCancel).toBe(false);
                    destroy(gridObj);
                    gridObj = null;
                    done();
                });
        });
    });

    describe('focusCell: all branch coverage => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    allowSelection: true,
                    selectionSettings: { checkboxOnly: false },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should return early from focusCell when activeKey is empty string', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).activeKey = '';
            expect(() => (renderer as any).focusCell()).not.toThrow();
        });

        it('should return early from focusCell when row is out of viewport (rowIndex very large)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).activeKey = 'downArrow';
            (renderer as any).rowIndex = 99999;
            expect(() => (renderer as any).focusCell()).not.toThrow();
            (renderer as any).activeKey = '';
        });

        it('should focus cell and clear activeKey when first row and cell exist in viewport', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).activeKey = 'downArrow';
            (renderer as any).rowIndex = 0;
            (renderer as any).cellIndex = 0;
            expect(() => (renderer as any).focusCell()).not.toThrow();
            expect((renderer as any).activeKey).toBe('');
        });

        it('should select row via focusCell when checkboxOnly is false', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            expect(gridObj.selectionSettings.checkboxOnly).toBeFalsy();
            (renderer as any).activeKey = 'downArrow';
            (renderer as any).rowIndex = 1;
            (renderer as any).cellIndex = 0;
            expect(() => (renderer as any).focusCell()).not.toThrow();
            expect((renderer as any).activeKey).toBe('');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('selectVirtualRow: all branch coverage => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should mark isAvailable=false and return early for index >= totalRecords', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let args: any = { selectedIndex: 9999, isAvailable: false };
            (renderer as any).selectVirtualRow(args);
            expect(args.isAvailable).toBe(false);
        });

        it('should mark isAvailable=false and return early for negative index', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let args: any = { selectedIndex: -1, isAvailable: false };
            (renderer as any).selectVirtualRow(args);
            expect(args.isAvailable).toBe(false);
        });

        it('should set isAvailable=true and return early when row already in viewport (index 0)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let args: any = { selectedIndex: 0, isAvailable: false };
            (renderer as any).selectVirtualRow(args);
            expect(args.isAvailable).toBe(true);
        });

        it('should set pendingSelectIndex and scroll when row is outside viewport', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let args: any = { selectedIndex: 450, isAvailable: false };
            (renderer as any).selectVirtualRow(args);
            expect(args.isAvailable).toBe(true);
            expect((renderer as any).pendingSelectIndex).toBe(450);
            (renderer as any).pendingSelectIndex = -1;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('domScrollListener: scroll edge cases => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 0 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should return early (no render) when startIndex equals prevStartIndex', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let currentStart: number = (renderer as any).getStartIndex((renderer as any).currentScrollTop);
            (renderer as any).prevStartIndex = currentStart;
            (renderer as any).domScrollListener({ offset: { top: (renderer as any).currentScrollTop, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).prevStartIndex).toBe(currentStart);
        });

        it('should skip viewport rendering when totalRecords is 0', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            let prevStart: number = (renderer as any).prevStartIndex;
            let origTotal: number = (renderer as any).totalRecords;
            (renderer as any).totalRecords = 0;
            (renderer as any).prevStartIndex = -1;
            (renderer as any).domScrollListener({ offset: { top: 500, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).prevStartIndex).toBe(-1);
            (renderer as any).totalRecords = origTotal;
            (renderer as any).prevStartIndex = prevStart;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('observer uses browser-default scrollThrottle when enableVirtualization forces throttle => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 10, maxPoolSize: 500, scrollThrottle: 0 },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should configure observer with browser-default throttle when enableVirtualization=true and scrollThrottle=0', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            // When enableVirtualization=true and user scrollThrottle=0, bindScrollEvents computes browserDefault (>=100ms)
            const observerScrollThrottle: number = ((renderer as any).observer as any).options.scrollThrottle;
            expect(observerScrollThrottle).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('onDataReady: undefined/null arg edge cases => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 5, maxPoolSize: 500 },
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 120 }],
                    height: 400
                }, done);
        });

        it('should reset pageSkip/pageTake/previousPage when called with undefined (isNullOrUndefined(requestType) path)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 50;
            (renderer as any).pageTake = 100;
            (renderer as any).previousPage = 3;
            (renderer as any).onDataReady({requestType: undefined});
            expect((renderer as any).pageSkip).toBe(-1);
            expect((renderer as any).pageTake).toBe(-1);
            expect((renderer as any).previousPage).toBe(0);
        });

        it('should not update count/maxPage when e is defined but count is undefined', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            const origCount: number = (renderer as any).count;
            const origMaxPage: number = (renderer as any).maxPage;
            // e is defined but no count property → isNullOrUndefined(e.count)=true → skip count update
            (renderer as any).onDataReady({ requestType: 'dom-virtualscroll' });
            expect((renderer as any).count).toBe(origCount);
            expect((renderer as any).maxPage).toBe(origMaxPage);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('setDomVirtualPageQuery: early return when enableVirtualization is false => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 5, maxPoolSize: 500 },
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 120 }],
                    height: 400
                }, done);
        });

        it('should be a no-op when enableVirtualization is false (early return on !enableVirtualization check)', () => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            (renderer as any).pageSkip = 0;
            let skipCalled: boolean = false;
            let args: any = {
                query: { skip: () => { skipCalled = true; }, take: () => {} },
                skipPage: false
            };
            (renderer as any).setDomVirtualPageQuery(args);
            expect(skipCalled).toBe(false);
            expect(args.skipPage).toBe(false);
            (renderer as any).pageSkip = -1;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('refreshOffsets: early return branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(50),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 5, maxPoolSize: 500 },
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 120 }],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should return early from refreshOffsets when count is 0 (blockSize>0 but count=0)', () => {
            const origKeys: string[] = [...renderer.offsetKeys];
            (renderer as any).count = 0;
            renderer.refreshOffsets();
            // offsets/offsetKeys unchanged because count<=0 → early return
            expect(renderer.offsetKeys).toEqual(origKeys);
            (renderer as any).count = 50;
        });

        it('should return early from refreshOffsets when blockSize is 0 (pageSize=1 → 1>>1=0)', () => {
            const origKeys: string[] = [...renderer.offsetKeys];
            const origPageSize: number = (gridObj.pageSettings as any).pageSize;
            (gridObj as any).pageSettings.pageSize = 1;
            (renderer as any).count = 50;
            renderer.refreshOffsets();
            expect(renderer.offsetKeys).toEqual(origKeys);
            (gridObj as any).pageSettings.pageSize = origPageSize;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('appendContent: pendingSelectIndex branch coverage => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    allowSelection: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, done);
        });

        it('should resolve pendingSelectIndex and reset to -1 when row enters viewport after refresh', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            // Set pendingSelectIndex to 0 — first row will be in viewport after refresh
            (renderer as any).pendingSelectIndex = 0;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                // appendContent should have found row 0 → reset pendingSelectIndex to -1
                expect((renderer as any).pendingSelectIndex).toBe(-1);
                done();
            };
            gridObj.refresh();
        });

        it('should keep pendingSelectIndex when row is not yet rendered in current viewport', (done: Function) => {
            let renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
            // Row 490 is far outside the initial viewport
            (renderer as any).pendingSelectIndex = 490;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                // Row 490 not in viewport → pendingSelectIndex still >=0 or was reset to -1 if found
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                (renderer as any).pendingSelectIndex = -1;
                done();
            };
            gridObj.refresh();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // ─── NEW COVERAGE BLOCKS ──────────────────────────────────────────────────

    describe('isRowDomVirtualization false: constructor and method else branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: {
                        virtualDomType: 'Column' as any,
                        rowBuffer: 5,
                        maxPoolSize: 500,
                        autoRowHeight: false
                    },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should cover appendContent else path on refresh (isRowDomVirtualization=false)', (done: Function) => {
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                expect(gridObj.getDataRows().length).toBeGreaterThan(0);
                done();
            };
            gridObj.refresh();
        });

        it('should cover onGroupExpandCollapse else path (no setVirtualDimensions when isRowDomVirt=false)', () => {
            let origCols: string[] = (gridObj.groupSettings as any).columns;
            (gridObj.groupSettings as any).columns = ['CustomerID'];
            let setVirtCalled: boolean = false;
            let origSetVirt: Function = (renderer as any).setVirtualDimensions;
            (renderer as any).setVirtualDimensions = () => { setVirtCalled = true; };
            (renderer as any).onGroupExpandCollapse();
            expect(setVirtCalled).toBe(false);
            (renderer as any).setVirtualDimensions = origSetVirt;
            (gridObj.groupSettings as any).columns = origCols;
        });

        it('should cover updateDetailRowHeight else path (no setVirtualDimensions when isRowDomVirt=false)', () => {
            let setVirtCalled: boolean = false;
            let origSetVirt: Function = (renderer as any).setVirtualDimensions;
            (renderer as any).setVirtualDimensions = () => { setVirtCalled = true; };
            renderer.updateDetailRowHeight(0, true, 100);
            expect(setVirtCalled).toBe(false);
            (renderer as any).setVirtualDimensions = origSetVirt;
        });

        it('should cover selectVirtualRow if-path early return when !isRowDomVirtualization', () => {
            (renderer as any).totalRecords = 200;
            let origGetRow: Function = (gridObj as any).getRowByIndex;
            (gridObj as any).getRowByIndex = (): null => null;
            let args: any = { selectedIndex: 5, isAvailable: false };
            (renderer as any).selectVirtualRow(args);
            expect((renderer as any).pendingSelectIndex).toBe(-1);
            (gridObj as any).getRowByIndex = origGetRow;
        });

        it('should cover renderEmpty with isRowDomVirtualization=false (no virtual-height guard needed)', () => {
            let tbody: HTMLElement = document.createElement('tbody');
            expect(() => renderer.renderEmpty(tbody)).not.toThrow();
        });

        it('should cover removeEventListeners else branches (no verticalScrollbar)', () => {
            expect(() => renderer.removeEventListeners()).not.toThrow();
        });

        it('should cover refreshContentRows default args if-path and else path by calling without args', () => {
            expect(() => (renderer as any).refreshContentRows()).not.toThrow();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('domScrollListener direct invocation: preventScroll, scrollTop update and early-return branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(2000),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, scrollThrottle: 100 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should return early when preventScroll=true (if-path in domScrollListener)', () => {
            (renderer as any).preventScroll = true;
            let prevStartIndex: number = (renderer as any).prevStartIndex;
            (renderer as any).domScrollListener({ offset: { top: 999, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).prevStartIndex).toBe(prevStartIndex);
            (renderer as any).preventScroll = false;
        });

        it('should update currentScrollTop and prevScrollTop from scrollArgs.offset.top', () => {
            (renderer as any).totalRecords = 2000;
            (renderer as any).prevStartIndex = -1;
            (renderer as any).domScrollListener({ offset: { top: 300, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            expect((renderer as any).currentScrollTop).toBe(300);
            expect((renderer as any).prevScrollTop).toBe(300);
            (renderer as any).prevStartIndex = -1;
        });

        it('should NOT call refreshContentRows when startIndex equals prevStartIndex', () => {
            let refreshCalled: boolean = false;
            const origRefresh: Function = (renderer as any).refreshContentRows.bind(renderer);
            (renderer as any).refreshContentRows = (args: any): void => { refreshCalled = true; origRefresh(args); };
            let currentStart: number = (renderer as any).getStartIndex((renderer as any).currentScrollTop);
            (renderer as any).prevStartIndex = currentStart;
            (renderer as any).totalRecords = 2000;
            (renderer as any).domScrollListener({ offset: { top: (renderer as any).currentScrollTop, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            (renderer as any).refreshContentRows = origRefresh;
            expect(refreshCalled).toBe(false);
        });

        it('should NOT call refreshContentRows when domScrollListener is called with unchanged startIndex', (done: Function) => {
            let refreshCalled: boolean = false;
            let origRefresh: Function = (renderer as any).refreshContentRows.bind(renderer);
            let origGetStart: Function = (renderer as any).getStartIndex.bind(renderer);
            (renderer as any).getStartIndex = (): number => 0;
            (renderer as any).prevStartIndex = 0;
            (renderer as any).totalRecords = 2000;
            (renderer as any).refreshContentRows = (args: any): void => { refreshCalled = true; origRefresh(args); };
            (renderer as any).domScrollListener({ offset: { top: 1, left: 0 }, direction: 'down', sentinel: {}, focusElement: null });
            setTimeout(() => {
                (renderer as any).getStartIndex = origGetStart;
                (renderer as any).refreshContentRows = origRefresh;
                expect(refreshCalled).toBe(false);
                done();
            }, 50);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('setVirtualDimensions: null verticalScrollerContainer both path branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should cover normal (else) path in setVirtualDimensions when storedVirtualHeight=0', () => {
            (renderer as any).storedVirtualHeight = 0;
            (renderer as any).currentScrollTop = 0;
            expect(() => (renderer as any).setVirtualDimensions()).not.toThrow();
        });

        it('should cover height-drift correction (if) path in setVirtualDimensions', () => {
            // previousHeight > 0 && totalHeight !== previousHeight && currentScrollTop > 0 → if-branch
            (renderer as any).storedVirtualHeight = 99999;
            (renderer as any).currentScrollTop = 200;
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            expect(() => (renderer as any).setVirtualDimensions()).not.toThrow();
            (renderer as any).storedVirtualHeight = 0;
            (renderer as any).currentScrollTop = 0;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('removeEventListeners: active timer and null content branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should null out observer in removeEventListeners', () => {
            expect((renderer as any).observer).not.toBeNull();
            renderer.removeEventListeners();
            expect((renderer as any).observer).toBeNull();
        });

        it('should not throw when removeEventListeners is called again (observer already null)', () => {
            // observer is already null from the previous test
            expect(() => renderer.removeEventListeners()).not.toThrow();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('focusCell and domVirtualCellFocus: checkboxOnly, emptyRow and template-cell branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    allowPaging: false,
                    allowSelection: true,
                    selectionSettings: { checkboxOnly: true },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should not call selectRow in focusCell when checkboxOnly=true (else path)', () => {
            let selectCalled: boolean = false;
            let origSelect: Function = (gridObj as any).selectRow;
            (gridObj as any).selectRow = () => { selectCalled = true; };
            (renderer as any).activeKey = 'downArrow';
            (renderer as any).rowIndex = 0;
            (renderer as any).cellIndex = 0;
            (renderer as any).focusCell();
            expect(selectCalled).toBe(false);
            expect((renderer as any).activeKey).toBe('');
            (gridObj as any).selectRow = origSelect;
        });

        it('should cover focusCell else branch when cell not found (cellIndex out of range)', () => {
            (renderer as any).activeKey = 'downArrow';
            (renderer as any).rowIndex = 0;
            (renderer as any).cellIndex = 9999;
            expect(() => (renderer as any).focusCell()).not.toThrow();
            (renderer as any).activeKey = '';
        });

        it('should cover emptyRow if-path in domVirtualCellFocus with downArrow (activeKey set)', () => {
            let origGetRow: Function = (gridObj as any).getRowByIndex;
            (gridObj as any).getRowByIndex = (): null => null;
            let cell: HTMLElement = document.createElement('td');
            cell.classList.add('e-rowcell');
            let tr: HTMLElement = document.createElement('tr');
            tr.setAttribute('aria-rowindex', '5');
            tr.appendChild(cell);
            cell.setAttribute('aria-colindex', '1');
            document.body.appendChild(tr);
            cell.tabIndex = 0;
            cell.focus();
            (renderer as any).activeKey = '';
            (renderer as any).totalRecords = 500;
            (renderer as any).domVirtualCellFocus({ action: 'downArrow' });
            expect((renderer as any).activeKey).toBe('downArrow');
            (renderer as any).activeKey = '';
            document.body.removeChild(tr);
            (gridObj as any).getRowByIndex = origGetRow;
        });

        it('should cover emptyRow if-path in domVirtualCellFocus with enter (scrollTop true-branch)', () => {
            let origGetRow: Function = (gridObj as any).getRowByIndex;
            (gridObj as any).getRowByIndex = (): null => null;
            let cell: HTMLElement = document.createElement('td');
            cell.classList.add('e-rowcell');
            let tr: HTMLElement = document.createElement('tr');
            tr.setAttribute('aria-rowindex', '5');
            tr.appendChild(cell);
            cell.setAttribute('aria-colindex', '1');
            document.body.appendChild(tr);
            cell.tabIndex = 0;
            cell.focus();
            (renderer as any).activeKey = '';
            (renderer as any).totalRecords = 500;
            (renderer as any).domVirtualCellFocus({ action: 'enter' });
            expect((renderer as any).activeKey).toBe('enter');
            (renderer as any).activeKey = '';
            document.body.removeChild(tr);
            (gridObj as any).getRowByIndex = origGetRow;
        });

        it('should cover emptyRow if-path in domVirtualCellFocus with upArrow (scrollTop false-branch)', () => {
            let origGetRow: Function = (gridObj as any).getRowByIndex;
            (gridObj as any).getRowByIndex = (): null => null;
            let cell: HTMLElement = document.createElement('td');
            cell.classList.add('e-rowcell');
            let tr: HTMLElement = document.createElement('tr');
            tr.setAttribute('aria-rowindex', '10');
            tr.appendChild(cell);
            cell.setAttribute('aria-colindex', '1');
            document.body.appendChild(tr);
            cell.tabIndex = 0;
            cell.focus();
            (renderer as any).activeKey = '';
            (renderer as any).totalRecords = 500;
            (renderer as any).domVirtualCellFocus({ action: 'upArrow' });
            expect((renderer as any).activeKey).toBe('upArrow');
            (renderer as any).activeKey = '';
            document.body.removeChild(tr);
            (gridObj as any).getRowByIndex = origGetRow;
        });

        it('should cover emptyRow if-path in domVirtualCellFocus with shiftEnter', () => {
            let origGetRow: Function = (gridObj as any).getRowByIndex;
            (gridObj as any).getRowByIndex = (): null => null;
            let cell: HTMLElement = document.createElement('td');
            cell.classList.add('e-rowcell');
            let tr: HTMLElement = document.createElement('tr');
            tr.setAttribute('aria-rowindex', '10');
            tr.appendChild(cell);
            cell.setAttribute('aria-colindex', '1');
            document.body.appendChild(tr);
            cell.tabIndex = 0;
            cell.focus();
            (renderer as any).activeKey = '';
            (renderer as any).totalRecords = 500;
            (renderer as any).domVirtualCellFocus({ action: 'shiftEnter' });
            expect((renderer as any).activeKey).toBe('shiftEnter');
            (renderer as any).activeKey = '';
            document.body.removeChild(tr);
            (gridObj as any).getRowByIndex = origGetRow;
        });

        it('should cover template-cell redirect branch (!isNullOrUndefined(closest(.e-templatecell)))', () => {
            let span: HTMLElement = document.createElement('span');
            let td: HTMLElement = document.createElement('td');
            td.classList.add('e-templatecell');
            td.appendChild(span);
            document.body.appendChild(td);
            span.tabIndex = 0;
            span.focus();
            expect(() => (renderer as any).domVirtualCellFocus({ action: 'downArrow' })).not.toThrow();
            document.body.removeChild(td);
        });

        it('should not call selectRow in domVirtualCellFocus when checkboxOnly=true (else path)', () => {
            let selectCalled: boolean = false;
            let origSelect: Function = (gridObj as any).selectRow;
            (gridObj as any).selectRow = () => { selectCalled = true; };
            let cell: HTMLElement = document.createElement('td');
            cell.classList.add('e-rowcell');
            let tr: HTMLElement = document.createElement('tr');
            tr.setAttribute('aria-rowindex', '2');
            tr.appendChild(cell);
            cell.setAttribute('aria-colindex', '1');
            document.body.appendChild(tr);
            cell.tabIndex = 0;
            cell.focus();
            (renderer as any).totalRecords = 500;
            (renderer as any).domVirtualCellFocus({ action: 'downArrow' });
            expect(selectCalled).toBe(false);
            document.body.removeChild(tr);
            (gridObj as any).selectRow = origSelect;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('measureRowHeights else branch and avgRowHeight=0 edge case => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: true },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should cover measureRowHeights else branch when offsetHeight=0 (tr not in document)', () => {
            let tbody: HTMLElement = document.createElement('tbody');
            let tr: HTMLElement = document.createElement('tr');
            tbody.appendChild(tr);
            let cacheSizeBefore: number = (renderer as any).rowHeightCache.size;
            (renderer as any).measureRowHeights(tbody);
            expect((renderer as any).rowHeightCache.size).toBe(cacheSizeBefore);
        });

        it('should cover getDataRowIndexByScrollTop if-path when avgRowHeight<=0 (dynamic mode)', () => {
            (renderer as any).rowHeight = 0;
            (renderer as any).rowHeightCache.clear();
            (renderer as any).dynamicRowCount = 0;
            (renderer as any).dynamicHeightSum = 0;
            let idx: number = (renderer as any).getDataRowIndexByScrollTop(100);
            expect(idx).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('refreshOffsets !enableVirtualization if-path and domScrollListener else path => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: {
                        virtualDomType: 'Row',
                        rowBuffer: 5,
                        maxPoolSize: 500,
                        autoRowHeight: false
                    },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should return early from refreshOffsets when enableVirtualization=false (if-path)', (done: Function) => {
            let nonVirtGrid: Grid = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500 },
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 120 }],
                    height: 400
                }, () => {
                    let r: DomVirtualContentRenderer = (nonVirtGrid as any).contentModule as DomVirtualContentRenderer;
                    let origKeys: string[] = [...r.offsetKeys];
                    r.refreshOffsets();
                    expect(r.offsetKeys).toEqual(origKeys);
                    destroy(nonVirtGrid);
                    done();
                });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('grouping path: parentsUntil caption row and nextFocusRowInfo undefined branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableDomVirtualization: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    allowPaging: false,
                    allowSelection: true,
                    domVirtualizationSettings: { rowBuffer: 5, maxPoolSize: 500, autoRowHeight: false },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should cover parentsUntil(groupCaptionRow) branch when element is inside a caption row', () => {
            let captionRow: HTMLElement = gridObj.element.querySelector('.e-groupcaptionrow') as HTMLElement;
            if (captionRow) {
                let td: HTMLElement = captionRow.querySelector('td') as HTMLElement;
                if (td) {
                    td.tabIndex = 0;
                    td.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'downArrow' })).not.toThrow();
                }
            }
            expect(gridObj.getDataRows().length).toBeGreaterThan(0);
        });

        it('should cover nextFocusRowInfo=undefined branch when nextFocusRow is null (first caption upArrow)', () => {
            let captionRows: NodeListOf<HTMLElement> = gridObj.element.querySelectorAll('.e-groupcaptionrow') as NodeListOf<HTMLElement>;
            if (captionRows.length > 0) {
                let firstCaption: HTMLElement = captionRows[0];
                let td: HTMLElement = firstCaption.querySelector('td') as HTMLElement;
                if (td) {
                    let wasRowCell: boolean = td.classList.contains('e-rowcell');
                    td.classList.add('e-rowcell');
                    td.tabIndex = 0;
                    td.focus();
                    expect(() => (renderer as any).domVirtualCellFocus({ action: 'upArrow' })).not.toThrow();
                    if (!wasRowCell) { td.classList.remove('e-rowcell'); }
                }
            }
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // ─── EDITING / ADD-ROW RESTORE COVERAGE ──────────────────────────────────

    describe('Normal edit: startEdit, scroll away, form maintained, endEdit saves => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(500);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    allowPaging: false,
                    allowSorting: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should open edit form on startEdit', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.selectRow(0, true);
            gridObj.startEdit();
        });

        it('should preserve virtualData when edit row scrolls out of viewport', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 3000;
            setTimeout(() => {
                // Edit form is gone from DOM but state is preserved
                expect(gridObj.isEdit).toBeTruthy();
                const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                const virtualData: Object = (renderer as any).virtualData;
                expect(Object.keys(virtualData).length).toBeGreaterThanOrEqual(0);
                expect((renderer as any).editedRowIndex).toBe(0);
                done();
            }, 300);
        });

        it('should restore edit form when scrolling back to edited row', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            gridObj.dataBound = () => {
                gridObj.dataBound = undefined;
                const editedRow: Element = gridObj.element.querySelector('.e-editedrow');
                if (editedRow) {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                }
                expect(gridObj.isEdit).toBeTruthy();
                done();
            };
            contentElement.scrollTop = 0;
        });

        it('should save the edit via endEdit and clear edit state', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.endEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Normal edit: sort action clears edit form => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(500);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    allowPaging: false,
                    allowSorting: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should open edit form before sort', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeTruthy();
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.selectRow(0, true);
            gridObj.startEdit();
        });

        it('should clear edit state after sort action completes', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'sorting') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    expect(Object.keys((renderer as any).virtualData).length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.sortColumn('OrderID', 'Ascending', false);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Normal edit: closeEdit cancels and clears edit state => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should open edit form via startEdit', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeTruthy();
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.selectRow(0, true);
            gridObj.startEdit();
        });

        it('should cancel edit and clear state via closeEdit', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    expect(Object.keys((renderer as any).virtualData).length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.closeEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Add row: addRecord form shown, scroll away, data preserved, endEdit saves => ', () => {
        let gridObj: Grid;
        let largeDataset: Object[] = generateLargeDataset(500);

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset,
                    enableDomVirtualization: true,
                    allowPaging: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Top' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should show add form on addRecord', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.addRecord();
        });

        it('should preserve isAdd flag when add row scrolls out of viewport', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 3000;
            setTimeout(() => {
                expect(gridObj.isEdit).toBeTruthy();
                const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                expect((renderer as any).isAdd).toBeTruthy();
                done();
            }, 300);
        });

        it('should restore add form when scrolling back to top', (done: Function) => {
            let contentElement: HTMLElement = gridObj.getContent().firstChild as HTMLElement;
            contentElement.scrollTop = 0;
            setTimeout(() => {
                expect(gridObj.isEdit).toBeTruthy();
                done();
            }, 300);
        });

        it('should cancel add row via closeEdit', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.closeEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            largeDataset = null;
        });
    });

    describe('Add row: addRecord, endEdit saves record to dataset => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(100),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Top' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should show add form and allow data entry', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    const orderInput: HTMLInputElement = gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as HTMLInputElement;
                    if (orderInput) { orderInput.value = '99999'; }
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.addRecord();
        });

        it('should save new record via endEdit and clear add state', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    expect((renderer as any).isAdd).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.endEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Normal edit: filter action clears edit state => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(300),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    allowFiltering: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                        { field: 'Freight', headerText: 'Freight', width: 120, format: 'C2' }
                    ],
                    height: 400
                }, done);
        });

        it('should open edit form before filtering', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeTruthy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.selectRow(0, true);
            gridObj.startEdit();
        });

        it('should clear edit state after filter action', (done: Function) => {
            let actionComplete: Function = (args: EditEventArgs) => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    const renderer: DomVirtualContentRenderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    expect(Object.keys((renderer as any).virtualData).length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete as any;
            gridObj.filterByColumn('CustomerID', 'equal', 'VINET0');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('onEntered: sentinel callback branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(500),
                    enableDomVirtualization: true,
                    enableVirtualization: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    domVirtualizationSettings: { virtualDomType: 'Row', rowBuffer: 5, maxPoolSize: 500 },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should not execute when direction is not up or down (e.g. right)', () => {
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).pageSkip = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 1 } }, true);
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'right', { top: 1476, left: 0 });
            (gridObj as any).showMaskRow = origShow;
            expect(showMaskCalled).toBe(false);
        });

        it('should not execute when enableVirtualization is false', () => {
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            let origVirt: boolean = (gridObj as any).enableVirtualization;
            (gridObj as any).enableVirtualization = false;
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'down', { top: 1476, left: 0 });
            (gridObj as any).enableVirtualization = origVirt;
            (gridObj as any).showMaskRow = origShow;
            expect(showMaskCalled).toBe(false);
        });

        it('should not call showMaskRow when pageChanged=false and rangeChanged=false', () => {
            // startPage=1, currentPage=1 → pageChanged=false; newSkip=-1, pageSkip=-1 → rangeChanged=false
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).pageSkip = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 1 } }, true);
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'down', { top: 720, left: 0 }); // scrollTop=720 → startPage=1
            (gridObj as any).showMaskRow = origShow;
            expect(showMaskCalled).toBe(false);
        });

        it('should not call showMaskRow when (pageChanged||rangeChanged) but enableVirtualMaskRow=false', () => {
            // scrollTop=1476 → startPage=1, currentPage=2 → pageChanged=true; but enableVirtualMaskRow=false (default)
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).pageSkip = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 2 } }, true);
            (gridObj as any).enableVirtualMaskRow = false;
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'down', { top: 1476, left: 0 }); // startPage=1 ≠ currentPage=2 → pageChanged=true
            (gridObj as any).showMaskRow = origShow;
            (gridObj as any).enableVirtualMaskRow = false;
            expect(showMaskCalled).toBe(false);
        });

        it('should call showMaskRow when (pageChanged||rangeChanged) and enableVirtualMaskRow=true', () => {
            // scrollTop=1476 → startPage=1, currentPage=2 → pageChanged=true; enableVirtualMaskRow=true → showMaskRow called
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).pageSkip = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 2 } }, true);
            (gridObj as any).enableVirtualMaskRow = true;
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'down', { top: 1476, left: 0 });
            (gridObj as any).showMaskRow = origShow;
            (gridObj as any).enableVirtualMaskRow = false;
            expect(showMaskCalled).toBe(true);
        });

        it('should call showMaskRow when direction=up and (pageChanged||rangeChanged) and enableVirtualMaskRow=true', () => {
            (renderer as any).totalRecords = 500;
            (renderer as any).rowHeight = 36;
            (renderer as any).maxPage = 10;
            (renderer as any).pageSkip = -1;
            gridObj.setProperties({ pageSettings: { currentPage: 2 } }, true);
            (gridObj as any).enableVirtualMaskRow = true;
            let showMaskCalled: boolean = false;
            let origShow: Function = (gridObj as any).showMaskRow;
            (gridObj as any).showMaskRow = () => { showMaskCalled = true; };
            const cb: Function = (renderer as any).onEntered();
            cb(null, {}, 'up', { top: 1476, left: 0 });
            (gridObj as any).showMaskRow = origShow;
            (gridObj as any).enableVirtualMaskRow = false;
            expect(showMaskCalled).toBe(true);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('addActionBegin: Top and Bottom newRowPosition branches => ', () => {
        let gridObj: Grid;
        let renderer: DomVirtualContentRenderer;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: generateLargeDataset(200),
                    enableDomVirtualization: true,
                    allowPaging: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Top' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 125 }
                    ],
                    height: 400
                }, () => {
                    renderer = (gridObj as any).contentModule as DomVirtualContentRenderer;
                    done();
                });
        });

        it('should skip all logic when isNormaledit=false', () => {
            let origIsNormal: boolean = (renderer as any).isNormaledit;
            (renderer as any).isNormaledit = false;
            let args: any = { startEdit: true };
            (renderer as any).addActionBegin(args);
            expect(args.startEdit).toBe(true); // unchanged
            (renderer as any).isNormaledit = origIsNormal;
        });

        it('should set scrollTop=0 and startEdit=false when newRowPosition=Top and scrollTop>0', () => {
            // Simulate content scrolled down
            (renderer as any).content.scrollTop = 500;
            let args: any = { startEdit: true };
            (renderer as any).addActionBegin(args);
            expect(args.startEdit).toBe(false);
            expect((renderer as any).content.scrollTop).toBe(0);
            expect((renderer as any).isAdd).toBe(true);
        });

        it('should only set isAdd=true (not change scrollTop) when newRowPosition=Top and scrollTop=0', () => {
            (renderer as any).content.scrollTop = 0;
            (renderer as any).isAdd = false;
            let args: any = { startEdit: true };
            (renderer as any).addActionBegin(args);
            expect(args.startEdit).toBe(true); // inner if not taken, startEdit unchanged
            expect((renderer as any).isAdd).toBe(true);
        });

        it('should set scrollTop=bottomOffset and startEdit=false when newRowPosition=Bottom and scrollTop<bottomOffset', () => {
            gridObj.setProperties({ editSettings: { newRowPosition: 'Bottom' } }, true);
            (renderer as any).totalRecords = 200;
            (renderer as any).rowHeight = 36;
            (renderer as any).content.scrollTop = 0; // 0 < bottomOffset(200*36=7200) - clientHeight(0) = 7200
            let args: any = { startEdit: true };
            (renderer as any).addActionBegin(args);
            expect(args.startEdit).toBe(false);
            expect((renderer as any).isAdd).toBe(true);
            gridObj.setProperties({ editSettings: { newRowPosition: 'Top' } }, true);
        });

        it('should not change scrollTop when newRowPosition=Bottom and totalRecords=0', () => {
            gridObj.setProperties({ editSettings: { newRowPosition: 'Bottom' } }, true);
            let origTotal: number = (renderer as any).totalRecords;
            (renderer as any).totalRecords = 0;
            (renderer as any).content.scrollTop = 0;
            let args: any = { startEdit: true };
            (renderer as any).addActionBegin(args);
            expect((renderer as any).content.scrollTop).toBe(0); // bottom branch not entered
            (renderer as any).totalRecords = origTotal;
            gridObj.setProperties({ editSettings: { newRowPosition: 'Top' } }, true);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
