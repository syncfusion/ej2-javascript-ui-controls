import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from '../../../src/spreadsheet/index';
import { L10n } from '@syncfusion/ej2-base';
import { CellModel, getCell, ProtectSettingsModel, refreshCell, setRow } from "../../../src/index";

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
        it('fillType - FillSeries Having Text and Integer preceeds with 0 as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 001');
            helper.invoke('autoFill',['J3:J11','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Adjustment 002');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('Adjustment 003');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Adjustment 004');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('Adjustment 006');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('Adjustment 008');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('Adjustment 009');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('Adjustment 010');
            done();
        });
        it('fillType - FillSeries Input Having 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('K2', 'Adjustment 001');
            helper.edit('K3', 'Adjustment 003');
            helper.invoke('autoFill',['K4:K10','K2:K3','Down','FillSeries']);
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('Adjustment 009');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('Adjustment 011');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('Adjustment 013');
            expect(helper.invoke('getCell', [8, 10]).textContent).toBe('Adjustment 015');
            expect(helper.invoke('getCell', [9, 10]).textContent).toBe('Adjustment 017');
            done();
        });
        it('fillType - FillSeries Input Having more than 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('L2', 'Adjustment 001');
            helper.edit('L3', 'Adjustment 005');
            helper.edit('L4', 'Adjustment 009');
            helper.invoke('autoFill',['L5:L10','L2:L4','Down','FillSeries']);
            expect(helper.invoke('getCell', [4, 11]).textContent).toBe('Adjustment 013');
            expect(helper.invoke('getCell', [5, 11]).textContent).toBe('Adjustment 017');
            expect(helper.invoke('getCell', [6, 11]).textContent).toBe('Adjustment 021');
            expect(helper.invoke('getCell', [7, 11]).textContent).toBe('Adjustment 025');
            expect(helper.invoke('getCell', [8, 11]).textContent).toBe('Adjustment 029');
            expect(helper.invoke('getCell', [9, 11]).textContent).toBe('Adjustment 033');
            done();
        });
        it('fillType - FillSeries Having mix of text and integer as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 01 Adjust 005');
            helper.invoke('autoFill',['J3:J11','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Adjustment 01 Adjust 006');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('Adjustment 01 Adjust 007');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Adjustment 01 Adjust 008');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('Adjustment 01 Adjust 009');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('Adjustment 01 Adjust 010');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('Adjustment 01 Adjust 011');
            done();
        });
        it('fillType - FillSeries Having preceeds with integer and  mix of text and integer as input', (done: Function) => {
            helper.edit('J2', '001 Ad 01 Adjust 002');
            helper.invoke('autoFill',['J3:J8','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('2 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('3 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('4 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('5 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('6 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('7 Ad 01 Adjust 002');
            done();
        });
        it('fillType - FillSeries input having without space.', (done: Function) => {
            helper.edit('J2', '001ADJUST007');
            helper.invoke('autoFill',['J3:J8','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('001ADJUST008');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('001ADJUST009');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('001ADJUST010');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('001ADJUST011');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('001ADJUST012');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('001ADJUST013');
            done();
        });
        it('fillType - FillSeries input having with space inbetween', (done: Function) => {
            helper.edit('J2', '001 ADJUST007');
            helper.invoke('autoFill',['J3:J8','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('2 ADJUST007');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('3 ADJUST007');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('4 ADJUST007');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('5 ADJUST007');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('6 ADJUST007');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('7 ADJUST007');
            done();
        });
        it('fillType - FillSeries input with space inbetween of mix of text and integer', (done: Function) => {
            helper.edit('J2', '001ADJUST 005 ADJUST004');
            helper.invoke('autoFill',['J3:J8','J2','Down','FillSeries']);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('001ADJUST 005 ADJUST005');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('001ADJUST 005 ADJUST006');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('001ADJUST 005 ADJUST007');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('001ADJUST 005 ADJUST008');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('001ADJUST 005 ADJUST009');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('001ADJUST 005 ADJUST010');
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
        it('fillType - FillSeries Having Text and Integer preceeds with 0 as input', (done: Function) => {
            helper.edit('J7', 'Adjustment 001');
            helper.invoke('autoFill',['J6:J2','J7','Up','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 004');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Adjustment 003');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('Adjustment 002');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Adjustment 001');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('Adjustment 000');
            done();
        });
        it('fillType - FillSeries Having mix of text and integer as input', (done: Function) => {
            helper.edit('J7', 'Adjustment 01 Adjust 005');
            helper.invoke('autoFill',['J6:J2','J7','Up','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 01 Adjust 000');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Adjustment 01 Adjust 001');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('Adjustment 01 Adjust 002');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Adjustment 01 Adjust 003');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('Adjustment 01 Adjust 004');
            done();
        });
        it('fillType - FillSeries Having preceeds with integer and  mix of text and integer as input', (done: Function) => {
            helper.edit('J8', '001 Ad 01 Adjust 002');
            helper.invoke('autoFill',['J7:J2','J8','Up','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('5 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('4 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('3 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('2 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('1 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('0 Ad 01 Adjust 002');
            done();
        });
        it('fillType - FillSeries Input Having 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('K9', 'Adjustment 001');
            helper.edit('K10', 'Adjustment 003');
            helper.invoke('autoFill',['K8:K2','K10:K9','Up','FillSeries']);
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 013');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('Adjustment 011');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('Adjustment 009');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('Adjustment 003');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('Adjustment 001');
            done();
        });
        it('fillType - FillSeries Input Having more than 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('K8', 'Adjustment 001');
            helper.edit('K9', 'Adjustment 005');
            helper.edit('K10', 'Adjustment 009');
            helper.invoke('autoFill',['K7:K2','K10:K8','Up','FillSeries']);
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 023');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('Adjustment 019');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('Adjustment 015');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('Adjustment 011');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('Adjustment 003');
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
            expect(format).toBe('m/d/yyyy');
            format=spreadsheet.sheets[0].rows[4].cells[0].format;
            expect(format).toBe(undefined);
            done();
        });
        it('fillType - FillSeries Having Text and Integer preceeds with 0 as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 001');
            helper.invoke('autoFill',['J2:E2','J2','Left','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 000');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Adjustment 001');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('Adjustment 002');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('Adjustment 003');
            expect(helper.invoke('getCell', [1, 5]).textContent).toBe('Adjustment 004');
            done();
        });
        it('fillType - FillSeries Having mix of text and integer as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 01 Adjust 005');
            helper.invoke('autoFill',['J2:E2','J2','Left','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 01 Adjust 004');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Adjustment 01 Adjust 003');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('Adjustment 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('Adjustment 01 Adjust 001');
            expect(helper.invoke('getCell', [1, 5]).textContent).toBe('Adjustment 01 Adjust 000');
            done();
        });
        it('fillType - FillSeries Having preceeds with integer and  mix of text and integer as input', (done: Function) => {
            helper.edit('J2', '001 Ad 01 Adjust 002');
            helper.invoke('autoFill',['J2:E2','J2','Left','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('0 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('1 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('2 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('3 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 5]).textContent).toBe('4 Ad 01 Adjust 002');
            done();
        });
        it('fillType - FillSeries Input Having 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('K2', 'Adjustment 001');
            helper.edit('J2', 'Adjustment 003');
            helper.invoke('autoFill',['K2:E2','K2:J2','Left','FillSeries']);
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Adjustment 009');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('Adjustment 011');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('Adjustment 013');
            done();
        });
        it('fillType - FillSeries Input Having more than 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('L2', 'Adjustment 001');
            helper.edit('K2', 'Adjustment 005');
            helper.edit('J2', 'Adjustment 009');
            helper.invoke('autoFill',['L2:E2','L2:J2','Left','FillSeries']);
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('Adjustment 013');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 017');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 021');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Adjustment 025');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('Adjustment 029');
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
        it('fillType - FillSeries Having Text and Integer preceeds with 0 as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 001');
            helper.invoke('autoFill',['J2:O2','J2','Right','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 002');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 003');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('Adjustment 004');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('Adjustment 006');
            done();
        });
        it('fillType - FillSeries Having mix of text and integer as input', (done: Function) => {
            helper.edit('J2', 'Adjustment 01 Adjust 005');
            helper.invoke('autoFill',['J2:O2','J2','Right','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('Adjustment 01 Adjust 006');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 01 Adjust 007');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('Adjustment 01 Adjust 008');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('Adjustment 01 Adjust 009');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('Adjustment 01 Adjust 010');
            done();
        });
        it('fillType - FillSeries Having preceeds with integer and  mix of text and integer as input', (done: Function) => {
            helper.edit('J2', '001 Ad 01 Adjust 002');
            helper.invoke('autoFill',['J2:O2','J2','Right','FillSeries']);
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('2 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('3 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('4 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('5 Ad 01 Adjust 002');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('6 Ad 01 Adjust 002');
            done();
        });
        it('fillType - FillSeries Input Having 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('J2', 'Adjustment 001');
            helper.edit('K2', 'Adjustment 003');
            helper.invoke('autoFill',['K2:O2','J2:K2','Right','FillSeries']);
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Adjustment 005');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('Adjustment 007');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('Adjustment 009');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('Adjustment 011');
            done();
        });
        it('fillType - FillSeries Input Having more than 2 cells of Text and Integer preceeds with 0', (done: Function) => {
            helper.edit('J2', 'Adjustment 001');
            helper.edit('K2', 'Adjustment 005');
            helper.edit('L2', 'Adjustment 009');
            helper.invoke('autoFill',['L2:P2','J2:L2','Right','FillSeries']);
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('Adjustment 013');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('Adjustment 017');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('Adjustment 021');
            expect(helper.invoke('getCell', [1, 14]).textContent).toBe('Adjustment 025');
            expect(helper.invoke('getCell', [1, 15]).textContent).toBe('Adjustment 029');
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
    describe('Autofill with scrolling on wrap cells (Cells outside the viewport) ->', () => {
        let spreadsheet: Spreadsheet; let sheet: any; let virtualTrack: HTMLElement;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ topLeftCell: 'A75', columns: [{ width: 180 }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Fill series down', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.updateCell({ value: 'Romona Heaslip Hello Taurus Pink Cargo jnwdnnc' }, 'A2');
            sheet = spreadsheet.sheets[0];
            expect(sheet.topLeftCell).toBe('A75');
            expect(sheet.rows[1].cells[0].wrap).toBeUndefined();
            expect(sheet.rows[1].height).toBeUndefined();
            expect(sheet.rows[1].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            virtualTrack = helper.getElementFromSpreadsheet('.e-sheet-content .e-virtualtrack');
            expect(virtualTrack.style.height).toBe('2200px');
            helper.invoke('wrap', ['A2:A2']);
            expect(virtualTrack.style.height).toBe('2218px');
            expect(sheet.rows[1].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[1].height).toBe(38);
            expect(sheet.rows[2]).toBeUndefined();
            helper.invoke('autoFill', ['A3:A80', 'A2', 'Down', 'FillSeries']);
            expect(sheet.topLeftCell).toBe('A75');
            expect(virtualTrack.style.height).toBe('3622px');
            expect(sheet.rows[2].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[2].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[2].height).toBe(38);
            expect(sheet.rows[30].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[30].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[30].height).toBe(38);
            expect(sheet.rows[51].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[51].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[51].height).toBe(38);
            expect(sheet.rows[65].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[65].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[65].height).toBe(38);
            expect(sheet.rows[79].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[79].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[79].height).toBe(38);
            done();
        });
        it('Fill without formatting down', (done: Function) => {
            helper.invoke('wrap', ['A3:A80', false]);
            expect(virtualTrack.style.height).toBe('2218px');
            helper.invoke('autoFill', ['A3:A80', 'A2', 'Down', 'FillWithoutFormatting']);
            expect(sheet.topLeftCell).toBe('A75');
            expect(virtualTrack.style.height).toBe('2218px');
            expect(sheet.rows[2].cells[0].wrap).toBeFalsy();
            expect(sheet.rows[2].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[2].height).toBe(20);
            expect(sheet.rows[30].cells[0].wrap).toBeFalsy();
            expect(sheet.rows[30].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[30].height).toBe(20);
            expect(sheet.rows[51].cells[0].wrap).toBeFalsy();
            expect(sheet.rows[51].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[51].height).toBe(20);
            expect(sheet.rows[65].cells[0].wrap).toBeFalsy();
            expect(sheet.rows[65].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[65].height).toBe(20);
            expect(sheet.rows[79].cells[0].wrap).toBeFalsy();
            expect(sheet.rows[79].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[79].height).toBe(20);
            done();
        });
        it('Fill formatting only down', (done: Function) => {
            helper.invoke('autoFill', ['A3:A80', 'A2', 'Down', 'FillFormattingOnly']);
            expect(sheet.topLeftCell).toBe('A75');
            expect(virtualTrack.style.height).toBe('3622px');
            expect(sheet.rows[2].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[2].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[2].height).toBe(38);
            expect(sheet.rows[30].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[30].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[30].height).toBe(38);
            expect(sheet.rows[51].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[51].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[51].height).toBe(38);
            expect(sheet.rows[65].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[65].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[65].height).toBe(38);
            expect(sheet.rows[79].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[79].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[79].height).toBe(38);
            done();
        });
        it('Copy cells down', (done: Function) => {
            helper.invoke('wrap', ['A3:A80', false]);
            expect(virtualTrack.style.height).toBe('2218px');
            helper.invoke('autoFill', ['A3:A80', 'A2', 'Down', 'CopyCells']);
            expect(sheet.topLeftCell).toBe('A75');
            expect(virtualTrack.style.height).toBe('3622px');
            expect(sheet.rows[2].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[2].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[2].height).toBe(38);
            expect(sheet.rows[30].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[30].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[30].height).toBe(38);
            expect(sheet.rows[51].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[51].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[51].height).toBe(38);
            expect(sheet.rows[65].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[65].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[65].height).toBe(38);
            expect(sheet.rows[79].cells[0].wrap).toBeTruthy();
            expect(sheet.rows[79].cells[0].value).toBe('Romona Heaslip Hello Taurus Pink Cargo jnwdnnc');
            expect(sheet.rows[79].height).toBe(38);
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
            expect(helper.invoke('getCell', [2, 3]).textContent).toBe('10');
            done();
        });
        it('Down - Direction with Top Left Cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(68, true);
            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
            done();
        });
        it('Down - Direction with one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(68, true);
            expect(helper.invoke('getCell', [1, 3]).textContent).toBe('Quantity');
            helper.edit('D12', '=SUM(D2:D11)');
            expect(helper.getInstance().sheets[0].rows[11].cells[3].formula).toBe('=SUM(D2:D11)');
            expect(helper.invoke('getCell', [11, 3]).textContent).toBe('257');
            helper.invoke('selectRange', ['D13']);
            helper.triggerKeyNativeEvent(68, true);
            expect(helper.getInstance().sheets[0].rows[12].cells[3].formula).toBe('=SUM(D3:D12)');
            expect(helper.invoke('getCell', [12, 3]).textContent).toBe('514');
            done();
        });
        it('Right - Direction with more than one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2:F2']);
            helper.triggerKeyNativeEvent(82, true);
            expect(helper.invoke('getCell', [1, 3]).textContent).toBe('Quantity');
            expect(helper.invoke('getCell', [1, 4]).textContent).toBe('Quantity');
            expect(helper.invoke('getCell', [1, 5]).textContent).toBe('Quantity');
            helper.edit('I4', '=SUM(D4:H4)');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toBe('=SUM(D4:H4)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('369');
            helper.invoke('selectRange', ['I4:J4']);
            helper.triggerKeyNativeEvent(82, true);
            expect(helper.getInstance().sheets[0].rows[3].cells[9].formula).toBe('=SUM(E4:I4)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('718');
            done();
        });
        it('Right - Direction with Top Left Cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(82, true);
            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
            done();
        });
        it('Right - Direction with one Selected Cell', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(82, true);
            expect(helper.invoke('getCell', [1, 3]).textContent).toBe('11:34:32 AM');
            done();
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
        it('Autofill icon is not displayed for formula dependency cells', (done: Function) => {
            helper.edit('J3', '=SUM(H2:H3)');
            helper.invoke('selectRange', ['H2']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                expect(autoFill.classList).not.toContain('e-hide');
                expect(getComputedStyle(autoFill).display).not.toBe('none');
                done();
            });
        });
        it('Autofill option is not shown for merged cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('H2:H3');
            helper.invoke('selectRange', ['H2']);
            setTimeout(() => {
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [9, 7]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    const fillOption: HTMLElement = helper.getElementFromSpreadsheet('.e-filloption');
                    expect(fillOption.classList).not.toContain('e-hide');
                    expect(getComputedStyle(fillOption).display).not.toBe('none');
                    helper.click('#spreadsheet_autofilloptionbtn');
                    helper.click('.e-dragfill-ddb ul li:nth-child(1)');
                    expect(helper.invoke('getCell', [9, 7]).textContent).toBe('10');
                    helper.click('#spreadsheet_autofilloptionbtn');
                    helper.click('.e-dragfill-ddb ul li:nth-child(3)');
                    expect(helper.invoke('getCell', [9, 7]).textContent).toBe('166');
                    expect(helper.invoke('getCell', [9, 7]).rowSpan).toBe(2);
                    helper.click('#spreadsheet_autofilloptionbtn');
                    helper.click('.e-dragfill-ddb ul li:nth-child(4)');
                    expect(helper.invoke('getCell', [9, 7]).textContent).toBe('14');
                    expect(helper.invoke('getCell', [9, 7]).rowSpan).toBe(1);
                    done();
                });
            });
        });
        it('Date formatted cells which has the string values', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: any = spreadsheet.getActiveSheet();
            setRow(sheet, 11, { cells: [{ value: '10/2/2020', format: 'mm-dd-yyyy' }] });
            helper.invoke('autoFill', ['A13:A15', 'A12:A12']);
            expect(sheet.rows[11].cells[0].value).toBe('44106');
            expect(sheet.rows[11].cells[0].format).toBe('mm-dd-yyyy');
            expect(sheet.rows[12].cells[0].value).toBe(44107);
            expect(sheet.rows[12].cells[0].format).toBe('mm-dd-yyyy');
            expect(sheet.rows[13].cells[0].value).toBe(44108);
            expect(sheet.rows[13].cells[0].format).toBe('mm-dd-yyyy');
            expect(sheet.rows[14].cells[0].value).toBe(44109);
            expect(sheet.rows[14].cells[0].format).toBe('mm-dd-yyyy');
            done();
        });
    });

    describe('Apply Autofill', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply fillseries Date format MMM/yy', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: any = spreadsheet.getActiveSheet();
            helper.invoke('selectRange', ['B3']);
            helper.edit('B3', '5/31/2014');
            helper.invoke('numberFormat', ['mmm-yy', 'B3']);
            expect(sheet.rows[2].cells[1].format).toBe('mmm-yy');
            helper.invoke('autoFill', ['C3', 'B3', 'Right', 'FillSeries']);
            expect(sheet.rows[2].cells[2].format).toBe('mmm-yy');
            done();
        });
        it('Auto fill using update action method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'autofill', eventArgs: { undoArgs: {} } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(0);
                done();
            });
        });
        it('Enabled Autofill-option, unprotect sheet when freeze pane is applied', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(8, 2)
            setTimeout(() => {
                helper.switchRibbonTab(4);
                helper.click('#' + helper.id + '_protect');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                    helper.click('.e-protect-dlg .e-primary');
                    expect(spreadsheet.sheets[0].isProtected).toBeTruthy();
                    expect(helper.getElementFromSpreadsheet('.e-autofill').classList.contains('e-hide')).toBeTruthy();
                    helper.invoke('unprotectSheet', [0]);
                    setTimeout(() => {
                        expect(helper.getElementFromSpreadsheet('.e-autofill').classList.contains('e-hide')).toBeFalsy();
                        done();
                    });
                });
            });
        });
    });

    describe('CR Issues ->', () => {
        describe('EJ2-56558, EJ2-60197, EJ2-71594, EJ2-881113 ->', () => {
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
            it('Spreadsheet displays NaN when drag the cells that contain larger number value', (done: Function) => {
                const instance: any = helper.getInstance();
                helper.invoke('selectRange', ['K1']);
                helper.edit('K1', '1000000000000');
                let autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [2, 10]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                instance.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                instance.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                helper.invoke('selectRange', ['L1']);
                helper.edit('L1', '1000000000000000000');
                td = helper.invoke('getCell', [2, 11]);
                coords = td.getBoundingClientRect();
                autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                instance.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                instance.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(JSON.stringify(getCell(0, 10, instance.sheets[0]).value)).toBe('1000000000000');
                expect(JSON.stringify(getCell(1, 10, instance.sheets[0]).value)).toBe('1000000000001');
                expect(JSON.stringify(getCell(2, 10, instance.sheets[0]).value)).toBe('1000000000002');
                expect(JSON.stringify(getCell(0, 11, instance.sheets[0]).value)).toBe('1000000000000000000');
                expect(JSON.stringify(getCell(1, 11, instance.sheets[0]).value)).toBe('1000000000000000000');
                expect(JSON.stringify(getCell(2, 11, instance.sheets[0]).value)).toBe('1000000000000000000');
                expect(helper.invoke('getCell', [0, 10]).textContent).toBe('1E+12');
                expect(helper.invoke('getCell', [1, 10]).textContent).toBe('1E+12');
                expect(helper.invoke('getCell', [0, 11]).textContent).toBe('1E+18');
                expect(helper.invoke('getCell', [1, 11]).textContent).toBe('1E+18');
                helper.edit('M1', '110000000000');
                helper.edit('M2', '101000000000');
                helper.edit('M3', '100001000000');
                helper.edit('N1', '100000100000');
                helper.edit('N2', '100000001000');
                expect(JSON.stringify(getCell(0, 12, instance.sheets[0]).value)).toBe('110000000000');
                expect(helper.invoke('getCell', [0, 12]).textContent).toBe('1.1E+11');
                expect(JSON.stringify(getCell(1, 12, instance.sheets[0]).value)).toBe('101000000000');
                expect(helper.invoke('getCell', [1, 12]).textContent).toBe('1.01E+11');
                expect(JSON.stringify(getCell(2, 12, instance.sheets[0]).value)).toBe('100001000000');
                expect(helper.invoke('getCell', [2, 12]).textContent).toBe('1.00001E+11');
                expect(JSON.stringify(getCell(0, 13, instance.sheets[0]).value)).toBe('100000100000');
                expect(helper.invoke('getCell', [0, 13]).textContent).toBe('1E+11');
                expect(JSON.stringify(getCell(1, 13, instance.sheets[0]).value)).toBe('100000001000');
                expect(helper.invoke('getCell', [1, 13]).textContent).toBe('1E+11');
                done();
            });
        });
        describe('Auto fill popup displays wrong options when the component is loaded with different locale ->', () => {
            L10n.load({
                'zh': {
                    'spreadsheet': {
                        "FillSeries": "填充系列",
                        "CopyCells": "複製單元格",
                        "FillFormattingOnly": "僅填充格式",
                        "FillWithoutFormatting": "無格式填充",
                    }
                }
            });
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'E1' }], locale: 'zh' }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('applying auto fill with different locale', (done:Function) => {
                helper.invoke('selectRange', ['A9']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [13, 0]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                helper.click('#spreadsheet_autofilloptionbtn');
                const fillPopup: HTMLElement = document.getElementById('spreadsheet_autofilloptionbtn-popup');
                expect(fillPopup.childNodes[0].childNodes.length).toBe(3);
                done();
            });
        });
        describe('EJ2-878274, EJ2-922795 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [
                        {
                            rows: [
                                { cells: [{ index: 5, value: "12:00:00 PM" }, { index: 6, value: "1:00:00 PM" }, { index: 7, value: "2:00:00 PM" }] }, { cells: [] }, { cells: [] }, { cells: [] }, { cells: [{ value: '12:00:00 PM' }] }, { cells: [{ value: '1:00:00 PM' }] }, { cells: [{ value: '2:00:00 PM' }] }
                            ]
                        }
                    ]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Autofill support is not working properly with time format values using up direction', (done: Function) => {
                helper.invoke('autoFill', ['A4:A2', 'A7:A5', 'Up', 'FillSeries']);
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe('11:00:00 AM');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('10:00:00 AM');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('9:00:00 AM');
                done();
            });
            it('Autofill support is not working properly with time format values using down direction', (done: Function) => {
                helper.invoke('autoFill', ['A8:A10', 'A5:A7', 'Down', 'FillSeries']);
                expect(helper.invoke('getCell', [7, 0]).textContent).toBe('3:00:00 PM');
                expect(helper.invoke('getCell', [8, 0]).textContent).toBe('4:00:00 PM');
                expect(helper.invoke('getCell', [9, 0]).textContent).toBe('5:00:00 PM');
                done();
            });
            it('Autofill support is not working properly with time format values using right direction', (done: Function) => {
                helper.invoke('autoFill', ['I1:K1', 'F1:H1', 'Right', 'FillSeries']);
                expect(helper.invoke('getCell', [0, 8]).textContent).toBe('3:00:00 PM');
                expect(helper.invoke('getCell', [0, 9]).textContent).toBe('4:00:00 PM');
                expect(helper.invoke('getCell', [0, 10]).textContent).toBe('5:00:00 PM');
                done();
            });
            it('Autofill support is not working properly with time format values using left direction', (done: Function) => {
                helper.invoke('autoFill', ['E1:C1', 'H1:F1', 'Left', 'FillSeries']);
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('11:00:00 AM');
                expect(helper.invoke('getCell', [0, 3]).textContent).toBe('10:00:00 AM');
                expect(helper.invoke('getCell', [0, 2]).textContent).toBe('9:00:00 AM');
                done();
            });
            it('Checking autofill with formula value referencing column index more than 26 using right direction', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.edit('D4', '=SUM(BN10)');
                helper.invoke('autoFill', ['E4', 'D4', 'Right', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[3].cells[4].formula).toBe('=SUM(BO10)');
                helper.edit('D5', '=SUM($BN10)');
                helper.invoke('autoFill', ['E5', 'D5', 'Right', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[4].cells[4].formula).toBe('=SUM($BN10)');
                helper.edit('D6', '=SUM($BN$10)');
                helper.invoke('autoFill', ['E6', 'D6', 'Right', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[5].cells[4].formula).toBe('=SUM($BN$10)');
                done();
            });
            it('Checking autofill with formula value referencing column index more than 26 using left direction', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.invoke('autoFill', ['C4', 'D4', 'Left', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[3].cells[2].formula).toBe('=SUM(BM10)');
                helper.invoke('autoFill', ['C5', 'D5', 'Left', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[4].cells[2].formula).toBe('=SUM($BN10)');
                helper.invoke('autoFill', ['C6', 'D6', 'Left', 'FillSeries']);
                expect(spreadsheet.sheets[0].rows[5].cells[2].formula).toBe('=SUM($BN$10)');
                done();
            });
        });
        describe('EJ2-896132, EJ2-910623', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Additional column cells gets selected while selecting the autofill options button in mouse moving', function (done) {
                helper.invoke('selectRange', ['A9']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [13, 0]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A9:A14');
                const autoFillOptions: HTMLElement = helper.getElementFromSpreadsheet('.e-dragfill-ddb');
                let autoFillOptionsCoords = autoFillOptions.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillOptionsCoords.left + 1, y: autoFillOptionsCoords.top + 1 }, null, autoFillOptions);
                helper.triggerMouseAction('mousemove', { x: autoFillOptionsCoords.left, y: autoFillOptionsCoords.top + 30 }, autoFillOptions);
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(spreadsheet.sheets[0].selectedRange).toBe('A9:A14');
                done();
            });
            it('The autoFill() method does not fill data in the expected sheet when using fill range and data range arguments.', function (done) {
                const spreadsheet: any = helper.getInstance();
                spreadsheet.autoFill('Sheet2!A11:C15', 'Sheet1!D2:F3', 'Down', 'CopyCells');
                expect(spreadsheet.sheets[1].rows[10].cells[0].value).toBe(10);
                expect(spreadsheet.sheets[1].rows[10].cells[1].value).toBe(20);
                expect(spreadsheet.sheets[1].rows[10].cells[2].value).toBe(200);
                expect(spreadsheet.sheets[1].rows[13].cells[0].value).toBe(20);
                expect(spreadsheet.sheets[1].rows[13].cells[1].value).toBe(30);
                expect(spreadsheet.sheets[1].rows[13].cells[2].value).toBe(600);
                expect(spreadsheet.sheets[1].rows[14].cells[0].value).toBe(10);
                expect(spreadsheet.sheets[1].rows[14].cells[1].value).toBe(20);
                expect(spreadsheet.sheets[1].rows[14].cells[2].value).toBe(200);
                spreadsheet.autoFill('Sheet2!A1:E1', 'Sheet1!A1:E1', 'Right', 'CopyCells');
                expect(spreadsheet.sheets[1].rows[0].cells[0].value).toBe('Item Name');
                expect(spreadsheet.sheets[1].rows[0].cells[1].value).toBe('Date');
                expect(spreadsheet.sheets[1].rows[0].cells[2].value).toBe('Time');
                expect(spreadsheet.sheets[1].rows[0].cells[3].value).toBe('Quantity');
                expect(spreadsheet.sheets[1].rows[0].cells[4].value).toBe('Price');
                spreadsheet.autoFill('Sheet2!F1:F10', 'Sheet1!D2:D3', 'Down', 'FillSeries');
                expect(spreadsheet.sheets[1].rows[0].cells[5].value).toBe(30);
                expect(spreadsheet.sheets[1].rows[1].cells[5].value).toBe(40);
                expect(spreadsheet.sheets[1].rows[2].cells[5].value).toBe(50);
                expect(spreadsheet.sheets[1].rows[3].cells[5].value).toBe(60);
                expect(spreadsheet.sheets[1].rows[4].cells[5].value).toBe(70);
                expect(spreadsheet.sheets[1].rows[5].cells[5].value).toBe(80);
                expect(spreadsheet.sheets[1].rows[6].cells[5].value).toBe(90);
                expect(spreadsheet.sheets[1].rows[7].cells[5].value).toBe(100);
                expect(spreadsheet.sheets[1].rows[8].cells[5].value).toBe(110);
                expect(spreadsheet.sheets[1].rows[9].cells[5].value).toBe(120);
                spreadsheet.autoFill('Sheet2!G5:G1', 'Sheet1!B2', 'Up', 'FillWithoutFormatting');
                expect(spreadsheet.sheets[1].rows[0].cells[6].value).toBe(41679);
                expect(spreadsheet.sheets[1].rows[1].cells[6].value).toBe(41680);
                expect(spreadsheet.sheets[1].rows[2].cells[6].value).toBe(41681);
                expect(spreadsheet.sheets[1].rows[3].cells[6].value).toBe(41682);
                expect(spreadsheet.sheets[1].rows[4].cells[6].value).toBe(41683);
                helper.invoke('numberFormat', ['$#,##0.00', 'D2']);
                spreadsheet.autoFill('Sheet2!F1:F10', 'Sheet1!D2', 'Down', 'FillFormattingOnly');
                expect(spreadsheet.sheets[1].rows[0].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[1].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[2].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[3].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[4].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[5].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[6].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[7].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[8].cells[5].format).toBe('$#,##0.00');
                expect(spreadsheet.sheets[1].rows[9].cells[5].format).toBe('$#,##0.00');
                spreadsheet.autoFill('Sheet!A1:E1', 'Sheet!A1:E1', 'Right', 'CopyCells');
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Item Name');
                expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('Date');
                expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('Time');
                expect(spreadsheet.sheets[0].rows[0].cells[3].value).toBe('Quantity');
                expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBe('Price');
                spreadsheet.autoFill('Sheet!F1:F10', 'Sheet!D2:D3', 'Down', 'FillSeries');
                expect(spreadsheet.sheets[0].rows[0].cells[5].value).toBe(30);
                expect(spreadsheet.sheets[0].rows[1].cells[5].value).toBe(40);
                expect(spreadsheet.sheets[0].rows[2].cells[5].value).toBe(50);
                expect(spreadsheet.sheets[0].rows[3].cells[5].value).toBe(60);
                expect(spreadsheet.sheets[0].rows[4].cells[5].value).toBe(70);
                expect(spreadsheet.sheets[0].rows[5].cells[5].value).toBe(80);
                expect(spreadsheet.sheets[0].rows[6].cells[5].value).toBe(90);
                expect(spreadsheet.sheets[0].rows[7].cells[5].value).toBe(100);
                expect(spreadsheet.sheets[0].rows[8].cells[5].value).toBe(110);
                expect(spreadsheet.sheets[0].rows[9].cells[5].value).toBe(120);
                done();
            });
        });
        describe('EJ2-927323', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenColumns: 3, frozenRows: 5 }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Checking right to left scroll selection with freeze pane', (done: Function) => {
                helper.invoke('goTo', ['M6']);
                helper.edit('M6', 'Sample');
                helper.invoke('selectRange', ['M6']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [6, 5]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(helper.getInstance().sheets[0].rows[5].cells[5].value).toBe('Sample');
                done();
            });
            it('Checking down to up scroll selection with freeze pane', (done: Function) => {
                helper.invoke('goTo', ['O25']);
                helper.edit('O25', '120');
                helper.invoke('selectRange', ['O25']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [7, 14]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(helper.getInstance().sheets[0].rows[7].cells[14].value).toBe(103);
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
                const dialog: HTMLElement = helper.getElement('.e-editAlert-dlg.e-dialog');
                //expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                    "The cell you're trying to change is protected. To make change, unprotect the sheet.");
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
    });
    describe('Apply Autofill to the ReadOnly cells', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Autofill to the ReadOnly cells', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();  
            spreadsheet.setRangeReadOnly(true,'B3:F3',0)
            helper.invoke('selectRange', ['B3']);
            helper.invoke('autoFill', ['F3', 'B3', 'Right', 'FillSeries']);
            spreadsheet.notify(refreshCell, {rowIndex: 2, colIndex: 2})  
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('EJ2-931170 - Data validation applied during autofill with FillFormattingOnly option', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '11,12,13' }, 'H1']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[7];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"11,12,13"}');
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['H2:H2', 'H1', 'Down', 'FillFormattingOnly']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[7].validation).toBe(undefined);
            done();
        });
    });
    describe(' AutoFill for date cell ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['K2']);
            helper.edit('K2', '=Average(B2:B11)');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [7, 10]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('K2:K2');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('8/3/2014');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(4)');
            td = helper.invoke('getCell', [7, 10]);
            expect(td.textContent).toBe('41854.75');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('41860.625');
        });
    });
    describe(' AutoFill for format cell ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['K2']);
            helper.edit('K2', '=Average(B2:B11)');
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [1, 14]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('K2:K2');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('1/1/1900');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(4)');
            td = helper.invoke('getCell', [1, 11]);
            expect(td.textContent).toBe('0.240206019');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(2)');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('1/1/1900');
        });
    });

    describe('EJ2-924157 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Autofill with "Fill Without Formatting" not working correctly for formula cells in Manual calculation mode.', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.edit('F11', '=PRODUCT(D11:E11)');
            helper.invoke('autoFill',['F12:F18','F11:F11','Down','FillWithoutFormatting']);
            expect(spreadsheet.sheets[0].rows[10].cells[5].formula).toBe('=PRODUCT(D11:E11)');
            expect(spreadsheet.sheets[0].rows[10].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[11].cells[5].formula).toBe('=PRODUCT(D12:E12)');
            expect(spreadsheet.sheets[0].rows[11].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[12].cells[5].formula).toBe('=PRODUCT(D13:E13)');
            expect(spreadsheet.sheets[0].rows[12].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[13].cells[5].formula).toBe('=PRODUCT(D14:E14)');
            expect(spreadsheet.sheets[0].rows[13].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[14].cells[5].formula).toBe('=PRODUCT(D15:E15)');
            expect(spreadsheet.sheets[0].rows[14].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[15].cells[5].formula).toBe('=PRODUCT(D16:E16)');
            expect(spreadsheet.sheets[0].rows[15].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[16].cells[5].formula).toBe('=PRODUCT(D17:E17)');
            expect(spreadsheet.sheets[0].rows[16].cells[5].value).toBe('500');
            expect(spreadsheet.sheets[0].rows[17].cells[5].formula).toBe('=PRODUCT(D18:E18)');
            expect(spreadsheet.sheets[0].rows[17].cells[5].value).toBe('500');
            helper.edit('G12', '=SUM(H2:H11)');
            expect(spreadsheet.sheets[0].rows[11].cells[6].formula).toBe('=SUM(H2:H11)');
            expect(spreadsheet.sheets[0].rows[11].cells[6].value).toBe(554);
            helper.invoke('autoFill',['H12:L12','G12:G12','Right','FillWithoutFormatting']);
            expect(spreadsheet.sheets[0].rows[11].cells[7].formula).toBe('=SUM(I2:I11)');
            expect(spreadsheet.sheets[0].rows[11].cells[7].value).toBe(554);
            expect(spreadsheet.sheets[0].rows[11].cells[8].formula).toBe('=SUM(J2:J11)');
            expect(spreadsheet.sheets[0].rows[11].cells[8].value).toBe(554);
            expect(spreadsheet.sheets[0].rows[11].cells[9].formula).toBe('=SUM(K2:K11)');
            expect(spreadsheet.sheets[0].rows[11].cells[9].value).toBe(554);
            expect(spreadsheet.sheets[0].rows[11].cells[10].formula).toBe('=SUM(L2:L11)');
            expect(spreadsheet.sheets[0].rows[11].cells[10].value).toBe(554);
            expect(spreadsheet.sheets[0].rows[11].cells[11].formula).toBe('=SUM(M2:M11)');
            expect(spreadsheet.sheets[0].rows[11].cells[11].value).toBe(554);
            done();
        });
    });

    describe('EJ2-895909 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Selection misalignment issue occurs on increasing the font size', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.invoke('cellFormat', [{ fontSize: '22pt' }, 'E2:H2']);
            expect(spreadsheet.sheets[0].rows[1].height).toBe(38);
            expect(helper.invoke('getRow', [1]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[1].cells[4].style.fontSize).toBe('22pt');
            helper.invoke('autoFill',['E3:E11','E2:E2','Down','FillSeries']);
            expect(spreadsheet.sheets[0].rows[2].height).toBe(38);
            expect(helper.invoke('getRow', [2]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[2].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[3].height).toBe(38);
            expect(helper.invoke('getRow', [3]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[3].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[4].height).toBe(38);
            expect(helper.invoke('getRow', [4]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[4].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[5].height).toBe(38);
            expect(helper.invoke('getRow', [5]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[5].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[6].height).toBe(38);
            expect(helper.invoke('getRow', [6]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[6].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[7].height).toBe(38);
            expect(helper.invoke('getRow', [7]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[7].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[8].height).toBe(38);
            expect(helper.invoke('getRow', [8]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[8].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[9].height).toBe(38);
            expect(helper.invoke('getRow', [9]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[9].cells[4].style.fontSize).toBe('22pt');
            expect(spreadsheet.sheets[0].rows[10].height).toBe(38);
            expect(helper.invoke('getRow', [10]).style.height).toBe('38px');
            expect(spreadsheet.sheets[0].rows[10].cells[4].style.fontSize).toBe('22pt');
            helper.invoke('autoFill',['Sheet2!A12:A17','Sheet1!E2:E2','Down','CopyCells']);
            expect(helper.invoke('getRow', [11]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[11].cells[0].style.fontSize).toBe('22pt');
            expect(helper.invoke('getRow', [12]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[12].cells[0].style.fontSize).toBe('22pt');
            expect(helper.invoke('getRow', [13]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[13].cells[0].style.fontSize).toBe('22pt');
            expect(helper.invoke('getRow', [14]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[14].cells[0].style.fontSize).toBe('22pt');
            expect(helper.invoke('getRow', [15]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[15].cells[0].style.fontSize).toBe('22pt');
            expect(helper.invoke('getRow', [16]).style.height).toBe('20px');
            expect(spreadsheet.sheets[1].rows[16].cells[0].style.fontSize).toBe('22pt');
            done();
        });        
    });

    describe(' AutoFill for blank cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            const instance: any = helper.getInstance();
            helper.invoke('selectRange', ['H2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [1, 12]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('H2:H2');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('12');
            done();
        });
        it('Apply autoFill - 1', (done: Function) => {
            const instance: any = helper.getInstance();
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 12]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('H2:M2');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('16');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('');
        });
        it('Undo action-1', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('12');
        });
        it('Redo action-1', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('16');
        });
        it('Undo action for clear autofill', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('');
        });
        it('Undo action for clear autofill-1', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('');
        });
        it('Apply autoFill for down direction', (done: Function) => {
            const instance: any = helper.getInstance();
            helper.invoke('selectRange', ['H2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('H2:H2');
            expect(helper.invoke('getCell', [6, 7]).textContent).toBe('15');
            done();
        });
        it('Apply autoFill for right direction', (done: Function) => {
            const instance: any = helper.getInstance();
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 12]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('H2:H9');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('16');
            done();
        });
        it('Undo action-2', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('');
        });
        it('Redo action-2', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('16');
        });
        it('Undo action-3', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('');
        });
        it('Apply autoFill for left direction', (done: Function) => {
            const instance: any = helper.getInstance();
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 4]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('H2:H9');
            expect(helper.invoke('getCell', [4, 5]).textContent).toBe('11');
            done();
        });
        it('Undo action-4', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [4, 5]).textContent).toBe('300');
        });
        it('Undo action-5', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [6, 7]).textContent).toBe('66');
        });
        it('Redo action-3', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [6, 7]).textContent).toBe('15');
        });
        it('Redo action-4', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [4, 5]).textContent).toBe('11');
        });
    });
    describe(' AutoFill for REF formulae ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            const instance: any = helper.getInstance();
            helper.edit('L8', '=Average(B2:B11)');
            expect(getCell(7, 11, instance.sheets[0]).formula).toBe('=Average(B2:B11)');
            helper.invoke('selectRange', ['L8']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [2, 11]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('L8:L8');
            expect(helper.invoke('getCell', [4, 11]).textContent).toBe('#REF!');
            expect(getCell(3, 11, instance.sheets[0]).formula).toBe('=Average(#REF!)');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('');
        });
        it('Redo action', () => {
            const instance: any = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('#REF!');
            expect(getCell(3, 11, instance.sheets[0]).formula).toBe('=Average(#REF!)');
        });
        it('Undo action-1', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('');
        });
        it('Undo action-2', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [7, 11]).textContent).toBe('');
        });
        it('Redo action-1', () => {
            const instance: any = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(getCell(7, 11, instance.sheets[0]).formula).toBe('=Average(B2:B11)');
        });
        it('Apply autoFill-1', (done: Function) => {
            const instance: any = helper.getInstance();
            helper.edit('L8', '=SUM(D2,A1,F3)');
            expect(getCell(7, 11, instance.sheets[0]).formula).toBe('=SUM(D2,A1,F3)');
            helper.invoke('selectRange', ['L8']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [2, 11]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(instance.selectionModule.dAutoFillCell).toBe('L8:L8');
            expect(helper.invoke('getCell', [4, 11]).textContent).toBe('#REF!');
            expect(getCell(5, 11, instance.sheets[0]).formula).toBe('=SUM(#REF!,#REF!,F1)');
            done();
        });
        it('Undo action-3', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('');
        });
        it('Redo action-2', () => {
            const instance: any = helper.getInstance();
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('#REF!');
            expect(getCell(3, 11, instance.sheets[0]).formula).toBe('=SUM(#REF!,#REF!,#REF!)');
        });
    });
    describe(' Autofill with Notes ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 1, cells: [{ index: 5, notes: 'Syncfusion' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['F2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [8, 5]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('F2:F2');
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('204');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(1)');
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('200');
            spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[1].cells[5].notes).toBe('Syncfusion');
            done();
        });
        it('Change autoFill option', (done: Function) => {
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(3)');
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('300');
            expect(helper.invoke('getCell', [5, 5]).querySelector('.e-addNoteIndicator')).toBe(null);
            done();
        });
        it('Change autoFill option-1', (done: Function) => {
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(4)');
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('204');
            expect(helper.invoke('getCell', [5, 5]).querySelector('.e-addNoteIndicator')).toBe(null);
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('300');
            expect(helper.invoke('getCell', [5, 5]).querySelector('.e-addNoteIndicator')).toBe(null);
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [5, 5]).textContent).toBe('204');
            expect(helper.invoke('getCell', [5, 5]).querySelector('.e-addNoteIndicator')).toBe(null);
        });
    });
    describe(' AutoFill for merged date cell ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply merge', (done: Function) => {
            helper.invoke('merge', ['B10:C11', 'Horizontally']);
            expect(helper.invoke('getCell', [9, 1]).textContent).toBe('7/9/2014');
            done();
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['B10:C11']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [15, 3]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('B10:C11');
            expect(helper.invoke('getCell', [15, 1]).textContent).toBe('5/23/2016');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(4)');
            expect(helper.invoke('getCell', [15, 1]).textContent).toBe('42513');
            expect(helper.invoke('getCell', [15, 2]).textContent).toBe('');
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [15, 1]).textContent).toBe('');
            expect(helper.invoke('getCell', [15, 2]).textContent).toBe('');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [15, 1]).textContent).toBe('42513');
            expect(helper.invoke('getCell', [15, 2]).textContent).toBe('');
        });
    });
    describe('EJ2-914385 -> Checking autofill with custom data validation cases', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Autofill - Cell validation with right autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C2', ignoreBlank: true }, 'E1:E4');
            helper.invoke('autoFill', ['F2', 'E2', 'Right', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[5].validation.value1).toBe('=D3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[5].value.toString()).toBe('21');
            done();
        });
        it('Autofill - Cell validation with down autofill ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['E3', 'E2', 'Down', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[2].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[2].cells[4].value.toString()).toBe('21');
            done();
        });
        it('Autofill - Cell validation with left autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['D2', 'E2', 'Left', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].validation.value1).toBe('=B3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].value.toString()).toBe('19');
            done();
        });
        it('Autofill - Cell validation with top', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['E2', 'E3', 'Top', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[4].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[4].value.toString()).toBe('22');
            done();
        });
        it('Autofill - Column validation with right autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=B2', ignoreBlank: true }, 'C:C');
            helper.invoke('autoFill', ['D2', 'C2', 'Right', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].value.toString()).toBe('0.5239814814814815');
            done();
        });
        it('Autofill - Column validation with down autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['C3', 'C2', 'Down', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[3].value.toString()).toBe('0.5239814814814815');
            done();
        });
        it('Autofill - Column validation with left autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['B2', 'C2', 'Left', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[1].validation.value1).toBe('=A3');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[1].value.toString()).toBe('0.440648148148148');
            done();
        });
        it('Autofill - Column validation with top autofill', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['C1', 'C2', 'Top', 'FillSeries']);
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[0].cells[2].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[0].cells[2].value.toString()).toBe('0.5239814814814815');
            done();
        });
        it('916573- Notes are getting added while selecting the Fill Formatting only option in autofill drop down', (done: Function) => {
            helper.invoke('selectRange', ['C11']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion';
            helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
            expect(helper.getInstance().sheets[0].rows[10].cells[2].notes).toBe('Syncfusion');
            expect(helper.getInstance().sheets[0].rows[10].cells[3].notes).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[10].cells[4].notes).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[10].cells[5].notes).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[10].cells[6].notes).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[10].cells[7].notes).toBeUndefined;
            done();
        });
    });

    describe('EJ2-923948 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Time format values are displayed incorrectly when trying to autofill across previous cells in Spreadsheet', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.edit('I12', '1:00:00 AM');
            expect(spreadsheet.sheets[0].rows[11].cells[8].formattedText).toBe('1:00:00 AM');
            helper.invoke('autoFill', ['I5:I11', 'I12', 'Up', 'FillSeries']);
            expect(spreadsheet.sheets[0].rows[10].cells[8].formattedText).toBe('12:00:00 AM');
            expect(spreadsheet.sheets[0].rows[9].cells[8].formattedText).toBe('11:00:00 PM');
            expect(spreadsheet.sheets[0].rows[8].cells[8].formattedText).toBe('10:00:00 PM');
            expect(spreadsheet.sheets[0].rows[7].cells[8].formattedText).toBe('9:00:00 PM');
            expect(spreadsheet.sheets[0].rows[6].cells[8].formattedText).toBe('8:00:00 PM');
            helper.invoke('autoFill', ['E12:H12', 'I12', 'Left', 'FillSeries']);
            expect(spreadsheet.sheets[0].rows[11].cells[7].formattedText).toBe('12:00:00 AM');
            expect(spreadsheet.sheets[0].rows[11].cells[6].formattedText).toBe('11:00:00 PM');
            expect(spreadsheet.sheets[0].rows[11].cells[5].formattedText).toBe('10:00:00 PM');
            expect(spreadsheet.sheets[0].rows[11].cells[4].formattedText).toBe('9:00:00 PM');
            done();
        });        
    });

    describe('EJ2-916365 -> Auto-fill drop-down button is not visible when finite mode is set to true', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                scrollSettings: { isFinite: true },
                sheets: [{ ranges: [{ dataSource: defaultData }], rowCount: 10 }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Ensuring', (done: Function) => {
            helper.invoke('selectRange', ['A10']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [0, 10]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            const instance: any = helper.getInstance();
            instance.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            instance.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            setTimeout(() => {
                const virtualable: number = instance.element.querySelector('.e-main-panel .e-sheet-content .e-virtualable').clientHeight;
                const eleTopPosition: number = instance.element.querySelector('.e-filloption').style.top.split('px')[0];
                expect(virtualable > (Number(eleTopPosition) + instance.element.querySelector('.e-filloption').clientHeight)).toBeTruthy();
                done();
            });
        });
    });

    describe('EJ2-943536 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{ index: 4, cells: [{ index: 7, notes: 'Syncfusion', isNoteEditable: false }] }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Duplicate Add Notes entries appear when performing autofill and scrolling down/up.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('autoFill', ['H6:H10', 'H5:H5', 'Down', 'CopyCells']);
            let td: HTMLElement;
            helper.invoke('goTo', ['A100']);
            setTimeout(() => {
                helper.invoke('goTo', ['A1']);
                setTimeout(() => {
                    td = helper.invoke('getCell', [4, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).not.toBeNull();
                    expect(spreadsheet.sheets[0].rows[4].cells[7].notes).toBe('Syncfusion');
                    expect(spreadsheet.sheets[0].rows[4].cells[7].isNoteEditable).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[5].cells[7].notes).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[5].cells[7].isNoteEditable).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[6].cells[7].notes).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[6].cells[7].isNoteEditable).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[7].cells[7].notes).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[7].cells[7].isNoteEditable).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[8].cells[7].notes).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[8].cells[7].isNoteEditable).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[9].cells[7].notes).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[9].cells[7].isNoteEditable).toBeUndefined();
                    td = helper.invoke('getCell', [5, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).toBeNull();
                    td = helper.invoke('getCell', [6, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).toBeNull();
                    td = helper.invoke('getCell', [7, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).toBeNull();
                    td = helper.invoke('getCell', [8, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).toBeNull();
                    td = helper.invoke('getCell', [9, 7]);
                    expect(td.querySelector('.e-addNoteIndicator')).toBeNull();
                    done();
                });
            });
        });
    });
});