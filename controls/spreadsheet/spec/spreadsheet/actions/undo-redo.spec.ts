import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, SheetModel, CellModel, getCell, ImageModel } from '../../../src/index';
import { getComponent, EventHandler } from '@syncfusion/ej2-base';
import { Overlay } from '../../../src/spreadsheet/services/index';

describe('Undo redo ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Undo issue after unhide column', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.openAndClickCMenuItem(0, 2, [8], null, true);
            expect(helper.getInstance().sheets[0].columns[2].hidden).toBe(true);
            let prevElement: HTMLElement = helper.getElements('.e-header-cell')[1];
            expect(prevElement.classList).toContain('e-hide-start');
            let endElement: HTMLElement = helper.getElements('.e-header-cell')[2];
            expect(endElement.classList).toContain('e-hide-end');
            expect(helper.invoke('getCell', [0, 2]).textContent).toBe('Date');
            helper.invoke('selectRange', ['B1:D1']);
            helper.openAndClickCMenuItem(0, 1, [9], null, true);
            expect(helper.getInstance().sheets[0].columns[2].hidden).toBe(false);
            expect(helper.invoke('getCell', [0, 2]).textContent).toBe('Time');
            setTimeout((): void => {
                helper.click('#spreadsheet_undo');
                expect(helper.getInstance().sheets[0].columns[1].hidden).toBeUndefined();
                expect(helper.getInstance().sheets[0].columns[2].hidden).toBe(true);
                expect(helper.getInstance().sheets[0].columns[3].hidden).toBeUndefined();
                expect(prevElement.classList).toContain('e-hide-start');
                expect(endElement.classList).toContain('e-hide-end');
                expect(helper.invoke('getCell', [0, 2]).textContent).toBe('Date');
                done();
            });
        });
        it('Undo issue after unhide row', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            helper.openAndClickCMenuItem(2, 0, [8], true, null);
            expect(helper.getInstance().sheets[0].rows[2].hidden).toBe(true);
            let prevElement: HTMLElement = helper.getElement('.e-rowhdr-table').children[1].children[1];
            expect(prevElement.classList).toContain('e-hide-start');
            let endElement: HTMLElement = helper.getElement('.e-rowhdr-table').children[1].children[2];
            expect(endElement.classList).toContain('e-hide-end');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
            helper.invoke('selectRange', ['A2:A4']);
            helper.openAndClickCMenuItem(2, 0, [9], true, null);
            expect(helper.getInstance().sheets[0].rows[2].hidden).toBe(false);
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
            setTimeout((): void => {
                helper.click('#spreadsheet_undo');
                expect(helper.getInstance().sheets[0].rows[1].hidden).toBeUndefined();
                expect(helper.getInstance().sheets[0].rows[2].hidden).toBe(true);
                expect(helper.getInstance().sheets[0].rows[3].hidden).toBeUndefined();
                expect(prevElement.classList).toContain('e-hide-start');
                expect(endElement.classList).toContain('e-hide-end');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
                done();
            });
        });
    });
    
    describe('UI- Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A1:A2' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Undo after Sorting for Two cells ->', (done: Function) => {
            helper.click('#spreadsheet_sorting');
            helper.click('#spreadsheet_sorting-popup .e-item');
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                helper.click('#spreadsheet_undo');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                done();
            }, 10);
        });

        it('Redo after Strikethrough and Underline ->', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.getElement('#' + helper.id + '_line-through').click();
            helper.getElement('#' + helper.id + '_underline').click();
            expect(helper.getInstance().sheets[0].rows[3].cells[2].style.textDecoration).toBe('underline line-through');
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[3].cells[2].style.textDecoration).toBe('line-through');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().sheets[0].rows[3].cells[2].style.textDecoration).toBe('underline line-through');
            done();
        });

        it('Redo after Strikethrough and Underline for Many Cells->', (done: Function) => {
            helper.invoke('selectRange', ['D4:D5']);
            helper.getElement('#' + helper.id + '_line-through').click();
            helper.getElement('#' + helper.id + '_underline').click();
            expect(helper.getInstance().sheets[0].rows[3].cells[3].style.textDecoration).toBe('underline line-through');
            expect(helper.getInstance().sheets[0].rows[4].cells[3].style.textDecoration).toBe('underline line-through');
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[3].cells[3].style.textDecoration).toBe('line-through');
            expect(helper.getInstance().sheets[0].rows[4].cells[3].style.textDecoration).toBe('line-through');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().sheets[0].rows[3].cells[3].style.textDecoration).toBe('underline line-through');
            expect(helper.getInstance().sheets[0].rows[4].cells[3].style.textDecoration).toBe('underline line-through');
            done();
        });

        it('Redo after Strikethrough and Underline and cell having Strikethrough Underline  for Single cell->', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            helper.getElement('#' + helper.id + '_line-through').click();
            helper.getElement('#' + helper.id + '_underline').click();
            helper.getElement('#' + helper.id + '_underline').click();
            expect(helper.getInstance().sheets[0].rows[4].cells[2].style.textDecoration).toBe('line-through');
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[4].cells[2].style.textDecoration).toBe('underline line-through');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().sheets[0].rows[4].cells[2].style.textDecoration).toBe('underline');
            done();
        });

        it('Redo after Strikethrough and Underline and cell having Strikethrough Underline Many cells->', (done: Function) => {
            helper.invoke('selectRange', ['C6:D7']);
            helper.getElement('#' + helper.id + '_line-through').click();
            helper.getElement('#' + helper.id + '_underline').click();
            helper.getElement('#' + helper.id + '_underline').click();
            expect(helper.getInstance().sheets[0].rows[5].cells[2].style.textDecoration).toBe('line-through');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.textDecoration).toBe('line-through');
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[5].cells[2].style.textDecoration).toBe('underline line-through');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.textDecoration).toBe('underline line-through');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().sheets[0].rows[5].cells[2].style.textDecoration).toBe('underline');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.textDecoration).toBe('underline');
            done();
        });

        it('Undo after Unique Formula Applied->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('I1', '=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[8].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[8].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[8].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[8].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[8].value).toBe('10');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[8].value).toBe('');
            expect(spreadsheet.sheets[0].rows[1].cells[8].value).toBe('');
            expect(spreadsheet.sheets[0].rows[2].cells[8].value).toBe('');
            expect(spreadsheet.sheets[0].rows[3].cells[8].value).toBe('');
            done();
        });

        it('redo after Wrongly applied Unique Formula->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('J1', '=unique(e2:e11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[9].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[9].value).toBe('10');
            helper.edit('J1', '=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[9].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[9].value).toBe('10');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('');
            expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('');
            expect(spreadsheet.sheets[0].rows[2].cells[9].value).toBe('');
            expect(spreadsheet.sheets[0].rows[3].cells[9].value).toBe('');
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('20');
            done();
        });

        it('redo after applied Unique Formula->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('K1', '=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[10].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[10].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[10].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[10].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[10].value).toBe('10');
            helper.edit('K1', '=UNIQUE(F2:F11)');
            expect(spreadsheet.sheets[0].rows[0].cells[10].value).toBe('#SPILL!');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[10].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[10].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[10].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[10].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[10].value).toBe('10');
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[10].formula).toBe('=UNIQUE(F2:F11)');
            expect(spreadsheet.sheets[0].rows[0].cells[10].value).toBe('200');
            expect(spreadsheet.sheets[0].rows[1].cells[10].value).toBe('600');
            expect(spreadsheet.sheets[0].rows[2].cells[10].value).toBe('300');
            expect(spreadsheet.sheets[0].rows[3].cells[10].value).toBe('800');
            done();
        });

        it('undo for Column Resize ->', (done: Function) => {
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('64px');
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 8, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('39px');
            helper.click('#spreadsheet_undo');
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('64px');
            done();
        });

        it('undo for Row Resize ->', (done: Function) => {
            helper.invoke('setRowHeight', [40, 1]);
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(40);
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[2].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(20);
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(40);
            helper.invoke('selectRange', ['G1:H1']);
            helper.invoke('merge', ['G1:H1']);
            done();
        });

        it('undo for Column span Resize ->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[6].colSpan).toBe(2);
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('auto');
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 8, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('auto');
            helper.click('#spreadsheet_undo');
            expect(getComputedStyle(helper.invoke('getCell', [0,7])).width).toBe('auto');
            helper.invoke('selectRange', ['A1:A2']);
            helper.invoke('merge', ['A1:A2']);
            done();
        });

        it('undo for Row span Resize ->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(40);
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[2].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(20);
            helper.click('#spreadsheet_undo');
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(40);
            done();
        });
    });

    describe('UI_Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Undo after sorting using Filter icon ->', (done: Function) => {
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                setTimeout(() => {
                    const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortasc');
                    helper.triggerMouseAction( 'mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                    helper.triggerMouseAction( 'mouseup', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                    setTimeout(() => {
                        let td: Element = helper.invoke('getCell', [0, 0]);
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Cricket Shoes');
                        helper.click('#spreadsheet_undo');
                        expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        expect(td.children[0].children[0].classList).not.toContain('e-sortasc-filter');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
                        done();
                    }, 20);
                });
            });
        });

        it('Redo after sorting ->', (done: Function) => {
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                let td: Element = helper.invoke('getCell', [0, 0]);
                expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Cricket Shoes');
                done();
            }, 10);
        });

        it('Undo after apply both sorting using Filter icon ->', (done: Function) => {
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                setTimeout(() => {
                    const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortdesc');
                    helper.triggerMouseAction( 'mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                    helper.triggerMouseAction( 'mouseup', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                    setTimeout(() => {
                        let td: Element = helper.invoke('getCell', [0, 0]);
                        expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('T-Shirts');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
                        helper.click('#spreadsheet_undo');
                        expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        expect(td.children[0].children[0].classList).toContain('e-sortasc-filter');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Cricket Shoes');
                        done();
                    }, 20);
                });
            });
        });

        it('Redo after both sorting ->', (done: Function) => {
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                let td: Element = helper.invoke('getCell', [0, 0]);
                expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('T-Shirts');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
                done();
            }, 10);
        });

        it('Undo after Removing Column Validation->', (done: Function) => {
            helper.invoke('selectRange', ['E2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                setTimeout(() => {
                    let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].value = 'List';
                    ddlElem.ej2_instances[0].dataBind();
                    helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '1,2,3';
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                    setTimeout(() => {
                        const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[4];
                        expect(JSON.stringify(cell.validation)).toBe('{"type":"List","operator":"Between","value1":"1,2,3","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                        helper.switchRibbonTab(4);
                        helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                        setTimeout(() => {
                            helper.click('.e-datavalidation-ddb li:nth-child(4)');
                            expect(JSON.stringify(cell.validation)).toBeUndefined();
                            helper.switchRibbonTab(1);
                            helper.click('#spreadsheet_undo');
                            helper.invoke('selectRange', ['E2']);
                            setTimeout(() => {
                                expect(JSON.stringify(cell.validation)).toBeUndefined();
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('Undo after Removing Hyperlink->', (done: Function) => {
            helper.invoke('addHyperlink', ['www.google.com', 'E3']);
            expect(helper.getInstance().sheets[0].rows[2].cells[4].hyperlink).toBe('http://www.google.com');
            let td: HTMLElement = helper.invoke('getCell', [2, 4]).children[0];
            expect(td.classList).toContain('e-hyperlink');
            expect(td.classList).toContain('e-hyperlink-style');
            expect(helper.getInstance().sheets[0].rows[2].cells[4].style.textDecoration).toBe('underline');
            helper.invoke('selectRange', ['E3']);
            helper.click('#spreadsheet_clear');
            helper.click('#spreadsheet_clear-popup ul li:nth-child(2)');
            setTimeout(() => {
                expect(td.classList).toContain('e-hyperlink');
                expect(td.classList).not.toContain('e-hyperlink-style');
                helper.click('#spreadsheet_undo');
                expect(td.classList).toContain('e-hyperlink');
                expect(helper.getInstance().sheets[0].rows[2].cells[4].style.textDecoration).toBe('underline');
                done();
            });
        });
        it('Cell format action - undo/redo collection->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.click('#' + helper.id + '_bold');
            const undoRedo: any = helper.getInstance().undoredoModule;
            expect(undoRedo.redoCollection.length).toBe(0);
            expect(helper.getElement('#' + helper.id + '_redo').parentElement.classList.contains('e-overlay')).toBeTruthy();
            let actionArgs: any = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.action).toBe('format');
            expect(actionArgs.eventArgs.range).toBe('Sheet1!A2:A2');
            expect(actionArgs.eventArgs.style.fontWeight).toBe('bold');
            helper.click('#' + helper.id + '_italic');
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.fontStyle).toBe('italic');
            helper.click('#' + helper.id + '_line-through');
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('line-through');
            helper.click('#' + helper.id + '_underline');
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('underline line-through');
            done();
        });
        it('Undo on cell format->', (done: Function) => {
            const undoRedo: any = helper.getInstance().undoredoModule;
            let undoColCount: number = undoRedo.undoCollection.length;
            helper.click('#' + helper.id + '_undo');
            expect(helper.getElement('#' + helper.id + '_redo').parentElement.classList.contains('e-overlay')).toBeFalsy();
            expect(undoRedo.redoCollection.length).toBe(1);
            expect(undoRedo.undoCollection.length).toBe(undoColCount - 1);
            let actionArgs: any = undoRedo.redoCollection[0];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('underline line-through');
            helper.click('#' + helper.id + '_undo');
            expect(undoRedo.redoCollection.length).toBe(2);
            expect(undoRedo.undoCollection.length).toBe(undoColCount - 2);
            actionArgs = undoRedo.redoCollection[1];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('line-through');
            helper.click('#' + helper.id + '_undo');
            expect(undoRedo.redoCollection.length).toBe(3);
            expect(undoRedo.undoCollection.length).toBe(undoColCount - 3);
            actionArgs = undoRedo.redoCollection[2];
            expect(actionArgs.eventArgs.style.fontStyle).toBe('italic');
            helper.click('#' + helper.id + '_undo');
            expect(undoRedo.redoCollection.length).toBe(4);
            expect(undoRedo.undoCollection.length).toBe(undoColCount - 4);
            actionArgs = undoRedo.redoCollection[3];
            expect(actionArgs.eventArgs.style.fontWeight).toBe('bold');
            done();
        });
        it('Redo on cell format->', (done: Function) => {
            const undoRedo: any = helper.getInstance().undoredoModule;
            helper.click('#' + helper.id + '_redo');
            expect(undoRedo.redoCollection.length).toBe(3);
            let actionArgs: any = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.fontWeight).toBe('bold');
            helper.click('#' + helper.id + '_redo');
            expect(undoRedo.redoCollection.length).toBe(2);
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.fontStyle).toBe('italic');
            helper.click('#' + helper.id + '_redo');
            expect(undoRedo.redoCollection.length).toBe(1);
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('line-through');
            helper.click('#' + helper.id + '_redo');
            expect(undoRedo.redoCollection.length).toBe(0);
            expect(helper.getElement('#' + helper.id + '_redo').parentElement.classList.contains('e-overlay')).toBeTruthy();
            actionArgs = undoRedo.undoCollection[undoRedo.undoCollection.length - 1];
            expect(actionArgs.eventArgs.style.textDecoration).toBe('underline line-through');
            done();
        });
    });

    describe('UI - Interaction II', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        
        it('Apply undo after clear Conditional Formats', (done: Function) => {
            helper.invoke('selectRange', ['H2:H11']);
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-clearrules');
            (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_cr_cells').click();
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
                helper.invoke('undo');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                done();
            });
        });
        it('Apply undo after after Cut/Paste Conditional Formats', (done: Function) => {
            helper.invoke('selectRange', ['H2:H11']);
            helper.invoke('cut').then(() => {
                helper.invoke('selectRange', ['J2']);
                helper.invoke('paste', ['J2']);
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 9]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [1, 9]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [9, 9]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                helper.click('#spreadsheet_undo');
                expect(helper.invoke('getCell', [1, 9]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 9]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [9, 9]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
                expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                done();
            });
        });
        it('Undo after Delete Spill causing Value in Unique Formula Applied->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('J1', '=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[9].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[9].value).toBe('10');
            helper.invoke('selectRange', ['J4']);
            helper.edit('J4', '1');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('#SPILL!');
            helper.triggerKeyNativeEvent(46);
            expect(spreadsheet.sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[9].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[9].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[9].value).toBe('10');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('#SPILL!');
            done();
        });
        it('Redo after Delete Spill causing Value in Unique Formula Applied->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.click('#spreadsheet_redo');
            let spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('#SPILL!');
            done();
        });
        it('Redo after Delete Spill causing Value in Unique Formula Applied in First Column->', (done: Function) => {
            helper.invoke('selectRange', ['A12']);
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('A12', '=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[11].cells[0].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[12].cells[0].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[13].cells[0].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[14].cells[0].value).toBe('10');
            helper.invoke('selectRange', ['A15']);
            helper.edit('A15', '1');
            expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('#SPILL!');
            helper.triggerKeyNativeEvent(46);
            expect(spreadsheet.sheets[0].rows[11].cells[0].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[12].cells[0].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[13].cells[0].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[14].cells[0].value).toBe('10');
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('#SPILL!');
            helper.invoke('selectRange', ['A12']);
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[11].cells[0].formula).toBe('=UNIQUE(E2:E11)');
            expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[12].cells[0].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[13].cells[0].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[14].cells[0].value).toBe('10');
            done();
        });
        it('Redo after apply Unique Formula in used Range->', (done: Function) => {
            helper.invoke('selectRange', ['G1']);
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.edit('G1', '=UNIQUE(E2:E11)');
            helper.edit('G1', '=UNIQUE(E2:E11);');
            expect(spreadsheet.sheets[0].rows[0].cells[6].formula).toBe('=UNIQUE(E2:E11);');
            expect(spreadsheet.sheets[0].rows[0].cells[6].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[6].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[6].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[6].value).toBe('10');
            helper.click('#spreadsheet_undo');
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[6].formula).toBe('=UNIQUE(E2:E11);');
            expect(spreadsheet.sheets[0].rows[0].cells[6].value).toBe('20');
            expect(spreadsheet.sheets[0].rows[1].cells[6].value).toBe('30');
            expect(spreadsheet.sheets[0].rows[2].cells[6].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[3].cells[6].value).toBe('10');
            done();
        });
        it('Undo Image, after cut/Paste', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'D3', isPublic: true });
            setTimeout(() => {
                let image: ImageModel = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
                expect(image.height).toBe(300);
                expect(image.width).toBe(400);
                expect(image.top).toBe(40);
                expect(image.left).toBe(192);
                expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(helper.getElement('#' + image.id).style.left).toBe('192px');
                helper.invoke('cut').then(() => {
                    helper.invoke('selectRange', ['M1']);
                    helper.invoke('paste', ['M1']);
                    image = helper.getInstance().sheets[0].rows[0].cells[12].image[0];
                    expect(image.height).toBe(300);
                    expect(image.width).toBe(400);
                    expect(image.top).toBe(0);
                    expect(image.left).toBe(768);
                    expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                    expect(helper.getElement('#' + image.id).style.left).toBe('768px');
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        image = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
                        expect(image.height).toBe(300);
                        expect(image.width).toBe(400);
                        expect(image.top).toBe(40);
                        expect(image.left).toBe(192);
                        expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                        expect(helper.getElement('#' + image.id).style.left).toBe('192px');
                        done();
                    });
                });
            });
        });
        it('Redo Image, after cut/Paste', (done: Function) => {
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                const image: ImageModel = helper.getInstance().sheets[0].rows[0].cells[12].image[0];
                expect(image.height).toBe(300);
                expect(image.width).toBe(400);
                expect(image.top).toBe(0);
                expect(image.left).toBe(768);
                expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(helper.getElement('#' + image.id).style.left).toBe('768px');
                done();
            });
        });
        it('Undo Image, after copy/Paste', (done: Function) => {
            helper.invoke('copy').then(() => {
                helper.invoke('selectRange', ['D3']);
                helper.invoke('paste', ['D3']);
                const image: ImageModel = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
                expect(image.height).toBe(300);
                expect(image.width).toBe(400);
                expect(image.top).toBe(40);
                expect(image.left).toBe(192);
                expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(helper.getElement('#' + image.id).style.left).toBe('192px');
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[]');
                    done();
                });
            });
        });
        it('Redo Image, after copy/Paste', (done: Function) => {
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                const image: ImageModel = helper.getInstance().sheets[0].rows[2].cells[3].image[0];
                expect(image.height).toBe(300);
                expect(image.width).toBe(400);
                expect(image.top).toBe(40);
                expect(image.left).toBe(192);
                expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(helper.getElement('#' + image.id).style.left).toBe('192px');
                done();
            });
        });
        it('Apply Undo after Image Refresh', (done: Function) => {
            const image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay-active');
            const inst: Spreadsheet = helper.getInstance();
            inst.element.focus();  
            helper.triggerMouseAction('mousedown', { x: image.getBoundingClientRect().left + 1, y: image.getBoundingClientRect().top + 1 }, image, image);
            helper.triggerMouseAction('mousemove', { x: image.getBoundingClientRect().left + 200, y: image.getBoundingClientRect().top + 100 }, image, image);
            helper.triggerMouseAction('mouseup', { x: image.getBoundingClientRect().left + 200, y: image.getBoundingClientRect().top + 100 }, document, image);
            (inst.serviceLocator.getService('shape') as Overlay).destroy();
            setTimeout(() => {
                expect(image.style.top).toEqual('139px');
                expect(image.style.left).toEqual('391px');
                helper.click('#spreadsheet_undo');
                expect(image.style.top).toEqual('40px');
                expect(image.style.left).toEqual('192px');
                done();
            });
        });
        it('Apply Redo after Image Refresh', (done: Function) => {
            const image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay-active');
            helper.click('#spreadsheet_redo');
            expect(image.style.top).toEqual('139px');
            expect(image.style.left).toEqual('391px');
            done();
        });
    });
    
    describe('CR Issues ->', () => {
        describe('SF-359671,SF-356044,SF-361047 -> actionBegin and actionComplete event', () => {
            let spreadsheet: Spreadsheet; let action: string; let isTriggered: boolean; let cancel: boolean;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{ ranges: [{ dataSource: defaultData }] }]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('cell edit', (done: Function) => {
                spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args): void => {
                    if (cancel) {
                        args.args.eventArgs.cancel = true;
                    }
                    if (action === 'undo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.args.eventArgs.value).toBe('20');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.args.eventArgs.value).toBe('20');
                    }
                    isTriggered = true;
                };
                spreadsheet.actionComplete = (args): void => {
                    if (action === 'undo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.isUndoRedo).toBeTruthy();
                        expect(args.eventArgs.value).toBe('20');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.isUndoRedo).toBeTruthy();
                        expect(args.eventArgs.value).toBe('20');
                    }
                };
                helper.edit('D2', '20');
                setTimeout((): void => {
                    action = 'undo';
                    helper.click('#spreadsheet_undo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(10);
                    action = 'redo';
                    helper.click('#spreadsheet_redo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    isTriggered = false;
                    helper.invoke('undo');
                    expect(isTriggered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(10);
                    helper.invoke('redo');
                    expect(isTriggered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    cancel = true;
                    action = '';
                    helper.click('#spreadsheet_undo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    expect(helper.getElement('#spreadsheet_undo').disabled).toBeFalsy();
                    expect(helper.getElement('#spreadsheet_redo').disabled).toBeFalsy();
                    cancel = false;
                    done();
                });
            });
            it('cell delete', (done: Function) => {
                spreadsheet.actionBegin = (args): void => {
                    if (cancel) {
                        args.args.eventArgs.cancel = true;
                    }
                    if (action === 'undo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.args.eventArgs.address).toBe('Sheet1!D2:D2');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeFalsy();
                    }
                    isTriggered = true;
                };
                spreadsheet.actionComplete = (args): void => {
                    if (action === 'undo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.isUndoRedo).toBeTruthy();
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.isUndoRedo).toBeTruthy();
                    }
                };
                helper.triggerKeyNativeEvent(46);
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBeUndefined();
                action = 'undo';
                helper.click('#spreadsheet_undo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                action = 'redo';
                helper.click('#spreadsheet_redo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBeUndefined();
                isTriggered = false;
                helper.invoke('undo');
                expect(isTriggered).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                helper.invoke('redo');
                expect(isTriggered).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBeUndefined();
                cancel = true;
                action = '';
                helper.click('#spreadsheet_undo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBeUndefined();
                expect(helper.getElement('#spreadsheet_undo').disabled).toBeFalsy();
                expect(helper.getElement('#spreadsheet_redo').disabled).toBeFalsy();
                cancel = false;
                done();
            });
        });

        describe('EJ2-912111', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{
                            rows: [{
                                index: 1, cells: [{
                                    value: '100', style: {
                                        fontSize: '11pt',
                                        fontFamily: 'Arial',
                                        verticalAlign: 'middle',
                                        textAlign: 'right',
                                    }
                                }], height: 30
                            }]
                        }]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Custom row height is not maintained when editing and performing undo actions', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.invoke('selectRange', ['A2']);
                helper.edit('A2', 'Hello Spreadsheet');
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Hello Spreadsheet');
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                spreadsheet.undo();
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe(100);
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                helper.edit('A2', 'www.syncfusion.com');
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('www.syncfusion.com');
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                expect(spreadsheet.sheets[0].rows[1].cells[0].hyperlink).toBe('http://www.syncfusion.com');
                spreadsheet.undo();
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe(100);
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                expect(spreadsheet.sheets[0].rows[1].cells[0].hyperlink).toBeUndefined();
                helper.triggerKeyNativeEvent(46);
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[0].style)).toBe('{"fontSize":"11pt","fontFamily":"Arial","verticalAlign":"middle","textAlign":"right"}');
                spreadsheet.undo();
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe(100);
                expect(spreadsheet.sheets[0].rows[1].height).toBe(30);
                expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[0].style)).toBe('{"fontSize":"11pt","fontFamily":"Arial","verticalAlign":"middle","textAlign":"right"}');
                done();
            });
        });
    });
    describe('Freezed panes', () => {
        let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply freeze', (done: Function) => {
            sheet = helper.getInstance().getActiveSheet();
            helper.invoke('selectRange', ['E5']);
            helper.switchRibbonTab(6);
            helper.click('#' + helper.id + '_freezepanes');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete all freeze columns', (done: Function) => {
            helper.invoke('selectRange', ['A1:D1']);
            helper.openAndClickCMenuItem(0, 5, [7], null, true);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(td.textContent).toBe('Profit');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(0);
                done();
            });
        });
        it('Freeze undo action', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Freeze redo action', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(0);
                done();
            });
        });
        it('Freeze undo action-00', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete column', (done: Function) => {
            helper.invoke('selectRange', ['D1:E1']);
            helper.openAndClickCMenuItem(0, 5, [7], null, true);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(td.textContent).toBe('Amount');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(3);
                done();
            });
        });
        it('Undo action', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Redo action', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(3);
                done();
            });
        });
        it('Undo action-00', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete column-1', (done: Function) => {
            helper.invoke('selectRange', ['A1:C1']);
            helper.openAndClickCMenuItem(0, 5, [7], null, true);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(td.textContent).toBe('Discount');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(1);
                done();
            });
        });
        it('Undo action-1', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Redo action-1', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(1);
                done();
            });
        });
        it('Undo action-01', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete column-2', (done: Function) => {
            helper.invoke('selectRange', ['F1:H1']);
            helper.openAndClickCMenuItem(0, 5, [7], null, true);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 6]);
                expect(td.textContent).toBe('');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Undo action-2', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 6]);
                expect(td.textContent).toBe('Discount');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            }, 10);
        });
        it('Redo action-2', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 6]);
                expect(td.textContent).toBe('');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Undo action-02', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 6]);
                expect(td.textContent).toBe('Discount');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            }, 200);
        });

        it('Delete all frozen Rows', (done: Function) => {
            helper.invoke('selectRange', ['1:4']);
            helper.openAndClickCMenuItem(5, 0, [7], true);
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(0);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Freeze row undo action', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Freeze row redo action', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(0);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Freeze row undo action-00', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete Row', (done: Function) => {
            helper.invoke('selectRange', ['4:5']);
            helper.openAndClickCMenuItem(5, 0, [7], true);
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(3);
                expect(sheet.frozenColumns).toBe(4);
                done();
            }, 10);
        });
        it('Row undo action', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row redo action', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(3);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row undo action-00', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete Row-1', (done: Function) => {
            helper.invoke('selectRange', ['1:3']);
            helper.openAndClickCMenuItem(5, 0, [7], true);
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(1);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row undo action-1', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row redo action-1', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(1);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row undo action-01', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Delete Row-2', (done: Function) => {
            helper.invoke('selectRange', ['8:10']);
            helper.openAndClickCMenuItem(5, 0, [7], true);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [9, 0]);
                expect(td.textContent).toBe('');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row undo action-2', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [9, 0]);
                expect(td.textContent).toBe('Cricket Shoes');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row redo action-2', (done: Function) => {
            helper.click('#' + helper.id + '_redo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [9, 0]);
                expect(td.textContent).toBe('');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                done();
            });
        });
        it('Row undo action-02', (done: Function) => {
            helper.click('#' + helper.id + '_undo');
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [9, 0]);
                expect(td.textContent).toBe('Cricket Shoes');
                expect(sheet.frozenRows).toBe(4);
                expect(sheet.frozenColumns).toBe(4);
                helper.switchRibbonTab(6);
                done();
            });
        });
        it('UnFreeze panes', (done: Function) => {
            helper.click('#' + helper.id + '_freezepanes');
            setTimeout((): void => {
                helper.invoke('goTo', ['D59']);
                expect(sheet.frozenRows).toBe(0);
                expect(sheet.frozenColumns).toBe(0);
                done();
            }, 100);
        });
        it('Scroll down', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.insertRow(2, 4);
            setTimeout((): void => {
                expect(sheet.frozenRows).toBe(0);
                expect(sheet.frozenColumns).toBe(0);
                done();
            }, 100);
        });
    });
    describe('SF-362962', () => {
        let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A3' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Invalid expression throws While delete row and apply undo for formula applied rows', (done: Function) => {
            sheet = helper.getInstance().sheets[0];
            helper.invoke('updateCell', [{ formula: '=IF(I3="","empty","not empty")' }, 'Sheet1!J3']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(2, 0, [7], true);
            setTimeout((): void => {
                expect(sheet.rows[2].cells[9]).toBeUndefined();
                expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('');
                helper.getElement('#spreadsheet_undo').click();
                setTimeout((): void => {
                    expect(sheet.rows[2].cells[9].formula).toEqual('=IF(I3="","empty","not empty")');
                    expect(sheet.rows[2].cells[9].value).toEqual('empty');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('empty');
                    done();
                });
            });
        });
        it('Invalid expression throws while delete column and apply undo for formula applied columns', (done: Function) => {
            helper.openAndClickCMenuItem(0, 9, [7], false, true);
            setTimeout((): void => {
                expect(sheet.rows[2].cells[9]).toBeUndefined();
                expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('');
                helper.getElement('#spreadsheet_undo').click();
                setTimeout((): void => {
                    expect(sheet.rows[2].cells[9].formula).toEqual('=IF(I3="","empty","not empty")');
                    expect(sheet.rows[2].cells[9].value).toEqual('empty');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('empty');
                    done();
                });
            });
        });
    });

    describe(' Undo redo for row height ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [
                    {
                        name: 'Car Sales Report',
                        ranges: [{ dataSource: defaultData }],
                        rows: [
                            {
                                index: 1,
                                cells: [
                                    { style: { fontSize: '18pt' } },
                                ], height: 50
                            },
                            {
                                index: 3,
                                cells: [
                                    { style: { fontSize: '18pt' } },
                                ], height: 50
                            },
                            {
                                index: 30,
                                cells: [
                                    { index: 4, value: 'Total Amount:', style: { fontWeight: 'bold', textAlign: 'right' } },
                                    { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } },
                                ]
                            }],
                        columns: [
                            { width: 180 }, { width: 130 }, { width: 130 }, { width: 180 },
                            { width: 130 }, { width: 120 }
                        ]
                    }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Copy action', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.getElement('#' + helper.id + '_copy').click();
            done();
        });
        it('Paste action', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            helper.getElement('#' + helper.id + '_paste').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
            done();
        });
        it('Paste action-1', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.getElement('#' + helper.id + '_paste').click();
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
            done();
        });
        it('Text add', (done: Function) => {
            helper.edit('A2', 'Just checking for cell text wrap working properly or not');
            helper.invoke('selectRange', ['A2']);
            helper.getElement('#' + helper.id + '_wrap').click();
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.classList.contains('e-wraptext')).toBeTruthy();
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(121);
            done();
        });
        it('Text add-1', (done: Function) => {
            helper.edit('A2', 'Just checking for cell text wrap working properly or not. Wow Working fine.');
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(150);
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(121);
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(50);
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].rows[3].height).toBe(50);
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Formal Shoes');
            helper.getElement('#' + helper.id + '_undo').click();
            expect(spreadsheet.sheets[0].rows[2].height).toBe(20);
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
        });
        it('Redo action-1', () => {
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[2].height).toBe(31);
            helper.getElement('#' + helper.id + '_redo').click();
        });
        it('Redo action-2', () => {
            spreadsheet = helper.getInstance();
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
            helper.getElement('#' + helper.id + '_redo').click();
        });
        it('Redo action-3', () => {
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(50);
            helper.getElement('#' + helper.id + '_redo').click();
        });
        it('Redo action-4', () => {
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(121);
            helper.getElement('#' + helper.id + '_redo').click();
        });
        it('Redo action-5', () => {
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].height).toBe(150);
        });
    });

    describe('Undo redo hyperlink selection', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply styles', (done: Function) => {
            helper.invoke('selectRange', ['A1:B100']);
            setTimeout((): void => {
                helper.click('#' + helper.id + '_bold');
                helper.click('#' + helper.id + '_italic');
                helper.click('#' + helper.id + '_line-through');
                setTimeout((): void => {
                    spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[1].cells[1].style.textDecoration).toBe('line-through');
                    done();
                });
            });
        });
        it('Insert hyperlink', (done: Function) => {
            helper.invoke('selectRange', ['A3:B6']);
            helper.switchRibbonTab(2);
            helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
            setTimeout(() => {
                helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Check', (done: Function) => {
            helper.switchRibbonTab(1);
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[3].cells[1].hyperlink.address).toBe('http://www.google.com');
            done();
        });
        it('Apply Clear Formats', (done: Function) => {
            helper.invoke('selectRange', ['A1:B100']);
            setTimeout((): void => {
                helper.click('#' + helper.id + '_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(2)');
                setTimeout((): void => {
                    spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[1].cells[1].style).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[1].cells[1].value).toBe('41684');
                    expect(spreadsheet.sheets[0].rows[3].cells[1].hyperlink.address).toBe('http://www.google.com');
                    expect(spreadsheet.sheets[0].rows[3].cells[1].style.textDecoration).toBe('none');
                    done();
                });
            });
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            setTimeout((): void => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[1].style.fontWeight).toBe('bold');
                expect(spreadsheet.sheets[0].rows[3].cells[1].hyperlink.address).toBe('http://www.google.com');
                expect(spreadsheet.sheets[0].rows[3].cells[1].style.textDecoration).toBe('underline');
                done();
            });
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            setTimeout((): void => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[1].style).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[1].cells[1].value).toBe(41684);
                expect(spreadsheet.sheets[0].rows[3].cells[1].hyperlink.address).toBe('http://www.google.com');
                expect(spreadsheet.sheets[0].rows[3].cells[1].style.textDecoration).toBe('none');
                done();
            });
        });
    });

    describe('EJ2-60728', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hyperlink text changed to URL after clearing all the hyperlink cell', (done: Function) => {
            (helper.getRibbonElement().querySelector('.e-tab-header .e-toolbar-items').children[3] as HTMLElement).click();
            (helper.getRibbonElement().querySelector('.e-control #spreadsheet_hyperlink') as HTMLElement).click();
            setTimeout(() => {
                helper.getElements('.e-dlg-container .e-webpage input')[1].value = 'www.syncfusion.com';
                helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                (helper.getRibbonElement().querySelector('.e-tab-header .e-toolbar-items').children[2] as HTMLElement).click();
                helper.getElement('#' + helper.id + '_clear').click();
                let target: HTMLElement = document.getElementById('spreadsheet_clear-popup').children[0].children[0] as HTMLElement;
                target.click();
                helper.getElement('#' + helper.id + '_undo').click();
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
    });

    describe('EJ2-910312', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A5' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Row height is not proper on undo of long text added with Alt + Enter', (done: Function) => {
            helper.triggerKeyNativeEvent(113);
            const spreadsheet: Spreadsheet = helper.getInstance();
            const editElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            expect(editElem.textContent.split('\n').length).toBe(6);
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[4].cells[0].wrap).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Sandals & Floaters\n\n\n\n\n ');
                expect(spreadsheet.sheets[0].rows[4].height).toBeGreaterThan(20);
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[4].cells[0].wrap).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Sandals & Floaters');
                    expect(spreadsheet.sheets[0].rows[4].height).toBe(20);
                    done();
                });
            });
        });
        it('Row height is not proper on redo of long text added with Alt + Enter', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_redo');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[4].cells[0].wrap).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Sandals & Floaters\n\n\n\n\n ');
                expect(spreadsheet.sheets[0].rows[4].height).toBeGreaterThan(20);
                done();
            });
        });        
        it('Wrap Applied Cell Row height is not proper on undo of long text added with Alt + Enter(891477)', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A4']);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].selectedRange).toBe('A4:A4');
                spreadsheet.sheets[0].rows[3].cells[0].wrap = true;
                helper.triggerKeyNativeEvent(113);
                const editElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
                helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
                helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
                helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
                helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
                helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
                expect(editElem.textContent.split('\n').length).toBe(6);
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[3].cells[0].wrap).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[3].cells[0].value).toBe('Formal Shoes\n\n\n\n\n ');
                    expect(spreadsheet.sheets[0].rows[3].height).toBeGreaterThan(20);
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[3].cells[0].wrap).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[3].cells[0].value).toBe('Formal Shoes');
                        expect(spreadsheet.sheets[0].rows[3].height).toBe(38);
                        done();
                    });
                });
            });
        });
        it('Wrap Applied Cell Row height is not proper on redo of long text added with Alt + Enter(891477)', function (done) {
            var spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_redo');
            setTimeout(function () {
                expect(spreadsheet.sheets[0].rows[3].cells[0].wrap).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toBe('Formal Shoes\n\n\n\n\n ');
                expect(spreadsheet.sheets[0].rows[3].height).toBeGreaterThan(20);
                done();
            });
        });
    });
    describe('allowUndoRedo: false ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ allowUndoRedo: false, sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Undo and Redo buttons should be disabled and not perform any action', (done: Function) => {
            spreadsheet = helper.getInstance().sheets[0];
            var undobtn = helper.getElement('#spreadsheet_undo');
            var redobtn = helper.getElement('#spreadsheet_redo');
            helper.edit('A1', 'Test');
            const cellA1 = spreadsheet.rows[0].cells[0];
            const tdA1 = helper.invoke('getCell', [0, 0]);
            helper.invoke('undo');
            expect(undobtn.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(cellA1.value).toBe('Test');
            expect(tdA1.textContent).toBe('Test');
            helper.invoke('redo');
            expect(redobtn.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(cellA1.value).toBe('Test');
            expect(tdA1.textContent).toBe('Test');
            done();
        });
    });
});