import { IDataOptions, IDataSet, IAxisSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, isNullOrUndefined, remove, EmitType, EventHandler, extend } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { CellClickEventArgs, FieldDroppedEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import {
    BeforeCopyEventArgs, RowSelectingEventArgs,
    RowSelectEventArgs, RowDeselectEventArgs, CellSelectingEventArgs,
    CellSelectEventArgs, CellDeselectEventArgs, QueryCellInfoEventArgs, HeaderCellInfoEventArgs,
    ContextMenuOpenEventArgs, Grid, resizeClassList, ColumnDragEventArgs, ResizeArgs
} from '@syncfusion/ej2-grids';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ExcelExport, PDFExport, VirtualScroll } from '../../src/pivotview/actions';
import { BeforeExportEventArgs } from '../../src';
import { DataManager, JsonAdaptor } from '@syncfusion/ej2-data';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { LoadEventArgs } from '../../src';
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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
            let dataSource: IDataOptions
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
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSource)).toBeTruthy();
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

            it('pivotgrid change locale', (done: Function) => {
                pivotGridObj.toolTip.close();
                pivotGridObj.locale = 'es-ES';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[index="10"]')[0].textContent).toBe('Grand Total');
                    done();
                }, 2000);
            });

            it('pivotgrid set data source', (done: Function) => {
                let dataSource: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSource as IDataOptions;
                dataSource.filterSettings = [];
                pivotGridObj.dataSource = dataSource;
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
                let dataSource: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSource as IDataOptions;
                dataSource.rows.pop();
                pivotGridObj.dataSource = dataSource;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.pivotValues.length > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid get dataSource', () => {
                let dataSource: IDataOptions = pivotGridObj.dataSource;
                expect(dataSource.columns.length).toBe(2);
            });

            it('pivotgrid set dataSource', () => {
                let dataSource: IDataOptions = pivotGridObj.dataSource;
                dataSource.rows.push({ name: 'product' });
                expect(pivotGridObj.dataSource.rows.length === 2).toBeTruthy();
            });

            it('pivotgrid get dataSource', () => {
                let dataSource: IDataOptions = pivotGridObj.dataSource;
                expect(dataSource.columns.length).toBe(2);
            });

            it('pivotgrid set dataSource', (done: Function) => {
                let dataSource: IDataOptions = pivotGridObj.dataSource;
                dataSource.values = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-rowcell') !== null).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource without filtering', (done: Function) => {
                dataSource = pivotGridObj.dataSource;
                dataSource.values = [{ name: 'balance' }, { name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelectorAll('td[index="10"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll false', (done: Function) => {
                dataSource.expandAll = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(4);
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll false', (done: Function) => {
                dataSource.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource expanAll true', (done: Function) => {
                pivotGridObj.setProperties(dataSource.expandAll = true);
                dataSource.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(3);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings include', (done: Function) => {
                dataSource.filterSettings = [
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
                dataSource.filterSettings = [
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
                dataSource.expandAll = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    // expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting', (done: Function) => {
                pivotGridObj.setProperties(dataSource.enableSorting = true);
                dataSource.sortSettings = [{ name: 'product', order: 'Descending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Van');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting', (done: Function) => {
                dataSource.sortSettings = [{ name: 'product', order: 'Descending' }, { name: 'eyeColor', order: 'Descending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource sorting ascending', (done: Function) => {
                dataSource.sortSettings = [{ name: 'product', order: 'Ascending' }, { name: 'eyeColor', order: 'Ascending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll true', (done: Function) => {
                dataSource.expandAll = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('green');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll true value sort', (done: Function) => {
                pivotGridObj.enableValueSorting = true;
                dataSource.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelectorAll('th[aria-colindex="1"]')[2] as HTMLElement).children[1].classList.contains('e-descending')).toBe(true);
                    expect((pivotGridObj.element.querySelectorAll('td[index="5"]')[1] as HTMLElement).innerText.trim()).toBe('$21,531.91');
                    done();
                }, 2000);
            });

            it('pivotgrid set dataSource set 3 columns', (done: Function) => {
                pivotGridObj.setProperties(dataSource.rows = [{ name: 'eyeColor' }]);
                dataSource.columns = [{ name: 'isActive' }, { name: 'gender' }, { name: 'product' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element
                        .querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).children[0].classList.contains('e-collapse')).toBe(true);
                    done();
                }, 2000);
            });

            it('pivotgrid all without value sorting', (done: Function) => {
                dataSource = extend({}, pivotGridObj.dataSource, null, true);
                dataSource.columns = [{ name: 'isActive' }, { name: 'gender' }];
                dataSource.rows = [{ name: 'eyeColor' }, { name: 'product' }];
                dataSource.values = [{ name: 'balance' }, { name: 'quantity' }];
                dataSource.enableSorting = true;
                dataSource.drilledMembers = [];
                dataSource.valueSortSettings = {};
                dataSource.sortSettings = [{ name: 'eyeColor', order: 'Descending' }];
                dataSource.expandAll = true;
                dataSource.formatSettings = [{ name: 'balance', format: 'C' }];
                dataSource.filterSettings = [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                ];
                pivotGridObj.dataSource = dataSource;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('th[aria-colindex="3"]').length).toBe(2);
                    expect(document.querySelectorAll('td[aria-colindex="3"]').length).toBe(10);
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting descending', (done: Function) => {
                pivotGridObj.enableValueSorting = true;
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="1"]')[2].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting ascending', (done: Function) => {
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="1"]')[2].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSource.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid all collapse false', (done: Function) => {
                pivotGridObj.dataSource.drilledMembers = [{ name: 'isActive', items: ['false'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 2000);
            });
        });

        describe(' - dataSource empty combo cases - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
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
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                pivotGridObj = new PivotView({
                    dataSource: {
                        expandAll: true,
                        data: jsonData,
                        rows: [{ name: 'eyeColor' }, { name: 'product' }],
                        columns: [{ name: 'isActive' }, { name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }]
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            let dataSource: IDataOptions
            it('pivotgrid render testing', (done: Function) => {
                dataSource = extend({}, pivotGridObj.dataSource, null, true);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="14"]')[0] as HTMLElement).innerText).toBe('1939');
                    done();
                }, 2000);
            });

            it('pivotgrid empty all', (done: Function) => {
                pivotGridObj.setProperties({ dataSource: { rows: [], columns: [] } }, true);
                pivotGridObj.dataSource.values = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill value alone', (done: Function) => {
                pivotGridObj.dataSource.values = [{ name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill column alone', (done: Function) => {
                pivotGridObj.dataSource.columns = [{ name: 'isActive' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill column and value', (done: Function) => {
                pivotGridObj.dataSource.values = [{ name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="3"]').length) > 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row alone', (done: Function) => {
                pivotGridObj.setProperties({ dataSource: { values: [], columns: [] } }, true);
                pivotGridObj.dataSource.rows = [{ name: 'eyeColor' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeFalsy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row and value', (done: Function) => {
                pivotGridObj.dataSource.values = [{ name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 4).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill row and column', (done: Function) => {
                pivotGridObj.dataSource.columns = [{ name: 'isActive' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill all', (done: Function) => {
                pivotGridObj.dataSource.values = [{ name: 'quantity' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('th[aria-colindex="3"]').length === 1).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="3"]').length) === 4).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid fill all 2 column', (done: Function) => {
                pivotGridObj.dataSource.columns.push({ name: 'gender' });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    done();
                }, 2000);
            });

            it('pivotgrid data empty', (done: Function) => {
                pivotGridObj.dataSource.data = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false, showSortIcon: false },
                    dataBound: dataBound
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
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true, showSortIcon: true };
                expect(pivotGridObj.element.children[0].classList.contains('e-grouping-bar')).toBeTruthy();
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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
            });
            it('First click', () => {
                (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).click();
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
            });
            it('Second click', () => {
                (document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).click();
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
            });
            it('Cellvalue click', () => {
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-headertext') as HTMLElement).click();
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('New Jercy');
            });
            it('Descending icon click', () => {
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-descending') as HTMLElement).click();
                expect((pivotGridObj.pivotValues[2][0] as IDataSet).formattedText).toBe('Tamilnadu');
            });
            it('Ascending icon click', (done: Function) => {
                ((document.querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).querySelector('.e-ascending') as HTMLElement).click();
                expect((pivotGridObj.pivotValues[2][0] as IAxisSet).formattedText).toBe('New Jercy');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    pivotGridObj.dataSource.valueSortSettings.headerText = 'blue';
                    pivotGridObj.dataSource.values.pop();
                    done();
                }, 1000);
            });
            it('single measure check', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
            });
            it('single measure check', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
                pivotGridObj.dataSource.columns.push({ name: 'isActive' });
                pivotGridObj.dataSource.valueSortSettings.headerText = 'blue';
                pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSource);
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
            });
            it('single measure with two columns', () => {
                expect((pivotGridObj.pivotValues[1][0] as IDataSet).formattedText).toBe('New Jercy');
                pivotGridObj.dataSource.expandAll = true;
                pivotGridObj.dataSource.valueSortSettings.headerText = 'blue##false';
                pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSource);
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                document.querySelector('.e-pivot-error-dialog').remove();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    cf.dialog.buttons[1].click();
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
                remove(document.querySelector('.e-dialog'));
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                expect(pivotGridObj.element.children[1].classList.contains('e-grouping-bar')).toBeTruthy();
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
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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

        describe('Conditional Formatting - Code Behind', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource.values.pop();
                pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSource);
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
            });
            it('With Single Measure', () => {
                expect(document.querySelectorAll('td[aria-colindex="1"]')[0].classList.contains('formatPivotGrid9')).toBeTruthy();
            });
            it('With Single Measure', () => {
                expect(document.querySelectorAll('td[aria-colindex="2"]')[0].classList.contains('formatPivotGrid6')).toBeTruthy();
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
                pivotGridObj.enableValueSorting = true;
            });
            it('With Value Sorting', () => {
                expect(document.querySelectorAll('td[aria-colindex="3"]')[0].classList.contains('formatPivotGrid0')).toBeTruthy();
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
                pivotGridObj.enableValueSorting = false;
            });
            it('With Default Sorting', () => {
                expect(document.querySelectorAll('td[aria-colindex="3"]')[4].classList.contains('formatPivotGrid0')).toBeTruthy();
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });

        describe('Conditional Formatting - UI', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            PivotView.Inject(ConditionalFormatting);
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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

        describe('Conditional Formatting - Mobile', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            PivotView.Inject(ConditionalFormatting);
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                pivotGridObj.dataSource = {
                    data: pivot_dataset as IDataSet[],
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
        describe(' - VirtualScrolling - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
            });

            it('Collapse bike', (done: Function) => {
                (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                    done();
                }, 1000);
            });
            it('Collapse female', (done: Function) => {
                (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(890);
                    done();
                }, 1000);
            });
            it('value in row axis', (done: Function) => {
                pivotGridObj.setProperties({ dataSource: { valueAxis: 'row' } }, true);
                pivotGridObj.dataSource.drilledMembers = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('balance');
                    expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('396.1px');
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
                }, 1000);
            });
            it('append name in column', (done: Function) => {
                pivotGridObj.dataSource.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
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
        describe(' - VirtualScrolling - Grouping Bar ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            beforeAll(() => {
                document.body.appendChild(elem);
                PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                }, 1000);
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
                    // expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 1000);
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
                    // expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                    // expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$33,116.92');
                    done();
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
            });

            it('Collapse bike', (done: Function) => {
                (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                    done();
                }, 1000);
            });
            it('Collapse female', (done: Function) => {
                (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(358);
                    done();
                }, 1000);
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
                }, 1000);
            });
            it('filter check', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(Math.round(document.querySelectorAll('.e-movableheader')[0].scrollLeft)).toBe(738);
                    expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(0);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                    done();
                }, 1000);
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
                }, 1000);
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
                }, 1000);
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
                }, 1000);
            });
            it('values added', () => {
                pivotGridObj.dataSource.values = [{ name: 'balance' }, { name: 'quantity' }];
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
                }, 1000);
            });
            it('values added', () => {
                pivotGridObj.dataSource.values = [{ name: 'balance' }, { name: 'quantity' }];
            });

            it('RTL', (done: Function) => {
                pivotGridObj.enableRtl = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                    expect(Math.round(document.querySelectorAll('.e-movableheader')[0].scrollLeft)).toBe(313);
                    expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(0);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('0.1px');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('410px');
                    done();
                }, 1000);
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        });
        describe('- VirtualScrolling - ValueSorting - ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            data: pivot_dataset as IDataSet[],
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
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(43);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    done();
                }, 1000);
            });
            it('sort male-blue-balance', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-movableheader th.e-firstcell')[0] as HTMLElement).click()
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(43);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('scrollTop', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('.e-movablecontent')[0].scrollTop = 398;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(43);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('scrollLeft', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1235;
                pivotGridObj.virtualscrollModule.direction = 'horizondal';
                let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(43);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('Collapse car', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-frozencontent tr')[14].querySelector('.e-icons') as HTMLElement).click()
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('scrollTop', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('scrollLeft', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
                pivotGridObj.virtualscrollModule.direction = 'horizondal';
                let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                    done();
                }, 1000);
            });
            it('sort male-green-balance', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click()
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 1000);
            });
            it('remove quantity', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSource.values = [{ name: 'balance' }];
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 1000);
            });
            it('sort female-brown', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click();
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                    done();
                }, 1000);
            });
            it('insert quantity', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSource.values = [{ name: 'balance' }, { name: 'quantity' }];
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(37);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(18);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                    done();
                }, 1000);
            });
            it('move values to row', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSource.valueAxis = 'row';
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(111);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('');
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

        describe(' - VirtualScrolling - advanced filtering ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            beforeAll(() => {
                document.body.appendChild(elem);
                pivotGridObj = new PivotView(
                    {
                        dataSource: {
                            allowLabelFilter: true,
                            allowValueFilter: true,
                            data: pivot_dataset as IDataSet[],
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
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    done();
                }, 1000);
            });
            it('state start with t', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'state', type: 'Label', condition: 'BeginWith', value1: 't' }],
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(13);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Tamilnadu');
                    done();
                }, 1000);
            });
            it('state contains e', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' }],
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                    done();
                }, 1000);
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
                }, 1000);
            });
            it('eyeColor equals blue', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' },
                    { name: 'eyeColor', type: 'Label', condition: 'Equals', value1: 'blue' }],
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('blue');
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('male Total');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                    done();
                }, 1000);
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
                }, 1000);
            });
            it('product quantity > 100', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 2000);
            });
            // it('eyeColor blue quantity < 100', (done: Function) => {
            //     pivotGridObj.dataSource.filterSettings = [
            //         { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' },
            //         { name: 'eyeColor', type: 'Value', condition: 'LessThan', measure: 'quantity', value1: '100' }],
            //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            //     setTimeout(() => {
            //         expect(document.querySelectorAll('.e-movableheader th')[1].textContent).toBe('balance');
            //         expect(document.querySelectorAll('.e-movableheader th')[2].textContent).toBe('quantity');
            //         done();
            //     }, 2000);
            // });
            it('product quantity > 100', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                    // expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 1000);
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
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 1000);
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
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                    done();
                }, 1000);
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
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                    done();
                }, 1000);
            });
            it('Collapse flight', (done: Function) => {
                (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click()
                setTimeout(() => {
                    let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                    expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                    expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                    done();
                }, 1000);
            });
            it('Collapse male', (done: Function) => {
                (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click()
                setTimeout(() => {
                    let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                    expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                    expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$95,040.55');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                    done();
                }, 1000);
            });
            it('value in row axis', (done: Function) => {
                pivotGridObj.setProperties({ dataSource: { valueAxis: 'row' } }, true);
                pivotGridObj.dataSource.drilledMembers = [];
                setTimeout(() => {
                    let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('balance');
                    expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('504.1px');
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
                setTimeout(() => {
                    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                    pivotGridObj.virtualscrollModule.direction = 'vertical';
                    let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    document.querySelector('.e-movablecontent').dispatchEvent(args);
                    done();
                }, 1000);
            });
            it('append name in column', (done: Function) => {
                pivotGridObj.dataSource.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }],
                    setTimeout(() => {
                        expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
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

        describe(' - no data - ', () => {
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
                    dataSource: {
                        expandAll: true,
                        data: noData as IDataSet[],
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

            let dataSource: IDataOptions
            it('pivotgrid render testing', (done: Function) => {
                dataSource = extend({}, pivotGridObj.dataSource, null, true);
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
                    dataSource: {
                        rows: [{ name: 'Teams', showNoDataItems: true }, { name: 'Priority', showNoDataItems: true }]
                    }
                }, true);
                pivotGridObj.dataSource.columns = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('p4');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('');
                    done();
                }, 1000);
            });
            it('swap row elements', (done: Function) => {
                pivotGridObj.dataSource.rows = [
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
                pivotGridObj.setProperties({ dataSource: { rows: [] } }, true);
                pivotGridObj.dataSource.columns = [
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
                pivotGridObj.setProperties({ dataSource: { columns: [] } }, true);
                pivotGridObj.dataSource.rows = [
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
                pivotGridObj.dataSource.rows = [
                    { name: 'Teams', showNoDataItems: true },
                    { name: 'Priority', showNoDataItems: true }
                ];
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.rows[1].showNoDataItems = false;
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
                pivotGridObj.setProperties({ dataSource: { sortSettings: [{ name: 'Teams', order: 'Descending' }] } }, true);
                pivotGridObj.dataSource.rows[1].showNoDataItems = true;
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
                pivotGridObj.dataSource.sortSettings = [{ name: 'Priority', order: 'Descending' }];
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
                    dataSource: {
                        data: pivot_nodata,
                        rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                        columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                        filterSettings: []
                    }
                }, true);
                pivotGridObj.dataSource.sortSettings = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Bayern');
                    done();
                }, 3000);
            });
            it('filter state BeginWith e', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[69] as HTMLElement).innerText).toBe('United Kingdom');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[69] as HTMLElement).innerText).toBe('');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[79] as HTMLElement).innerText).toBe('Garonne (Haute)');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[79] as HTMLElement).innerText).toBe('');
                    done();
                }, 3000);
            });
            it('state nodata false', (done: Function) => {
                pivotGridObj.setProperties({
                    dataSource: {
                        rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }],
                    }
                }, true);
                pivotGridObj.dataSource.filterSettings = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Brunswick');
                    done();
                }, 3000);
            });
            it('filter state BeginWith e', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[18] as HTMLElement).innerText).toBe('United Kingdom');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[18] as HTMLElement).innerText).toBe('');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[28] as HTMLElement).innerText).toBe('Garonne (Haute)');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[28] as HTMLElement).innerText).toBe('');
                    done();
                }, 3000);
            });
            it('filter clear', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                    done();
                }, 3000);
            });

            it('filter state quantity LessThan 500', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('6450');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                    done();
                }, 3000);
            });
            it('filter state quantity GreaterThan 500', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('22100');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5200');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                    done();
                }, 3000);
            });
            it('filter state quantity LessThan 500', (done: Function) => {
                pivotGridObj.setProperties({
                    dataSource: {
                        rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                    }
                }, true);
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('6450');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                    done();
                }, 3000);
            });
            it('filter state quantity GreaterThan 500', (done: Function) => {
                pivotGridObj.dataSource.filterSettings = [
                    { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
                ]
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('22100');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                    expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5200');
                    expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                    done();
                }, 3000);
            });
        });

        describe(' - no data - virtual scroll ', () => {
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
                    dataSource: {
                        expandAll: true,
                        data: pivot_nodata as IDataSet[],
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

            let dataSource: IDataOptions
            it('pivotgrid render testing', (done: Function) => {
                dataSource = extend({}, pivotGridObj.dataSource, null, true);
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
                pivotGridObj.dataSource.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }];
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
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.filterSettings = [
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
                pivotGridObj.dataSource.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }];
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
                    done();
                }, 2000);
            });
        });

    });

    /**
     * PivotGrid base spec
     */

    describe('Data Grid Features module - ', () => {

        describe(' - dataSource ejGrid features combo - ', () => {
            let pivotGridObj: PivotView;
            let eventName: string;
            let args: any;
            let headers: any;
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
                PivotView.Inject(GroupingBar, ExcelExport, PDFExport);
                pivotGridObj = new PivotView({
                    dataSource: {
                        expandAll: true,
                        data: pivot_dataset as IDataSet[],
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
                        contextMenuItems: [{ text: 'Copy with headers', target: '.e-content', id: 'copywithheader' }],
                        selectionSettings: { type: 'Multiple', mode: 'Both' },
                        rowHeight: 40,
                        gridLines: 'None',
                        contextMenuClick: (args: MenuEventArgs): void => {
                            eventName = args.name;
                            args = args;
                        },
                        contextMenuOpen: (args: ContextMenuOpenEventArgs): void => {
                            eventName = args.name;
                            args = args;
                        },
                        beforeCopy: (args: BeforeCopyEventArgs): void => {
                            eventName = 'beforeCopy';
                            args = args;
                        },
                        beforePrint: (args): void => {
                            eventName = 'beforePrint';
                            args = args;
                        },
                        printComplete: (args): void => {
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
                        },
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            let dataSource: IDataOptions
            let gridObj: Grid
            it('pivotgrid render testing', (done: Function) => {
                dataSource = extend({}, pivotGridObj.dataSource, null, true);
                gridObj = pivotGridObj.grid;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="14"]')[0] as HTMLElement).innerText).toBe('1939');
                    done();
                }, 1000);
            });

            it('context menu header', () => {
                (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
                let e = {
                    event: (gridObj.contextMenuModule as any).eventArgs,
                    items: gridObj.contextMenuModule.contextMenu.items
                };
                (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
                (gridObj.contextMenuModule as any).contextMenuOpen();
                (gridObj.contextMenuModule as any).contextMenuOnClose(e);
                expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(1);
            });

            it('context menu content', () => {
                (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
                let e = {
                    event: (gridObj.contextMenuModule as any).eventArgs,
                    items: gridObj.contextMenuModule.contextMenu.items
                };
                (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
                expect(gridObj.contextMenuModule.isOpen).toBe(false);
                expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
                expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            });

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
                    expect((document.querySelector('.e-clipboard') as HTMLInputElement).value.length).toBe(244);
                    done();
                }, 1000);
            });

            it('Clipboard Check with row type selection - include header', (done: Function) => {
                gridObj.copy(true);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelector('.e-clipboard') as HTMLInputElement).value.length).toBe(364);
                    done();
                }, 1000);
            });

            it('resize start', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
                (gridObj.resizeModule as any).resizeStart({ target: handler });
                expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
            });

            it('resize end', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
                (gridObj.resizeModule as any).resizeEnd({ target: handler });
                expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
                let head = gridObj.getHeaderTable();
                [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
                    expect(ele.classList.contains(resizeClassList.cursor)).toBeFalsy();
                });
                expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeFalsy();
                expect((gridObj.resizeModule as any).pageX).toBeNull();
                expect((gridObj.resizeModule as any).element).toBeNull();
                expect((gridObj.resizeModule as any).column).toBeNull();
                expect((gridObj.resizeModule as any).helper).toBeNull();
                expect(gridObj.element.querySelector('.' + resizeClassList.helper)).toBeFalsy();
            });

            it('resizing - mousemove', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[0] as HTMLElement;
                (gridObj.resizeModule as any).resizeStart({ target: handler, pageX: 0 });
                (gridObj.resizeModule as any).resizing({ target: handler, pageX: 200 });
                let width = (gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth;
                (gridObj.resizeModule as any).resizing({ target: handler, pageX: 300 });
                width += 100;
                expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth);
                (gridObj.resizeModule as any).resizing({ target: handler, pageX: 100 });
                width -= 200;
                expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[0]).offsetWidth);
                pivotGridObj.copy();
            });

        });
    });

    /**
     * PivotGrid action spec
     */

    function beforeExport(args: BeforeExportEventArgs): void {
        args.dataCollections.push(args.dataCollections[0]);
        args.header = 'This is Header';
        args.footer = 'This is Footer';
    }

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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
                    allowExcelExport: true,
                    allowPdfExport: true,
                    enableRtl: true,
                    width: 1000,
                    height: 100,
                    gridSettings: {
                        allowReordering: true,
                        pdfHeaderQueryCellInfo: (args): void => {
                        },
                        pdfQueryCellInfo: (args): void => {
                        },
                        excelHeaderQueryCellInfo: (args): void => {
                        },
                        excelQueryCellInfo: (args): void => {
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
                    done();
                }, 2000);
            });

            it('pivotgrid pdf-engine dataSource', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    pivotGridObj.pdfExportModule.exportToPDF();
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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
                    dataSource: {
                        data: pivot_dataset as IDataSet[],
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
    });
});

