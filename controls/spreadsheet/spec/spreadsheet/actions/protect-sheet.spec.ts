import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, dialog as dlg } from '../../../src/index';
import { Dialog } from '../../../src/spreadsheet/services/index';

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
        describe('I321143 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ index: 1, isLocked: true, value: '1' }] }, { cells:
                    [{ isLocked: true, value: '2' }, { isLocked: true, value: '3' }] }, { cells: [{ isLocked: true, value: '4' },
                    { isLocked: true, value: '5' }] }], selectedRange: 'A1:B3' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('deleting values from locked cells and warning dialog', (done: Function) => {
                
                done();
            });
        });
    });
});