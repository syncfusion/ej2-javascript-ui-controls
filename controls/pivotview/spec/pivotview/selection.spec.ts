import { IDataSet } from '../../src/base/engine';
import { pivot_smalldata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCellSelectedEventArgs } from '../../src/common/base/interface';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe(' - selection', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
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
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada.Alberta mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada * FY 2005 value cell mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2005 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2006 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(31);
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2006 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('save selected cells + header refresh + apply selection on selected cells _ used in window resize', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(31);
                (pivotGridObj as any).getSelectedCellsPos();
                pivotGridObj.grid.headerModule.refreshUI();
                (pivotGridObj as any).setSavedSelectedCells();
                done();
            }, 2000);
        });
        it('Canada.Alberta keyboard ctrl + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('Column multi click', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.gridSettings.selectionSettings.mode = 'Column';
                pivotGridObj.gridSettings.selectionSettings.type = 'Multiple';
                expect(args.selectedCellsInfo.length).toBe(31);
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('FY 2005 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2006 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada.Alberta click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada * FY 2005 value cell mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="2"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2005 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2006 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('Canada.Alberta keyboard ctrl + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
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
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2006 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada.Alberta mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada * FY 2005 value cell mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                document.querySelector('[aria-colindex="2"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2005 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2006 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(31);
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('Canada.Alberta keyboard ctrl + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(31);
                done();
            }, 2000);
        });
        it('Both multi click', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.gridSettings.selectionSettings.type = 'Multiple';
                expect(args.selectedCellsInfo.length).toBe(31);
                done();
            }, 2000);
        });
        it('FY 2005 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2006 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada.Alberta mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('Canada * FY 2007 value cell mouse click', (done: Function) => {
            setTimeout(() => {
                document.querySelector('[aria-colindex="4"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2005 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2006 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].value).toBe('Canada');
                document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(shiftClick);
                done();
            }, 2000);
        });
        it('FY 2007 keyboard ctrl + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                expect(args.selectedCellsInfo[1].columnHeaders).toBe('');
                document.querySelector('[aria-colindex="4"][index="0"]').dispatchEvent(ctrlClick);
                done();
            }, 2000);
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
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('-> FY 2006 using keyboard right arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'rightArrow', target: document.querySelector('[aria-colindex="2"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('FY 2005 keyboard shift + mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftLeft', shiftKey: true, target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('Canada.Alberta * FY 2006 value cell mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[1].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="3"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('-> FY 2006 using keyboard up arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('-> Canada.Alberta * FY 2006 value cell using keyboard down arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'downArrow', target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('-> FY 2006 using keyboard shift + keyboard up arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftUp', shiftKey: true, target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('-> Canada.Alberta * FY 2006 value cell using keyboard shift + keyboard down arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'shiftDown', shiftKey: true, target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('keyboard escape', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'escape', target: document.querySelector('[aria-colindex="3"][index="0"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('Report change - Add Quantity in values', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                pivotGridObj.dataSourceSettings.values = [{ name: 'Amount' }, { name: 'Quantity' }];
                done();
            }, 2000);
        });
        it('FY 2005.Amount mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                document.querySelector('[aria-colindex="2"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('-> FY 2005 using keyboard up arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(31);
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="2"][index="1"]'), preventDefault: (): void => { /** Null */ } });
                pivotGridObj.grid.selectionSettings.mode = 'Both';
                done();
            }, 2000);
        });
        it('Canada mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(63);
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('-> 0th cell using keyboard up arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'upArrow', target: document.querySelector('[aria-colindex="1"][index="2"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('-> out of the pivot gris using keyboard left arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'leftArrow', target: document.querySelector('[aria-colindex="1"][index="2"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('Canada.Alberta mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                document.querySelector('[aria-colindex="1"][index="3"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('-> Canada.Alberta * FY 2005.Amount value cell using keyboard right arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'rightArrow', target: document.querySelector('[aria-colindex="1"][index="3"]'), preventDefault: (): void => { /** Null */ } });
                done();
            }, 2000);
        });
        it('-> Canada.Alberta using keyboard left arrow', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBeGreaterThan(0);
                (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'leftArrow', target: document.querySelector('[aria-colindex="2"][index="3"]'), preventDefault: (): void => { /** Null */ } });
                pivotGridObj.renderModule.updateGridSettings();
                done();
            }, 2000);
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
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2006 mouse click + adaptive mode + Both + Multiple -> configured', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('');
                pivotGridObj.setProperties({ gridSettings: { selectionSettings: { mode: 'Both' } } });
                pivotGridObj.gridSettings.selectionSettings.type = 'Multiple';
                pivotGridObj.isAdaptive = true;
                done();
            }, 2000);
        });
        it('Canada mouse click', (done: Function) => {
            document.querySelector('[aria-colindex="3"][index="0"]').dispatchEvent(click);
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2006');
                document.querySelector('[aria-colindex="1"][index="1"]').dispatchEvent(click);
                done();
            }, 2000);
        });
        it('FY 2005 mouse click', (done: Function) => {
            setTimeout(() => {
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                (pivotGridObj as any).isPopupClicked = true;
                done();
            }, 2000);
        });
        it('FY 2005 on popup dialog mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                (pivotGridObj as any).isPopupClicked = false;
                done();
            }, 2000);
        });
        it('FY 2005 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo.length).toBe(0);
                document.querySelector('[aria-colindex="2"][index="0"]').dispatchEvent(click);
                pivotGridObj.gridSettings.selectionSettings.mode = 'Cell';
                done();
            }, 2000);
        });
        it('Alberta mouse click + Cell + Desktop mode -> configured', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                document.querySelector('[aria-colindex="1"][index="2"]').dispatchEvent(click);
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
            }, 2000);
        });
    });

    describe(' - Persist the selection while resizing the window', () => {
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
                width: '100%',
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
        let ctrlClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'ctrlKey': true
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('For sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('FY 2005 mouse click', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('[aria-colindex="1"][index="2"]').textContent).toBe('Alberta');
                const element: Element = document.querySelector('[aria-colindex="2"][index="0"]');
                element.dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('Canada.Alberta mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                const element: Element = document.querySelector('[aria-colindex="1"][index="2"]');
                element.dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
        it('Simulate window resize (enlarge)', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                pivotGridObj.element.style.width = '1200px';
                window.dispatchEvent(new Event('resize'));
                done();
            }, 2000);
        });
        it('Canada mouse click', (done: Function) => {
            setTimeout(() => {
                expect(args.selectedCellsInfo[0].columnHeaders).toBe('FY 2005');
                const element: Element = document.querySelector('[aria-colindex="1"][index="1"]');
                element.dispatchEvent(ctrlClick);
                done();
            }, 2000);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});