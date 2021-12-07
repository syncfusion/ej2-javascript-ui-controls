import { IDataOptions, IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, extend } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { PivotCellSelectedEventArgs } from '../../src/common/base/interface';
import {
    BeforeCopyEventArgs, RowSelectingEventArgs,
    RowSelectEventArgs, RowDeselectEventArgs, CellSelectingEventArgs,
    CellSelectEventArgs, CellDeselectEventArgs, QueryCellInfoEventArgs, HeaderCellInfoEventArgs,
    Grid, ColumnDragEventArgs, ResizeArgs
} from '@syncfusion/ej2-grids';
import { ExcelExport, PDFExport } from '../../src/pivotview/actions';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Data Grid Features module - ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe(' - dataSource ejGrid features combo - ', () => {
        let pivotGridObj: PivotView;
        let eventName: string;
        let args: any;
        let selectArgs: PivotCellSelectedEventArgs;
        let headers: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px;' });
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(GroupingBar, ExcelExport, PDFExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    expandAll: true,
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'eyeColor' }, { name: 'product' }],
                    columns: [{ name: 'isActive' }, { name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }]
                },
                width: 4000,
                showGroupingBar: true,
                gridSettings: {
                    allowTextWrap: true,
                    allowReordering: true,
                    allowSelection: true,
                    // contextMenuItems: [{ text: 'Copy with headers', target: '.e-content', id: 'copywithheader' }],
                    selectionSettings: { cellSelectionMode: 'Box', mode: 'Cell', type: 'Single' },
                    rowHeight: 40,
                    gridLines: 'None',
                    // contextMenuClick: (args: MenuEventArgs): void => {
                    //     eventName = args.name;
                    //     args = args;
                    // },
                    // contextMenuOpen: (args: ContextMenuOpenEventArgs): void => {
                    //     eventName = args.name;
                    //     args = args;
                    // },
                    beforeCopy: (args: BeforeCopyEventArgs): void => {
                        eventName = 'beforeCopy';
                        args = args;
                    },
                    beforePrint: (args: any): void => {
                        eventName = 'beforePrint';
                        args = args;
                    },
                    printComplete: (args: any): void => {
                        eventName = 'printComplete';
                        args = args;
                    },
                    rowSelecting: (args: RowSelectingEventArgs): void => {
                        eventName = 'rowSelecting';
                        args = args;
                    },
                    rowSelected: (args: RowSelectEventArgs): void => {
                        eventName = 'rowSelected';
                        args = args;
                    },
                    rowDeselecting: (args: RowDeselectEventArgs): void => {
                        eventName = 'rowDeselecting';
                        args = args;
                    },
                    rowDeselected: (args: RowDeselectEventArgs): void => {
                        eventName = 'rowDeselected';
                        args = args;
                    },
                    cellSelecting: (args: CellSelectingEventArgs): void => {
                        eventName = 'cellSelecting';
                        args = args;
                    },
                    cellSelected: (args: CellSelectEventArgs): void => {
                        eventName = 'cellSelected';
                        args = args;
                    },
                    cellDeselecting: (args: CellDeselectEventArgs): void => {
                        eventName = 'cellDeselecting';
                        args = args;
                    },
                    cellDeselected: (args: CellDeselectEventArgs): void => {
                        eventName = 'cellDeselected';
                        args = args;
                    },
                    resizeStart: (args: ResizeArgs): void => {
                        eventName = 'resizeStart';
                        args = args;
                    },
                    resizing: (args: ResizeArgs): void => {
                        eventName = 'resizing';
                        args = args;
                    },
                    resizeStop: (args: ResizeArgs): void => {
                        eventName = 'resizeStop';
                        args = args;
                    },
                    queryCellInfo: (args: QueryCellInfoEventArgs): void => {
                        eventName = 'queryCellInfo';
                        args = args;
                    },
                    headerCellInfo: (args: HeaderCellInfoEventArgs): void => {
                        eventName = 'headerCellInfo';
                        args = args;
                    },
                    columnDragStart: (args: ColumnDragEventArgs): void => {
                        eventName = 'resizeStop';
                        args = args;
                    },
                    columnDrag: (args: ColumnDragEventArgs): void => {
                        eventName = 'queryCellInfo';
                        args = args;
                    },
                    columnDrop: (args: ColumnDragEventArgs): void => {
                        eventName = 'headerCellInfo';
                        args = args;
                    }
                },
                cellSelected: (args: PivotCellSelectedEventArgs): void => {
                    eventName = 'cellSelected';
                    selectArgs = args;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        let dataSourceSettings: IDataOptions
        let gridObj: Grid
        it('pivotgrid render testing', (done: Function) => {
            dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
            gridObj = pivotGridObj.grid;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="14"]')[0] as HTMLElement).innerText).toBe('1939');
                done();
            }, 1000);
        });

        // it('context menu header', () => {
        //     (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
        //     let e = {
        //         event: (gridObj.contextMenuModule as any).eventArgs,
        //         items: gridObj.contextMenuModule.contextMenu.items
        //     };
        //     (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
        //     (gridObj.contextMenuModule as any).contextMenuOpen();
        //     (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        //     expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(1);
        // });

        // it('context menu content', () => {
        //     (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
        //     let e = {
        //         event: (gridObj.contextMenuModule as any).eventArgs,
        //         items: gridObj.contextMenuModule.contextMenu.items
        //     };
        //     (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
        //     expect(gridObj.contextMenuModule.isOpen).toBe(false);
        //     expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
        //     expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
        // });

        it('Clipboard Check hidden clipboard textarea', () => {
            let clipArea: HTMLElement = (gridObj.element.querySelectorAll('.e-clipboard')[0] as HTMLElement);
            expect(gridObj.element.querySelectorAll('.e-clipboard').length > 0).toBeTruthy();
            expect(clipArea.style.opacity === '0').toBeTruthy();
        });

        it('Clipboard Check with row type selection', (done: Function) => {
            gridObj.selectRows([0, 1]);
            gridObj.copy();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                // expect((document.querySelector('.e-clipboard') as HTMLInputElement).value.length).toBe(244);
                done();
            }, 1000);
        });

        it('Clipboard Check with row type selection - include header', (done: Function) => {
            gridObj.copy(true);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-clipboard') as HTMLInputElement).value.length).toBe(364);
                done();
            }, 1000);
        });

        // it('resize start', () => {
        //     let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
        //     (gridObj.resizeModule as any).resizeStart({ target: handler });
        //     expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
        // });

        // it('resize end', () => {
        //     let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
        //     (gridObj.resizeModule as any).resizeEnd({ target: handler });
        //     expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
        //     let head = gridObj.getHeaderTable();
        //     [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
        //         expect(ele.classList.contains(resizeClassList.cursor)).toBeFalsy();
        //     });
        //     expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeFalsy();
        //     expect((gridObj.resizeModule as any).pageX).toBeNull();
        //     expect((gridObj.resizeModule as any).element).toBeNull();
        //     expect((gridObj.resizeModule as any).column).toBeNull();
        //     expect((gridObj.resizeModule as any).helper).toBeNull();
        //     expect(gridObj.element.querySelector('.' + resizeClassList.helper)).toBeFalsy();
        // });

        // it('resizing - mousemove', () => {
        //     let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
        //     (gridObj.resizeModule as any).resizeStart({ target: handler, pageX: 0 });
        //     (gridObj.resizeModule as any).resizing({ target: handler, pageX: 200 });
        //     let width = (gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth;
        //     (gridObj.resizeModule as any).resizing({ target: handler, pageX: 300 });
        //     width += 100;
        //     expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth);
        //     (gridObj.resizeModule as any).resizing({ target: handler, pageX: 100 });
        //     width -= 200;
        //     expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth);
        //     pivotGridObj.copy();
        // });

        it('select - col index 1', (done: Function) => {
            (document.querySelector('td[aria-colindex="1"]') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(selectArgs.selectedCellsInfo.length).toBe(1);
                expect(selectArgs.selectedCellsInfo[0].rowHeaders).toBe('blue');
                expect(selectArgs.selectedCellsInfo[0].columnHeaders).toBe('false.female');
                done();
            }, 1000);
        })
        it('select - col index 2', (done: Function) => {
            (document.querySelector('td[aria-colindex="2"]') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(selectArgs.selectedCellsInfo.length).toBe(1);
                expect(selectArgs.selectedCellsInfo[0].value).toBe(359);
                done();
            }, 1000);
        })
        it('switch row select', (done: Function) => {
            pivotGridObj.gridSettings.selectionSettings.mode = 'Row';
            pivotGridObj.renderPivotGrid();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(selectArgs.selectedCellsInfo.length).toBe(0);
                done();
            }, 1000);
        })
        it('select - row index 5', (done: Function) => {
            (document.querySelector('td[index="5"]') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(selectArgs.selectedCellsInfo.length).toBe(15);
                expect(selectArgs.selectedCellsInfo[0].value).toBe('Car');
                done();
            }, 1000);
        })
        it('select - row index 6', (done: Function) => {
            (document.querySelector('td[index="6"]') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(selectArgs.selectedCellsInfo.length).toBe(15);
                expect(selectArgs.selectedCellsInfo[0].value).toBe('Flight');
                done();
            }, 1000);
        })
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});