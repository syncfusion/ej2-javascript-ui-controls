import { IDataOptions, IDataSet, IAxisSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, isNullOrUndefined, remove, EmitType, EventHandler, extend } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import {
    CellClickEventArgs, FieldDroppedEventArgs, ColumnRenderEventArgs, FieldDragStartEventArgs,
    FieldDropEventArgs, FieldRemoveEventArgs, CalculatedFieldCreateEventArgs, MemberEditorOpenEventArgs,
    MemberFilteringEventArgs
} from '../../src/common/base/interface';
import { DataManager, JsonAdaptor } from '@syncfusion/ej2-data';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import * as util from '../utils.spec';

describe('PivotView spec', () => {
    /**
     * PivotGrid base spec
     */

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
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });

            let persistdata: string;
            let dataSourceSettings: IDataOptions
            it('pivotgrid render testing', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
            });

            it('pivotgrid setPersist', () => {
                persistdata = pivotGridObj.getPersistData();
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSourceSettings)).toBeTruthy();
            });

            it('pivotgrid loadPersist', () => {
                pivotGridObj.loadPersistData(persistdata);
                expect(document.getElementsByClassName('e-pivotview')).toBeTruthy();
            });

            it('Mouse hover event testing - Value cell', () => {
                let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="3"]');
                util.triggerMouseEvent(target, 'mouseover');
                expect(true).toBeTruthy();
            });

            it('Mouse hover event testing - Value cell', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$68,573.14');
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[1] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
            });

            it('Mouse hover event testing - top left cell', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$6,891.93');
                let target: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                util.triggerMouseEvent(target, 'mouseover');
            });

            it('Mouse hover event testing - bottom left value cell', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(0);
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[1] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
            });

            it('Mouse hover event testing - bottom right value cell', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$80,237.13');
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[7] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
            });

            it('Mouse hover event testing - bottom middle value cell', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$148,810.27');
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[5] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
            });

            it('hide tooltip', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('$148,810.27');
                pivotGridObj.showTooltip = false;
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="10"]')[5] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
            })

            it('pivotgrid change locale', () => {
                expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent').length).toBe(0);
                pivotGridObj.locale = 'es-ES';
            });

            it('pivotgrid set data source', () => {
                expect(pivotGridObj.element.querySelectorAll('td[index="10"]')[0].textContent).toBe('Grand Total');
                let dataSourceSettings: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSourceSettings as IDataOptions;
                dataSourceSettings.filterSettings = [];
                pivotGridObj.dataSourceSettings = dataSourceSettings;
            });

            it('pivotgrid click collapse icon', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length > 2).toBeTruthy();
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-collapse')[1] as HTMLElement;
                icon.click();
            });

            it('pivotgrid click collapse icon', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="7"]')[1] as HTMLElement).innerText.trim()).toBe('$15,036.18');
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-collapse')[1] as HTMLElement;
                icon.click();
            });

            it('pivotgrid click expand icon', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[5] as HTMLElement).innerText).toBe('Jet');
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-expand')[1] as HTMLElement;
                icon.click();
            });

            it('pivotgrid click non icon space', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[5] as HTMLElement).innerText).toBe('Tempo');
                let element: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                element.click();
            });

            it('pivotgrid destroy engine', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                pivotGridObj.engineModule.isEngineUpdated = false;
                pivotGridObj.pivotValues = [];
            });

            it('pivotgrid set dataSource', () => {
                expect(pivotGridObj.element.querySelector('.e-rowcell') === null).toBeTruthy();
                let dataSourceSettings: IDataOptions = JSON.parse(pivotGridObj.getPersistData()).dataSourceSettings as IDataOptions;
                dataSourceSettings.rows.pop();
                pivotGridObj.dataSourceSettings = dataSourceSettings;
            });

            it('pivotgrid get dataSource', () => {
                expect(pivotGridObj.pivotValues.length > 0).toBeTruthy();
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

            it('pivotgrid set dataSource', () => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                dataSourceSettings.values = [];
                expect(true).toBeTruthy();
            });

            it('pivotgrid set dataSource without filtering', () => {
                expect(pivotGridObj.element.querySelector('.e-rowcell') !== null).toBeTruthy();
                dataSourceSettings = pivotGridObj.dataSourceSettings;
                dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
            });

            it('pivotgrid set dataSource expanAll false', () => {
                expect((pivotGridObj.element.querySelectorAll('td[index="10"]')[0] as HTMLElement).innerText).toBe('brown');
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(4);
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                dataSourceSettings.expandAll = false;
            });

            it('pivotgrid set dataSource expanAll false', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(4);
                dataSourceSettings.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
            });

            it('pivotgrid set dataSource expanAll true', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                pivotGridObj.setProperties({ dataSourceSettings: { expandAll: true } }, true);
                dataSourceSettings.drilledMembers = [{ name: 'eyeColor', items: ['blue', 'brown'] }, { name: 'isActive', items: ['true'] }];
            });

            it('pivotgrid set dataSource set filtersettings include', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(3);
                expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                dataSourceSettings.filterSettings = [
                    { name: 'eyeColor', type: 'Include', items: ['blue'] },
                    { name: 'isActive', type: 'Include', items: ['true'] }
                ];
            });

            it('pivotgrid set dataSource set filtersettings exclude', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(0);
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Grand Total');
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
                }, 1000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll false', (done: Function) => {
                dataSourceSettings.expandAll = false;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    // expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 1000);
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
                }, 1000);
            });

            it('pivotgrid set dataSource sorting', (done: Function) => {
                dataSourceSettings.sortSettings = [{ name: 'product', order: 'Descending' }, { name: 'eyeColor', order: 'Descending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('brown');
                    done();
                }, 1000);
            });

            it('pivotgrid set dataSource sorting ascending', (done: Function) => {
                dataSourceSettings.sortSettings = [{ name: 'product', order: 'Ascending' }, { name: 'eyeColor', order: 'Ascending' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(1);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(2);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('Bike');
                    done();
                }, 1000);
            });

            it('pivotgrid set dataSource set filtersettings exclude expanAll true', (done: Function) => {
                dataSourceSettings.expandAll = true;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(2);
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(1);
                    expect((pivotGridObj.element.querySelectorAll('td[index="4"]')[0] as HTMLElement).innerText).toBe('green');
                    done();
                }, 1000);
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
                }, 1000);
            });

            it('pivotgrid set dataSource set 3 columns', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { rows: [{ name: 'eyeColor' }] } }, true);
                dataSourceSettings.columns = [{ name: 'isActive' }, { name: 'gender' }, { name: 'product' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element
                        .querySelectorAll('th[aria-colindex="1"]')[1] as HTMLElement).children[0].classList.contains('e-collapse')).toBe(true);
                    done();
                }, 1000);
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
                }, 1000);
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
                }, 1000);
            });

            it('pivotgrid all with value sorting ascending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~balance', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="1"]')[2].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~female~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid all with value sorting parent', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Ascending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('blue');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-ascending')).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid all with value sorting parent descending', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = { sortOrder: 'Descending', headerText: 'false~quantity', headerDelimiter: '~' };
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="6"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid all collapse false', (done: Function) => {
                pivotGridObj.dataSourceSettings.drilledMembers = [{ name: 'isActive', items: ['false'] }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('brown');
                    expect(document.querySelectorAll('th[aria-colindex="2"]')[0].querySelectorAll('div')[1].classList.contains('e-descending')).toBeTruthy();
                    done();
                }, 1000);
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
                }, 1000);
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[5] as HTMLElement;
                util.triggerMouseEvent(target, 'mouseover');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[0].innerHTML).toBe('brown - Bike - male');
                    done();
                }, 1000);
            });
            it('Mouse hover event testing - Tooltip as false', (done: Function) => {
                pivotGridObj.showTooltip = false;
                pivotGridObj.setProperties({ dataSourceSettings: { columns: [{ name: 'isActive' }, { name: 'gender' }] } }, true);
                pivotGridObj.dataSourceSettings.rows = [{ name: 'eyeColor' }, { name: 'product' }];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(true).toBe(true);
                    done();
                }, 1000);
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
                }, 1000);
            });

            it('pivotgrid empty all', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { rows: [], columns: [] } }, true);
                pivotGridObj.dataSourceSettings.values = [];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill value alone', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) > 0).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill column alone', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill column and value', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="3"]').length) > 0).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill row alone', (done: Function) => {
                pivotGridObj.setProperties({ dataSourceSettings: { values: [], columns: [] } }, true);
                pivotGridObj.dataSourceSettings.rows = [{ name: 'eyeColor' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeFalsy();
                    expect((document.querySelectorAll('th[aria-colindex="1"]').length) === 0).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill row and value', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 4).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill row and column', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('td[aria-colindex="0"]').length === 4).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="1"]').length) === 0).toBeFalsy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill all', (done: Function) => {
                pivotGridObj.dataSourceSettings.values = [{ name: 'quantity' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect(document.querySelectorAll('th[aria-colindex="3"]').length === 1).toBeTruthy();
                    expect((document.querySelectorAll('td[aria-colindex="3"]').length) === 4).toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid fill all 2 column', (done: Function) => {
                pivotGridObj.dataSourceSettings.columns = [{ name: 'isActive' }, { name: 'gender' }];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
                    expect((document.querySelectorAll('th[aria-colindex="7"]')[1] as HTMLElement).style.display === 'none').toBeTruthy();
                    done();
                }, 1000);
            });

            it('pivotgrid data empty', (done: Function) => {
                pivotGridObj.dataSourceSettings.dataSource = [];
                setTimeout(() => {
                    expect((document.querySelectorAll('.e-emptyrow').length) === 0).toBeTruthy();
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
                    },
                    fieldDragStart: (args: FieldDragStartEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDragName: ' + args.fieldItem.name);
                    },
                    fieldDrop: (args: FieldDropEventArgs) => {
                        expect(args.dropField).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDropName: ' + args.dropField.name);
                    },
                    onFieldDropped: (args: FieldDroppedEventArgs) => {
                        expect(args.droppedField).toBeTruthy;
                        console.log('fieldDroppedName: ' + args.droppedField.name);
                    },
                    fieldRemove: (args: FieldRemoveEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldRemoveName: ' + args.fieldItem.name);
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            let persistdata: string;
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
                    util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = util.setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
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
                    dataBound: dataBound,
                    fieldDragStart: (args: FieldDragStartEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDragName: ' + args.fieldItem.name);
                    },
                    fieldDrop: (args: FieldDropEventArgs) => {
                        expect(args.dropField).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldDropName: ' + args.dropField.name);
                    },
                    onFieldDropped: (args: FieldDroppedEventArgs) => {
                        expect(args.droppedField).toBeTruthy;
                        console.log('fieldDroppedName: ' + args.droppedField.name);
                    },
                    fieldRemove: (args: FieldRemoveEventArgs) => {
                        expect(args.fieldItem).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('fieldRemoveName: ' + args.fieldItem.name);
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
                util.disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
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
                    util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = util.setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
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
                setTimeout(() => { done(); }, 1000);
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
                setTimeout(() => { done(); }, 1000);
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
            PivotView.Inject(GroupingBar, FieldList, CalculatedField);
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
                        allowCalculatedField: true,
                        fieldDragStart: (args: FieldDragStartEventArgs) => {
                            expect(args.fieldItem).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldDragName: ' + args.fieldItem.name);
                        },
                        fieldDrop: (args: FieldDropEventArgs) => {
                            expect(args.dropField).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldDropName: ' + args.dropField.name);
                        },
                        onFieldDropped: (args: FieldDroppedEventArgs) => {
                            expect(args.droppedField).toBeTruthy;
                            console.log('fieldDroppedName: ' + args.droppedField.name);
                        },
                        fieldRemove: (args: FieldRemoveEventArgs) => {
                            expect(args.fieldItem).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldRemoveName: ' + args.fieldItem.name);
                        },
                        calculatedFieldCreate: (args: CalculatedFieldCreateEventArgs) => {
                            expect(args.calculatedField).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('CreateCalcaltedFieldName: ' + args.calculatedField.name);
                        },
                        load: () => {
                            pivotGridObj.isAdaptive = true;
                        }
                    });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.pivotFieldListModule.load = function () {
                    pivotGridObj.pivotFieldListModule.isAdaptive = true;
                }
                pivotGridObj.pivotFieldListModule.refresh();
            });
            it('fieldist render testing', () => {
                expect(pivotGridObj.pivotFieldListModule.dialogRenderer.parentElement).toBeTruthy;
                pivotGridObj.pivotFieldListModule.load = function () {
                    pivotGridObj.pivotFieldListModule.isAdaptive = true;
                }
                pivotGridObj.pivotFieldListModule.refresh();
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
            it('check on calculated field button edit option', () => {
                let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].id).toBe('price');
                expect(pivotButton[pivotButton.length - 1].querySelector('.e-edit')).toBeTruthy;
                (pivotButton[pivotButton.length - 1].querySelector('.e-edit') as HTMLElement).click();
            });
            it('check -> edited calculated field info', (done: Function) => {
                let element: HTMLElement = document.querySelector('.e-adaptive-container');
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[4].textContent).toBe('Create Calculated Field');
                expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                expect((document.querySelector('.e-pivot-calc-input') as any).value).toBe('price');
                expect((document.querySelector('.e-pivot-formula') as any).value).toBe('"Sum(balance)"+"Count(quantity)"');
                expect((document.querySelector('.e-custom-format-input') as any).value).toBe('');
                setTimeout(() => {
                    (document.querySelector('.e-calculated-field-btn') as any).click();
                    done();
                }, 100);
            });
            it('check -> edited icon exists for calculated field', () => {
                expect(document.querySelectorAll('.e-pivot-accord').length > 0).toBeTruthy;
                let accordions: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-pivot-accord .e-acrdn-item'));
                expect(accordions.length).toBeGreaterThan(0);
                let calcElement: HTMLElement = accordions[0] as HTMLElement;
                expect(calcElement).toBeTruthy;
                expect(calcElement.querySelector('.e-edited')).toBeTruthy;
                expect(calcElement.textContent).toBe('price (Calculated Field)');
            });
            it('check on axis view change to calculated field', (done: Function) => {
                let element: HTMLElement = document.querySelector('.e-pivotfieldlist-wrapper');
                expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Filters');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                    (document.querySelectorAll('.e-add-icon')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('add field', () => {
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
            });
            it('add field btn click', (done: Function) => {
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.pivotFieldListModule.isAdaptive).toBeTruthy();
                    expect(pivotGridObj.pivotFieldListModule.dialogRenderer.parentElement).toBeTruthy;
                    (document.querySelector('.e-field-list-back-icon') as HTMLElement).click();
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
                }, 1000);
            });
            it('without text wrap', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.gridSettings.allowTextWrap = false;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(36);
                    done();
                }, 1000);
            });
            it('without resizing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.gridSettings.allowResizing = false;
                setTimeout(function () {
                    expect((document.querySelectorAll('.e-valuesheader')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[1] as HTMLElement).offsetHeight).toEqual(36);
                    expect((document.querySelectorAll('.e-valuescontent')[14] as HTMLElement).offsetHeight).toEqual(36);
                    done();
                }, 1000);
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
                }, 1000);
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
                }, 1000);
            });
            it('drill position without subtotals', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.showSubTotals = false;
                setTimeout(function () {
                    //expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(3);
                    //expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    done();
                }, 1000);
            });
            it('drill position with expand all', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.expandAll = true;
                setTimeout(function () {
                    // expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(0);
                    // expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(0);
                    done();
                }, 1000);
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
                }, 1000);
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
                    dataBound: dataBound,
                    memberEditorOpen: (args: MemberEditorOpenEventArgs) => {
                        expect(args.fieldMembers).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('MemberFilterOpenNAme: ' + args.fieldName);
                    },
                    memberFiltering: (args: MemberFilteringEventArgs) => {
                        expect(args.filterSettings).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        console.log('MemberFilterOpenNAme: ' + args.filterSettings.name);
                    }
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