import { IDataOptions, IDataSet, IAxisSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata, pivot_smalldata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, isNullOrUndefined, remove, EmitType, EventHandler, extend, getInstance } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import {
    CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs, AggregateEventArgs,
    PivotCellSelectedEventArgs, ColumnRenderEventArgs, BeginDrillThroughEventArgs, PdfCellRenderArgs,
    ToolbarArgs, RenameReportArgs, RemoveReportArgs, SaveReportArgs, FetchReportArgs, LoadReportArgs, ChartSeriesCreatedEventArgs
} from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import {
    BeforeCopyEventArgs, RowSelectingEventArgs,
    RowSelectEventArgs, RowDeselectEventArgs, CellSelectingEventArgs,
    CellSelectEventArgs, CellDeselectEventArgs, QueryCellInfoEventArgs, HeaderCellInfoEventArgs,
    ContextMenuOpenEventArgs, Grid, resizeClassList, ColumnDragEventArgs, ResizeArgs
} from '@syncfusion/ej2-grids';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ExcelExport, PDFExport, VirtualScroll } from '../../src/pivotview/actions';
import { BeforeExportEventArgs, onPdfCellRender } from '../../src';
import { DrillThrough } from '../../src/pivotview/actions'
import { DataManager, JsonAdaptor } from '@syncfusion/ej2-data';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { LoadEventArgs } from '../../src';
import { MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotUtil } from '../../src/base/util';
import { Toolbar } from '../../src/common/popups/toolbar';
import { Series, IResizeEventArgs } from '@syncfusion/ej2-charts';
import { PivotChart } from '../../src/pivotchart/index';
import { Grouping } from '../../src/common/popups/grouping'
import { CheckBox } from '@syncfusion/ej2-buttons';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';

describe('PivotView spec', () => {
    /**
     * PivotGrid base spec
     */


    function copyObject(source: any, destiation: any): Object {
        for (let prop of source) {
            destiation[prop] = source[prop];
        }
        return destiation;
    }

    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number): Object {
        let tempEvent: any = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
        let returnObject: any = copyObject(tempEvent, {});
        returnObject.preventDefault = () => { return true; };

        if (!isNullOrUndefined(x)) {
            returnObject.pageX = x;
            returnObject.clientX = x;
        }
        if (!isNullOrUndefined(y)) {
            returnObject.pageY = y;
            returnObject.clientY = y;
        }
        if (!isNullOrUndefined(currentTarget)) {
            returnObject.currentTarget = currentTarget;
        }
        if (!isNullOrUndefined(target)) {
            returnObject.target = returnObject.srcElement = returnObject.toElement = target;
            returnObject.offsetY = 7;
        }
        returnObject.type = 'mouse';
        return returnObject;
    }

    function setMouseCordinates(eventarg: any, x: number, y: number): Object {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        eventarg.offsetY = 7;
        return eventarg;
    }

    function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
        let mouseEve: MouseEvent = document.createEvent('MouseEvents');
        if (x && y) {
            mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
        } else {
            mouseEve.initEvent(eventType, true, true);
        }
        node.dispatchEvent(mouseEve);
    }

    function triggerEvent(node: HTMLElement, eventType: string) {
        let mouseEve: MouseEvent = document.createEvent('MouseEvents');
        mouseEve.initEvent(eventType, true, true);
        node.dispatchEvent(mouseEve);
    }

    function saveReport(args: SaveReportArgs): void {
        let reports: SaveReportArgs[] = [];
        let isSaved: boolean = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reports = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            reports.map(function (item: any): any {
                if (args.reportName === item.reportName) {
                    item.report = args.report; isSaved = true;
                }
            });
            if (!isSaved) {
                reports.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(reports);
        }
    }

    function fetchReport(args: FetchReportArgs): void {
        let reportCollection: string[] = [];
        let reeportList: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): void { reeportList.push(item.reportName); });
        args.reportName = reeportList;
    }

    function loadReport(args: LoadReportArgs): void {
        let reportCollection: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): void {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            this.dataSource = JSON.parse(args.report).dataSource;
        }
    }

    function removeReport(args: RemoveReportArgs): void {
        let reportCollection: any[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        for (let i: number = 0; i < reportCollection.length; i++) {
            if (reportCollection[i].reportName === args.reportName) {
                reportCollection.splice(i, 1);
            }
        }
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportCollection);
        }
    }

    function renameReport(args: RenameReportArgs): void {
        let reportCollection: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): any { if (args.reportName === item.reportName) { item.reportName = args.rename; } });
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportCollection);
        }
    }

    function newReport(): void {
    }

    function beforeToolbarRender(args: ToolbarArgs): void {
        args.customToolbar.splice(4, 0, {
            prefixIcon: 'e-new-report e-icons', tooltipText: 'ADD', id: 'new-report'
        });
    }

    function beforeExport(args: BeforeExportEventArgs): void {
        args.dataCollections.push(args.dataCollections[0]);
        args.header = 'This is Header';
        args.footer = 'This is Footer';
        args.style = {
            header: {
                bold: true,
                border: { color: '#000000', dashStyle: 'DashDot', width: 2 },
                fontColor: '#bd1616',
                fontName: 'Symbol',
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8
            },
            record: {
                bold: true,
                border: { color: '#000000', dashStyle: 'Dot', width: 2 },
                fontColor: '#bd1616',
                fontName: 'Courier',
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8
            }
        };
    }

    function pdfCellRender(args: PdfCellRenderArgs): void {
        if (args.pivotCell && args.pivotCell.formattedText == 'balance') {
            args.style = {
                backgroundColor: '#bd1616',
                bold: true,
                textBrushColor: '#00FFFF',
                textPenColor: '#0000FF',
                border: { color: '#000000', dashStyle: 'DashDotDot', width: 2 },
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8,
                fontFamily: undefined
            };
        } else if (args.pivotCell && args.pivotCell.formattedText == 'blue') {
            args.style = {
                backgroundColor: '#bd1616',
                bold: true,
                textBrushColor: '#00FFFF',
                textPenColor: '#0000FF',
                border: { color: '#000000', dashStyle: 'Dash', width: 2 },
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8,
                fontFamily: 'TimesNewRoman'
            };
        } else if (args.pivotCell && args.pivotCell.formattedText == 'true') {
            args.style = {
                backgroundColor: '#bd1616',
                bold: true,
                textBrushColor: '#00FFFF',
                textPenColor: '#0000FF',
                border: undefined,
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8,
                fontFamily: 'TimesRoman'
            };
        } else {
            args.style = {
                backgroundColor: '#bd1616',
                bold: true,
                textBrushColor: '#00FFFF',
                textPenColor: '#0000FF',
                border: { color: '#000000', dashStyle: 'DashDotDot', width: 2 },
                underline: true,
                italic: true,
                strikeout: true,
                fontSize: 8,
                fontFamily: 'ZapfDingbats'
            };
        }
    }

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Grid base module - ', () => {
        describe('- Grid properties - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        filterSettings: [
                            { name: 'eyeColor', type: 'Include', items: ['blue'] },
                            { name: 'isActive', type: 'Include', items: ['true'] }
                        ],
                        rows: [{ name: 'eyeColor' }, { name: 'product' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }]
                    }, width: 1000,
                    height: 500
                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            let persistdata: string;
            let dataSourceSettings: IDataOptions
            it('pivotgrid render testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    pivotGridObj.onWindowResize();
                    pivotGridObj.renderModule.updateGridSettings();
                    done();
                }, 2000);
            });

            it('pivotgrid setPersist', () => {
                persistdata = pivotGridObj.getPersistData();
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSourceSettings)).toBeTruthy();
            });

            it('pivotgrid loadPersist', () => {
                pivotGridObj.loadPersistData(persistdata);
                expect(document.getElementsByClassName('e-pivotview')).toBeTruthy();
            });

            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="3"]');
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$68,573.14');
                    done();
                }, 2000);
            });

            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[1] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$6,891.93');
                    done();
                }, 2000);
            });

            it('Mouse hover event testing - top left cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(0);
                    done();
                }, 2000);
            });

            it('Mouse hover event testing - bottom left value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[1] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$80,237.13');
                    done();
                }, 2000);
            });

            it('Mouse hover event testing - bottom right value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[7] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$148,810.27');
                    done();
                }, 2000);
            });

            it('Mouse hover event testing - bottom middle value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[5] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$148,810.27');
                    done();
                }, 2000);
            });

            it('hide tooltip', (done: Function) => {
                pivotGridObj.showTooltip = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[5] as HTMLElement;
                    triggerMouseEvent(target, 'mouseover');
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent').length).toBe(0);
                    done();
                }, 2000);
            })

            it('pivotgrid change locale', (done: Function) => {
                pivotGridObj.locale = 'es-ES';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[index="10"]')[0].textContent).toBe('Grand Total');
                    done();
                }, 2000);
            });

            it('pivotgrid set data source', (done: Function) => {
                let dataSourceSettings: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSourceSettings as IDataOptions;
                dataSourceSettings.filterSettings = [];
                pivotGridObj.dataSourceSettings = dataSourceSettings;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length > 2).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid click collapse icon', (done: Function) => {
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-collapse')[1] as HTMLElement;
                icon.click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                    expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="7"]')[1] as HTMLElement).innerText.trim()).toBe('$15,036.18');
                    done();
                }, 2000);
            });

            it('pivotgrid click collapse icon', (done: Function) => {
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-collapse')[1] as HTMLElement;
                icon.click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[5] as HTMLElement).innerText).toBe('Jet');
                    done();
                }, 2000);
            });

            it('pivotgrid click expand icon', (done: Function) => {
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-expand')[1] as HTMLElement;
                icon.click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                    expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[5] as HTMLElement).innerText).toBe('Tempo');
                    done();
                }, 2000);
            });

            it('pivotgrid click non icon space', (done: Function) => {
                let element: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                element.click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    done();
                }, 2000);
            });

            it('pivotgrid destroy engine', (done: Function) => {
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-rowcell') === null).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource', (done: Function) => {
                let dataSourceSettings: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSourceSettings as IDataOptions;
                dataSourceSettings.rows.pop();
                pivotGridObj.dataSourceSettings = dataSourceSettings;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.pivotValues.length > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid get dataSource', () => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                expect(dataSourceSettings.columns.length).toBe(2);
            });

            it('pivotgrid set dataSource', () => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                dataSourceSettings.rows.push({ name: 'product' });
                expect(pivotGridObj.dataSourceSettings.rows.length === 2).toBeTruthy();
            });

            it('pivotgrid get dataSource', () => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                expect(dataSourceSettings.columns.length).toBe(2);
            });

            it('pivotgrid set dataSource', (done: Function) => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                dataSourceSettings.values = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-rowcell') !== null).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource without filtering', (done: Function) => {
                dataSourceSettings = pivotGridObj.dataSourceSettings;
                dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelectorAll('td[index="10"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll false', (done: Function) => {
                dataSourceSettings.expandAll = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(4);
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll false', (done: Function) => {
                dataSourceSettings.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll true', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { expandAll: true } }, true);
                dataSourceSettings.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(3);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings include', (done: Function) => {
                dataSourceSettings.filterSettings = [
                    { name: 'eyeColor', type: 'Include', items: ['blue'] },
                    { name: 'isActive', type: 'Include', items: ['true'] }
                ];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(0);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Grand Total');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings exclude', (done: Function) => {
                dataSourceSettings.filterSettings = [
                    { name: 'eyeColor', type: 'Exclude', items: ['blue'] },
                    { name: 'isActive', type: 'Exclude', items: ['true'] }
                ];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('green');
                    done();
                }, 3000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll false', (done: Function) => {
                dataSourceSettings.expandAll = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    // expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { enableSorting: true } }, true);
                dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Van');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting', (done: Function) => {
                dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }, { name: 'eyeColor', order: 'Descending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting ascending', (done: Function) => {
                dataSourceSettings.sortSettings = [{ name: 'product', order: 'Ascending' }, { name: 'eyeColor', order: 'Ascending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll true', (done: Function) => {
                dataSourceSettings.expandAll = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('green');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll true value sort', (done: Function) => {
                //pivotGridObj.enableValueSorting = true;
                pivotGridObj.setProperties({ enableValueSorting: true }, true);
                dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[2] as HTMLElement).children[1].classList.contains('e-descending')).toBe(true);
                    expect((pivotGridObj.element.querySelectorAll('td[index="5"]')[1] as HTMLElement).innerText.trim()).toBe('$21,531.91');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set 3 columns', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { rows: [{ name: 'eyeColor' }] } }, true);
                dataSourceSettings.columns = [{ name: 'isActive' }, { name: 'gender' }, { name: 'product' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element
                        .querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).children[0].classList.contains('e-collapse')).toBe(true);
                    done();
                }, 2000);
            });

            it('pivotgrid all without value sorting', (done: Function) => {
                dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
                dataSourceSettings.columns = [{ name: 'isActive' }, { name: 'gender' }];
                dataSourceSettings.rows = [{ name: 'eyeColor' }, { name: 'product' }];
                dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
                dataSourceSettings.enableSorting = true;
                dataSourceSettings.drilledMembers = [];
                dataSourceSettings.valueSortSettings = {};
                dataSourceSettings.sortSettings = [{ name: 'eyeColor', order: 'Descending' }];
                dataSourceSettings.expandAll = true;
                dataSourceSettings.formatSettings = [{ name: 'balance', format: 'C' }];
                dataSourceSettings.filterSettings = [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                ];
                pivotGridObj.dataSourceSettings = dataSourceSettings;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('th[aria-colindex="3"]').length).toBe(2);
                    expect(document.querySelectorAll('td[aria-colindex="3"]').length).toBe(10);
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting descending', (done: Function) => {
                //pivotGridObj.enableValueSorting = true;
                pivotGridObj.setProperties({ enableValueSorting: true }, true);
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="1"]')[2].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting ascending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="1"]')[2].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all collapse false', (done: Function) => {
                pivotGridObj.dataSourceSettings.drilledMembers = [{ name: 'isActive', items: ['false'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
                dataSourceSettings.columns = [{ name: 'isActive' }];
                dataSourceSettings.rows = [{ name: 'eyeColor' }, { name: 'product' }, { name: 'gender' }];
                pivotGridObj.showTooltip = true;
                pivotGridObj.dataSourceSettings = dataSourceSettings;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(true).toBe(true);
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[5] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[0].innerHTML).toBe('brown - Bike - male');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - Tooltip as false', (done: Function) => {
                pivotGridObj.showTooltip = false;
                pivotGridObj.setProperties({ dataSourceSettings: { columns: [{ name: 'isActive' }, { name: 'gender' }] } }, true);
                pivotGridObj.dataSourceSettings.rows = [{ name: 'eyeColor' }, { name: 'product' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(true).toBe(true);
                    done();
                }, 2000);
            });
        });

        describe(' - dataSource empty combo cases - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px;' });
            let jsonData: DataManager = new DataManager({
                json: pivot_dataset,
                adaptor: new JsonAdaptor
            });
            document.body.appendChild(elem);
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        expandAll: true,
                        dataSource: jsonData,
                        rows: [{ name: 'eyeColor' }, { name: 'product' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }]
                    },
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            let dataSourceSettings: IDataOptions
            it('pivotgrid render testing', (done: Function) => {
                dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="14"]')[0] as HTMLElement).innerText).toBe('1939');
                    done();
                }, 2000);
            });

            it('pivotgrid empty all', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { rows: [], columns: [] } }, true);
                pivotGridObj.dataSourceSettings.values = [];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill value alone', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill column alone', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill column and value', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="3"]').length) > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row alone', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { values: [], columns: [] } }, true);
                pivotGridObj.dataSourceSettings.rows = [{ name: 'eyeColor' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeFalsy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row and value', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 4).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row and column', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill all', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('th[aria-colindex="3"]').length === 1).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="3"]').length) === 4).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill all 2 column', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }, { name: 'gender' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="7"]')[1] as HTMLElement).style.display === 'none').toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid data empty', (done: Function) => {
                pivotGridObj.dataSourceSettings.dataSource = [];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });
        });

        describe('- Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Value Sorting - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'state', order: 'Descending' }],
                            filterSettings: [
                                {
                                    name: 'state', type: 'Include',
                                    items: ['Delhi', 'Tamilnadu', 'New Jercy']
                                }
                            ],
                            rows: [{ name: 'state' }, { name: 'product' }],
                            columns: [{ name: 'eyeColor' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            valueSortSettings: {
                                headerText: 'Grand Total##balance',
                                headerDelimiter: '##',
                                sortOrder: 'Ascending'
                            }
                        },
                        enableValueSorting: true
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('Value sort check', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
                (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).click();
            });
            it('First click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
                (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).click();
            });
            it('Second click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-headertext') as HTMLElement).click();
            });
            it('Cellvalue click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-descending') as HTMLElement).click();
            });
            it('Descending icon click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-ascending') as HTMLElement).click();
            });
            it('Ascending icon click', (done: Function) => {
                expect((pivotGridObj.pivotValues[2][0] as IAxisSet).formattedText).toBe('New Jercy');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    pivotGridObj.dataSourceSettings.valueSortSettings.headerText = 'blue';
                    pivotGridObj.dataSourceSettings.values.pop();
                    done();
                }, 1000);
            });
            it('single measure check', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
            });
            it('single measure check', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
                pivotGridObj.dataSourceSettings.columns.push({ name: 'isActive' });
                pivotGridObj.dataSourceSettings.valueSortSettings.headerText = 'blue';
                pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSourceSettings);
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
            });
            it('single measure with two columns', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
                pivotGridObj.dataSourceSettings.expandAll = true;
                pivotGridObj.dataSourceSettings.valueSortSettings.headerText = 'blue##false';
                pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSourceSettings);
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
            });
            it('With ExpandAll', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
                ((document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement).querySelector('.e-collapse') as HTMLElement).click();
            });
            it('Collapse icon click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
                ((document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement).querySelector('.e-expand') as HTMLElement).click();
            });
            it('Expand icon click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
                (document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).click();
            });
            it('Row header click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
                (document.querySelectorAll('td[aria-colindex="1"]')[0] as HTMLElement).click();
            });
            it('Value cell click', () => {
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });

        describe('Calculated Field', () => {
            let pivotGridObj: PivotView;
            let cf: any;
            let mouseEvent: any;
            let tapEvent: any;
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:600px; width:100%' });
            PivotView.Inject(CalculatedField, GroupingBar, FieldList);
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'state', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            calculatedFieldSettings: [{ name: 'price', formula: '"Sum(balance)"+"Count(quantity)"' }],
                            filterSettings: [
                                {
                                    name: 'state', type: 'Include',
                                    items: ['Delhi', 'Tamilnadu', 'New Jercy']
                                }
                            ],
                            rows: [{ name: 'state' }, { name: 'product' }],
                            columns: [{ name: 'eyeColor' }],
                            values: [{ name: 'balance' }, { name: 'quantity' },
                            { name: 'price', type: 'CalculatedField' }]
                        },
                        allowCalculatedField: true,
                        showGroupingBar: true,
                        showFieldList: true
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('Create Dialog', (done: Function) => {
                cf = new CalculatedField(pivotGridObj);
                cf.createCalculatedFieldDialog(pivotGridObj);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('nodeExpanding event is triggered', () => {
                mouseEvent = {
                    preventDefault: (): void => { },
                    stopImmediatePropagation: (): void => { },
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEvent,
                    tapCount: 1
                };
                let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[2].querySelector('.e-icons');
                cf.treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            it('drag and drop node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
                (document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value = '';
            });
            it('drag and drop node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
            });
            it('drag and drop node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[15].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[15].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
            });
            it('drag and drop node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
            });
            it('drag and drop node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.querySelector('.e-pivot-treeview-outer');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value === null).toBeTruthy;
            });
            it('nodeCollapsing event is triggered', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                tapEvent.originalEvent = mouseEventArgs;
                cf.treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    cf.treeObj.touchClickObj.tap(tapEvent);
                    expect(true).toEqual(true);
                    done();
                }, 1000);
            });
            it('OK Button Click', () => {
                cf.inputObj.value = 'New';
                (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
                (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                cf.dialog.buttons[0].click();
            });
            it('Open Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    cf.createCalculatedFieldDialog(pivotGridObj);
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('treeview click', () => {
                // (document.querySelectorAll('.e-pivot-treeview-outer .e-fullrow')[1] as HTMLElement).click();
                let treeObj: any = cf.treeObj;
                // let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                // let e: any = {
                //     target: li[1].querySelector('.e-fullrow')
                // };
                // cf.fieldClickHandler(e as MouseEvent);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[1].querySelector('.e-format');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            // it('treeview click', () => {
            //     let treeObj: any = cf.treeObj;
            //     let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            //     let e: any = {
            //         target: li[0].querySelector('.e-fullrow')
            //     };
            //     cf.fieldClickHandler(e as MouseEvent);
            //     // (document.querySelector('.e-pivot-treeview-outer .e-fullrow') as HTMLElement).click();
            //     expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            // });
            it('Context menu click', () => {
                // let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
                // EventHandler.trigger(document.querySelector('#' + cf.parentID + 'contextmenu'), 'contextmenu', contextmenu);

                // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                // setTimeout(() => {
                //     mouseEventArgs.target = document.querySelector('#' + cf.parentID + 'contextmenu li');
                //     mouseEventArgs.type = 'click';
                //     cf.menuObj.clickHandler(mouseEventArgs);
                //     done();
                // }, 1000); 
                let menuObj: any = cf.menuObj;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[0]
                };
                menuObj.element.style.display = 'none';
                cf.selectContextMenu(menu as MenuEventArgs);
                expect(true).toBeTruthy();
            });
            it('check context menu click', () => {
                expect(document.querySelector('#' + cf.parentID + 'contextmenu')).toBeTruthy;
                // expect((document.querySelector('#' + cf.parentID + 'contextmenu') as HTMLElement).style.display).toBe('none');
            });
            it('treeview click', function () {
                var treeObj = cf.treeObj;
                // var li = treeObj.element.querySelectorAll('li');
                // var e = {
                //     target: li[13].querySelector('.e-edit')
                // };
                // cf.fieldClickHandler(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[13].querySelector('.e-edit');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            it('Edit Click', function () {
                var treeObj = cf.treeObj;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[13].querySelector('.e-edited');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            it('Clear Click', function () {
                var treeObj = cf.treeObj;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[13].querySelector('.e-edit');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            it('Edit Formula', function (done) {
                cf.inputObj.value = 'Price';
                (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Price';
                (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    cf.dialog.buttons[0].click();
                    done();
                }, 1000);
            });
            it('Open Dialog', function (done) {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    cf.createCalculatedFieldDialog(pivotGridObj);
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Open Dialog', (done: Function) => {
                cf.inputObj.value = 'price';
                (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price';
                (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    cf.dialog.buttons[0].click();
                    done();
                }, 1000);
            });
            it('OK Button Click', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('.e-ok-btn') as HTMLElement).click();
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Open Dialog', (done: Function) => {
                cf.createCalculatedFieldDialog(pivotGridObj);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    cf.inputObj.value = 'price1';
                    (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
                    (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('OK Button Click', (done: Function) => {
                // cf.dialog.buttons[0].click();
                cf.replaceFormula();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Open Dialog', (done: Function) => {
                cf.createCalculatedFieldDialog(pivotGridObj);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    cf.inputObj.value = 'price1';
                    (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'price1';
                    (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '100/*-78';
                    done();
                }, 1000);
            });
            it('OK Button Click', (done: Function) => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                cf.dialog.buttons[0].click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Open Dialog', (done: Function) => {
                (document.querySelector('.e-control.e-btn.e-ok-btn') as any).click();
                // document.querySelector('.e-pivot-error-dialog').remove();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    //cf.dialog.buttons[1].click();
                    done();
                }, 1000);
            });
            it('Cancel Button Click', (done: Function) => {
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    (document.querySelector('.e-toggle-field-list') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check field list icon', (done: Function) => {
                (document.querySelector('.e-calculated-field') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).inputObj.value = 'Pric';
                    (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'Pric';
                    (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = 'balance*100';
                    (pivotGridObj.pivotFieldListModule.calculatedFieldModule as any).dialog.buttons[0].click();
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('check field list icon', (done: Function) => {
                (document.querySelector('.e-calculated-field') as HTMLElement).click();
                // (document.querySelector('.e-calculated-field') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    remove(document.querySelector('.e-dialog'));
                    remove(document.querySelector('.e-dialog'));
                    done();
                }, 1000);
            });
            it('Open Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.setProperties({ enableRtl: true }, true);
                    pivotGridObj.enableRtl = true;
                    cf.createCalculatedFieldDialog(pivotGridObj);
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 1000);
            });
            it('treeview click', () => {
                let treeObj: any = cf.treeObj;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = li[1].querySelector('.e-format');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            });
            it('Context menu click', () => {
                let menuObj: any = cf.menuObj;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[0]
                };
                menuObj.element.style.display = 'none';
                cf.selectContextMenu(menu as MenuEventArgs);
                expect(true).toBeTruthy();
            });
            it('check context menu click', () => {
                expect(document.querySelector('#' + cf.parentID + 'contextmenu')).toBeTruthy;
                cf.dialog.buttons[1].click();
                // remove(document.querySelector('.e-dialog'));
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });

        describe('Cell Click', () => {
            let pivotGridObj: PivotView;
            let fieldName: string;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'state', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            filterSettings: [
                                {
                                    name: 'state', type: 'Include',
                                    items: ['Delhi', 'Tamilnadu', 'New Jercy']
                                }
                            ],
                            rows: [{ name: 'state' }, { name: 'product' }],
                            columns: [{ name: 'eyeColor' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }]
                        },
                        cellClick(args: CellClickEventArgs): void {
                            fieldName = (args as any).data.formattedText;
                        }
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('Column header click', () => {
                (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).click();
                expect(fieldName).toBe('balance');
            });
            it('Row header click', () => {
                (document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).click();
                expect(fieldName).toBe('Tamilnadu');
            });
            it('Value cell click', () => {
                (document.querySelectorAll('td[aria-colindex="1"]')[0] as HTMLElement).click();
                expect(fieldName).toBe('$41,019.61');
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });

        describe('Adaptive Context menu for Grouping Bar', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:600px; width:100%' });
            PivotView.Inject(GroupingBar, FieldList);
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
                pivotGridObj = new PivotView(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'state', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            calculatedFieldSettings: [{ name: 'price', formula: '"Sum(balance)"+"Count(quantity)"' }],
                            filterSettings: [
                                {
                                    name: 'state', type: 'Include',
                                    items: ['Delhi', 'Tamilnadu', 'New Jercy']
                                }
                            ],
                            rows: [{ name: 'state' }, { name: 'product' }],
                            columns: [{ name: 'eyeColor' }],
                            values: [{ name: 'balance' }, { name: 'quantity' },
                            { name: 'price', type: 'CalculatedField' }]
                        },
                        showGroupingBar: true,
                        showFieldList: true,
                        load: () => {
                            pivotGridObj.isAdaptive = true;
                        }
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('taphold button selection for normal field', () => {
                pivotGridObj.isAdaptive = true;
                let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
                let target: HTMLElement = pivotButtons[0];
                let e: any = {}; e.originalEvent = {};
                e.target = target;
                e.type = 'touchstart';
                e.originalEvent.target = target;
                e.originalEvent.type = 'touchstart';
                (pivotGridObj.groupingBarModule as any).tapHoldHandler(e);
                let popup: Element = document.getElementById('PivotGrid_PivotContextMenu');
                expect(popup).toBeTruthy();
            });
            it('check add field to row', () => {
                let menuObj: any = pivotGridObj.contextMenuModule.menuObj;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                // let menu: any = {
                //     element: li[1]
                // };
                // menuObj.element.style.display = 'none';
                // menuObj.onSelectContextMenu(menu as MenuEventArgs);
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-group-rows').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBe(2);
                (li[1] as HTMLElement).click();
                expect(true).toBeTruthy();
            });
            it('check context menu click', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-group-rows').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBe(3);
            });
            it('taphold button selection for calculated field', () => {
                let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
                let target: HTMLElement = pivotButtons[1];
                let e: any = {}; e.originalEvent = {};
                e.target = target;
                e.type = 'touchstart';
                e.originalEvent.target = target;
                e.originalEvent.type = 'touchstart';
                (pivotGridObj.groupingBarModule as any).tapHoldHandler(e);
                let popup: Element = document.getElementById('PivotGrid_PivotContextMenu');
                expect(popup).toBeTruthy();
            });
            it('open field list dialog', (done: Function) => {
                pivotGridObj.pivotFieldListModule.load = function () {
                    pivotGridObj.pivotFieldListModule.isAdaptive = true;
                }
                pivotGridObj.pivotFieldListModule.refresh();
                setTimeout(() => {
                    (document.querySelectorAll('.e-toggle-field-list')[0] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('add field', (done: Function) => {
                (document.querySelectorAll('.e-add-icon')[0] as HTMLElement).click();
                setTimeout(() => {
                    let treeObj: TreeView = pivotGridObj.pivotFieldListModule.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    let firNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firNode.querySelector('.e-frame').dispatchEvent(args);
                    done();
                }, 1000);
            });
            it('add field btn click', (done: Function) => {
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.pivotFieldListModule.isAdaptive).toBeTruthy();
                    done();
                }, 1000);
            });
        });

        describe('Date sorting', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: true,
                            enableSorting: true,
                            sortSettings: [{ name: 'state', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', type: 'date', skeleton: 'GyMMMd' }],
                            filterSettings: [
                                {
                                    name: 'state', type: 'Include',
                                    items: ['Delhi', 'Tamilnadu', 'New Jercy']
                                },
                                {
                                    name: 'date', type: 'Include',
                                    items: ['Dec 14, 1975 AD',
                                        'Jan 18, 2016 AD',
                                        'Jan 31, 2018 AD']
                                }
                            ],
                            rows: [{ name: 'state' }],
                            columns: [{ name: 'eyeColor' }, { name: 'date' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }]
                        },
                        showGroupingBar: true
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('Header label check', () => {
                let value: string = (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).innerText.trim();
                expect(value).toBe('Dec 14, 1975 AD');
                (document.querySelectorAll('.e-sort')[1] as HTMLElement).click();
            });
            it('Header sort check', () => {
                let value: string = (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).innerText.trim();
                expect(value).toBe('Jan 18, 2016 AD');
                (document.querySelectorAll('.e-pv-filtered')[0] as HTMLElement).click();
            });
            // it('Header filter check', (done: Function) => {
            //     let value: string = (document.querySelectorAll('.e-list-text')[2] as HTMLElement).innerText.trim();
            //     setTimeout(() => {
            //         expect(value === 'Jan 31, 2018 AD').toBeTruthy();
            //         done();
            //     }, 1000);
            //     (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click();
            // });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });

        describe('Conditional Formatting', () => {
            describe(' - Code Behind', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: true,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                                filterSettings: [
                                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                                ],
                                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                                conditionalFormatSettings: [
                                    {
                                        value1: 50000,
                                        value2: 600,
                                        conditions: 'Between',
                                        style: {
                                            backgroundColor: 'violet',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '13px'
                                        },
                                    },
                                    {
                                        value1: 50000,
                                        value2: 600,
                                        conditions: 'NotBetween',
                                        style: {
                                            backgroundColor: 'green',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '13px'
                                        },
                                    },
                                    {
                                        measure: 'quantity',
                                        value1: 500,
                                        conditions: 'Equals',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'violet',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    },
                                    {
                                        measure: 'balance',
                                        value1: 500,
                                        conditions: 'NotEquals',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'violet',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    },
                                    {
                                        measure: 'quantity',
                                        value1: 500,
                                        conditions: 'LessThanOrEqualTo',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'violet',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    },
                                    {
                                        measure: 'balance',
                                        value1: 500,
                                        conditions: 'GreaterThanOrEqualTo',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'violet',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    },
                                    {
                                        value1: 600,
                                        value2: 50000,
                                        conditions: 'Between',
                                        style: {
                                            backgroundColor: 'violet',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '13px'
                                        },
                                    },
                                    {
                                        value1: 600,
                                        value2: 50000,
                                        conditions: 'NotBetween',
                                        style: {
                                            backgroundColor: 'green',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '13px'
                                        },
                                    },
                                    {
                                        measure: 'quantity',
                                        label: 'female.false',
                                        value1: 500,
                                        conditions: 'LessThan',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'violet',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    },
                                    {
                                        measure: 'quantity',
                                        label: 'female.false',
                                        value1: 500,
                                        conditions: 'GreaterThan',
                                        style: {
                                            backgroundColor: 'yellow',
                                            color: 'green',
                                            fontFamily: 'Verdana',
                                            fontSize: '15px'
                                        }
                                    }
                                ]
                            },
                            height: 400,
                            allowConditionalFormatting: true
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 3000);
                });
                it('Check Default Format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid6')).toBeTruthy();
                });
                it('Check Default Format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid8')).toBeTruthy();
                    pivotGridObj.dataSourceSettings.values.pop();
                    pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSourceSettings);
                    pivotGridObj.engineModule.isEngineUpdated = false;
                    pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
                });
                it('With Single Measure', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid6')).toBeTruthy();
                });
                it('With Single Measure', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid6')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                });
                it('Without Filtering', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                });
                it('With Filtering', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                        filters: [],
                        calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                measure: 'Price',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                });
                it('With Calculated Field', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[1].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.setProperties({ enableValueSorting: true }, true);
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                        filters: [],
                        calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                        valueSortSettings: { headerText: 'female##false##Price', headerDelimiter: '##', sortOrder: 'Descending' },
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                measure: 'Price',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                    //pivotGridObj.enableValueSorting = true;
                });
                it('With Value Sorting', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.setProperties({ enableValueSorting: true }, true);
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                        filters: [],
                        calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                        sortSettings: [{ name: 'product', order: 'Descending' }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                measure: 'Price',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                    //pivotGridObj.enableValueSorting = false;
                });
                it('With Default Sorting', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[4].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        rows: [{ name: 'company'}],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        conditionalFormatSettings: [
                            {
                                value1: 2000,
                                measure: 'balance',
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    };
                });
                it('Check empty cell', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[4].classList.contains('formatPivotGrid0')).toBeFalsy();
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - UI', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
                PivotView.Inject(ConditionalFormatting);
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: true,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                                filterSettings: [
                                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                                ],
                                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                                conditionalFormatSettings: [
                                    {
                                        measure: 'quantity',
                                        value1: 500,
                                        conditions: 'LessThan',
                                        style: {
                                            backgroundColor: 'green',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '12px'
                                        }
                                    }
                                ]
                            },
                            allowConditionalFormatting: true
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('Check code behind format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Delete format', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-delete-button') as HTMLElement).click();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check code behind format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeFalsy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-condition-button') as HTMLElement).click();
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelectorAll('.e-dropdown-btn')[0] as HTMLElement).click();
                    (document.querySelectorAll('.e-tile')[9] as HTMLElement).click();
                    (document.querySelector('.e-apply') as HTMLElement).click();
                    (document.querySelectorAll('.e-dropdown-btn')[1] as HTMLElement).click();
                    (document.querySelectorAll('.e-tile')[55] as HTMLElement).click();
                    (document.querySelector('.e-apply') as HTMLElement).click();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Cancel button click', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'Between';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'NotBetween';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"].formatPivotGrid0').length > 0).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'quantity';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'LessThan';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                        filters: [],
                        calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                        sortSettings: [{ name: 'product', order: 'Descending' }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: undefined,
                                measure: undefined,
                                conditions: undefined,
                                style: {
                                    backgroundColor: undefined,
                                    color: undefined,
                                    fontFamily: undefined,
                                    fontSize: undefined
                                },
                            }
                        ]
                    };
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - Mobile', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
                PivotView.Inject(ConditionalFormatting);
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: true,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                                filterSettings: [
                                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                                ],
                                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                                conditionalFormatSettings: [
                                    {
                                        measure: 'quantity',
                                        value1: 500,
                                        conditions: 'LessThan',
                                        style: {
                                            backgroundColor: 'green',
                                            color: 'yellow',
                                            fontFamily: 'Verdana',
                                            fontSize: '12px'
                                        }
                                    }
                                ]
                            },
                            load: (args: LoadEventArgs) => {
                                pivotGridObj.isAdaptive = true;
                            },
                            allowConditionalFormatting: true
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('Check code behind format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Delete format', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-delete-button') as HTMLElement).click();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check code behind format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeFalsy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-condition-button') as HTMLElement).click();
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelectorAll('.e-dropdown-btn')[0] as HTMLElement).click();
                    (document.querySelectorAll('.e-tile')[9] as HTMLElement).click();
                    (document.querySelector('.e-apply') as HTMLElement).click();
                    (document.querySelectorAll('.e-dropdown-btn')[1] as HTMLElement).click();
                    (document.querySelectorAll('.e-tile')[55] as HTMLElement).click();
                    (document.querySelector('.e-apply') as HTMLElement).click();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Cancel button click', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'Between';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'NotBetween';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                    (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="3"].formatPivotGrid0').length > 0).toBeTruthy();
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Add format', () => {
                    expect(true).toBeTruthy();
                    (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'quantity';
                    (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'LessThan';
                    (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
                    (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
                    (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
                    (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
                    (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
                });
                it('Click apply button', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                });
                it('Check applied format', () => {
                    expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                    pivotGridObj.dataSourceSettings = {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                        filters: [],
                        calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                        sortSettings: [{ name: 'product', order: 'Descending' }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        conditionalFormatSettings: [
                            {
                                value1: undefined,
                                measure: undefined,
                                conditions: undefined,
                                style: {
                                    backgroundColor: undefined,
                                    color: undefined,
                                    fontFamily: undefined,
                                    fontSize: undefined
                                },
                            }
                        ]
                    };
                    pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
                });
                it('Cancel button click', () => {
                    expect(true).toBeTruthy();
                    (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
        });

        describe(' - VirtualScrolling', () => {
            describe(' - VirtualScrolling', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: false,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                rows: [{ name: 'product' }, { name: 'state' }],
                                columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                            },
                            allowCalculatedField: true,
                            enableVirtualization: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });

                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-frozencontent')[0].scrollTop = 317;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("touchstart", { clientY: 317, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
                    // document.querySelector('.e-frozencontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        done();
                    }, 2000);
                });

                it('scroll top false', (done: Function) => {
                    document.querySelectorAll('.e-frozencontent')[0].scrollTop = 317;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("touchstart", { clientY: 0, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        done();
                    }, 2000);
                });

                it('scroll right', (done: Function) => {
                    document.querySelectorAll('.e-movableheader')[0].scrollLeft = 1360;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("touchstart", { clientX: 1360, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movableheader').dispatchEvent(args);
                    // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
                    // document.querySelector('.e-movableheader').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movableheader').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        done();
                    }, 2000);
                });

                it('scroll right false', (done: Function) => {
                    document.querySelectorAll('.e-movableheader')[0].scrollLeft = 1360;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("touchstart", { clientX: 0, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movableheader').dispatchEvent(args);
                    // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
                    // document.querySelector('.e-movableheader').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movableheader').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        done();
                    }, 2000);
                });

                it('scroll top wheel', (done: Function) => {
                    document.querySelectorAll('.e-frozencontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("wheel", { clientY: 0, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 0).toBeTruthy();
                        done();
                    }, 2000);
                });

                it('scroll top wheel false', (done: Function) => {
                    document.querySelectorAll('.e-frozencontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("wheel", { clientY: 0, view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-frozencontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 0).toBeTruthy();
                        done();
                    }, 2000);
                });

                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - VirtualScrolling', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: false,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                rows: [{ name: 'product' }, { name: 'state' }],
                                columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                            },
                            allowCalculatedField: true,
                            enableVirtualization: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('pivotgrid render testing', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        done();
                    }, 2000);
                });
                it('scroll right', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$33,116.92');
                        done();
                    }, 2000);
                });
                it('scroll bottom', (done: Function) => {
                    pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 400;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(400);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        // expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(0);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 2000);
                });
                it('Collapse flight', (done: Function) => {
                    (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 2000);
                });
                it('Collapse male', (done: Function) => {
                    (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$95,040.55');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 900;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(900);
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Delhi');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Delhi');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 752;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                        done();
                    }, 2000);
                });

                it('Collapse bike', (done: Function) => {
                    (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                        done();
                    }, 2000);
                });
                it('Collapse female', (done: Function) => {
                    (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(890);
                        done();
                    }, 2000);
                });
                it('value in row axis', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
                    pivotGridObj.dataSourceSettings.drilledMembers = [];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('1692.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('790px');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                        pivotGridObj.virtualscrollModule.direction = 'vertical';
                        let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                        document.querySelector('.e-movablecontent').dispatchEvent(args);
                        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        document.querySelector('.e-movablecontent').dispatchEvent(args);
                        done();
                    }, 2000);
                });
                it('append name in column', (done: Function) => {
                    pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        //expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 50000;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        done();
                    }, 2000);
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - Grouping Bar', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                beforeAll(() => {
                    document.body.appendChild(elem);
                    PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: false,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                rows: [{ name: 'product' }, { name: 'state' }],
                                columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                            },
                            allowCalculatedField: true,
                            showGroupingBar: true,
                            enableVirtualization: true,
                            showFieldList: true,
                            showValuesButton: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('pivotgrid render testing', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        done();
                    }, 2000);
                });
                it('scroll right', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$33,116.92');
                        done();
                    }, 2000);
                });
                it('scroll bottom', (done: Function) => {
                    pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1730px');
                        done();
                    }, 2000);
                });
                it('Collapse flight', (done: Function) => {
                    (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1730px');
                        done();
                    }, 2000);
                });
                it('Collapse male', (done: Function) => {
                    (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$95,040.55');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 358;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(358);
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                        done();
                    }, 2000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 752;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                        done();
                    }, 2000);
                });

                it('Collapse bike', (done: Function) => {
                    (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                        done();
                    }, 2000);
                });
                it('Collapse female', (done: Function) => {
                    (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(358);
                        done();
                    }, 2000);
                });

                it('filter', (done: Function) => {
                    (document.querySelector('#product.e-pivot-button .e-pv-filter') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let allNode: HTMLElement = document.querySelector('.e-checkbox-wrapper');
                        let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        allNode.querySelector('.e-frame').dispatchEvent(args);
                        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        allNode.querySelector('.e-frame').dispatchEvent(args);
                        let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[2] as HTMLElement;
                        args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        firstNode.querySelector('.e-frame').dispatchEvent(args);
                        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        firstNode.querySelector('.e-frame').dispatchEvent(args);
                        (document.querySelector('.e-ok-btn') as HTMLElement).click();
                        done();
                    }, 2000);
                });
                it('filter check', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-movableheader')[0].scrollLeft)).toBeGreaterThan(735);
                        expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(358);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        done();
                    }, 2000);
                });

                it('value moved to row', (done: Function) => {
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(3);
                        done();
                    }, 2000);
                });
                it('value moved to column', (done: Function) => {
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(3);
                        done();
                    }, 2000);
                });
                it('value removed', (done: Function) => {
                    let rowAxiscontent: any = document;
                    let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(8);
                        done();
                    }, 2000);
                });
                it('values added', () => {
                    pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
                });
                it('values removed', (done: Function) => {
                    let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                    let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                    (pivotButton[2].querySelector('.e-remove') as HTMLElement).click();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(0);
                        done();
                    }, 2000);
                });
                it('values added', () => {
                    pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
                });

                it('RTL', (done: Function) => {
                    pivotGridObj.enableRtl = true;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(0);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('0.1px');
                        done();
                    }, 2000);
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - ValueSorting', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                beforeAll(() => {
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: false,
                                sortSettings: [{ name: 'company', order: 'Descending' }],
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                rows: [{ name: 'product' }, { name: 'state' }],
                                columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                            },
                            enableVirtualization: true,
                            enableValueSorting: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('render testing', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        done();
                    }, 2000);
                });
                it('sort male-blue-balance', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    (document.querySelectorAll('.e-movableheader th.e-firstcell')[0] as HTMLElement).click()
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                        done();
                    }, 2000);
                });
                it('scrollTop', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 398;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                        done();
                    }, 2000);
                });
                it('scrollLeft', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1235;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$35,784.78');
                        done();
                    }, 2000);
                });
                it('Collapse car', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    (document.querySelectorAll('.e-frozencontent tr')[14].querySelector('.e-icons') as HTMLElement).click()
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$35,784.78');
                        done();
                    }, 2000);
                });
                it('scrollTop', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$23,417.02');
                        done();
                    }, 2000);
                });
                it('scrollLeft', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$14,986.08');
                        done();
                    }, 2000);
                });
                it('sort male-green-balance', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click()
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                        done();
                    }, 2000);
                });
                it('remove quantity', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }];
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                        done();
                    }, 2000);
                });
                it('sort female-brown', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                        done();
                    }, 2000);
                });
                it('insert quantity', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                        done();
                    }, 2000);
                });
                it('move values to row', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.dataSourceSettings.valueAxis = 'row';
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(36);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('');
                        done();
                    }, 3000);
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - advanced filtering ', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                allowLabelFilter: true,
                                allowValueFilter: true,
                                dataSource: pivot_dataset as IDataSet[],
                                expandAll: true,
                                enableSorting: false,
                                formatSettings: [{ name: 'balance', format: 'C' }],
                                rows: [{ name: 'product' }, { name: 'state' }],
                                columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                                values: [{ name: 'balance' }, { name: 'quantity' }],
                                filters: [],
                            },
                            enableVirtualization: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                it('pivotgrid render testing', (done: Function) => {
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        done();
                    }, 5000);
                });
                it('state start with t', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'state', type: 'Label', condition: 'BeginWith', value1: 't' }],
                        setTimeout(() => {
                            expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(13);
                            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                            expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Tamilnadu');
                            done();
                        }, 5000);
                });
                it('state contains e', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' }],
                        setTimeout(() => {
                            expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                            expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                            done();
                        }, 5000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                        done();
                    }, 5000);
                });
                it('eyeColor equals blue', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' },
                        { name: 'eyeColor', type: 'Label', condition: 'Equals', value1: 'blue' }],
                        setTimeout(() => {
                            expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('blue');
                            expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('male Total');
                            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                            done();
                        }, 5000);
                });
                it('scroll right', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                        done();
                    }, 5000);
                });
                it('product quantity > 100', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                        setTimeout(() => {
                            expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                            expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                            done();
                        }, 5000);
                });
                // it('eyeColor blue quantity < 100', (done: Function) => {
                //     pivotGridObj.dataSource.filterSettings = [
                //         { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' },
                //         { name: 'eyeColor', type: 'Value', condition: 'LessThan', measure: 'quantity', value1: '100' }],
                //     setTimeout(() => {
                //         expect(document.querySelectorAll('.e-movableheader th')[1].textContent).toBe('balance');
                //         expect(document.querySelectorAll('.e-movableheader th')[2].textContent).toBe('quantity');
                //         done();
                //     }, 2000);
                // });
                it('product quantity > 100', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                        setTimeout(() => {
                            expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                            expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                            // expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                            done();
                        }, 5000);
                });
                it('scroll bottom', (done: Function) => {
                    pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        done();
                    }, 5000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 400;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(400);
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('648.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 5000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('648.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 5000);
                });
                it('Collapse flight', (done: Function) => {
                    (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click()
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$6,416.24');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                        done();
                    }, 5000);
                });
                it('Collapse male', (done: Function) => {
                    (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click()
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                        expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                        expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                        done();
                    }, 5000);
                });
                it('value in row axis', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
                    pivotGridObj.dataSourceSettings.drilledMembers = [];
                    setTimeout(() => {
                        let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('1692.1px');
                        expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('790px');
                        done();
                    }, 5000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                        pivotGridObj.virtualscrollModule.direction = 'vertical';
                        let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                        document.querySelector('.e-movablecontent').dispatchEvent(args);
                        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        document.querySelector('.e-movablecontent').dispatchEvent(args);
                        done();
                    }, 5000);
                });
                it('timeout', (done: Function) => {
                    // pivotGridObj.dataSource.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }],
                    setTimeout(() => {
                        done();
                    }, 2000);
                });
                it('append name in column', (done: Function) => {
                    pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }],
                        setTimeout(() => {
                            //expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                            done();
                        }, 5000);
                });
                it('scroll left', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 50000;
                    pivotGridObj.virtualscrollModule.direction = 'horizondal';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                        done();
                    }, 5000);
                });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
            describe(' - Coverage', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let cf: any;
                beforeAll(() => {
                    document.body.appendChild(elem);
                    PivotView.Inject(VirtualScroll, CalculatedField, GroupingBar, FieldList);
                    pivotGridObj = new PivotView(
                        {
                            dataSourceSettings: {
                                dataSource: pivot_nodata as IDataSet[],
                                enableSorting: false,
                                expandAll: true,
                                rows: [{ name: 'Country' }, { name: 'State' }],
                                columns: [{ name: 'Product' }, { name: 'Date' }],
                                values: [{ name: 'Amount' }, { name: 'Quantity' }],
                            },
                            allowCalculatedField: true,
                            showFieldList: true,
                            showGroupingBar: true,
                            enableVirtualization: true,
                            width: 600,
                            height: 300
                        });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });

                let mouseup: MouseEvent = new MouseEvent('mouseup', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let mousedown: MouseEvent = new MouseEvent('mousedown', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                it('drop down menu (Sum of Amount) click', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-values .e-dropdown-icon')).not.toBeUndefined;
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('28550');
                        document.querySelectorAll('.e-values .e-dropdown-icon')[0].dispatchEvent(click);
                        done();
                    }, 2000);
                });

                it('Sum of Amount -> Count of Amount _using grouping bar dropdown menu', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        let menu: MenuEventArgs = {
                            element: document.querySelectorAll('.e-menu-item')[1] as HTMLElement,
                            item: { id: pivotGridObj.element.id + '_Count', text: 'Count' }
                        };
                        (pivotGridObj.pivotButtonModule.menuOption as any).selectOptionInContextMenu(menu);
                        done();
                    }, 2000);
                });
                it('Sum of Amount -> Count of Amount _result + enable sorting', () => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('6');
                    pivotGridObj.dataSourceSettings.enableSorting = true;
                });
                it('Country -> descending _using grouping bar sort icon', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        //expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('');
                        document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Country -> descending _result + Switch to ascending', () => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('7');
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('United States');
                    document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                });
                it('Country -> Switch to ascending _result + open field list', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('6');
                        expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                        document.querySelectorAll('.e-toggle-field-list')[0].dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Open calculated field dialog', (done: Function) => {
                    cf = new CalculatedField(pivotGridObj);
                    cf.createCalculatedFieldDialog(pivotGridObj);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.engineModule.enableSort = false;
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        done();
                    }, 2000);
                });
                it('drag and drop Amount(Count) node to drop field', () => {
                    let treeObj: any = cf.treeObj;
                    let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                    let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                    mousemove = setMouseCordinates(mousemove, 150, 400);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                    expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
                });
                it('set new field as "New" and close the dialog', () => {
                    cf.inputObj.value = 'New';
                    (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
                    (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    cf.dialog.buttons[0].click();
                    document.querySelector('.e-pivotfieldlist-wrapper .e-cancel-btn').dispatchEvent(click);
                });
                it('Country -> open filter dialog + uncheck canada + click ok btn', (done: Function) => {
                    pivotGridObj.engineModule.enableSort = true;
                    expect(document.querySelectorAll('.e-movableheader th')[11].textContent).toBe('New');
                    document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                        firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        firstNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Country -> open filter dialog + check canada + click ok btn', (done: Function) => {
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('France');
                    expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('4');
                    document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                        firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        firstNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Country -> set report as no data', (done: Function) => {
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                    //expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('');
                    pivotGridObj.dataSourceSettings.rows[0].showNoDataItems = true;
                    setTimeout(() => {
                        //expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Alberta');
                        done();
                    }, 2000);
                });
                it('Country -> open filter dialog + uncheck france + click ok btn', (done: Function) => {
                    document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                        firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        firstNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Country -> open filter dialog + check france + click ok btn', (done: Function) => {
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                    expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('6');
                    document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                        firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        firstNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('State -> open filter dialog + uncheck essonnee + click ok btn', (done: Function) => {
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                    expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('6');
                    document.querySelectorAll('#State .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let treeNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[11] as HTMLElement;
                        treeNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        treeNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        treeNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('State -> open filter dialog + check essonnee + click ok btn', (done: Function) => {
                    document.querySelectorAll('#State .e-btn-filter')[0].dispatchEvent(click);
                    expect(document.querySelectorAll('.e-frozencontent td')[11].textContent).toBe('Garonne (Haute)');
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let treeNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[11] as HTMLElement;
                        treeNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        treeNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        treeNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Collapse Car', (done: Function) => {
                    expect(document.querySelectorAll('.e-frozencontent td')[11].textContent).toBe('Essonne');
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                    document.querySelectorAll('.e-movableheader th .e-collapse')[1].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movableheader th')[1].getAttribute('aria-rowspan')).toBe('2');
                        done();
                    }, 2000);
                });
                it('Expand Car', (done: Function) => {
                    document.querySelectorAll('.e-movableheader th .e-expand')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-movableheader th')[1].getAttribute('aria-rowspan')).toBe('1');
                        done();
                    }, 2000);
                });
                it('Product -> open filter dialog + uncheck car + click ok btn', (done: Function) => {
                    document.querySelectorAll('#Product .e-btn-filter')[0].dispatchEvent(click);
                    setTimeout(() => {
                        expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                        firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                        firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                        firstNode.querySelector('.e-frame').dispatchEvent(click);
                        document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                        done();
                    }, 2000);
                });
                it('Refresh data source', (done: Function) => {
                    (pivotGridObj.engineModule as any).getAxisByFieldName('None');
                    pivotGridObj.dataSourceSettings.dataSource = [];
                    done();
                });

                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
            });
        });

        describe(' - no data', () => {
            describe(' - no data', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let noData: IDataSet[] = [
                    { "Teams": "Application Support", "Priority": "p1", "Calls": 4 },
                    { "Teams": "Application Support", "Priority": "p2", "Calls": 1 },
                    { "Teams": "Application Support", "Priority": "p3", "Calls": 2 },
                    { "Teams": "Service Desk", "Priority": "p1", "Calls": 4 },
                    { "Teams": "Service Desk", "Priority": "p2", "Calls": 1 },
                    { "Teams": "Service Desk", "Priority": "p3", "Calls": 2 },
                    { "Teams": "Network Support", "Priority": "p4", "Calls": 5 },
                    { "Teams": "Network Support", "Priority": "p5", "Calls": 6 }
                ];
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
                    PivotView.Inject(FieldList, CalculatedField);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: noData as IDataSet[],
                            rows: [{ name: 'Teams', showNoDataItems: true }],
                            columns: [{ name: 'Priority', showNoDataItems: true }],
                            values: [{ name: 'Calls', showNoDataItems: true }],
                            allowLabelFilter: true,
                            allowValueFilter: true
                        },
                        showFieldList: true,
                        allowCalculatedField: true,
                        height: 400
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });

                let dataSourceSettings: IDataOptions
                it('pivotgrid render testing', (done: Function) => {
                    dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="4"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5');
                        done();
                    }, 2000);
                });
                it('priority to row', (done: Function) => {
                    pivotGridObj.setProperties({
                        dataSourceSettings: {
                            rows: [{ name: 'Teams', showNoDataItems: true }, { name: 'Priority', showNoDataItems: true }]
                        }
                    }, true);
                    pivotGridObj.dataSourceSettings.columns = [];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        // expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                        // expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('p4');
                        // expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('');
                        done();
                    }, 1000);
                });
                it('swap row elements', (done: Function) => {
                    pivotGridObj.dataSourceSettings.rows = [
                        { name: 'Priority', showNoDataItems: true },
                        { name: 'Teams', showNoDataItems: true }
                    ];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('5');
                        done();
                    }, 1000);
                });
                it('swap to columns', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { rows: [] } }, true);
                    pivotGridObj.dataSourceSettings.columns = [
                        { name: 'Priority', showNoDataItems: true },
                        { name: 'Teams', showNoDataItems: true }
                    ];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="13"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('th[aria-colindex="13"] .e-headertext')[0] as HTMLElement).innerText).toBe('Application Support');
                        expect((document.querySelectorAll('td[aria-colindex="14"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('5');
                        expect((document.querySelectorAll('th[aria-colindex="14"] .e-headertext')[0] as HTMLElement).innerText).toBe('Network Support');
                        done();
                    }, 1000);
                });
                it('swap to rows', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { columns: [] } }, true);
                    pivotGridObj.dataSourceSettings.rows = [
                        { name: 'Priority', showNoDataItems: true },
                        { name: 'Teams', showNoDataItems: true }
                    ];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('5');
                        done();
                    }, 1000);
                });
                it('exclude p4,p5', (done: Function) => {
                    pivotGridObj.dataSourceSettings.rows = [
                        { name: 'Teams', showNoDataItems: true },
                        { name: 'Priority', showNoDataItems: true }
                    ];
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'Priority', type: 'Exclude', items: ['p4', 'p5'] }
                    ],
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('Network Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[8] as HTMLElement).innerText).toBe('7');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[7] as HTMLElement).innerText).toBe('');
                        done();
                    }, 1000);
                });
                it('exclude p1,p2,p3', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'Priority', type: 'Include', items: ['p4', 'p5'] }
                    ],
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                        done();
                    }, 1000);
                });
                it('dont show priority no items', (done: Function) => {
                    pivotGridObj.dataSourceSettings.rows[1].showNoDataItems = false;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                        done();
                    }, 1000);
                });
                it('sort teams', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { sortSettings: [{ name: 'Teams', order: 'Descending' }] } }, true);
                    pivotGridObj.dataSourceSettings.rows[1].showNoDataItems = true;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Service Desk');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                        done();
                    }, 1000);
                });
                it('sort priority', (done: Function) => {
                    pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'Priority', order: 'Descending' }];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p5');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                        done();
                    }, 1000);
                });
                it('change data source', (done: Function) => {
                    pivotGridObj.setProperties({
                        dataSourceSettings: {
                            dataSource: pivot_nodata,
                            expandAll: false,
                            drilledMembers: [{ name: 'Country', items: ['Canada'] }],
                            rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                            columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                            values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                            filterSettings: []
                        }
                    }, true);
                    pivotGridObj.dataSourceSettings.sortSettings = [];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Bayern');
                        done();
                    }, 3000);
                });
                it('filter state BeginWith e', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Label', condition: 'BeginWith', value1: 'e' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('France');
                        done();
                    }, 3000);
                });
                it('filter state DoesNotBeginWith e', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['United Kingdom'] }] } });
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('United Kingdom');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('Garonne (Haute)');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('');
                        done();
                    }, 3000);
                });
                it('state nodata false', (done: Function) => {
                    pivotGridObj.setProperties({
                        dataSourceSettings: {
                            rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }],
                            drilledMembers: [{ name: 'Country', items: ['Canada'] }],
                        }
                    }, true);
                    pivotGridObj.dataSourceSettings.filterSettings = [];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Brunswick');
                        done();
                    }, 3000);
                });
                it('filter state BeginWith e', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Label', condition: 'BeginWith', value1: 'e' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('France');
                        done();
                    }, 3000);
                });
                it('filter state DoesNotBeginWith e', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['United Kingdom'] }] } });
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('United Kingdom');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('Garonne (Haute)');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('');
                        done();
                    }, 3000);
                });
                it('filter clear', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                        done();
                    }, 3000);
                });

                it('filter state quantity LessThan 500', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['Canada'] }] } });
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('19260');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                        done();
                    }, 3000);
                });
                it('filter state quantity GreaterThan 500', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('80700');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('13500');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                        done();
                    }, 3000);
                });
                it('filter state quantity LessThan 500', (done: Function) => {
                    pivotGridObj.setProperties({
                        dataSourceSettings: {
                            rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                        }
                    }, true);
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('19260');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                        done();
                    }, 3000);
                });
                it('filter state quantity GreaterThan 500', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
                    ]
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('80700');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('13500');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                        done();
                    }, 3000);
                });
            });
            describe(' - virtual scroll ', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
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
                    PivotView.Inject(VirtualScroll);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_nodata as IDataSet[],
                            rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                            columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                            values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        },
                        enableVirtualization: true,
                        width: 800,
                        height: 300
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let scrollEvent: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                let upEvent: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                let dataSourceSettings: IDataOptions
                it('pivotgrid render testing', (done: Function) => {
                    dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        done();
                    }, 2000);
                });
                it('state false', (done: Function) => {
                    pivotGridObj.dataSourceSettings.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                        done();
                    }, 2000);
                });
                it('include england', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Include', items: ['England'] }
                    ],
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('United Kingdom');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('1040');
                        done();
                    }, 2000);
                });
                it('exclude england', (done: Function) => {
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'State', type: 'Exclude', items: ['England'] }
                    ],
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Quebec');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6400');
                        done();
                    }, 2000);
                });
                it('state true', (done: Function) => {
                    pivotGridObj.dataSourceSettings.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                        done();
                    }, 2000);
                });
                it('scroll bottom', (done: Function) => {
                    document.querySelector('.e-movablecontent').scrollTop = 100;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                        done();
                    }, 2000);
                });
                it('scroll top', (done: Function) => {
                    document.querySelector('.e-movablecontent').scrollTop = 0;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                        pivotGridObj.scrollerBrowserLimit = 1000;
                        done();
                    }, 2000);
                });
                it('scroll both', (done: Function) => {
                    document.querySelector('.e-movablecontent').scrollTop = 1500;
                    document.querySelector('.e-movablecontent').scrollLeft = 1500;
                    document.querySelector('.e-movablecontent').dispatchEvent(scrollEvent);
                    document.querySelector('.e-movablecontent').dispatchEvent(upEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('United States');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('33950');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('3450');
                        expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                        expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('');
                        done();
                    }, 2000);
                });
            });
        })

        describe('- Members limit in editor', () => {
            describe('- Members limit in editor - groupingbar', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            rows: [{ name: 'product' }, { name: 'state' }],
                            columns: [{ name: 'gender' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'index' }],
                            allowLabelFilter: true,
                            allowValueFilter: true
                        },
                        showGroupingBar: true,
                        dataBound: dataBound,
                        maxNodeLimitInMemberEditor: 5
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });
                it('grouping bar render testing', () => {
                    expect(document.querySelectorAll('.e-pivot-button').length).toBe(6);
                });

                it('check filtering field', (done: Function) => {
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                        done();
                    }, 1000);
                });
                it('check all nodes on filter popup', () => {
                    let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                    let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                    expect(checkedEle.length).toEqual(0);
                    expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
                    let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[1] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    checkedEle = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                    expect(checkedEle.length).toEqual(1);
                    expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                    (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
                });
                it('check filter state after update', () => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[1] as HTMLElement).innerText).toBe('Grand Total');
                });
                it('check filtering field', (done: Function) => {
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                        expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
                        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                        done();
                    }, 1000);
                });
                it('search 0', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[1] as HTMLElement).innerText).toBe("10");
                });
                it('search 11', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '11' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(0);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(0);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
                });
                it('check 11', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[1] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
                });
                it('search 11', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '11' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
                });
                it('check all search 0', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[0] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
                    let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
                });
                it('check all btn click', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[0] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
                    (document.querySelector('.e-ok-btn') as HTMLElement).click();
                    pivotGridObj.maxNodeLimitInMemberEditor = 3;
                });
                it('state search a', (done: Function) => {
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                        searchOption.setProperties({ value: 'a' });
                        searchOption.change({ value: searchOption.value });
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(3);
                        done();
                    }, 1000);
                });
                it('gender search a', (done: Function) => {
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                        searchOption.setProperties({ value: 'a' });
                        searchOption.change({ value: searchOption.value });
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(2);
                        done();
                    }, 1000);
                });
                it('change mem limit to 10', (done: Function) => {
                    pivotGridObj.maxNodeLimitInMemberEditor = 10;
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(10);
                        expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                        done();
                    }, 1000);
                });
            });
            describe('- Members limit in editor - field list', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(FieldList);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            rows: [{ name: 'product' }, { name: 'state' }],
                            columns: [{ name: 'gender' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'index' }]
                        },
                        showFieldList: true,
                        dataBound: dataBound,
                        maxNodeLimitInMemberEditor: 5
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });
                it('field list render testing', () => {
                    expect(document.querySelectorAll('.e-pivot-button').length).toBe(6);
                });

                it('check filtering field', (done: Function) => {
                    (document.querySelectorAll('.e-toggle-field-list')[0] as HTMLElement).click();
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                        done();
                    }, 1000);
                });
                it('check all nodes on filter popup', () => {
                    let allNode: HTMLElement = document.querySelector('.e-member-editor-wrapper .e-checkbox-wrapper');
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    allNode.querySelector('.e-frame').dispatchEvent(args);
                    let checkedEle: Element[] = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-wrapper .e-check');
                    expect(checkedEle.length).toEqual(0);
                    expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
                    let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    checkedEle = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-wrapper .e-check');
                    expect(checkedEle.length).toEqual(1);
                    expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                    (document.querySelector('.e-ok-btn') as HTMLElement).click();
                });
                it('check filter state after update', () => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[1] as HTMLElement).innerText).toBe('Grand Total');
                });
                it('check filtering field', (done: Function) => {
                    (document.querySelectorAll('.e-toggle-field-list')[0] as HTMLElement).click();
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                        expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
                        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                        done();
                    }, 1000);
                });
                it('search 0', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[1] as HTMLElement).innerText).toBe("10");
                });
                it('search 11', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '11' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(0);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(0);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
                });
                it('check 11', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
                });
                it('search 11', () => {
                    let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '11' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
                });
                it('check all search 0', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[0] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
                    let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
                    searchOption.setProperties({ value: '0' });
                    searchOption.change({ value: searchOption.value });
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                    expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
                });
                it('check all btn click', () => {
                    let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[0] as HTMLElement;
                    args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    firstNode.querySelector('.e-frame').dispatchEvent(args);
                    expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
                    (document.querySelector('.e-ok-btn') as HTMLElement).click();
                });
                it('change mem limit to 10', () => {
                    pivotGridObj.maxNodeLimitInMemberEditor = 10;
                    pivotGridObj.pivotFieldListModule.maxNodeLimitInMemberEditor = 10;
                    let pivotButtons: HTMLElement[] =
                        [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                    ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                });
                it('change mem limit to 10-check', () => {
                    expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(10);
                    expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                    expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                });
            });
        });

        describe('- Drill Through', () => {
            describe('- normal', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                            rows: [{ name: 'product' }, { name: 'state' }],
                            columns: [{ name: 'gender' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                            allowValueFilter: true,
                            allowLabelFilter: true
                        },
                        height: 300,
                        width: 800,
                        allowDrillThrough: true,
                        beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                            if (args.gridObj) {
                                let eventType: string = args.type;
                                let gridObj: Grid = args.gridObj;
                                gridObj.allowKeyboard = false;
                            }
                        },
                        showGroupingBar: true,
                        dataBound: dataBound,
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });
                let event: MouseEvent = new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                it('render testing', () => {
                    expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                });
                it('click bike-female-balance', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-groupdroparea')).toBeTruthy();
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('72975.03000000001');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="1"]')[2].textContent).toBe('Delhi');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click car-quantity-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Car');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('585');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click jet-price-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('price');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('1007288.6399999999');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click bike-quantity', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('1060');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click female-balance', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="1"]')[6].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('477089.13');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click price', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('price');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('11314903.290000001');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('expand bike', (done: Function) => {
                    (document.querySelectorAll('td[aria-colindex="0"] .e-expand')[0] as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                        done();
                    }, 1000);
                });
                it('click delhi-quantity-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike - Delhi');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('79');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('value axis to row', (done: Function) => {
                    pivotGridObj.dataSourceSettings.valueAxis = 'row';
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('quantity');
                        done();
                    }, 2000);
                });
                it('click bike-balance-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('97762.19000000002');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click bike-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 1000);
                });
                it('value axis to column filter bike alone', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'column' } });
                    pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike'] }];
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                        done();
                    }, 2000);
                });
                it('click quantity-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click quantity-female keyboard', (done: Function) => {
                    (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'enter', target: document.querySelectorAll('td[aria-colindex="2"]')[7], preventDefault: (): void => { /** Null */ } });
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click bike', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-cellvalue').dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 1000);
                });
                it('click female', (done: Function) => {
                    document.querySelectorAll('th[aria-colindex="1"]')[0].querySelector('.e-stackedheadercelldiv').dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 1000);
                });
                it('state no data', (done: Function) => {
                    pivotGridObj.setProperties({
                        dataSourceSettings: {
                            dataSource: pivot_nodata as IDataSet[],
                            expandAll: false,
                            rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                            columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                            values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                            filterSettings: []
                        }
                    }, true);
                    pivotGridObj.dataSourceSettings.drilledMembers = [{ name: 'Country', items: ['Canada'] }];
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 1000);
                });
                it('click empty data', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="1"]')[1].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('click balance', (done: Function) => {
                    document.querySelectorAll('th[aria-colindex="1"]')[1].querySelector('.e-headertext').dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        pivotGridObj.isAdaptive = true;
                        pivotGridObj.render();
                        done();
                    }, 1000);
                });
                it('click Bike adaptive', (done: Function) => {
                    document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 1000);
                });
            });
            describe('- Virtual scrolling', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, VirtualScroll);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                            rows: [{ name: 'product' }, { name: 'state' }],
                            columns: [{ name: 'gender' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                            allowValueFilter: true,
                            allowLabelFilter: true
                        },
                        height: 300,
                        width: 800,
                        allowDrillThrough: true,
                        enableVirtualization: true,
                        showGroupingBar: true,
                        dataBound: dataBound,
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });
                let event: MouseEvent = new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                it('render testing', () => {
                    expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                });
                it('click bike-female-balance', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('72975.03000000001');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="1"]')[2].textContent).toBe('Delhi');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click car-quantity-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Car');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('585');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click jet-price-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Jet');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('price');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('1007288.6399999999');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click bike-quantity', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('1060');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click female-balance', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="1"]')[6].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('477089.13');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click price', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('price');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('11314903.290000001');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('expand bike', (done: Function) => {
                    (document.querySelectorAll('td[aria-colindex="0"] .e-expand')[0] as HTMLElement).click();
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                        done();
                    }, 5000);
                });
                it('click delhi-quantity-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike - Delhi');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('79');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('value axis to row', (done: Function) => {
                    pivotGridObj.dataSourceSettings.valueAxis = 'row';
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('quantity');
                        done();
                    }, 5000);
                });
                it('click bike-balance-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('97762.19000000002');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click bike-male', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                        done();
                    }, 5000);
                });
                it('value axis to column filter bike alone', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'column' } });
                    pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike'] }];
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                        done();
                    }, 5000);
                });
                it('click quantity-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('filter clear expand all', (done: Function) => {
                    pivotGridObj.setProperties({ dataSourceSettings: { expandAll: true } });
                    pivotGridObj.dataSourceSettings.filterSettings = [];
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[7].textContent).toBe('Vetaikan');
                        done();
                    }, 5000);
                });
                it('scroll bottom', (done: Function) => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 1265;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Tamilnadu');
                        done();
                    }, 5000);
                });
                it('click delhi-quantity-female', (done: Function) => {
                    document.querySelectorAll('td[aria-colindex="2"]')[19].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Van - Delhi');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                        expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                        expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('52');
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Van');
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
            });
        });

        describe('- Editing', () => {
            describe('- normal', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                            rows: [{ name: 'product' }, { name: 'state' }],
                            columns: [{ name: 'gender' }],
                            values: [{ name: 'balance' }, { name: 'price' }, { name: 'quantity' }], filters: [{ name: 'index' }],
                            drilledMembers: [{ name: 'product', items: ['Flight'] }],
                            allowValueFilter: true,
                            allowLabelFilter: true
                        },
                        height: 300,
                        width: 800,
                        allowDrillThrough: true,
                        editSettings: {
                            allowAdding: true, allowDeleting: true, allowEditing: true,
                            showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                        },
                        beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                            if (args.gridObj) {
                                let eventType: string = args.type;
                                let gridObj: Grid = args.gridObj;
                                gridObj.allowKeyboard = false;
                            }
                        },
                        showGroupingBar: true,
                        dataBound: dataBound,
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 2000);
                });
                let event: MouseEvent = new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let mouseup: MouseEvent = new MouseEvent('mouseup', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let mousedown: MouseEvent = new MouseEvent('mousedown', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                it('render testing', () => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                });
                it('click bike-female-balance', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-groupdroparea')).toBeTruthy();
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("477");
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('remove tamilnadu single', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[3].textContent).toBe("66");
                    document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('remove tamilnadu single check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("12");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('remove tamilnadu full', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("12");
                    document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('remove tamilnadu full check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid tr')[2].textContent).toBe("No records to display");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('add tamilnadu', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("");
                    document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('add tamilnadu 1', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[0] as HTMLInputElement).value = "Tamilnadu";
                        (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[1] as HTMLInputElement).value = "Flight";
                        (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[2] as HTMLInputElement).value = "female";
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[5].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[5].dispatchEvent(mouseup);
                        done();
                    }, 5000);
                });
                it('add tamilnadu check', (done: Function) => {
                    ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("1");
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });


                it('batch mode', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotGridObj.editSettings.mode = 'Batch';
                        pivotGridObj.editSettings.showConfirmDialog = false;
                        pivotGridObj.editSettings.showDeleteConfirmDialog = false;
                        pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                        pivotGridObj.refresh();
                        done();
                    }, 5000);
                });

                it('batch click bike-female-balance', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                        done();
                    }, 5000);
                });
                it('batch click bike-female-balance check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("18");
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('dummy', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(true).toBe(true);
                        done();
                    }, 5000);
                });
                it('batch click california-quantity-female', (done: Function) => {
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("476");
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                        done();
                    }, 5000);
                });
                it('batch click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("20");
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('batch remove tamilnadu single', (done: Function) => {
                    ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(click);
                        document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('dialogmode', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotGridObj.editSettings.mode = 'Dialog';
                        pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                        pivotGridObj.refresh();
                        done();
                    }, 5000);
                });
                it('dialog click bike-female-balance', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-edit-dialog button.e-primary')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('dialog click bike-female-balance check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("17");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('dialog click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("475");
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                        document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-edit-dialog button.e-primary')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('dialog click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("21");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });

                it('command columns mode', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotGridObj.editSettings.allowCommandColumns = true;
                        pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                        pivotGridObj.refresh();
                        done();
                    }, 5000);
                });

                it('cc click bike-female-balance', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click bike-female-balance save', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click bike-female-balance check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("16");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("474");
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female save', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("22");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('cc click bike-female-balance', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click bike-female-balance save', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click bike-female-balance check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("20");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female save', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                        document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                        document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('cc click california-quantity-female check', (done: Function) => {
                    ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("18");
                        (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                        done();
                    }, 5000);
                });
                it('apply value filter', () => {
                    expect(document.querySelector('.e-drillthrough-dialog')).toBeTruthy;
                    pivotGridObj.dataSourceSettings.filterSettings = [
                        { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '1000', measure: 'quantity' },
                    ];
                });
                it('value filter check', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelectorAll('td[aria-colindex="9"]')[4].textContent).toBe("4663");
                        done();
                    }, 5000);
                });
            });
        });

        describe('Column resizing and text wrap ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'eyeColor' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance', type: 'Product' }, { name: 'quantity', type: 'Product' }]
                    },
                    showGroupingBar: true,
                    showFieldList: false,
                    gridSettings: {
                        allowTextWrap: true,
                        allowResizing: true
                    },
                    dataBound: dataBound

                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('pivot render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy;
            });
            it('with text wrap and resizing true', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(54);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(55);
                    done();
                }, 2000);
            });
            it('without text wrap', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.gridSettings.allowTextWrap = false;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(36);
                    done();
                }, 2000);
            });
            it('without resizing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.gridSettings.allowResizing = false;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(36);
                    done();
                }, 2000);
            });
            it('with specific column width', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.setProperties({
                    gridSettings: {
                        allowTextWrap: true,
                    }
                }, true);
                pivotGridObj.gridSettings.columnWidth = 40;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(54);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(55);
                    done();
                }, 2000);
            });
        });

        describe('Drill position ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'eyeColor', items: ['Bike##blue'], delimiter: '##' }],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }, { name: 'isActive' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    showGroupingBar: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('drill position default', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    done();
                }, 2000);
            });
            it('drill position without subtotals', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.showSubTotals = false;
                setTimeout(function () {
                    //expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    //expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    done();
                }, 2000);
            });
            it('drill position with expand all', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.expandAll = true;
                setTimeout(function () {
                    // expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(0);
                    // expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(0);
                    done();
                }, 2000);
            });
            it('false case for drill', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.expandAll = false;
                // let bool1:boolean;
                // let bool1:boolean;
                // let bool1:boolean;
                setTimeout(function () {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length === 5).toBeFalsy;
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length === 20).toBeFalsy;
                    done();
                }, 2000);
            });
        });

        describe('Filtering with none sorting ', () => {

            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'None' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'eyeColor', items: ['Bike##blue'], delimiter: '##' }],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }, { name: 'isActive' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    showGroupingBar: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[2]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                //let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                //allNode.querySelector('.e-frame').dispatchEvent(args);
                //args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                //allNode.querySelector('.e-frame').dispatchEvent(args);
                //args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                //allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
        });

        describe('Scroll apperance', () => {

            describe('Scroll comparison ', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
                let data: IDataSet[] = [
                    { row: 'row1', column: 'column1', value: 1 },
                    { row: 'row2', column: 'column2', value: 2 },
                    { row: 'row3', column: 'column3', value: 3 },
                    { row: 'row4', column: 'column4', value: 4 },
                ]
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.style.height = '500px';
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, VirtualScroll);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: data,
                            expandAll: false,
                            rows: [{ name: 'row' }],
                            columns: [{ name: 'column' }],
                            values: [{ name: 'value' }],
                        },
                        width: 900,
                        height: 300,
                        enableVirtualization: false,
                        showGroupingBar: true,
                        dataBound: dataBound

                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });
                it('Compare scrollbar', () => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                });

                it('Display vertical scrollbar alone', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.height = 200;
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBeGreaterThan(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Display horizondal scrollbar alone', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.setProperties({ height: '100%' }, true);
                    pivotGridObj.width = 300;
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBeGreaterThan(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Hide both scrollbars', (done: Function) => {
                    pivotGridObj.setProperties({ height: '100%' }, true);
                    pivotGridObj.width = '100%';
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Hide both scrollbars by setting auto', (done: Function) => {
                    pivotGridObj.setProperties({ height: 'auto' }, true);
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

            });

            describe('Scroll comparison - virtual scrolling', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
                let data: IDataSet[] = [
                    { row: 'row1', column: 'column1', value: 1 },
                    { row: 'row2', column: 'column2', value: 2 },
                    { row: 'row3', column: 'column3', value: 3 },
                    { row: 'row4', column: 'column4', value: 4 },
                ]
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.style.height = '500px';
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, VirtualScroll);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: data,
                            expandAll: false,
                            rows: [{ name: 'row' }],
                            columns: [{ name: 'column' }],
                            values: [{ name: 'value' }],
                        },
                        width: 900,
                        height: 300,
                        enableVirtualization: true,
                        showGroupingBar: true,
                        dataBound: dataBound

                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                beforeEach((done: Function) => {
                    setTimeout(() => { done(); }, 1000);
                });

                it('Scroll compare', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Display vertical scrollbar alone', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.height = 200;
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBeGreaterThan(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Display horizondal scrollbar alone', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    pivotGridObj.setProperties({ height: '100%' }, true);
                    pivotGridObj.width = 300;
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBeGreaterThan(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Hide both scrollbars by setting 100%', (done: Function) => {
                    pivotGridObj.setProperties({ height: '100%' }, true);
                    pivotGridObj.width = '100%';
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

                it('Hide both scrollbars by setting auto', (done: Function) => {
                    pivotGridObj.setProperties({ height: 'auto' }, true);
                    setTimeout(() => {
                        expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                        expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                        done();
                    }, 1000);
                });

            });

        });
    });

    describe('Data Grid Features module - ', () => {

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
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
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
                pivotGridObj.grid.selectionSettings.mode = 'Row';
                pivotGridObj.renderPivotGrid();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(selectArgs.selectedCellsInfo.length).toBe(0);
                    done();
                }, 2000);
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
    });

    describe('Miscellaneous Features', () => {
        describe('Exporting and scrolling', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
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
                PivotView.Inject(ExcelExport, PDFExport);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        filterSettings: [
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                            { name: 'isActive', type: 'Include', items: ['true'] },
                            {
                                name: 'date', type: 'Include', items: [
                                    'Fri Dec 18 1987 05:37:53 GMT+0530 (India Standard Time)',
                                    'Fri Jan 10 2003 20:13:56 GMT+0530 (India Standard Time)',
                                    'Fri Jan 15 2010 12:24:35 GMT+0530 (India Standard Time)',
                                    'Fri Mar 30 1990 00:54:08 GMT+0530 (India Standard Time)',
                                    'Fri May 24 1996 23:27:58 GMT+0530 (India Standard Time)',
                                    'Fri May 27 1983 06:48:41 GMT+0530 (India Standard Time)',
                                    'Fri Nov 06 1987 19:11:22 GMT+0530 (India Standard Time)'
                                ]
                            }],
                        columns: [{ name: 'eyeColor' }, { name: 'date' }],
                        rows: [{ name: 'isActive' }, { name: 'state' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }]
                    },
                    beforeExport: beforeExport,
                    onPdfCellRender: pdfCellRender,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    enableRtl: true,
                    width: 1000,
                    height: 100,
                    gridSettings: {
                        allowReordering: true,
                        pdfHeaderQueryCellInfo: (args: any): void => {
                        },
                        pdfQueryCellInfo: (args: any): void => {
                        },
                        excelHeaderQueryCellInfo: (args: any): void => {
                        },
                        excelQueryCellInfo: (args: any): void => {
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            it('pivotgrid excel export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExport();
                    done();
                }, 1000);
            });

            it('pivotgrid csv dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.csvExport();
                    done();
                }, 2000);
            });

            it('pivotgrid pdf dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.pdfExport();
                    done();
                }, 2000);
            });

            it('pivotgrid excel-engine export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExportModule.exportToExcel('Excel');
                    done();
                }, 2000);
            });

            it('pivotgrid csv-engine dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExportModule.exportToExcel('CSV');
                    pivotGridObj.excelExportModule.destroy();
                    done();
                }, 2000);
            });

            it('pivotgrid pdf-engine dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(true).toBe(true);
                    done();
                }, 2000);
            });

            it('value axis row', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.valueAxis = 'row';
                setTimeout(() => {
                    pivotGridObj.pdfExportModule.exportToPDF();
                    pivotGridObj.pdfExportModule.destroy();
                    done();
                }, 2000);
            });

            it('pivotgrid excel export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExport();
                    done();
                }, 2000);
            });

            it('pivotgrid pdf dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.pdfExport();
                    done();
                }, 2000);
            });
        });
        describe('Pivot Grid Conditional Formatting Export', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
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
                PivotView.Inject(ExcelExport, PDFExport, ConditionalFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        filterSettings: [
                            { name: 'eyeColor', type: 'Include', items: ['blue'] },
                            { name: 'isActive', type: 'Include', items: ['true'] }
                        ],
                        rows: [{ name: 'eyeColor' }, { name: 'product' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    },
                    allowConditionalFormatting: true,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    width: 1000,
                    height: 200
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('pivotgrid excel-engine export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExportModule.exportToExcel('Excel');
                    done();
                }, 1000);
            });
            it('pivotgrid pdf-engine dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.pdfExportModule.exportToPDF();
                    done();
                }, 1000);
            });
        });
        describe('Pivot Grid Conditional Formatting Export with Virtual Scrolling', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
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
                PivotView.Inject(ExcelExport, PDFExport, ConditionalFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        filterSettings: [
                            { name: 'eyeColor', type: 'Include', items: ['blue'] },
                            { name: 'isActive', type: 'Include', items: ['true'] }
                        ],
                        rows: [{ name: 'eyeColor' }, { name: 'product' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            }
                        ]
                    },
                    allowConditionalFormatting: true,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    enableVirtualization: true,
                    width: 1000,
                    height: 200
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('pivotgrid excel-engine export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.excelExportModule.exportToExcel('Excel');
                    done();
                }, 1000);
            });
            it('pivotgrid pdf-engine dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.pdfExportModule.exportToPDF();
                    done();
                }, 1000);
            });
        });
        describe('Pivot Grid - HyperLink', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
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
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [{ name: 'eyeColor', type: 'Exclude', items: ['blue'] }
                        ],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    width: 1000,
                    height: 200
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Check on show all cells hyperlink', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: true,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: false,
                    headerText: undefined,
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-frozencontent td a')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show row header cell hyperlink only', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: true,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: false,
                    headerText: undefined,
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-frozencontent td a')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show column cell hyperlink only', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: true,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: false,
                    headerText: undefined,
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridheader .e-headercontent th a')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show value cells hyperlink only', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: true,
                    showSummaryCellHyperlink: false,
                    headerText: undefined,
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent').querySelectorAll('.e-valuescontent a')[30]).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show summary cells hyperlink only', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: true,
                    headerText: undefined,
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show hyperlink with conditional-based', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: false,
                    headerText: undefined,
                    conditionalSettings: [
                        {
                            label: 'Tempo',
                            conditions: 'LessThan',
                            value1: 1000,
                            value2: 550
                        },
                        {
                            measure: 'balance',
                            conditions: 'LessThan',
                            value1: 10000
                        }
                    ]
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent').querySelectorAll('.e-valuescontent a')[40]).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on show hyperlink with label text', (done: Function) => {
                pivotGridObj.hyperlinkSettings = {
                    showHyperlink: false,
                    showRowHeaderHyperlink: false,
                    showColumnHeaderHyperlink: false,
                    showValueCellHyperlink: false,
                    showSummaryCellHyperlink: false,
                    headerText: 'female.false',
                    conditionalSettings: []
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Check on hyperlink click event trigger with label text', (done: Function) => {
                pivotGridObj.hyperlinkCellClick = function (args: HyperCellClickEventArgs) {
                    args.cancel = false;
                };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
                    (pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a') as HTMLElement).click();
                    done();
                }, 1000);
            });
        });
        describe('Sub total hiding', () => {
            describe('Sub total hiding in row', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            filterSettings: [
                                { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                            ],
                            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                            showSubTotals: false
                        },
                        showValuesButton: true,
                        showGroupingBar: true,
                        dataBound: dataBound
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === '$48,954.03').toBeTruthy();
                        (document.querySelector('.e-rowcell .e-expand') as HTMLElement).click();
                        done();
                    }, 2000);
                });
                it('After Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === '').toBeTruthy();
                        let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                        let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                        let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(3);
                        let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                        let mousedown: any =
                            getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                        EventHandler.trigger(dragElement, 'mousedown', mousedown);
                        let mousemove: any =
                            getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                        mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                        mousemove = setMouseCordinates(mousemove, 15, 75);
                        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                        let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                        mouseOverEventArgs.type = 'mouseover';
                        (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                        let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                        mouseLeaveEventArgs.type = 'mouseleave';
                        (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                        let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                        mouseUp.type = 'mouseup';
                        mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                        EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(3);
                        done();
                    }, 2000);
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === '').toBeTruthy();
                        (document.querySelectorAll('.e-rowcell .e-expand')[1] as HTMLElement).click();
                        done();
                    }, 2000);
                });
                it('After Drill', (done: Function) => {
                    expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === '').toBeTruthy();
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    let dragElement: HTMLElement = pivotButton[1].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                    mouseOverEventArgs.type = 'mouseover';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                    let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                    mouseLeaveEventArgs.type = 'mouseleave';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(4);
                        done();
                    }, 2000);
                });
            });
            describe('Sub total hiding in column', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            filterSettings: [
                                { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                            ],
                            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                            showSubTotals: false
                        },
                        showValuesButton: true,
                        showGroupingBar: true,
                        dataBound: dataBound
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.engineModule.columnCount === 6).toBeTruthy();
                        (document.querySelector('.e-expand') as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('After Drill', (done: Function) => {
                    expect(pivotGridObj.engineModule.columnCount === 8).toBeTruthy();
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                    mouseOverEventArgs.type = 'mouseover';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                    let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                    mouseLeaveEventArgs.type = 'mouseleave';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(4);
                        done();
                    }, 1000);
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.engineModule.columnCount === 8).toBeTruthy();
                        (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('After Drill', (done: Function) => {
                    expect(pivotGridObj.engineModule.columnCount === 10).toBeTruthy();
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(1);
                    let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                    mouseOverEventArgs.type = 'mouseover';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                    let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                    mouseLeaveEventArgs.type = 'mouseleave';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(5);
                        done();
                    }, 1000);
                });
            });
            describe('Specific sub total hiding in column/row', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            filterSettings: [
                                { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                            ],
                            rows: [{ name: 'product', caption: 'Items', showSubTotals: false }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population', showSubTotals: false }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                            showSubTotals: false
                        },
                        showValuesButton: true,
                        showGroupingBar: true,
                        dataBound: dataBound
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(pivotGridObj.engineModule.columnCount === 6).toBeTruthy();
                        (document.querySelector('.e-expand') as HTMLElement).click();
                        done();
                    }, 1000);
                });
                it('After Drill', (done: Function) => {
                    expect(pivotGridObj.engineModule.columnCount === 8).toBeTruthy();
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                    mouseOverEventArgs.type = 'mouseover';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                    let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                    mouseLeaveEventArgs.type = 'mouseleave';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(4);
                        done();
                    }, 1000);
                });
                it('Before Drill', () => {
                    expect(pivotGridObj.engineModule.columnCount === 8).toBeTruthy();
                    (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                });
                it('After Drill', (done: Function) => {
                    expect(pivotGridObj.engineModule.columnCount === 10).toBeTruthy();
                    let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                    let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                    let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(1);
                    let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                    let mousedown: any =
                        getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                    EventHandler.trigger(dragElement, 'mousedown', mousedown);
                    let mousemove: any =
                        getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                    mouseOverEventArgs.type = 'mouseover';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                    let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                    mouseLeaveEventArgs.type = 'mouseleave';
                    (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                    let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                    mouseUp.type = 'mouseup';
                    mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                        expect(pivotButton.length).toEqual(5);
                        done();
                    }, 1000);
                });
            });
            describe('Grand total hiding', () => {
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll((done: Function) => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: true,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            formatSettings: [{ name: 'balance', format: 'C' }],
                            filterSettings: [
                                { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                                { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                            ],
                            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }],
                            filters: [],
                            showGrandTotals: false
                        },
                        showValuesButton: true,
                        showGroupingBar: true,
                        dataBound: dataBound
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                it('Before Drill', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === '$48,954.03').toBeTruthy();
                        done();
                    }, 2000);
                });
            });
        });
        describe(' - selection', () => {
            describe(' - column_single', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Column',
                                type: 'Single'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,

                });
                let shiftClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'shiftKey': true
                });
                let ctrlClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'ctrlKey': true
                });

                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2006 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada * FY 2005 value cell mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2005 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('FY 2006 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(0);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('save selected cells + header refresh + apply selection on selected cells _ used in window resize', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(31);
                        (pivotGridObj as any).getSelectedCellsPos();
                        pivotGridObj.grid.headerModule.refreshUI();
                        (pivotGridObj as any).setSavedSelectedCells();
                        done();
                    }, 5000);
                });
                it('Canada.Alberta keyboard ctrl + mouse click', function (done) {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(ctrlClick);
                        done();
                    }, 5000);
                });
            });
            describe(' - column_multiple', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Column',
                                type: 'Multiple'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let shiftClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'shiftKey': true
                });
                let ctrlClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'ctrlKey': true
                });
                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2006 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada * FY 2005 value cell mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2005 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('FY 2006 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(0);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta keyboard ctrl + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(ctrlClick);
                        done();
                    }, 5000);
                });
            });
            describe(' - both_single', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Both',
                                type: 'Single'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let shiftClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'shiftKey': true
                });
                let ctrlClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'ctrlKey': true
                });
                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2006 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada * FY 2005 value cell mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2005 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('FY 2006 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(31);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta keyboard ctrl + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(ctrlClick);
                        done();
                    }, 5000);
                });
                it('FY 2005 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
            });
            describe(' - both_multiple', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Both',
                                type: 'Multiple'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let shiftClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'shiftKey': true
                });
                let ctrlClick: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'ctrlKey': true
                });
                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2006 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada.Alberta mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('Canada * FY 2007 value cell mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        document.querySelector('[aria-colindex="3"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2005 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(42);
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('FY 2006 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[1].value).toBe('Canada');
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                        done();
                    }, 5000);
                });
                it('FY 2007 keyboard ctrl + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        expect(args.selectedCellsInfo[1].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(ctrlClick);
                        done();
                    }, 5000);
                });
            });
            describe(' - keyboard_column_single', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Column',
                                type: 'Multiple'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('-> FY 2006 using keyboard right arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'rightArrow', target: document.querySelector('[aria-colindex="1"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('FY 2005 keyboard shift + mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftLeft', shiftKey: true, target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('Canada.Alberta * FY 2006 value cell mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[1].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="2"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('-> FY 2006 using keyboard up arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('-> Canada.Alberta * FY 2006 value cell using keyboard down arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'downArrow', target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('-> FY 2006 using keyboard shift + keyboard up arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftUp', shiftKey: true, target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('-> Canada.Alberta * FY 2006 value cell using keyboard shift + keyboard down arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftDown', shiftKey: true, target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('keyboard escape', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'escape', target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('Report change - Add Quantity in values', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(0);
                        pivotGridObj.dataSourceSettings.values = [{ name: 'Amount' }, { name: 'Quantity' }];
                        done();
                    }, 5000);
                });
                it('FY 2005.Amount mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(0);
                        document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('-> FY 2005 using keyboard up arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(31);
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="1"][index="1"]'), preventDefault: (): void => { /** Null */ } });
                        pivotGridObj.grid.selectionSettings.mode = 'Both';
                        done();
                    }, 5000);
                });
                it('Canada mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(63);
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('-> 0th cell using keyboard up arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="0"][index="2"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('-> out of the pivot gris using keyboard left arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'leftArrow', target: document.querySelector('[aria-colindex="0"][index="2"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('Canada.Alberta mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                        document.querySelector('[aria-colindex="0"][index="3"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('-> Canada.Alberta * FY 2005.Amount value cell using keyboard right arrow', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'rightArrow', target: document.querySelector('[aria-colindex="0"][index="3"]'), preventDefault: (): void => { /** Null */ } });
                        done();
                    }, 5000);
                });
                it('-> Canada.Alberta using keyboard left arrow', function (done) {
                    ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                        (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'leftArrow', target: document.querySelector('[aria-colindex="1"][index="3"]'), preventDefault: (): void => { /** Null */ } });
                        pivotGridObj.renderModule.updateGridSettings();
                        done();
                    }, 5000);
                });
            });
            describe(' - all', () => {
                let originalTimeout: number;
                let pivotGridObj: PivotView;
                let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
                let args: PivotCellSelectedEventArgs;
                document.body.appendChild(elem);
                afterAll(() => {
                    if (pivotGridObj) {
                        pivotGridObj.destroy();
                    }
                    remove(elem);
                });
                beforeAll(() => {
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                    if (document.getElementById(elem.id)) {
                        remove(document.getElementById(elem.id));
                    }
                    document.body.appendChild(elem);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            expandAll: true,
                            dataSource: pivot_smalldata as IDataSet[],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            columns: [{ name: 'Date' }],
                            values: [{ name: 'Amount' }],
                        },
                        height: 400,
                        gridSettings: {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Cell',
                                type: 'Single',
                                cellSelectionMode: 'Box'
                            }
                        },
                        cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                            args = arg;
                        }
                    });
                    pivotGridObj.appendTo('#PivotGrid');
                });
                let click: MouseEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let down: MouseEvent = new MouseEvent('mousedown', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let up: MouseEvent = new MouseEvent('mouseup', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                let move: MouseEvent = new MouseEvent('mousemove', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                });
                it('Alberta mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2006 mouse click + adaptive mode + Both + Multiple -> configured', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        pivotGridObj.setProperties({ gridSettings: { selectionSettings: { mode: 'Both' } } });
                        pivotGridObj.gridSettings.selectionSettings.type = 'Multiple';
                        pivotGridObj.isAdaptive = true;
                        done();
                    }, 5000);
                });
                it('Canada mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                    setTimeout(() => {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                        document.querySelector('[aria-colindex="0"][index="1"]').dispatchEvent(click);
                        done();
                    }, 5000);
                });
                it('FY 2005 mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        (pivotGridObj as any).isPopupClicked = true;
                        done();
                    }, 5000);
                });
                it('FY 2005 on popup dialog mouse click', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        (pivotGridObj as any).isPopupClicked = false;
                        done();
                    }, 5000);
                });
                it('FY 2005 mouse click', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(args.selectedCellsInfo.length).toBe(0);
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(click);
                        pivotGridObj.gridSettings.selectionSettings.mode = 'Cell';
                        done();
                    }, 5000);
                });
                it('Alberta mouse click + Cell + Desktop mode -> configured', function (done) {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(document.querySelector('[aria-colindex="0"][index="2"]').textContent).toBe('Alberta');
                        document.querySelector('[aria-colindex="0"][index="2"]').dispatchEvent(click);
                        pivotGridObj.gridSettings = {
                            allowSelection: true,
                            selectionSettings: {
                                mode: 'Cell',
                                type: 'Multiple',
                                cellSelectionMode: 'Box'
                            }
                        },
                            pivotGridObj.isAdaptive = false;
                        done();
                    }, 7000);
                });
                it('FY 2005 -> keyboard down arrow', (done: Function) => {
                    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(() => {
                        document.querySelector('[aria-colindex="1"][index="0"]').dispatchEvent(down);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(move);
                        document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(move);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(move);
                        document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(up);
                        (pivotGridObj as any).parentAt(document.querySelector('[aria-colindex="2"][index="0"]'), 'TD');
                        done();
                    }, 6000);
                });
            });
        });
    });
    describe('Pivot Grid Slicer in Field List with injected Module', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_nodata as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    filterSettings: [{ name: 'Country', type: 'Include', items: ['Canada', 'Germany'] },
                    { name: 'State', type: 'Include', items: ['England'] }
                    ],
                    rows: [{ name: 'Product' }],
                    columns: [{ name: 'Date' }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }],
                    filters: [{ name: 'Country' }, { name: 'State' }, { name: 'Product' }]
                },
                showFieldList: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let persistdata: string;
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('check all nodes on filter', (done: Function) => {
            (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: Element = document.querySelector('.e-filters').querySelectorAll('.e-pivot-button').item(0);
                expect((pivotButtons.querySelector('.e-content') as HTMLElement).innerText).toEqual('Country (Multiple items)');
                done();
            }, 1000);
        });
        it('check single node on filter', (done: Function) => {
            (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: Element = document.querySelector('.e-filters').querySelectorAll('.e-pivot-button').item(1);
                expect((pivotButtons.querySelector('.e-content') as HTMLElement).innerText).toEqual('State (England)');
                done();
            }, 1000);
        });
        it('uncheck single node on filter', (done: Function) => {
            (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: Element = document.querySelector('.e-filters').querySelectorAll('.e-pivot-button').item(2);
                expect((pivotButtons.querySelector('.e-content') as HTMLElement).innerText).toEqual('Product (All)');
                pivotGridObj.copy();
                done();
            }, 1000);
        });
    });
    describe('Pivot Grid Single Measure Header', () => {
        describe(' -  Initial Rendering and Value Sorting', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_nodata as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        rows: [{ name: 'Product' }],
                        columns: [{ name: 'Date' }],
                        values: [{ name: 'Amount' }],
                        alwaysShowValueHeader: true
                    },
                    enableValueSorting: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check value header initially', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Amount').toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check value header after value sorting', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Amount').toBeTruthy();
                    done();
                }, 1000);
            });
        });
        describe('- Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }], filters: [{ name: 'gender' }],
                        alwaysShowValueHeader: true
                    },
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }], filters: [{ name: 'gender' }],
                        alwaysShowValueHeader: true
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    describe('Group By Date feature', () => {
        describe(' -  Initial Rendering and Value Sorting', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance', caption: 'Balance' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }],
                        alwaysShowValueHeader: true
                    },
                    enableValueSorting: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check date groups initially', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check single value header', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check date groups after value sorting', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 1000);
            });
            it('Check group settings update using on proptery', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
                setTimeout(() => {
                    // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 2000);
            });
        });
        describe(' -  Initial Rendering with range', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance', caption: 'Balance' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }],
                        alwaysShowValueHeader: true
                    },
                    enableValueSorting: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check date groups initially', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check single value header', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Out of Range');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check date groups after value sorting', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1983');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 1000);
            });
            it('Check group settings update using on proptery', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
                setTimeout(() => {
                    // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 2000);
            });
        });
        describe(' -  Initial Rendering with range - PivotChart', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance', caption: 'Balance' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }],
                        alwaysShowValueHeader: true
                    },
                    chartSettings: {
                        chartSeries: { type: 'Column', animation: { enable: false } }
                    },
                    displayOption: { view: 'Chart' },
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Group settings with chart - Days on values', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }, { name: 'date_date_group_months' }];
                pivotGridObj.dataSourceSettings.values = [{ name: 'date' }];
                setTimeout(() => {
                    expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                    done();
                }, 2000);
            });
            it('Group settings with chart - Days and Months on values', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
                pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }];
                setTimeout(() => {
                    expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                    done();
                }, 2000);
            });
            it('Group settings with chart - Days, Months and Quarters on values', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }];
                pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_quarters' }];
                setTimeout(() => {
                    expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('1975:4');
                    done();
                }, 2000);
            });
            it('Group settings with chart - Days, Months, Quarters and Years on values', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [];
                pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
                setTimeout(() => {
                    expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:102');
                    done();
                }, 2000);
            });
        });
        describe(' -  Initial Rendering with range value as string', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance', caption: 'Balance' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: '1975-01-10', endingAt: '2005-11-5' },
                        { name: 'age', type: 'Number', startingAt: '25', endingAt: '35', rangeInterval: 5 }],
                        alwaysShowValueHeader: true
                    },
                    enableValueSorting: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check date groups initially', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1975');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check single value header', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Out of Range');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check date groups after value sorting', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1983');
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 1000);
            });
            it('Check group settings update using on proptery', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
                setTimeout(() => {
                    // expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('1970');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    done();
                }, 2000);
            });
        });
        describe('- Editing - normal', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        allowLabelFilter: true,
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                    },
                    height: 300,
                    width: 800,
                    allowDrillThrough: true,
                    editSettings: {
                        allowAdding: true, allowDeleting: true, allowEditing: true,
                        showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                    },
                    beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                        if (args.gridObj) {
                            let eventType: string = args.type;
                            let gridObj: Grid = args.gridObj;
                            gridObj.allowKeyboard = false;
                        }
                    },
                    showGroupingBar: true,
                    dataBound: dataBound,
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            let event: MouseEvent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let mouseup: MouseEvent = new MouseEvent('mouseup', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let mousedown: MouseEvent = new MouseEvent('mousedown', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let click: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            it('render testing', () => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(8);
            });
            it('click female-balance', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                setTimeout(() => {
                    document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                    expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("16");
                    document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                    (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('click female-quantity', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("$15,800.99");
                document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
                setTimeout(() => {
                    document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                    expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("16");
                    document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                    (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                    done();
                }, 3000);
            });
        });
        describe('- Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        enableSorting: true,
                        allowLabelFilter: true,
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] },
                        { name: 'product', items: ['Flight'], type: 'Exclude' }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                    },
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('product');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        enableSorting: true,
                        allowLabelFilter: true,
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] },
                        { name: 'product', items: ['Flight'], type: 'Exclude' }],
                        rows: [{ name: 'date', caption: 'TimeLine' }],
                        columns: [{ name: 'gender', caption: 'Population' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'product', caption: 'Category' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('product');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    describe('Grouping feature in UI', () => {
        describe(' -  Initial Rendering with Grouping module', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            let args: PivotCellSelectedEventArgs;
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(Grouping);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        rows: [{ name: 'product', caption: 'Category' }],
                        values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                        columns: [{ name: 'age' }],
                        filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters'] },
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                        { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }],
                    },
                    height: 500,
                    allowGrouping: true,
                    dataBound: dataBound,
                    cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                        args = arg;
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let shiftClick: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'shiftKey': true
            });
            let ctrlClick: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'ctrlKey': true
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check code-behind groups initially', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                    done();
                }, 1000);
            });
            it('contextmenu in row header', () => {
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('check context menu in row header', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option for false statement', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
                    (document.querySelector('.e-pivot-error-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Perform ungroup option', (done: Function) => {
                expect(document.querySelector('.e-pivot-error-dialog') == null).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].querySelector('.e-expand')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].querySelector('.e-expand')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Expand All', (done: Function) => {
                pivotGridObj.dataSourceSettings.expandAll = true;
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].querySelector('.e-collapse')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].querySelector('.e-collapse')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9].textContent).toBe('Jet');
                    done();
                }, 1000);
            });
            it('Create new group from selction Jet keyboard ctrl + mouse click', function (done) {
                document.querySelector('[aria-colindex="0"][index="10"]').dispatchEvent(ctrlClick);
                setTimeout(function () {
                    expect(args.selectedCellsInfo[0].rowHeaders).toBe('Jet');
                    document.querySelector('[aria-colindex="0"][index="4"]').dispatchEvent(ctrlClick);
                    done();
                }, 1000);
            });
            it('Flight keyboard ctrl + mouse click', function (done) {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
                setTimeout(function () {
                    pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="0"][index="4"]');
                    let cell: HTMLElement = document.querySelector('[aria-colindex="0"][index="4"]');
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Context menu in selected headers', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option for selected headers', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category3');
                    done();
                }, 1000);
            });
            it('Update without group name for false statement', (done: Function) => {
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Assign new group name for selected headers', (done: Function) => {
                let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                expect(input1).toBeTruthy;
                input1.value = 'Airways';
                setTimeout(() => {
                    expect(input1.value).toBe('Airways');
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated new group selected headers in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[4].textContent).toBe('Jet');
                    done();
                }, 1000);
            });
            it('Context menu in column header for number grouping', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group_interval_input').getAttribute('value')).toBe('5');
                    done();
                }, 1000);
            });
            it('Change grouping interval to 10', (done: Function) => {
                let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
                let input1: NumericTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, NumericTextBox) as NumericTextBox;
                expect(option1).toBeTruthy;
                expect(input1).toBeTruthy;
                option1.click();
                input1.value = 10;
                setTimeout(() => {
                    expect(input1.value).toBe(10);
                    expect(option1.checked).toBe(false);
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated number grouping in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20-29');
                    pivotGridObj.lastCellClicked = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9];
                    let cell: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9] as HTMLElement;
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform ungrouping custom groups', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-expand') == null).toBeTruthy();
                    pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                    let cell: HTMLElement = document.querySelector('.e-columnsheader');
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform ungrouping the number groups', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20');
                    done();
                }, 1000);
            });
            it('Create new group from selction 20 keyboard shift + mouse click', function (done) {
                document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(shiftClick);
                setTimeout(function () {
                    expect(args.selectedCellsInfo[0].columnHeaders).toBe('20');
                    document.querySelectorAll('th[aria-colindex="11"]')[0].dispatchEvent(shiftClick);
                    done();
                }, 1000);
            });
            it('25 keyboard shift + mouse click', function (done) {
                expect(args.selectedCellsInfo[5].columnHeaders).toBe('25');
                setTimeout(function () {
                    pivotGridObj.lastCellClicked = document.querySelectorAll('th[aria-colindex="1"]')[0];
                    let cell: HTMLElement = document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement;
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform group option for selected headers', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('age2');
                    done();
                }, 1000);
            });
            it('Assign new group name for selected headers', (done: Function) => {
                let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                expect(input1).toBeTruthy;
                input1.value = '.Check';
                setTimeout(() => {
                    expect(input1.value).toBe('.Check');
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated new group selected headers in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('.Check');
                    done();
                }, 1000);
            });
        });

        describe(' -  With All Features(Field list, Grouping Bar, Value sorting, Single value header and Editing', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let ds: IDataSet[] = PivotUtil.getClonedData(pivot_dataset) as IDataSet[];
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            let args: PivotCellSelectedEventArgs;
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(Grouping, GroupingBar, FieldList, DrillThrough);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: ds,
                        expandAll: false,
                        formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                        filterSettings: [{ name: 'gender', items: ['male'], type: 'Exclude' }],
                        rows: [{ name: 'product', caption: 'Category' }],
                        values: [{ name: 'balance', caption: 'Balance' }, { name: 'price', caption: 'Totals' }],
                        columns: [{ name: 'age' }],
                        filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                        groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10) },
                        { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                        { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }],
                        alwaysShowValueHeader: true
                    },
                    height: 500,
                    allowGrouping: true,
                    enableValueSorting: true,
                    allowDrillThrough: true,
                    editSettings: {
                        allowAdding: true, allowDeleting: true, allowEditing: true,
                        showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                    },
                    beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                        if (args.gridObj) {
                            let eventType: string = args.type;
                            let gridObj: Grid = args.gridObj;
                            gridObj.allowKeyboard = false;
                        }
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound,
                    cellSelected: function (arg: PivotCellSelectedEventArgs): void {
                        args = arg;
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let shiftClick: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'shiftKey': true
            });
            let ctrlClick: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'ctrlKey': true
            });
            let event: MouseEvent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let mouseup: MouseEvent = new MouseEvent('mouseup', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let mousedown: MouseEvent = new MouseEvent('mousedown', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            let click: MouseEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check close field list', () => {
                let controlWrapper: HTMLElement = document.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(document.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
            });
            it('Check code-behind groups initially', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('Check single value header', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Four wheelers');
                    expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                    done();
                }, 1000);
            });
            it('check sorting order field', () => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBe(2);
                expect((pivotButtons[0]).querySelector('.e-ascend')).toBeTruthy;
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Four wheelers');
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBe(2);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            });
            it('check filtering field', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBe(3);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeTruthy();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    expect((pivotButton[1].id)).toBe("date_date_group_years");
                    done();
                }, 1000);
            });
            it('contextmenu in row header', () => {
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('check context menu in row header', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option for false statement', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-pivot-error-dialog')).toBeTruthy();
                    (document.querySelector('.e-pivot-error-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Perform ungroup option', (done: Function) => {
                expect(document.querySelector('.e-pivot-error-dialog') == null).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].querySelector('.e-expand')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].querySelector('.e-expand')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('check pivot button maintenance', () => {
                let pivotButton: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].id).toBe('date');
            });
            it('Expand All', (done: Function) => {
                pivotGridObj.dataSourceSettings.expandAll = true;
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].querySelector('.e-collapse')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[8].querySelector('.e-collapse')).toBeTruthy();
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9].textContent).toBe('Jet');
                    done();
                }, 1000);
            });
            it('Create new group from selction Jet keyboard ctrl + mouse click', function (done) {
                document.querySelector('[aria-colindex="0"][index="10"]').dispatchEvent(ctrlClick);
                setTimeout(function () {
                    expect(args.selectedCellsInfo[0].rowHeaders).toBe('Jet');
                    document.querySelector('[aria-colindex="0"][index="4"]').dispatchEvent(ctrlClick);
                    done();
                }, 1000);
            });
            it('Flight keyboard ctrl + mouse click', function (done) {
                expect(args.selectedCellsInfo[0].rowHeaders).toBe('Flight');
                setTimeout(function () {
                    pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="0"][index="4"]');
                    let cell: HTMLElement = document.querySelector('[aria-colindex="0"][index="4"]');
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Context menu in selected headers', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option for selected headers', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category3');
                    done();
                }, 1000);
            });
            it('Update without group name for false statement', (done: Function) => {
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Assign new group name for selected headers', (done: Function) => {
                let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                expect(input1).toBeTruthy;
                input1.value = 'Airways';
                setTimeout(() => {
                    expect(input1.value).toBe('Airways');
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated new group selected headers in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Airways');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Flight');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3].textContent).toBe('Jet');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[4].textContent).toBe('Jet');
                    done();
                }, 1000);
            });
            it('check pivot button maintenance', () => {
                let pivotButton: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].id).toBe('date');
            });
            it('Context menu in column header for number grouping', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('25-29');
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group_interval_input').getAttribute('value')).toBe('5');
                    done();
                }, 1000);
            });
            it('Change grouping interval to 10', (done: Function) => {
                let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
                let input1: NumericTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, NumericTextBox) as NumericTextBox;
                expect(option1).toBeTruthy;
                expect(input1).toBeTruthy;
                option1.click();
                input1.value = 10;
                setTimeout(() => {
                    expect(input1.value).toBe(10);
                    expect(option1.checked).toBe(false);
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated number grouping in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20-29');
                    pivotGridObj.lastCellClicked = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9];
                    let cell: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[9] as HTMLElement;
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('check pivot button maintenance', () => {
                let pivotButton: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].id).toBe('date');
            });
            it('Perform ungrouping custom groups', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('Bike');
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-expand') == null).toBeTruthy();
                    pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                    let cell: HTMLElement = document.querySelector('.e-columnsheader');
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform ungrouping the number groups', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('20');
                    pivotGridObj.enableValueSorting = false;
                    done();
                }, 1000);
            });
            it('Create new group from selction 20 keyboard shift + mouse click', function (done) {
                document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(shiftClick);
                setTimeout(function () {
                    expect(args.selectedCellsInfo[0].columnHeaders).toBe('20');
                    document.querySelectorAll('th[aria-colindex="11"]')[0].dispatchEvent(shiftClick);
                    done();
                }, 1000);
            });
            it('25 keyboard shift + mouse click', function (done) {
                expect(args.selectedCellsInfo[5].columnHeaders).toBe('25');
                setTimeout(function () {
                    pivotGridObj.lastCellClicked = document.querySelectorAll('th[aria-colindex="1"]')[0];
                    let cell: HTMLElement = document.querySelectorAll('th[aria-colindex="1"]')[0] as HTMLElement;
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform group option for selected headers', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('age2');
                    done();
                }, 1000);
            });
            it('Assign new group name for selected headers', (done: Function) => {
                let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                expect(input1).toBeTruthy;
                input1.value = '.Check';
                setTimeout(() => {
                    expect(input1.value).toBe('.Check');
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated new group selected headers in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[0].textContent).toBe('.Check');
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button from column to filter axis', (done: Function) => {
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].id)).toBe("age_custom_group");
                    done();
                }, 1000);
            });
            it('click 20-balance for editing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
                setTimeout(() => {
                    document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                    document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                    expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                    document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                    (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('check pivot button maintenance', () => {
                let pivotButton: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                expect(pivotButton[0].id).toBe('date');
            });
            it('check drag and drop pivot button from row to filter axis', (done: Function) => {
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(4);
                    expect((pivotButton[3].id)).toBe("product");
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button from filter to row axis', (done: Function) => {
                let filterAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-filters');
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(4);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(1);
                    expect((pivotButton[0].id)).toBe("date");
                    done();
                }, 1000);
            });
            it('Context menu in row header for date grouping', (done: Function) => {
                expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Out of Range');
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Perform group option', (done: Function) => {
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-multi-select-wrapper').querySelector('.e-delim-view.e-delim-values').textContent).toBe('Years, Quarters');
                    done();
                }, 1000);
            });
            it('Change grouping interval to Months', (done: Function) => {
                let option1: CheckBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_start_option') as HTMLElement, CheckBox) as CheckBox;
                let input1: MultiSelect = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_interval_input') as HTMLElement, MultiSelect) as MultiSelect;
                expect(option1).toBeTruthy;
                expect(input1).toBeTruthy;
                option1.click();
                input1.value = ['Months'];
                setTimeout(() => {
                    expect(option1.checked).toBe(false);
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Check updated number grouping in table', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                    expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('Jan');
                    done();
                }, 2000);
            });
            it('check pivot button maintenance', () => {
                let pivotButton: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[0].id).toBe('age_custom_group');
                pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                expect(pivotButton[0].id).toBe('date');
                pivotButton = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                expect(pivotButton[0].id).toBe('age');
                pivotGridObj.lastCellClicked = pivotGridObj.element.querySelector('.e-rowsheader');
                let cell: HTMLElement = pivotGridObj.element.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('Perform ungrouping the number groups', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_ungroup') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[0].textContent).toBe('20/01/1970-10:54 AM');
                    pivotGridObj.enableValueSorting = false;
                    done();
                }, 3000);
            });
            it('Create new group from selction 20/01/1970-10:54 AM keyboard shift + mouse click', function (done) {
                pivotGridObj.element.querySelector('.e-rowsheader').dispatchEvent(shiftClick);
                setTimeout(function () {
                    expect(args.selectedCellsInfo[0].rowHeaders).toBe('20/01/1970-10:54 AM');
                    document.querySelector('td[aria-colindex="0"][index="420"]').dispatchEvent(shiftClick);
                    done();
                }, 1000);
            });
            it('01/01/2018-09:50 AM keyboard shift + mouse click', function (done) {
                expect(args.selectedCellsInfo[416].rowHeaders).toBe('01/01/2018-09:50 AM');
                setTimeout(function () {
                    pivotGridObj.lastCellClicked = pivotGridObj.element.querySelector('.e-rowsheader');
                    let cell: HTMLElement = pivotGridObj.element.querySelector('.e-rowsheader');
                    triggerMouseEvent(cell, 'contextmenu');
                    done();
                }, 1000);
            });
            it('Perform group option for selected headers', (done: Function) => {
                expect(document.querySelector('#PivotGrid_grid_cmenu')).toBeTruthy();
                (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                    expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('TimeLine2');
                    done();
                }, 1000);
            });
            it('Assign new group name for selected headers', (done: Function) => {
                let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
                expect(input1).toBeTruthy;
                input1.value = '.Check';
                setTimeout(() => {
                    expect(input1.value).toBe('.Check');
                    (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 3000);
            });
            it('Check updated new group selected headers in table', (done: Function) => {
                expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-rowsheader').textContent).toBe('.Check');
                    done();
                }, 1000);
            });
        });
    });

    describe('Pivot Grid Toolbar', () => {
        describe(' -  Initial Rendering and Basic Operations', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(FieldList, CalculatedField, Toolbar, ConditionalFormatting, PivotChart);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    displayOption: {
                        view: 'Both'
                    },
                    dataBound: dataBound,
                    saveReport: saveReport.bind(this),
                    fetchReport: fetchReport.bind(this),
                    loadReport: loadReport.bind(this),
                    removeReport: removeReport.bind(this),
                    renameReport: renameReport.bind(this),
                    newReport: newReport.bind(this),
                    toolbarRender: beforeToolbarRender.bind(this),
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'ConditionalFormatting',
                        'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                    allowExcelExport: true,
                    allowConditionalFormatting: true,
                    allowPdfExport: true,
                    showToolbar: true,
                    allowCalculatedField: true,
                    showFieldList: true
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Toolbar initial render check', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report Dialog-check', () => {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
            });
            it('Remove Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report Dialog', (done: Function) => {
                expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                    (document.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report Dialog - OK', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report1";
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    (document.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                    (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save As Report Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save As Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                    (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save As Report Dialog - OK', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Save As Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    (pivotGridObj.toolbarModule as any).action = 'Load';
                    (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Rename Report Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Rename Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
                    (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Rename Report Dialog - OK', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "";
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Rename Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
                    (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
                    (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Remove Report Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Remove Report Dialog', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Remove Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Remove Report Dialog - Cancel', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('.e-pivot-toolbar .e-toolbar-fieldlist') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Fieldlist', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect(window.getComputedStyle(document.querySelector('.e-pivotfieldlist-wrapper')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-pivotfieldlist-wrapper .e-cancel-btn') as HTMLElement).click();
                    (document.querySelector('.e-pivot-toolbar .e-toolbar-formatting') as HTMLElement).click();
                    done();
                }, 2000);
            });
            it('Conditional Formatting', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivot-formatting-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelector('.e-collapse') as HTMLElement).click();
                    (document.querySelector('.e-pivot-formatting-dialog .e-format-cancel-button') as HTMLElement).click();
                    (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('New Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('New Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display === 'none').toBeTruthy();
                    (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Remove - Empty Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect(window.getComputedStyle(document.querySelectorAll('.e-pivot-error-dialog')[1]).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[4] as HTMLElement).click();
                    (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Remove - Rename Report', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect(window.getComputedStyle(document.querySelectorAll('.e-pivot-error-dialog')[1]).display !== 'none').toBeTruthy();
                    (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[4] as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('PDF Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Excel Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('CSV Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Export', (done: Function) => {
                PivotView.Inject(PDFExport, ExcelExport);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('PDF Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Excel Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('CSV Export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Sub Total', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Sub Total - True', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Sub Total - False', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Sub Total - Row', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Sub Total - Column', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Grand Total', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Grand Total - True', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Grand Total - False', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Grand Total - Row', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Grand Total - Column', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    // pivotGridObj.toolbarModule.refreshToolbar();
                    done();
                }, 1000);
            });
        });
        describe(' -  Chart and Grid with grouping bar', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(Toolbar, PivotChart, GroupingBar, FieldList, CalculatedField);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    dataBound: dataBound,
                    saveReport: saveReport.bind(this),
                    fetchReport: fetchReport.bind(this),
                    loadReport: loadReport.bind(this),
                    removeReport: removeReport.bind(this),
                    renameReport: renameReport.bind(this),
                    newReport: newReport.bind(this),
                    toolbarRender: beforeToolbarRender.bind(this),
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                        'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                    allowExcelExport: true,
                    allowPdfExport: true,
                    showToolbar: true,
                    allowCalculatedField: true,
                    showFieldList: true,
                    showGroupingBar: true,
                    displayOption: { view: 'Both' }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Mouseover on chart icon', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 1000);
            });
            it('Switch to Grid with grouping bar', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
                setTimeout(() => {
                    //expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                    pivotGridObj.displayOption.primary = 'Chart';
                    done();
                }, 1000);
            });
        });
    });

    describe('Chart - ', () => {
        describe('Grouping bar - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotView', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                setTimeout(() => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, FieldList, PivotChart);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_smalldata as IDataSet[],
                            expandAll: false,
                            columns: [{ name: 'Date' }, { name: 'Product' }],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            formatSettings: [{ name: 'Amount', format: 'C' }],
                            values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        },
                        dataBound: dataBound,
                        height: 500,
                        showGroupingBar: true,
                        showFieldList: true,
                        displayOption: { view: 'Chart' },
                        chartSettings: {
                            value: 'Amount',
                            chartSeries: { type: 'Column', animation: { enable: false } }
                        },
                    });
                    pivotGridObj.appendTo('#PivotView');
                }, 2000);
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check initial render', (done: Function) => {
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                    expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                    expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                    expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                    expect(document.getElementById('PivotView_chart_Series_4_Point_4')).toBeNull();
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + United States');
                    expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('$500.00');
                    expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('Country / State');
                    expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Amount');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2008');
                    done();
                }, 2000);
            });

            // it('tooltip => FY 2005 * Germany', (done: Function) => {
            //     let dataLabel: HTMLElement = document.getElementById('PivotView_chart_Series_0_Point_2');
            //     let series: Series = <Series>pivotGridObj.chart.series[0];
            //     let chartArea: HTMLElement = document.getElementById('PivotView_chart_ChartAreaBorder');
            //     let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + (elem.querySelector('.e-chart') as HTMLElement).offsetTop;
            //     let x: number = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + (elem.querySelector('.e-chart') as HTMLElement).offsetLeft;
            //     triggerMouseEvent(dataLabel, 'mousemove', Math.ceil(x), Math.ceil(y))
            //     setTimeout(() => {
            //         let tooltip: HTMLElement = document.getElementById('PivotView_chart_tooltip');
            //         expect(tooltip != null).toBe(true);
            //         expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')));
            //         expect(tooltip.querySelectorAll('tspan')[0].textContent.trim()).toBe('Sum of Amount');
            //         expect(tooltip.querySelectorAll('tspan')[2].textContent.trim()).toBe('$100.00');
            //         expect(tooltip.querySelectorAll('tspan')[5].textContent.trim()).toBe('FY 2005');
            //         expect(tooltip.querySelectorAll('tspan')[8].textContent.trim()).toBe('Germany');
            //         done();
            //     }, 2000);
            // });

            it('chart type changed to stackingcolumn100', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'StackingColumn100';
                setTimeout(() => {
                    //  expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('50%');
                    done();
                }, 2000);
            });
            it('chart type changed to stackingarea100', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
                setTimeout(() => {
                    // expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('50%');
                    done();
                }, 2000);
            });
            it('chart type changed to column', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'Column';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('$500.00');
                    done();
                }, 2000);
            });

            it('sort descending -> Country', (done: Function) => {
                triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #Country .e-sort'), 'click');
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:400');
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                    done();
                }, 2000);
            })

            it('remove Date from column', (done: Function) => {
                triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-columns #Date .e-remove'), 'click');
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:300');
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('Bike');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_2').textContent).toBe('Van');
                    done();
                }, 2000);
            })

            it('empty column', (done: Function) => {
                triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-columns #Product .e-remove'), 'click');
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('United States:1450');
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + Canada');
                    done();
                }, 2000);
            })

            it('remove Country from row', function (done) {
                triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #Country .e-remove'), 'click');
                setTimeout(function () {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Alabama:250');
                    done();
                }, 2000);
            })

            it('empty row', (done: Function) => {
                triggerMouseEvent(document.querySelector('.e-chart-grouping-bar .e-rows #State .e-remove'), 'click');
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:4600');
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_0').textContent).toBe('Grand Total');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_0')).toBe(null);
                    done();
                }, 2000);
            })

            // it('tooltip => Grand Total', (done: Function) => {
            //     let dataLabel: HTMLElement = document.getElementById('PivotView_chart_Series_0_Point_0');
            //     let series: Series = <Series>pivotGridObj.chart.series[0];
            //     let chartArea: HTMLElement = document.getElementById('PivotView_chart_ChartAreaBorder');
            //     let y: number = series.points[0].regions[0].y + parseFloat(chartArea.getAttribute('y')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetTop;
            //     let x: number = series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')) + (elem.querySelector('.e-pivotchart') as HTMLElement).offsetLeft;
            //     triggerMouseEvent(dataLabel, 'mousemove', Math.ceil(x), Math.ceil(y))
            //     setTimeout(() => {
            //         let tooltip: HTMLElement = document.getElementById('PivotView_chart_tooltip');
            //         expect(tooltip != null).toBe(true);
            //         expect(parseFloat(tooltip.style.left) > series.points[0].regions[0].x + parseFloat(chartArea.getAttribute('x')));
            //         expect(tooltip.querySelectorAll('tspan')[0].textContent.trim()).toBe('Sum of Amount');
            //         expect(tooltip.querySelectorAll('tspan')[2].textContent.trim()).toBe('$4,600.00');
            //         done();
            //     }, 2000);
            // });

            it('expand all', function (done) {
                pivotGridObj.dataSourceSettings = {
                    dataSource: pivot_smalldata as IDataSet[],
                    expandAll: true,
                    columns: [{ name: 'Date' }, { name: 'Product' }],
                    rows: [{ name: 'Country' }, { name: 'State' }],
                    formatSettings: [{ name: 'Amount', format: 'C' }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                };
                setTimeout(function () {
                    done();
                }, 2000);
            });

            it('multi measure => Amount * Quantity', (done: Function) => {
                pivotGridObj.chartSettings.enableMultiAxis = true;
                setTimeout(function () {
                    //  expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:4');
                    //  expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:250');
                    done();
                }, 2000);
            });
            it('perform drill up operation', (done: Function) => {
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - United States');
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                node.dispatchEvent(args);
                setTimeout(function () {
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' + United States');
                    expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States:4');
                    expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States:250');
                    done();
                }, 3000);
            });
            it('perform drill down operation', (done: Function) => {
                expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' + United States');
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                let node: HTMLElement = document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0') as HTMLElement;
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                node.dispatchEvent(args);
                setTimeout(function () {
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_1_Text_0').textContent).toBe(' - United States');
                    expect(document.getElementById('PivotView_chart_Series_11_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:4');
                    expect(document.getElementById('PivotView_chart_Series_10_Point_0').getAttribute('aria-label')).toBe('United States - Alabama:250');
                    done();
                }, 3000);
            });
            it('empty rows', (done: Function) => {
                pivotGridObj.dataSourceSettings.rows = [];
                setTimeout(function () {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
                    expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
                    expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
                    expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Sum of Amount');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
                    done();
                }, 2000);
            });
            it('chart type changed to stackingarea100', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'StackingArea100';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart1_AxisLabel_1').textContent).toBe('50%');
                    done();
                }, 2000);
            });
            it('chart type changed to column', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'Column';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart1_AxisLabel_1').textContent).toBe('$500.00');
                    done();
                }, 2000);
            });

            it('load y axis properties', () => {
                pivotGridObj.setProperties({ chartSettings: { primaryYAxis: { labelFormat: 'C', title: 'Custom title', plotOffset: 30 } } }, true);
                pivotGridObj.chartModule.refreshChart();
            });
            it('load y axis properties-update', () => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
                expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
                expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
                expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Custom title');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
            });
            it('customize tooltip, legend and zoom properties', () => {
                pivotGridObj.chartSettings = {
                    legendSettings: { padding: 20, shapePadding: 15 },
                    value: 'Amount',
                    chartSeries: { type: 'Column', animation: { enable: false } }
                };
                expect(true).toBeTruthy();
            });
            it('customize tooltip, legend and zoom properties-update', () => {
                expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Grand Total:600');
                expect(document.getElementById('PivotView_chart_Series_5_Point_0').getAttribute('aria-label')).toBe('Grand Total:2');
                expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('');
                expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Custom title');
                expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005 - Bike | Amount');
                expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2005 - Van | Quantity');
            });
            it('display option view as both', (done: Function) => {
                pivotGridObj.displayOption = { view: 'Both' };
                setTimeout(function () {
                    expect(true).toBeTruthy();
                    done();
                }, 2000);
            });
            it('Set display option view as both, primary as chart', (done: Function) => {
                pivotGridObj.displayOption.primary = 'Chart';
                setTimeout(function () {
                    expect(true).toBeTruthy();
                    done();
                }, 2000);
            });
            it('Set display option view as both, primary as table', (done: Function) => {
                pivotGridObj.chartSeriesCreated = function (args: ChartSeriesCreatedEventArgs) {
                    args.cancel = true;
                },
                    pivotGridObj.displayOption.primary = 'Table';
                setTimeout(function () {
                    expect(document.querySelectorAll('.e-grid,.e-chart')[0].classList.contains('e-pivotchart')).toBeFalsy();
                    done();
                }, 2000);
            });
        });

        describe('Normal - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotView', styles: 'height:500px; width:100%' });
            let eventArgs: any;
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
                setTimeout(() => {
                    if (!document.getElementById(elem.id)) {
                        document.body.appendChild(elem);
                    }
                    let dataBound: EmitType<Object> = () => { done(); };
                    PivotView.Inject(GroupingBar, FieldList, PivotChart);
                    pivotGridObj = new PivotView({
                        dataSourceSettings: {
                            dataSource: pivot_smalldata as IDataSet[],
                            expandAll: false,
                            columns: [{ name: 'Date' }, { name: 'Product' }],
                            rows: [{ name: 'Country' }, { name: 'State' }],
                            formatSettings: [{ name: 'Amount', format: 'C' }],
                            values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        },
                        dataBound: dataBound,
                        height: '500px',
                        width: '80%',
                        displayOption: { view: 'Chart' },
                        chartSettings: {
                            enableExport: true,
                            primaryXAxis: { title: 'X axis title', labelIntersectAction: 'Rotate90' },
                            primaryYAxis: { title: 'Y axis title', labelFormat: 'N' },
                            beforePrint: (args: any) => { eventArgs = args; },
                            animationComplete: (args: any) => { eventArgs = args; },
                            legendRender: (args: any) => { eventArgs = args; },
                            textRender: (args: any) => { eventArgs = args; },
                            pointRender: (args: any) => { eventArgs = args; },
                            seriesRender: (args: any) => { eventArgs = args; },
                            chartMouseMove: (args: any) => { eventArgs = args; },
                            chartMouseClick: (args: any) => { eventArgs = args; },
                            pointMove: (args: any) => { eventArgs = args; },
                            pointClick: (args: any) => { eventArgs = args; },
                            chartMouseLeave: (args: any) => { eventArgs = args; },
                            chartMouseDown: (args: any) => { eventArgs = args; },
                            chartMouseUp: (args: any) => { eventArgs = args; },
                            dragComplete: (args: any) => { eventArgs = args; },
                            zoomComplete: (args: any) => { eventArgs = args; },
                            scrollStart: (args: any) => { eventArgs = args; },
                            scrollEnd: (args: any) => { eventArgs = args; },
                            scrollChanged: (args: any) => { eventArgs = args; },
                            tooltipRender: (args: any) => { eventArgs = args; },
                            loaded: (args: any) => { eventArgs = args; },
                            load: (args: any) => { eventArgs = args; },
                            resized: (args: any) => { eventArgs = args; },
                            axisLabelRender: (args: any) => { eventArgs = args; }
                        },
                    });
                    pivotGridObj.appendTo('#PivotView');
                }, 2000);
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Check initial render', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries = {
                    type: 'Column', animation: { enable: false }
                };
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                    expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                    expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                    expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                    expect(document.getElementById('PivotView_chart_Series_4_Point_4')).toBeNull();
                    expect(document.getElementById('PivotView_chart0_Axis_MultiLevelLabel_Level_0_Text_4').textContent).toBe(' + United States');
                    expect(document.getElementById('PivotView_chart1_AxisLabel_5').textContent).toBe('500');
                    expect(document.getElementById('PivotView_chart_AxisTitle_0').textContent).toBe('X axis title');
                    expect(document.getElementById('PivotView_chart_AxisTitle_1').textContent).toBe('Y axis title');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_0').textContent).toBe('FY 2005');
                    expect(document.getElementById('PivotView_chart_chart_legend_text_3').textContent).toBe('FY 2008');
                    done();
                }, 2000);
            });
            it('change width to  800px', (done: Function) => {
                pivotGridObj.width = '800px';
                pivotGridObj.chartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                    done();
                }, 2000);
            });
            it('change width to 500', (done: Function) => {
                pivotGridObj.width = 500;
                pivotGridObj.chartModule.loadChart(pivotGridObj, pivotGridObj.chartSettings);
                setTimeout(() => {
                    //  expect(Math.ceil(Number(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis').getAttribute('width')))).toBe(445);
                    done();
                }, 2000);
            });
            it('current measure set to amt(false case)', (done: Function) => {
                pivotGridObj.chartSettings.value = 'Amt';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Canada:100');
                    expect(document.getElementById('PivotView_chart_Series_1_Point_0').getAttribute('aria-label')).toBe('Canada:400');
                    expect(document.getElementById('PivotView_chart_Series_0_Point_1').getAttribute('aria-label')).toBe('France:200');
                    expect(document.getElementById('PivotView_chart_Series_3_Point_4').getAttribute('aria-label')).toBe('United States:400');
                    done();
                }, 2000);
            });
            it('chart type changed to polar', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'Polar';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                    done();
                }, 2000);
            });
            it('chart type changed to radar', (done: Function) => {
                pivotGridObj.chartSettings.chartSeries.type = 'Radar';
                setTimeout(() => {
                    expect(document.getElementById('PivotView_chart_scrollBarThumb_primaryXAxis')).toBe(null);
                    // pivotGridObj.chartModule.destroy();
                    done();
                }, 2000);
            });
            it('onResize', (done: Function) => {
                (pivotGridObj.chartModule as any).resized({
                    chart: pivotGridObj.chart,
                    currentSize: { height: 800, width: 800 },
                    previousSize: { height: 500, width: 500 },
                    name: 'resized'
                } as IResizeEventArgs);
                setTimeout(() => {
                    expect(true).toBeTruthy();
                    done();
                }, 2000);
            })
            it('onExport', (done: Function) => {
                pivotGridObj.chartExport('JPEG', 'jp');
                setTimeout(() => {
                    pivotGridObj.chartModule.destroy();
                    expect(pivotGridObj.chart.isDestroyed).toBeTruthy(true);
                    done();
                }, 2000);
            })
        });
    });

    // cell template function
    (<{ getCellContent?: Function }>window).getCellContent = (e: any) => {
        let template: string;
        if (e && e.targetCell.className.indexOf('e-valuescontent') > -1) {
            template = '<div class="caption" style="color: red;">Values</div>';
        } else if (e && e.targetCell.className.indexOf('e-columnsheader') > -1) {
            template = '<div class="caption" style="color: green;">Colum Header</div>';
        } else if (e && e.targetCell.className.indexOf('e-rowsheader') > -1) {
            template = '<div class="caption" style="color: blue;">Row Header</div>';
        }
        return template;
    };
    describe('Pivot Grid Cell Template', () => {
        describe('- Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    height: 400,
                    width: 1000,
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        },
                        rowHeight: 90
                    },
                    cellTemplate: '<div class="templatewrap">${getCellContent(data)}</div>',
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('check cell template', () => {
                expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 2).toBeTruthy();
                pivotGridObj.cellTemplate = '<script type="text/javascript">${getCellContent(data)}</script>';
                pivotGridObj.refresh();
            });
            it('check cell template with sanitizer', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 1).toBeTruthy();
                    pivotGridObj.enableHtmlSanitizer = false;
                    pivotGridObj.refresh();
                    done();
                }, 1000);
            });
            it('check cell template without sanitizer', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td')[4].childElementCount == 2).toBeTruthy();
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Include', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound,
                    gridSettings: {
                        rowHeight: 90
                    },
                    cellTemplate: '<div class="templatewrap">${getCellContent(data)}</div>',
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy;
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('gender');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    // Grouping with allowDragAndDrop feature
    describe('- Grouping Bar with allowDragAndDrop - ', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Include', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                },
                showGroupingBar: true,
                groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false, allowDragAndDrop: false },
                dataBound: dataBound,
                gridSettings: {
                    columnRender: (args: ColumnRenderEventArgs) => {
                        args.columns[0].width = 200;
                        args.columns[1].allowReordering = true;
                        args.columns[1].allowResizing = true;
                    }
                },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let persistdata: string;
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('check window resize with grouping bar', () => {
            pivotGridObj.onWindowResize();
            pivotGridObj.renderModule.updateGridSettings();
            expect(true).toBeTruthy();
        });
        it('grouping bar render testing', () => {
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
            pivotGridObj.dataBind();
            pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true, allowDragAndDrop: false };
            expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
        });
        it('check sorting order field', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('sorting order after update', () => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', () => {
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            expect(filterDialog).toBeUndefined;
        });
        it('check remove pivot button', (done: Function) => {
            let pivotButton: HTMLElement =
                (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
            expect(pivotButton.id).toBe('gender');
            (pivotButton.querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton).toBeNull();
                done();
            }, 1000);
        });
        it('check drag and drop pivot button', (done: Function) => {
            pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                args.droppedField.caption = "droppedButton"
            };
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(2);
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
            let mousedown: any =
                getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseOverEventArgs: any = extend({}, mousemove, null, true);
            mouseOverEventArgs.type = 'mouseover';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
            let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
            mouseLeaveEventArgs.type = 'mouseleave';
            (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
            let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('destroy common event handlers', () => {
            pivotGridObj.commonModule.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy', () => {
            pivotGridObj.destroy();
            expect(true).toBeTruthy();
        });
        it('pivotgrid destroy expect', () => {
            expect(pivotGridObj.element.innerHTML).toBe('');
        });
    });

    // Field based sorting option 
    describe('- PivotGrid with Field based sorting option - ', () => {
        describe('Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        filterSettings: [{ name: 'state', type: 'Exclude', items: ['Delhi'] }],
                        sortSettings: [{ name: 'product', order: 'None' },
                        { name: 'eyeColor', order: 'Descending' },
                        { name: 'date', order: 'None' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'state' }],
                    },
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        }
                    },
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('state');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        filterSettings: [{ name: 'state', type: 'Exclude', items: ['Delhi'] }],
                        sortSettings: [{ name: 'product', order: 'None' },
                        { name: 'eyeColor', order: 'Descending' },
                        { name: 'date', order: 'None' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                        rows: [{ name: 'date', caption: 'Date' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'state' }],
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy;
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('state');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    expect((pivotButton[2].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    /// Spec for Aggregate Cell Info Event ///
    describe('Pivot Grid with AggregateCellInfo Event', () => {
        describe('- Grouping Bar with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                            { name: 'age', type: 'Exclude', items: ['25'] },
                            { name: 'product', type: 'Include', items: ['Flight', 'Tempo'] },
                        ],
                        valueSortSettings: { sortOrder: 'Descending', headerText: 'female~false~balance', headerDelimiter: '~' },
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'age' }],
                    },
                    enableValueSorting: true,
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        },
                        rowHeight: 90
                    },
                    aggregateCellInfo: (args: AggregateEventArgs) => {
                        if (args.aggregateType === 'Avg') {
                            args.value = args.fieldName === 'balance' ? 225 : 5;
                        }
                        if (args.row.actualText === 'brown') {
                            args.skipFormatting = true;
                            args.value = args.fieldName === 'balance' ? 225 : 5;
                        }
                        if (args.fieldName === 'gender') {
                            args.skipFormatting = true;
                            args.value = args.cellSets[0][args.fieldName] as any;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy;
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('age');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, valueAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, valueAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                            { name: 'age', type: 'Exclude', items: ['25'] },
                            { name: 'product', type: 'Include', items: ['Flight', 'Tempo'] },
                        ],
                        valueSortSettings: { sortOrder: 'Descending', headerText: 'female~false~balance', headerDelimiter: '~' },
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [{ name: 'age' }],
                    },
                    enableValueSorting: true,
                    showGroupingBar: true,
                    showFieldList: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false, showValueTypeIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        },
                        rowHeight: 90
                    },
                    aggregateCellInfo: (args: AggregateEventArgs) => {
                        if (args.aggregateType === 'Avg') {
                            args.value = args.fieldName === 'balance' ? 225 : 5;
                        }
                        if (args.row.actualText === 'brown') {
                            args.skipFormatting = true;
                            args.value = args.fieldName === 'balance' ? 225 : 5;
                        }
                        if (args.fieldName === 'gender') {
                            args.skipFormatting = true;
                            args.value = args.cellSets[0][args.fieldName] as any;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 2000);
            });
            it('check window resize with grouping bar', () => {
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy;
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check sorting order field', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('sorting order after update', () => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('age');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = (pivotGridObj.element.querySelector('.e-filters').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).toBeNull();
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, valueAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, valueAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = valueAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(3);
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    // Spec for pivot context menu
    describe('Pivot Context Menu Spec', () => {
        describe(' context menu in default grid', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                // if (document.getElementById(elem.id)) {
                //     remove(document.getElementById(elem.id));
                // }
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                //document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(CalculatedField, GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        enableSorting: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    enableValueSorting: true,
                    allowDrillThrough: true,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    showValuesButton: true,
                    allowCalculatedField: true,
                    dataBound: dataBound,
                    gridSettings: {
                        contextMenuItems: ['Collapse', 'Drillthrough', 'Expand', 'Excel Export', 'Pdf Export', 'Csv Export',
                            'Sort Ascending', 'Sort Descending', 'Aggregate', 'CalculatedField']
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check', () => {
                expect(true).toBeTruthy();
            })
            it('contextmenu in values-content', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
                let cell: HTMLElement = document.querySelector('.e-valuesheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu in values content', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#PivotGrid_grid_cmenu') !== null)
                    expect(true);
                    done();
                }, 6000);
            });
            it('contextmenu in values-content', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu select drill through', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_drillthrough_menu') as HTMLElement).click();
                    done();
                }, 6000);
            });
            it('drillthrough check', function (done) {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(document.querySelector('#PivotGrid_drillthrough') !== null).toBe(true);
                    done();
                }, 5000);
            });
            it('dialog close click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu open calculated field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('dialog close click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#PivotGridcalculateddialog') !== null).toBe(true);
                    done();
                }, 5000);
            });
            it('dialog close click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu expand', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_expand') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                expect(document.querySelector('e-collapse')).toBe(null);
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu collapse', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_collapse') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                expect(document.querySelector('.e-collapse') === null).toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu pdf export', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                setTimeout(() => {
                    triggerMouseEvent(target, 'mouseover');
                    (document.querySelector('#' + pivotGridObj.element.id + '_pdf') as HTMLElement).click();
                    expect(document.querySelector('.e-collapse') === null).toBeTruthy();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu excel export', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                setTimeout(() => {
                    triggerMouseEvent(target, 'mouseover');
                    (document.querySelector('#' + pivotGridObj.element.id + '_excel') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu csv export', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                setTimeout(() => {
                    triggerMouseEvent(target, 'mouseover');
                    (document.querySelector('#' + pivotGridObj.element.id + '_csv') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
                let cell: HTMLElement = document.querySelector('.e-valuesheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value sorting ascending', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_sortasc') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                expect(document.querySelector('.e-ascending')).toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
                let cell: HTMLElement = document.querySelector('.e-valuesheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value sorting descending', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_sortdesc') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                expect(document.querySelector('.e-descending')).toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
                let cell: HTMLElement = document.querySelector('.e-valuesheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('contextmenu open', () => {
                expect(document.querySelector('.e-descending')).toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate count', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('aggregate count click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggCount') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', (done: Function) => {
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate dcount', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('aggregate dcount click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggDistinctCount') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', (done: Function) => {
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate product', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 6000);
            });
            it('aggregate product click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggProduct') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', (done: Function) => {
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "6.588638896563111e+152").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "6.588638896563111e+152").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate average', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 6000);
            });
            it('aggregate avg click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggAvg') as HTMLElement).click();
                    done();
                }, 6000);
            });
            it('contextmenu open', (done: Function) => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "2409.7805263157893").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "2409.7805263157893").toBeTruthy();
                    done();
                }, 6000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate minimum', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 6000);
            });
            it('aggregate Min click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggMin') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', (done: Function) => {
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "1195.56").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "1195.56").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate maximum', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('aggregate Max click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggMax') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', (done: Function) => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "3958.73").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "3958.73").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate sum', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('aggregate sum click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggSum') as HTMLElement).click();
                    done();
                }, 5000);
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText).toBe("104702.76999999997");
            });
            it('contextmenu open', (done: Function) => {
                // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "104702.76999999997").toBeTruthy();
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "104702.76999999997").toBeTruthy();
                    done();
                }, 5000);
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu value aggregate more option', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('aggregate  click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggMoreOption') as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                expect(document.querySelector('#PivotGrid_ValueDialog') !== null).toBe(true);
                pivotGridObj.allowDrillThrough = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('dialog close click', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                    done();
                }, 5000);
            });
            it('context menu hide drillthrough', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_drillthrough_menu').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
            });
            it('contextmenu open', () => {
                pivotGridObj.enableValueSorting = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
                let cell: HTMLElement = document.querySelector('.e-valuesheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu hide sorting', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_sortasc').classList.contains('e-disabled') === true);
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_sortdesc').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
            });
            it('contextmenu open calc disabled', () => {
                pivotGridObj.allowCalculatedField = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check calculated field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
            });
            it('contextmenu open pdf disabled', () => {
                pivotGridObj.allowPdfExport = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check pdf menu', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    setTimeout(() => {
                        let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                        triggerMouseEvent(target, 'mouseover');
                        done();
                    }, 5000);
                });
            });
            it('check pdf field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_pdf').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
            });
            it('contextmenu open excel disabled', () => {
                pivotGridObj.allowExcelExport = false;
                pivotGridObj.allowPdfExport = true;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check pdf menu', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    setTimeout(() => {
                        let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                        triggerMouseEvent(target, 'mouseover');
                        done();
                    }, 5000);
                });
            });
            it('check pdf field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_excel').classList.contains('e-disabled') === true);
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_csv').classList.contains('e-disabled') === true);
                    done();
                    done();
                }, 5000);
            });
            it('contextmenu open excel disabled', () => {
                pivotGridObj.allowExcelExport = false;
                pivotGridObj.allowPdfExport = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check excel and csv field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 6000);
            });
            it('check excel and csv field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_exporting').classList.contains('e-disabled') === true);
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_excel').classList.contains('e-disabled') === true);
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_csv').classList.contains('e-disabled') === true);
                    done();
                }, 6000);
            });
            it('contextmenu open calculated field disabled', () => {
                pivotGridObj.allowCalculatedField = false;
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check calculated field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 6000);
            });
            it('check calc field in disabled state', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
                pivotGridObj.dataSourceSettings.valueAxis = 'row';
            });
            it('contextmenu open values in row ', () => {
                pivotGridObj.dataSourceSettings.valueAxis = 'row';
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
                let cell: HTMLElement = document.querySelector('.e-valuescontent');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('context menu check calculated field', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    triggerMouseEvent(target, 'mouseover');
                    done();
                }, 5000);
            });
            it('check calc field in disabled state', (done: Function) => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('#' + pivotGridObj.element.id + '_aggregate').classList.contains('e-disabled') === true);
                    done();
                }, 5000);
            });
            it('contextmenu open values in column header ', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
                let cell: HTMLElement = document.querySelector('.e-columnsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('contextmenu open headertext ', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-headertext');
                let cell: HTMLElement = document.querySelector('.e-headertext');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('contextmenu open rowsheader ', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
            it('contextmenu open rowsheader ', () => {
                //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                triggerMouseEvent(cell, 'contextmenu');
            });
        });
        // describe('Context menu in disabled state', ()=>{
        //     let pivotGridObj: PivotView;
        //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        //     afterAll(() => {
        //         if (pivotGridObj) {
        //             pivotGridObj.destroy();
        //         }
        //         remove(elem);
        //     });
        //     beforeAll((done: Function) => {
        //         if (!document.getElementById(elem.id)) {
        //             document.body.appendChild(elem);
        //         }
        //         let dataBound: EmitType<Object> = () => { done(); };
        //         pivotGridObj = new PivotView({
        //             dataSourceSettings: {
        //                 dataSource: pivot_dataset as IDataSet[],
        //                 enableSorting: true,
        //                 rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        //                 columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        //                 values: [{ name: 'balance' }, { name: 'quantity' }],
        //                 filters: [],
        //             },
        //             enableValueSorting: false,
        //             allowDrillThrough: false,
        //             allowExcelExport:false,
        //             allowPdfExport:false,
        //             allowCalculatedField: false,
        //             showValuesButton: true,
        //             showGroupingBar:false,
        //             dataBound: dataBound,
        //             gridSettings : {
        //                 contextMenuItems:['Collapse','Drillthrough','Expand','EXCELExport','PDFExport','CSVExport',
        //                 'Sort Ascending','Sort Descending','Aggregate','CalculatedField']
        //             }
        //         });
        //         pivotGridObj.appendTo('#PivotGrid');
        //     });
        //     beforeEach((done: Function) => {
        //         setTimeout(() => { done(); }, 1000);
        //     });
        //     it('contextmenu in values-content', ()=>{
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
        //         let cell: HTMLElement = document.querySelector('.e-valuesheader');
        //         triggerMouseEvent(cell,'contextmenu');
        //     });
        //     it('context menu in values sorting', (done: Function) => {
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(() => {
        //             expect(document.querySelector('#sortasc').classList.contains('e-disabled') === true);
        //             expect(document.querySelector('#sortasc').classList.contains('e-disabled') === true);
        //             done();
        //         }, 1000);
        //     });
        //     it('contextmenu in values-content', ()=>{
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
        //         let cell: HTMLElement = document.querySelector('.e-valuescontent');
        //         triggerMouseEvent(cell,'contextmenu');
        //     });
        //     it('context menu in values content', (done: Function) => {
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(() => {
        //             expect(document.querySelector('#drillthrough').classList.contains('e-disabled') === true);
        //             expect(document.querySelector('#CalculatedField').classList.contains('e-disabled') === true);
        //             expect(document.querySelector('#exporting').classList.contains('e-disabled') === true);
        //             done();
        //         }, 1000);
        //         pivotGridObj.dataSource.valueAxis = 'row';
        //     });
        //     it('contextmenu in empty-content', ()=>{
        //         pivotGridObj.dataSource.valueAxis = 'row';
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
        //         let cell: HTMLElement = document.querySelector('.e-valuescontent');
        //         triggerMouseEvent(cell,'contextmenu');
        //     });
        //     it('context menu in empty content', (done: Function) => {
        //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //         setTimeout(() => {
        //             expect(document.querySelector('#drillthrough').classList.contains('e-disabled') === true);
        //             expect(document.querySelector('#aggregate').classList.contains('e-disabled') === true);
        //             done();
        //         }, 1000);
        //     });
        // });
    });

    describe('Grouping Bar sorting none ', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'None' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Include', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                },
                showGroupingBar: true,
                showFieldList: false,
                gridSettings: {
                    contextMenuItems: ['Aggregate', 'Csv Export', 'Drillthrough', 'Expand', 'Collapse']
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let persistdata: string;
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('grouping bar sort asc', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            setTimeout(() => {
                pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Ascending' }];
                expect((pivotButtons[0]).querySelector('.e-sort')).toBeTruthy;
                done();
            }, 2000);
        });
        it('grouping bar sort desc', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            setTimeout(() => {
                pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Descending' }];
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
                done();
            }, 2000);
        });
        it('grouping bar sort none', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            setTimeout(() => {
                pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'None' }]
                expect((pivotButtons[0]).querySelector('.e-sort')).not.toBeTruthy;
                done();
            }, 2000);
        });
        it('grouping bar sort none icon click', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'company', order: 'Ascending' }];
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect((pivotButtons[1]).querySelector('.e-sort')).toBeTruthy;
            setTimeout(() => {
                // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
                document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
                done();
            }, 2000);
        });
        it('grouping bar sort asc icon click', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect((pivotButtons[1]).querySelector('.e-descend')).toBeTruthy;
            setTimeout(() => {
                // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
                document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
                expect((pivotButtons[0]).querySelector('.e-sort')).toBeTruthy;
                done();
            }, 2000);
        });
        it('grouping bar sort desc icon click', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            expect((pivotButtons[1]).querySelector('.e-sort')).toBeTruthy;
            setTimeout(() => {
                // pivotGridObj.dataSource.sortSettings = [{ name: 'company', order: 'None' }]
                document.querySelectorAll('.e-group-rows .e-sort')[1].dispatchEvent(click);
                done();
            }, 2000);
        });
        it('grouping bar sort desc icon click', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.showGroupingBar = false;
                pivotGridObj.setProperties({
                    gridSettings: {
                        contextMenuItems: ['Aggregate', 'Expand', 'Collapse']
                    }
                }, true);
                done();
            }, 2000);
        });
    });

    describe('Grouping bar sort icon deferupdate', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let cf: any;
        beforeAll(() => {
            document.body.appendChild(elem);
            PivotView.Inject(GroupingBar, FieldList);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_nodata as IDataSet[],
                        enableSorting: true,
                        expandAll: true,
                        rows: [{ name: 'Country' }],
                        columns: [{ name: 'Product' }],
                        values: [{ name: 'Amount' }],
                    },
                    allowDeferLayoutUpdate: true,
                    showFieldList: true,
                    showGroupingBar: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });

        let mouseup: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mousedown: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('Country -> descending _using grouping bar sort icon', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Country -> descending _result', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('United States');
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });

    describe('ZoomFactor in chart', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '500',
                width: '25%',
                dataBound: dataBound,
                showFieldList: true,
                showGroupingBar: true,
                displayOption: { view: 'Chart' },
                load: function (args) {
                    args.pivotview.chartSettings.zoomSettings.enableScrollbar = false;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Find zoomfactor value', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.chart.primaryXAxis.zoomFactor === 1).toBeTruthy();
                done();
            }, 1000);
        });
    });

    describe('Chart in percentage', () => {
        let pivotGridObj: PivotView;
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height:1000px; width:100%' });
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        ele.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(ele.id)) {
                document.body.appendChild(ele);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '50%',
                width: '100%',
                dataBound: dataBound,
                showFieldList: true,
                displayOption: { view: 'Chart' },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('find height of chart for percentage', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.chart.height === "500").toBeTruthy();
                done();
            }, 1000);
        });
    });

    describe('Chart in percentage with toolbar', () => {
        let pivotGridObj: PivotView;
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height:1000px; width:100%' });
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:100%; width:100%' });
        ele.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(ele.id)) {
                document.body.appendChild(ele);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(PivotChart, FieldList, Toolbar, CalculatedField, GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                height: '50%',
                width: '100%',
                dataBound: dataBound,
                showGroupingBar: true,
                showToolbar: true,
                saveReport: saveReport.bind(this),
                fetchReport: fetchReport.bind(this),
                loadReport: loadReport.bind(this),
                removeReport: removeReport.bind(this),
                renameReport: renameReport.bind(this),
                newReport: newReport.bind(this),
                toolbarRender: beforeToolbarRender.bind(this),
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'ConditionalFormatting',
                    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                allowCalculatedField: true,
                showFieldList: true,
                displayOption: { view: 'Chart' },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('find height of chart for percentage with tool bar', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.chart.height === "458").toBeTruthy();
                done();
            }, 1000);
        });
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

