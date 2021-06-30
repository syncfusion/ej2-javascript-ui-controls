import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, dialog as dlg, DialogBeforeOpenEventArgs, BeforeSelectEventArgs, getRangeIndexes, getCell, CellModel } from '../../../src/index';
import { SheetModel } from '../../../src/index';
import { Dialog, Overlay } from '../../../src/spreadsheet/services/index';

describe('Protect sheet ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('protectSheet', ['Sheet1', {}]);
            expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('none');
            expect(helper.getElements('.e-overlay').length).toBeGreaterThanOrEqual(23);

            helper.invoke('unprotectSheet', ['Sheet1']);
            setTimeout(() => {
                expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('block');
                expect(helper.getElements('.e-overlay').length).toBeLessThanOrEqual(5);
                done();
            });
        });
    });

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Protect sheet', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[5] as HTMLElement).click();
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.invoke('selectRange', ['D4']);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D4:D4');
                // helper.editInUI('Test'); // This case need to be fixed
                setTimeout(() => {
                    // expect(helper.getElementFromSpreadsheet('#' + helper.id + '_protect').textContent).toBe('Unprotect Sheet'); // Check this now
                    // expect(helper.getElementFromSpreadsheet('.e-editAlert-dlg')).not.toBeNull(); // This case need to be fixed
                    // helper.setAnimationToNone('.e-editAlert-dlg');
                    // helper.click('.e-editAlert-dlg .e-primary');
                    // expect(helper.invoke('getCell', [2, 3]).textContent).toBe('20');
                    done();
                });
            });
        });

        it('Delete in locked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg');
                expect(helper.getElement('.e-editAlert-dlg')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":"Item Name"}');
                done();
            });
        });

        it('Delete in unlocked cell', (done: Function) => {
            helper.invoke('lockCells', ['B2', false]);
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[1])).toBe('{"format":"mm-dd-yyyy","isLocked":false}');
                done();
            });
        });

        it('Set unlocked to whole column', (done: Function) => {
            helper.invoke('selectRange', ['D1:D100']);
            helper.invoke('lockCells', [null, false]);
            expect(helper.getInstance().sheets[0].columns[3].isLocked).toBeFalsy();
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                done();
            });
        });

        it('Protect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                //helper.setAnimationToNone('.e-protectworkbook-dlg');
                (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = 'T1@/a';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'T1@/a';
                helper.click('.e-protectworkbook-dlg .e-primary');
                // This case need to be fixed.
                setTimeout(()=>{
                    done();
                });
            });
        });

        it('Un protect sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });
    });

    describe('CR-Issues ->', () => {
        describe('I275297 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Employee ID': '2963633', 'Employee Name': 'Kylie Phettis', 'Gender': 'Female',
                    'Department': 'Marketing', 'Date of Joining': '03/18/2011', 'Salary': '$26038.56', 'City': 'Huangzhai' }] }], selectedRange: 'E2:E2' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
                        spreadsheet.cellFormat({ fontWeight: 'bold' }, 'E31:F31');
                        spreadsheet.cellFormat({ textAlign: 'right' }, 'E31');
                        spreadsheet.numberFormat('$#,##0.00', 'F2:F31');
                        spreadsheet.protectSheet(
                            'Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Unable to lock a cell without protecting the sheet ~ from 275269', (done: Function) => {
                let cell: HTMLElement = helper.invoke('getCell', [1, 4]);
                helper.triggerMouseAction('dblclick', { x: cell.getBoundingClientRect().left + 2, y:
                    cell.getBoundingClientRect().top + 2 }, null, cell);
                setTimeout((): void => {
                    let dialog: HTMLElement = helper.getElement('.e-editAlert-dlg');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    const editor: HTMLElement = helper.getElement('#' + helper.id + '_edit');
                    expect(editor.style.display).toBe('');
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    (spreadsheet.serviceLocator.getService(dlg) as Dialog).hide();
                    setTimeout((): void => {
                        helper.invoke('lockCells', ['A2:AZ100', false]);
                        cell = helper.invoke('getCell', [1, 4]);
                        helper.triggerMouseAction('dblclick', {
                            x: cell.getBoundingClientRect().left + 10, y: cell.getBoundingClientRect().top + 5
                        }, null, cell);
                        setTimeout((): void => {
                            expect(editor.style.display).toBe('block');
                            helper.invoke('lockCells', ['E2:E4', true]);
                            helper.invoke('endEdit', []);
                            helper.triggerMouseAction('dblclick', {
                                x: cell.getBoundingClientRect().left + 2, y: cell.getBoundingClientRect().top + 2
                            }, null, cell);
                            setTimeout((): void => {
                                dialog = helper.getElement('.e-editAlert-dlg');
                                expect(!!dialog).toBeTruthy();
                                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                                    "The cell you're trying to change is protected. To make change, unprotect the sheet.");
                                expect(editor.style.display).toBe('');
                                (spreadsheet.serviceLocator.getService(dlg) as Dialog).hide();
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('I321143, F161227, FB23867 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Deleting values from locked cells and warning dialog', (done: Function) => {
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [0, 0]));
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('spreadsheet');
                setTimeout((): void => {
                    helper.setAnimationToNone('.e-editAlert-dlg');
                    expect(helper.getElement('.e-editAlert-dlg')).not.toBeNull();
                    helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
            it('Cancel button in hyperlink popup is not working in protected sheet', (done: Function) => {
                helper.invoke('protectSheet', ['Sheet1', { selectCells: true, insertLink: true }]);
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(9)');
                    setTimeout(() => {
                        helper.triggerKeyEvent('keydown', 65, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                        setTimeout(() => {
                            expect(helper.getElement('.e-editAlert-dlg')).toBeNull();
                            helper.setAnimationToNone('.e-hyperlink-dlg');
                            helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                            expect(helper.getElement('.e-hyperlink-dlg')).toBeNull();
                            done();
                        });
                    });
                });
            });
        });
        describe('I282699 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Prevent protected sheet dialog box', (done: Function) => {
                helper.getElement().focus();                
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    args.cancel = true;
                };
                spreadsheet.dataBind();
                helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [0, 0]));
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('spreadsheet');
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + ' .e-editAlert-dlg').classList).toContain('e-popup-close');
                    done();
                });
            });
        });
        describe('F161227, I264291 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Aggregate after open from json throw error issue and cell cannot be copy/paste after using openFromJson', (done: Function) => {
            //     const json: object = { "Workbook": { "sheets": [{ "rows": [{ "cells": [{ "value": "20" }, { "value": "10" }] }, { "cells":
            //         [{ "value": "5" }, { "value": "7" }] }], "selectedRange": "A1:B2" }] } };
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.openFromJson({ file: json });
            //     setTimeout((): void => {
            //         helper.getElement('#' + helper.id + '_aggregate').click();
            //         const aggregatePopup: HTMLElement = helper.getElement('#' + helper.id + '_aggregate-popup');
            //         expect(aggregatePopup.classList).toContain('e-popup-open');
            //         expect(aggregatePopup.firstElementChild.childElementCount).toBe(5);
            //         expect(aggregatePopup.querySelector('.e-item').textContent).toBe('Count: 4');
            //         helper.invoke('copy').then((): void => {
            //             helper.invoke('paste', ['C3']);
            //             setTimeout((): void => {
            //                 expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toBe('20');
            //                 expect(spreadsheet.sheets[0].rows[3].cells[3].value.toString()).toBe('7');
            //                 done();
            //             });
            //         });
            //     });
            // });
        });
        describe('F161227 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ allowResizing: false, enableContextMenu: false, allowUndoRedo: false, allowScrolling: false,
                    allowFindAndReplace: false, showRibbon: false, showFormulaBar: false, showSheetTabs: false, allowOpen: false, allowSave:
                    false, allowSorting: false, allowFiltering: false, allowNumberFormatting: false, allowHyperlink: false, allowInsert:
                    false, allowDelete: false, allowDataValidation: false, allowChart: false, allowConditionalFormat: false, height: 1500,
                    sheets: [{ isProtected: true, protectSettings: { selectCells: true, formatCells: false, formatRows: false, insertLink:
                        false, formatColumns: false }, rowCount: 16, rows: [{ cells: [{ image: [{ src:
                        "https://ravennaareachamber.com/wp-content/uploads/2017/03/your-company-lsiting.png", height: 70, width: 100,
                        top: 2, left: 10 }] }, { index: 2, value: 'LOCKED' }, { value: 'LOCKED' }] }, { cells: [{index: 2, value: 'LOCKED'
                        }, { value: 'UNLOCKED' }] }, { cells: [{ value: 'LOCKED' }, { value: 'LOCKED' }, { value: 'LOCKED' }, { value:
                        'LOCKED' }, { value: 'LOCKED' }] }, { index: 15, cells: [{ value: 'LOCKED' }, { index: 4, value: 'LOCKED' }] }] }],
                    beforeSelect: (args: BeforeSelectEventArgs): void => {
                        const range: number[] = getRangeIndexes(args.range);
                        const sheet: SheetModel = helper.getInstance().getActiveSheet();
                        const cell: CellModel = getCell(range[0], range[1], sheet);
                        if (sheet.isProtected) args.cancel = true;
                        if (cell && cell.isLocked == false) args.cancel = false;
                    },
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.merge("D2:E2"); spreadsheet.merge("A1:B3"); spreadsheet.merge("A4:E4");
                        spreadsheet.lockCells("D1", false); spreadsheet.lockCells("D3", false); spreadsheet.lockCells("A6:E15", false);
                        spreadsheet.lockCells("A17", false);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Preventing delete when a range contains locked cell', (done: Function) => {
                helper.getElement().focus();
                helper.invoke('selectRange', ['A6:D1'])
                setTimeout((): void => {
                    helper.triggerKeyNativeEvent(46);
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[0].image).toBeDefined();
                    expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBe('UNLOCKED');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].rowSpan).toBe(-2);
                    expect(spreadsheet.sheets[0].rows[2].cells[3].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[2].cells[3].isLocked).toBeFalsy();
                    (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in image.
                    done();
                });
            });
        });
    });
});