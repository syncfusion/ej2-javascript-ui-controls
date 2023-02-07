import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from '../../../src/spreadsheet/index';
import { L10n } from '@syncfusion/ej2-base';
import { getCell, ProtectSettingsModel } from "../../../src/index";

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
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('0.183263889');
            expect(helper.invoke('getCell', [4, 1]).textContent).toBe('1/1/1900');
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
            expect(helper.invoke('getCell', [4, 3]).textContent).toBe('0.308263889');
            expect(helper.invoke('getCell', [4, 4]).textContent).toBe('0.349930556');
            const spreadsheet: Spreadsheet = helper.getInstance();
            const cells: any[] = spreadsheet.sheets[0].rows[4].cells;
            expect(cells[3].format).toBeUndefined();
            expect(cells[3].value).toBe(0.3082638888888889);
            expect(cells[4].format).toBeUndefined();
            expect(cells[4].value).toBe(0.34993055555555563);
            done();
        });
        it('Fill series right with date and currency cells', (done: Function) => {
            helper.invoke('updateCell', [{ value: '9/4/2015', format: 'mm-dd-yyyy' }, 'A14']);
            helper.invoke('updateCell', [{ value: '13853.09', format: '$#,##0.00' }, 'B14']);
            helper.invoke('autoFill', ['C14:D14', 'A14:B14', 'Right', 'FillSeries']);
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[13].cells[2].format).toBe('mm-dd-yyyy');
            expect(spreadsheet.sheets[0].rows[13].cells[2].value).toBe(42252);
            expect(helper.invoke('getCell', [13, 2]).textContent).toBe('9/5/2015');
            expect(spreadsheet.sheets[0].rows[13].cells[3].format).toBe('$#,##0.00');
            expect(spreadsheet.sheets[0].rows[13].cells[3].value).toBe(13854.09);
            expect(helper.invoke('getCell', [13, 3]).textContent).toBe('$13,854.09');
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

    describe('Autofill using Autofill Button', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Fill Type - Copy Cells', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'A1']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [5, 0]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [1, 0]).style.fontWeight).toBe('bold');
                done();
            });
        });
        it('Fill Type - Fill Series', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [5, 3]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(2)');
                expect(helper.invoke('getCell', [2, 3]).textContent).toBe('11');
                done();
            });
        });
        it('Fill Type - Fill Without Formatting', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'B1']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [5, 1]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(3)');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('Date');
                expect(helper.invoke('getCell', [1, 1]).style.fontWeight).not.toBe('bold');
                done();
            });
        });
        it('Fill Type - Fill Series - Up Direction', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(2)');
                expect(helper.invoke('getCell', [6, 7]).textContent).toBe('51');
                done();
            });
        });
        it('Fill Type - Fill Series - Right Direction', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [10, 10]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 10]).textContent).toBe('58');
                done();
            });
        });
        it('Fill Type - Fill Series - Left Direction', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [10, 5]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 5]).textContent).toBe('53');
                done();
            });
        });
        it('Apply Redo after Autofill', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'B1']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [2, 1]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 1]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [2, 1]).style.fontWeight).toBe('bold');
                helper.click('#spreadsheet_undo');
                expect(helper.invoke('getCell', [1, 1]).style.fontWeight).not.toBe('bold');
                expect(helper.invoke('getCell', [2, 1]).style.fontWeight).not.toBe('bold');
                helper.click('#spreadsheet_redo');
                expect(helper.invoke('getCell', [1, 1]).style.fontWeight).toBe('bold');
                expect(helper.invoke('getCell', [2, 1]).style.fontWeight).toBe('bold');
                done();
            });
        });
    });

    describe('Autofill for Merged cell', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Right - Direction', (done: Function) => {
            helper.invoke('selectRange', ['E6:F7']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('E6:F7');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 6]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [5, 6]).textContent).toBe('11');
                done();
            });
        });
        it('Up - Direction', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [4, 4]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [3, 4]).textContent).toBe('9');
                done();
            });
        });
        it('Left - Direction', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 3]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [5, 2]).textContent).toBe('9');
                done();
            });
        });
        it('Down - Direction', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [7, 5]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [7, 4]).textContent).toBe('11');
                done();
            });
        });
        it('Alert Message for Merged Cell', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('N5:Q11');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 20]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.setAnimationToNone('.e-dialog');
                var dialog = helper.getElement('.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Close Alert Message Dialog by Clicking Ok Button', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('N5:Q11');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 20]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.setAnimationToNone('.e-dialog');
                var dialog = helper.getElement('.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-dialog')).toBeNull();
                    done();
                });
            });
        });
        it('Close Alert Message Dialog by Clicking Close Button', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('N5:Q11');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 20]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.setAnimationToNone('.e-dialog');
                var dialog = helper.getElement('.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.click('.e-dialog .e-dlg-closeicon-btn');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-dialog')).toBeNull();
                    done();
                });
            });
        });
    });

    describe('Apply Autofill by Keyboard ShortCuts', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Down - Direction with more than one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2:D3']);
            helper.triggerKeyNativeEvent(68, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 3]).textContent).toBe('10');
                done();
            });
        });
        it('Down - Direction with Top Left Cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(68, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
        it('Down - Direction with one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(68, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('Quantity');
                done();
            });
        });
        it('Right - Direction with more than one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2:F2']);
            helper.triggerKeyNativeEvent(82, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('Quantity');
                expect(helper.invoke('getCell', [1, 4]).textContent).toBe('Quantity');
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('Quantity');
                done();
            });
        });
        it('Right - Direction with Top Left Cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(82, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                done();
            });
        });
        it('Right - Direction with one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(82, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('11:34:32 AM');
                done();
            });
        });
        it('Apply Autofill with Protect Sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');    
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                helper.click('.e-protect-dlg .e-primary');
                helper.triggerKeyNativeEvent(82, true);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 4]).textContent).toBe('Quantity');
                    done();
                });
            });
        });
    });

    describe('getAutoFillRange Method', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Autofill Morethan one Cell in Up - Direction', (done: Function) => {
            helper.invoke('selectRange', ['H11:H9']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [5, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [5, 7]).textContent).toBe('55');
                done();
            });
        });
        it('Autofill Morethan one Cell in Up - Direction - II', (done: Function) => {
            helper.invoke('selectRange', ['H9:H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [5, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [5, 7]).textContent).toBe('55');
                done();
            });
        });
        it('Autofill Morethan one Cell in Left - Direction', (done: Function) => {
            helper.invoke('selectRange', ['H11:G10']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [10, 5]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [10, 5]).textContent).toBe('9');
                done();
            });
        });
        it('Autofill Morethan one Cell in Right - Direction', (done: Function) => {
            helper.invoke('selectRange', ['G10:H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [10, 8]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [10, 8]).textContent).toBe('9');
                done();
            });
        });
        it('Autofill Morethan one Column in Up - Direction', (done: Function) => {
            helper.invoke('selectRange', ['G10:H11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [8, 7]).textContent).toBe('166');
                done();
            });
        });
        it('Apply Autofill for Hidden Row', (done: Function) => {
            helper.invoke('hideRow', [2]);
            helper.invoke('selectRange', ['A2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [3, 0]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe('Casual Shoes');
                done();
            });
        });
        it('Apply Autofill for Hidden Column', (done: Function) => {
            helper.invoke('hideColumn', [2]);
            helper.invoke('selectRange', ['B2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [1, 3]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                helper.click('#spreadsheet_autofilloptionbtn');
                helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('2/14/2014');
                done();
            });
        });
        it('Cancelling Autofill in action begin event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'autofill') {  
                        args.args.eventArgs.cancel = true; }
                }
            helper.invoke('selectRange', ['A4']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [4, 0]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Sandals & Floaters');
                done();
            });
        });
    });

    describe('Appy Autofill for cell after Freeze Pane', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Appy Autofill for cell after Freeze Pane', (done: Function) => {
            helper.invoke('selectRange', ['D4']);
            helper.invoke('freezePanes', [3, 3]);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [4, 3]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [4, 3]).textContent).toBe('21');
                    done();
                });
            });
        });
        it('Appy Autofill for cell before Freezed Column', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 2]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 2]).textContent).toBe('1:32:44 AM');
                    done();
                });
            });
        });
        it('Appy Autofill for cell before Freezed Column and Freezed Row with Up Direction', (done: Function) => {
            helper.invoke('selectRange', ['C2']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [0, 2]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 2]).textContent).toBe('12:32:44 AM');
                    done();
                });
            });
        });
        it('Appy Autofill for cell before Freezed Column and Freezed Row with Down Direction', (done: Function) => {
            helper.invoke('selectRange', ['C2']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [2, 2]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 2]).textContent).toBe('2:32:44 AM');
                    done();
                });
            });
        });
        it('Appy Autofill for cell After Freezed Column and before Freezed Row with Right Direction', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [0, 6]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 6]).textContent).toBe('Quantity');
                    done();
                });
            });
        });
        it('Appy Autofill for cell before Freezed Row and After Freezed Column', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 3]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 3]).textContent).toBe('19');
                    helper.switchRibbonTab(5);
                    helper.click('#' + helper.id + '_freezepanes');
                    done();
                });
            });
        });
        it('Appy Autofill for Whole Column after Freeze Pane', (done: Function) => {
            helper.invoke('selectRange', ['D1:D200']);
            helper.invoke('freezePanes', [0, 3]);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [0, 4]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 4]).textContent).toBe('Quantity');
                    done();
                });
            });
        });
    });

    describe('Apply Autofill', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply fillseries for alphanumeric characters', (done: Function) => {
            helper.edit('I1', 'Apple@123');
            helper.invoke('selectRange', ['I1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 8]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Apple@124');
                    done();
                });
            });
        });
        it('Apply fillseries for CF applied Cells', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('31%');
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [2, 7]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 7]).textContent).toBe('11');
                    expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                    done();
                });
            });
        });
        it('Apply copy cells for CF applied Cells', (done: Function) => {
            helper.invoke('selectRange', ['H3']);
            expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('17%');
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [3, 7]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    helper.click('#spreadsheet_autofilloptionbtn');
                    helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                    expect(helper.invoke('getCell', [3, 7]).textContent).toBe('11');
                    expect(helper.invoke('getCell', [3, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                    done();
                });
            });
        });
        it('Apply autofill for string starting with Number', (done: Function) => {
            helper.edit('J1', '1 Test');
            helper.invoke('selectRange', ['J1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 9]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 9]).textContent).toBe('2 Test');
                    done();
                });
            });
        });
        it('Apply autofill for string Ending with Number', (done: Function) => {
            helper.edit('K1', 'Test 1');
            helper.invoke('selectRange', ['K1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 10]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Test 2');
                    done();
                });
            });
        });
        it('Apply autofill for formula', (done: Function) => {
            helper.edit('L1', '=SUM(H2:H11)');
            expect(helper.invoke('getCell', [0, 11]).textContent).toBe('499');
            helper.invoke('selectRange', ['L1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [2, 11]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 11]).textContent).toBe('489');
                    done();
                });
            });
        });
        it('Apply autofill for formula with Vertical Fill', (done: Function) => {
            helper.edit('M3', '=SUM(H2:H11)');
            expect(helper.invoke('getCell', [2, 12]).textContent).toBe('499');
            helper.invoke('selectRange', ['M3']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [0, 12]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 12]).textContent).toBe('#REF!');
                    done();
                });
            });
        });
        it('Apply autofill for formula having "!"', (done: Function) => {
            helper.edit('N1', '=(! A2+ H2)');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=(! A3+ H3)');
                    done();
                });
            });
        });
        it('Apply autofill for formula having "-"', (done: Function) => {
            helper.edit('N1', '=-5+10');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=-5+10');
                    expect(helper.invoke('getCell', [1, 13]).textContent).toBe('5');
                    done();
                });
            });
        });
        it('Apply autofill for formula having ">"', (done: Function) => {
            helper.edit('N1', '=IF(10>5, 15+5)');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=IF(10>5, 15+5)');
                    expect(helper.invoke('getCell', [1, 13]).textContent).toBe('20');
                    done();
                });
            });
        });
        it('Apply autofill for formula having "<"', (done: Function) => {
            helper.edit('N1', '=IF(10<20, 15-5)');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=IF(10<20, 15-5)');
                    expect(helper.invoke('getCell', [1, 13]).textContent).toBe('10');
                    done();
                });
            });
        });
        it('Apply autofill for formula having "*, / and &"', (done: Function) => {
            helper.edit('N1', '=((10*2)&(10/2))');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=((10*2)&(10/2))');
                    expect(helper.invoke('getCell', [1, 13]).textContent).toBe('205');
                    done();
                });
            });
        });
        it('Apply autofill for formula having "% and ^"', (done: Function) => {
            helper.edit('N1', '=((10^2)&(10%2))');
            helper.invoke('selectRange', ['N1']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 13]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[13].formula).toEqual('=((10^2)&(10%2))');
                    expect(helper.invoke('getCell', [1, 13]).textContent).toBe('100,1,2');
                    done();
                });
            });
        });
    }); 

    describe('CR Issues ->', () => {
        describe('EJ2-56558, EJ2-60197 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'E1' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Auto fill does not hide when selection is in hidden range after undo & redo on filtered rows', (done: Function) => {
                helper.invoke('applyFilter').then(() => {
                    const td: HTMLTableCellElement = helper.invoke('getCell', [0, 4]);
                    helper.invoke('selectRange', ['E1']);
                    helper.invoke('getCell', [0, 4]).focus();
                    helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
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
    describe('EJ2-66414', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [
                    {
                        name: 'Price Details',
                        rows: [{ cells: [{ value: '11' }] }],
                    }
                ],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    let protectSetting: ProtectSettingsModel = {
                        selectCells: true,
                        formatCells: false,
                        formatRows: false,
                        formatColumns: false,
                        insertLink: false
                    }
                    spreadsheet.protectSheet("Price Details", protectSetting);
                    spreadsheet.lockCells('A1:Z1', false);
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Autofill is not working as expected for unlocked cells while the sheet is protected on keyboard interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:F1']);
            helper.triggerKeyNativeEvent(82, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('11');
                expect(helper.invoke('getCell', [0, 2]).textContent).toBe('11');
                expect(helper.invoke('getCell', [0, 3]).textContent).toBe('11');
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('11');
                done();
            });
        });
        it('Edit alert Dialog shown while the autofill applied on locked cell and the sheet is protected on keyboard interaction', (done: Function) => {
            helper.invoke('selectRange', ['A1:C3']);
            helper.triggerKeyNativeEvent(82, true);
            setTimeout(() => {
                var dialog = helper.getElement('.e-editAlert-dlg.e-dialog');
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                    "The cell you're trying to change is protected. To make change, unprotect the sheet.");
                done();
            });
        });
    });
});