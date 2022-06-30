import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from '../../../src/spreadsheet/index';
import { L10n } from '@syncfusion/ej2-base';
import { getCell } from "../../../src/index";

describe('Auto fill ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Autofill drag is not working when autofill option buttion is visible', (done: Function) => {
            helper.invoke('selectRange', ['G10']);
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'G10']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [12, 6]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G10');
            expect(helper.invoke('getCell', [11, 6]).textContent).toBe('14');
            expect(helper.invoke('getCell', [12, 6]).textContent).toBe('15');
            td = helper.invoke('getCell', [15, 6]);
            coords = td.getBoundingClientRect();
            autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G13');
            expect(helper.invoke('getCell', [13, 6]).textContent).toBe('16');
            expect(helper.invoke('getCell', [14, 6]).textContent).toBe('17');
            expect(helper.invoke('getCell', [15, 6]).textContent).toBe('18');
            autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.triggerMouseAction('mouseup', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, document, autoFill);
            expect(instance.selectionModule.dAutoFillCell).toBe('G10:G13');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(3)');
            td = helper.invoke('getCell', [13, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            td = helper.invoke('getCell', [14, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            td = helper.invoke('getCell', [15, 6]);
            expect(td.textContent).toBe('');
            expect(td.style.fontWeight).toBe('bold');
            done();
        });
    });

    describe('Autofill getFillType Type - Down ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('fillType - CopyCells', (done: Function) => {
            helper.invoke('autoFill',['A4:A10','A1:A3','Down','CopyCells']);
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Item Name');
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [5, 0]).textContent).toBe('Sports Shoes');
            expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Item Name');
            expect(helper.invoke('getCell', [7, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [8, 0]).textContent).toBe('Sports Shoes');
            expect(helper.invoke('getCell', [9, 0]).textContent).toBe('Item Name');
            expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');
            done();
        });
        it('fillType - FillSeries', (done: Function) => {
            helper.invoke('autoFill',['G4:G10','G2:G3','Down','FillSeries']);
            expect(helper.invoke('getCell', [3, 6]).textContent).toBe('9');
            expect(helper.invoke('getCell', [4, 6]).textContent).toBe('13');
            expect(helper.invoke('getCell', [5, 6]).textContent).toBe('17');
            expect(helper.invoke('getCell', [6, 6]).textContent).toBe('21');
            expect(helper.invoke('getCell', [7, 6]).textContent).toBe('25');
            expect(helper.invoke('getCell', [8, 6]).textContent).toBe('29');
            expect(helper.invoke('getCell', [9, 6]).textContent).toBe('33');
            expect(helper.invoke('getCell', [10, 6]).textContent).toBe('9');
            done();
        });
        it('fillType - FillFormattingOnly', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'F2']);
            helper.invoke('autoFill',['F4:F10','F2:F3','Down','FillFormattingOnly']);
            expect(helper.invoke('getCell', [3, 5]).textContent).toBe('300');
                expect(helper.invoke('getCell', [3, 5]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [4, 5]).textContent).toBe('300');
                expect(helper.invoke('getCell', [4, 5]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [5, 5]).textContent).toBe('300');
                expect(helper.invoke('getCell', [5, 5]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [6, 5]).textContent).toBe('800');
                expect(helper.invoke('getCell', [6, 5]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [7, 5]).textContent).toBe('200');
                expect(helper.invoke('getCell', [7, 5]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [8, 5]).textContent).toBe('310');
                expect(helper.invoke('getCell', [8, 5]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [9, 5]).textContent).toBe('1210');
                expect(helper.invoke('getCell', [9, 5]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [10, 5]).textContent).toBe('500');
                expect(helper.invoke('getCell', [10, 5]).style.fontWeight).toBe('');
                done();
        });
        it('fillType - FillWithoutFormatting', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'G3']);
            helper.invoke('autoFill',['G4:G10','G2:G3','Down','FillWithoutFormatting']);
            expect(helper.invoke('getCell', [2, 6]).style.fontWeight).toBe('bold');
            expect(helper.invoke('getCell', [3, 6]).textContent).toBe('9');
                expect(helper.invoke('getCell', [3, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [4, 6]).textContent).toBe('13');
                expect(helper.invoke('getCell', [4, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [5, 6]).textContent).toBe('17');
                expect(helper.invoke('getCell', [5, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [6, 6]).textContent).toBe('21');
                expect(helper.invoke('getCell', [6, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [7, 6]).textContent).toBe('25');
                expect(helper.invoke('getCell', [7, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [8, 6]).textContent).toBe('29');
                expect(helper.invoke('getCell', [8, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [9, 6]).textContent).toBe('33');
                expect(helper.invoke('getCell', [9, 6]).style.fontWeight).toBe('');
                expect(helper.invoke('getCell', [10, 6]).textContent).toBe('9');
                expect(helper.invoke('getCell', [10, 6]).style.fontWeight).toBe('');
                done();
        });

    });
    describe('Autofill getFillType Type - Up ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('fillType - CopyCells', (done: Function) => {
            helper.invoke('autoFill',['A3:A1','A5:A4','Up','CopyCells']);
            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Formal Shoes');
            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Sandals & Floaters');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Formal Shoes');
            done();
        });
        it('fillType - FillSeries', (done: Function) => {
            helper.invoke('autoFill',['G3:G1','G5:G4','Up','FillSeries']);
            expect(helper.invoke('getCell', [0, 6]).textContent).toBe('-5');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('-1');
            expect(helper.invoke('getCell', [2, 6]).textContent).toBe('3');
            done();
        });
        it('fillType - FillFormattingOnly', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'F5']);
            helper.invoke('autoFill',['F3:F1','F5:F4','Up','FillFormattingOnly']);
            expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Amount');
            expect(helper.invoke('getCell', [0, 5]).style.fontWeight).toBe('');
            expect(helper.invoke('getCell', [1, 5]).textContent).toBe('200');
            expect(helper.invoke('getCell', [1, 5]).style.fontWeight).toBe('bold');
            expect(helper.invoke('getCell', [2, 5]).textContent).toBe('600');
            expect(helper.invoke('getCell', [2, 5]).style.fontWeight).toBe('');
            done();
        });
        it('fillType - FillWithoutFormatting', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'G5']);
            helper.invoke('autoFill',['G3:G1','G5:G4','Up','FillWithoutFormatting']);
            expect(helper.invoke('getCell', [0, 6]).textContent).toBe('-5');
            expect(helper.invoke('getCell', [0, 6]).style.fontWeight).toBe('');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('-1');
            expect(helper.invoke('getCell', [1, 6]).style.fontWeight).toBe('');
            expect(helper.invoke('getCell', [2, 6]).textContent).toBe('3');
            expect(helper.invoke('getCell', [2, 6]).style.fontWeight).toBe('');
            done();
        });
    });
    describe('Autofill getFillType Type - Left ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('fillType - CopyCells', (done: Function) => {
            helper.invoke('autoFill',['B3:A3','C3','Left','CopyCells']);
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('5:56:32 AM');
            expect(helper.invoke('getCell', [2, 1]).textContent).toBe('5:56:32 AM');
            done();
        });
        it('fillType - FillSeries', (done: Function) => {
            helper.invoke('autoFill',['B3:A3','C3','Left','FillSeries']);
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('3:56:32 AM');
            expect(helper.invoke('getCell', [2, 1]).textContent).toBe('4:56:32 AM');
            done();
        });
        it('fillType - FillFormattingOnly', (done: Function) => {
            helper.invoke('autoFill',['B4:A4','C4','Left','FillFormattingOnly']);
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Formal Shoes');
            expect(helper.invoke('getCell', [3, 1]).textContent).toBe('12:00:00 AM');
            const spreadsheet: Spreadsheet = helper.getInstance();
            var format=spreadsheet.sheets[0].rows[3].cells[1].format;
            expect(format).toBe('h:mm:ss AM/PM');
            format=spreadsheet.sheets[0].rows[3].cells[0].format;
            expect(format).toBe('h:mm:ss AM/PM');
            done();
        });
        it('fillType - FillWithoutFormatting', (done: Function) => {
            helper.invoke('autoFill',['B5:A5','C5','Left','FillWithoutFormatting']);
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('-1.817');
            expect(helper.invoke('getCell', [4, 1]).textContent).toBe('12/30/1899');
            const spreadsheet: Spreadsheet = helper.getInstance();
            var format=spreadsheet.sheets[0].rows[4].cells[1].format;
            expect(format).toBe('mm-dd-yyyy');
            format=spreadsheet.sheets[0].rows[4].cells[0].format;
            expect(format).toBe(undefined);
            done();
        });
    });
    describe('Autofill getFillType Type - Right ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('fillType - CopyCells', (done: Function) => {
            helper.invoke('autoFill',['D3:E3','C3','Right','CopyCells']);
            expect(helper.invoke('getCell', [2, 3]).textContent).toBe('5:56:32 AM');
            expect(helper.invoke('getCell', [2, 4]).textContent).toBe('5:56:32 AM');
            done();
        });
        it('fillType - FillSeries', (done: Function) => {
            helper.invoke('autoFill',['D3:E3','C3','Right','FillSeries']);
            expect(helper.invoke('getCell', [2, 3]).textContent).toBe('6:56:32 AM');
            expect(helper.invoke('getCell', [2, 4]).textContent).toBe('7:56:32 AM');
            done();
        });
        it('fillType - FillFormattingOnly', (done: Function) => {
            helper.invoke('autoFill',['D4:E4','C4','Right','FillFormattingOnly']);
            expect(helper.invoke('getCell', [3, 3]).textContent).toBe('12:00:00 AM');
            expect(helper.invoke('getCell', [3, 4]).textContent).toBe('12:00:00 AM');
            const spreadsheet: Spreadsheet = helper.getInstance();
            var format=spreadsheet.sheets[0].rows[3].cells[3].format;
            expect(format).toBe('h:mm:ss AM/PM');
            format=spreadsheet.sheets[0].rows[3].cells[4].format;
            expect(format).toBe('h:mm:ss AM/PM');
            done();
        });
        it('fillType - FillWithoutFormatting', (done: Function) => {
            helper.invoke('autoFill',['D5:E5','C5','Right','FillWithoutFormatting']);
            expect(helper.invoke('getCell', [4, 3]).textContent).toBe('1.308263888888889');
            expect(helper.invoke('getCell', [4, 4]).textContent).toBe('2.349930555555556');
            const spreadsheet: Spreadsheet = helper.getInstance();
            var format=spreadsheet.sheets[0].rows[4].cells[3].format;
            expect(format).toBe(undefined);
            format=spreadsheet.sheets[0].rows[4].cells[4].format;
            expect(format).toBe(undefined);
            done();
        });
    });
    describe('Autofill with Freezepane ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Autofill with Freezepane - Right position', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(3,3,0);
            setTimeout(function () {
            helper.invoke('autoFill',['D3:E3','C3','Right','FillSeries']);
            expect(helper.invoke('getCell', [2, 3]).textContent).toBe('6:56:32 AM');
            expect(helper.invoke('getCell', [2, 4]).textContent).toBe('7:56:32 AM');
            done();
            },0);
        });
        it('Autofill with Freezepane - down position', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(3,3,0);
            helper.invoke('autoFill',['A3:A5','A2','Down','CopyCells']);
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
            done();
        });
    });
    describe('Not Providing Fill range and Data range in autofill ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Not Providing Fill range in autofill', (done: Function) => {
            helper.invoke('autoFill',[null,'C3','Right','FillSeries']);
            expect(helper.invoke('getCell', [2, 3]).textContent).not.toBe('6:56:32 AM');
            expect(helper.invoke('getCell', [2, 4]).textContent).not.toBe('7:56:32 AM');
            done();
        });
        it('Not Providing Data range in autofill', (done: Function) => {
            helper.invoke('autoFill',['D4:D6',null,'Down','FillSeries']);
            expect(helper.invoke('getCell', [3, 3]).textContent).toBe('Item Name');
            expect(helper.invoke('getCell', [4, 3]).textContent).toBe('Item Name');
            expect(helper.invoke('getCell', [5, 3]).textContent).toBe('Item Name');
            done();
        });
    });

    //----- Autofill method is not working for merge cell option ----//

    // describe('Apply Autofill for merged cell ->', () => {
    //     beforeAll((done: Function) => {
    //         helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
    //     });
    //     afterAll(() => {
    //         helper.invoke('destroy');
    //     });

    //     it('Apply Autofill for merged cell', (done: Function) => {
    //         const spreadsheet: Spreadsheet = helper.getInstance();
    //         spreadsheet.merge('B2:B3');
    //         helper.invoke('autoFill',['B3:B7','B2','Down','FillSeries']);
    //         expect(helper.invoke('getCell', [4, 1]).textContent).toBe('2/16/2014');
    //         expect(helper.invoke('getCell', [6, 1]).textContent).toBe('2/18/2014');
    //         done();
    //     });
    // });

    //------------- Autofill method is not working properly for locked cells --------------------------//

    // describe('Apply autofill for locked cells ->', () => {
    //     beforeAll((done: Function) => {
    //         helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
    //     });
    //     afterAll(() => {
    //         helper.invoke('destroy');
    //     });

    //     it('Apply autofill for locked cells', (done: Function) => {
    //         const spreadsheet: Spreadsheet = helper.getInstance();
    //         spreadsheet.protectSheet('Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
    //         helper.invoke('autoFill',['A3:A5','A2','Down','CopyCells']);
    //         expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
    //         expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Formal Shoes');
    //         expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Sandals & Floaters');
    //         done();
    //     });
    // });

    describe('Autofill for refresh method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Autofill for refresh method ', (done: Function) => {
            helper.invoke('autoFill',['A3:A5','A2','Down','CopyCells']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.refresh(false);
            setTimeout(() => {
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Casual Shoes');
            done();
            },0);
        });
    });

    describe('Autofill for refresh method ->', () => {
        L10n.load({
            'de-DE': {
                'spreadsheet': {
                    "FillSeries": "Fill Series",
                    "CopyCells": "Copy Cells",
                    "FillFormattingOnly": "Fill Formatting Only",
                    "FillWithoutFormatting": "Fill Without Formatting",
                }
            }
        });
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],locale: 'de-DE' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Autofill for refresh method ', (done: Function) => {
            helper.invoke('autoFill',['A3:A5','A2','Down','CopyCells']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.refresh(false);
            setTimeout(() => {
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Casual Shoes');
            done();
            },0);
        });
    });




    describe('CR Issues ->', () => {
        describe('EJ2-56558, EJ2-60197 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Auto fill does not hide when selection is in hidden range after undo & redo on filtered rows', (done: Function) => {
                helper.invoke('applyFilter').then(() => {
                    const btn: HTMLElement = helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon');
                    const coords = btn.getBoundingClientRect();
                    helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top + 1 }, null, btn);
                    helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, btn);
                    setTimeout(() => {
                        setTimeout(() => {
                            helper.click('.e-filter-popup .e-ftrchk:nth-child(2) .e-chk-hidden');
                            helper.click('.e-filter-popup .e-ftrchk:nth-child(3) .e-chk-hidden');
                            helper.click('.e-filter-popup .e-primary');
                            setTimeout(() => {
                                helper.click('#spreadsheet_undo');
                                helper.invoke('selectRange', ['D4']);
                                helper.click('#spreadsheet_redo');
                                setTimeout(() => {
                                    const autofill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                                    expect(autofill.classList).toContain('e-hide');
                                    expect(getComputedStyle(autofill).display).toBe('none');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            it('The formula with an empty space before the cell reference is not updated properly while performing autofill', (done: Function) => {
                const instance: any = helper.getInstance();
                helper.invoke('selectRange', ['I1']);
                helper.edit('I1', '=IF($I2="Other", $J2, CONCAT($I2: $J2))');
                let autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 8]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                instance.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                instance.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                helper.invoke('selectRange', ['I1']);
                td = helper.invoke('getCell', [0, 9]);
                coords = td.getBoundingClientRect();
                autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                instance.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                instance.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(getCell(1, 8, instance.sheets[0]).formula).toBe('=IF($I3="Other", $J3, CONCAT($I3: $J3))');
                expect(getCell(0, 9, instance.sheets[0]).formula).toBe('=IF($I2="Other", $J2, CONCAT($I2: $J2))');
                done();
            });
        });
    });
});