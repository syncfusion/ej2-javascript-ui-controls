import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, SheetModel, CellModel } from '../../../src/index';

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
               setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Casual Shoes');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Item Name');
                    helper.click('#spreadsheet_undo');
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                    done();
               });
            });
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
            expect(spreadsheet.sheets[0].rows[0].cells[9].value).toBe('#SPILL!');
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
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
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
                    }, 10);
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
            helper.invoke('selectRange', ['A1']);
            helper.invoke('getCell', [0, 0]).focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
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
                    }, 10);
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
                    helper.setAnimationToNone('.e-datavalidation-dlg');
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
                helper.setAnimationToNone('.e-hyperlink-dlg');
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
});