import { Spreadsheet, PreviousCellDetails } from '../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../spreadsheet/util/spreadsheethelper.spec';
import { defaultData, manualData } from '../spreadsheet/util/datasource.spec';
import { CellModel, Workbook } from '../../src/workbook/index';
import { WorkbookHelper } from '../workbook/util/workbookhelper.spec';

describe('Manual calculation cases', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let workbookHelper: WorkbookHelper;

    describe('Added formula cell with manual mode ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Formula added', (done: Function) => {
            setTimeout(() => {
                helper.edit('J2', '=SUM(D2:E2);');
                expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
                done();
            });
        });

        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('');
            done();
        });

        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            done();
        });

        it('Copy action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['J2']);
            helper.click('#' + helper.id + '_copy');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            spreadsheet.selectRange("L2");
            done();
        });

        it('paste action', (done: Function) => {
            helper.click('#' + helper.id + '_paste');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('30');
            done();
        });

        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('');
            done();
        });

        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            done();
        });

        it('Value check', (done: Function) => {
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('30');
            done();
        });
    });

    describe('Copy action with Manual calc mode ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Copy action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['G2:H11']);
            helper.click('#' + helper.id + '_copy');
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            spreadsheet.selectRange("L2");
            done();
        });

        it('paste action', (done: Function) => {
            helper.click('#' + helper.id + '_paste');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('5');
            done();
        });

        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('');
            done();
        });

        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            done();
        });

        it('Value check', (done: Function) => {
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('5');
            done();
        });
    });

    describe('Cut action with Manual calc mode ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Cut action', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['G2:H11']);
            helper.click('#' + helper.id + '_cut');
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            spreadsheet.selectRange("L2");
            done();
        });

        it('paste action', (done: Function) => {
            helper.click('#' + helper.id + '_paste');
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('5');
            helper.switchRibbonTab(3);
            helper.getElement('#' + helper.id + '_calc_entire_sheets').click();
            done();
        });

        it('Undo action', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('');
            done();
        });

        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('50');
            done();
        });

        it('Value check', (done: Function) => {
            expect(helper.invoke('getCell', [2, 7]).innerText).toBe('');
            expect(helper.invoke('getCell', [2, 11]).innerText).toBe('5');
            done();
        });

        it('Formula added', (done: Function) => {
            helper.edit('J2', '=SUM(D2:E2);');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
            done();
        });

        it('Insert Column', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.openAndClickCMenuItem(0, 1, [6, 1], false, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 7]).innerText).toBe('');
                done();
            });
        });

        it('Undo insert Column', (done: Function) => {
            expect(helper.invoke('getCell', [0, 7]).innerText).toBe('');
            helper.invoke('selectRange', ['L1']);
            helper.getElement('#' + helper.id + '_undo').click();
            done();
        });

        it('Redo insert Column', (done: Function) => {
            expect(helper.invoke('getCell', [0, 7]).innerText).toBe('Profit');
            helper.getElement('#' + helper.id + '_redo').click();
            done();
        });

        it('UndoRedo insert value check', (done: Function) => {
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('30');
            done();
        });

        // it('Save check', function (done: Function) {
        //     spreadsheet = helper.getInstance();
        //     const args: Object = {
        //         "saveSettings": {
        //             "url": "",
        //             "fileName": "Sample",
        //             "saveType": "Xlsx",
        //             "customParams": {},
        //             "isFullPost": true,
        //             "needBlobData": false,
        //             "cancel": false,
        //             "autoDetectFormat": false,
        //             "pdfLayoutSettings": {
        //                 "fitSheetOnOnePage": false,
        //                 "orientation": "Portrait"
        //             }
        //         },
        //         "isFullPost": true,
        //         "needBlobData": false,
        //         "customParams": {},
        //         "pdfLayoutSettings": {
        //             "fitSheetOnOnePage": false,
        //             "orientation": "Portrait"
        //         },
        //         "name": "beginSave"
        //     }; // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (spreadsheet as any).workbookSaveModule.initiateSave(args);
        //     spreadsheet.dataBind();
        //     done();
        // });
    });

    describe('UpdateCell call. ->', () => {
        beforeAll((done: Function) => {
            workbookHelper = new WorkbookHelper({ sheets: [{ ranges: [{ dataSource: defaultData, startCell: 'A10' }],id:1 }]});
            done();
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('UpdateCell method using workbook instance', (done: Function) => {
            workbookHelper = new WorkbookHelper({ sheets: [{ ranges: [{ dataSource: defaultData, startCell: 'A10' }],id:1 }]});
            const workbook: Workbook = workbookHelper.getInstance();
            workbook.updateCell({ value: '220' });
            expect(workbook.sheets[0].rows[0].cells.length).toBe(1);
            done();
        });
    });

    describe('Manual calculations', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ name: 'Formula', ranges: [{ dataSource: manualData }] },
                { name: 'Formulae', ranges: [{ dataSource: manualData }], rows: [{ cells: [{ index: 8, formula: '=SUM(Formula!D2:D11)' }] }] }], calculationMode: 'Manual'
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Initial rendering->', (done: Function) => {
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('0');
            done();
        });
        it('Show sheet', (done: Function) => {
            helper.click('.e-sheets-list');
            helper.click('.e-popup.e-sheets-list ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 6]).textContent).toBe('0');
                done();
            }, 100);
        });
        it('Calculate current page->', (done: Function) => {
            helper.switchRibbonTab(3);
            helper.click('#spreadsheet_calc_current_sheet');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 6]).textContent).toBe('improper formula');
                done();
            });
        });
        it('Deleting formula referred sheet', (done: Function) => {
            const cell: any = helper.getInstance().sheets[1].rows[0].cells[8];
            expect(cell.formula).toBe('=SUM(Formula!D2:D11)');
            expect(cell.value).toBe(277);
            helper.invoke('delete', [0]);
            setTimeout(() => {
                expect(cell.formula).toBe('=SUM(#REF!D2:D11)');
                expect(cell.value).toBe(277);
                expect(helper.invoke('getCell', [0, 8]).textContent).toBe('277');
                done();
            });
        });
    });

    describe('Manual calculations - 1', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ name: 'Formula', ranges: [{ dataSource: manualData }] },
                { name: 'Formulae', ranges: [{ dataSource: manualData }] }], calculationMode: 'Manual'
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Initial rendering->', (done: Function) => {
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('0');
            done();
        });
        it('Show sheet', (done: Function) => {
            helper.click('.e-sheets-list');
            helper.click('.e-popup.e-sheets-list ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 6]).textContent).toBe('0');
                done();
            }, 100);
        });
        it('Calculate entire page->', (done: Function) => {
            helper.switchRibbonTab(3);
            helper.click('#spreadsheet_calc_entire_sheets');
            setTimeout(() => {
                expect(helper.invoke('getCell', [4, 7]).textContent).toBe('#VALUE!');
                done();
            });
        });
        it('Change calc to automatic->', (done: Function) => {
            helper.click('.e-ribbon #' + helper.id + '_calc_types');
            setTimeout(() => {
                expect(helper.getElement('.e-calc-types li:nth-child(1)').textContent).toBe('Automatic');
                helper.click('.e-calc-types li:nth-child(1)');
                done();
            });
        });
        it('Change calc to manual->', (done: Function) => {
            helper.click('.e-ribbon #' + helper.id + '_calc_types');
            setTimeout(() => {
                expect(helper.getElement('.e-calc-types li:nth-child(2)').textContent).toBe('Manual');
                helper.click('.e-calc-types li:nth-child(2)');
                done();
            });
        });
        it('Calculate current page->', (done: Function) => {
            helper.click('#spreadsheet_calc_current_sheet');
            setTimeout(() => {
                expect(helper.invoke('getCell', [6, 7]).textContent).toBe('89');
                done();
            });
        });
        it('Calculate entire page->', (done: Function) => {
            helper.click('#spreadsheet_calc_entire_sheets');
            setTimeout(() => {
                expect(helper.invoke('getCell', [5, 7]).textContent).toBe('56');
                done();
            });
        });
        it('Change cell value->', (done: Function) => {
            helper.edit('G2', '=DAYS(1000,)');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('1000');
            expect(helper.invoke('getCell', [4, 7]).textContent).toBe('#VALUE!');
            done();
        });
        it('Change cell value->', (done: Function) => {
            helper.click('#spreadsheet_calc_entire_sheets');
            setTimeout(() => {
                expect(helper.invoke('getCell', [4, 7]).textContent).toBe('-985');
                expect(helper.invoke('getCell', [8, 7]).textContent).toBe('-960');
                done();
            });
        });
    });

    describe('Manual autoFill', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    name: 'Formula', ranges: [{
                        dataSource: [
                            { A: 600 },
                            { A: 400 },
                            { A: 300 },
                            { A: '=SUM(Sheet2!A3:A4,Sheet2!A2)' }
                        ]
                    }]
                },
                {
                    name: 'Formulae', ranges: [{
                        dataSource: [
                            { A: '=SUM(Sheet1!A2:A4, A3, A4)' },
                            { A: 400 },
                            { A: 600 }
                        ]
                    }]
                }], calculationMode: 'Manual'
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Initial rendering->', (done: Function) => {
            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('0');
            done();
        });
        it('Calculate entire page->', (done: Function) => {
            helper.switchRibbonTab(3);
            helper.click('#spreadsheet_calc_entire_sheets');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('600');
                done();
            });
        });
        it('Value check->', (done: Function) => {
            setTimeout(() => {
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('3300');
                done();
            });
        });
    });
    describe('Autofill With Manual calculation ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: manualData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Formula added', (done: Function) => {
            setTimeout(() => {
                helper.edit('J2', '=SUM(D2:E2);');
                expect(helper.invoke('getCell', [1, 9]).textContent).toBe('30');
                done();
            });
        });
        it('fillType - FillSeries', (done: Function) => {
            helper.invoke('selectRange', ['J2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [6, 9]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('J2:J2');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('30');
            done();
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('');
            done();
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('30');
            done();
        });
        it('fillType - CopyCells', (done: Function) => {
            helper.invoke('selectRange', ['H9']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [15, 7]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            const instance: any = helper.getInstance();
            expect(instance.selectionModule.dAutoFillCell).toBe('H9:H9');
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('0');
            done();
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('');
            done();
        });
        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [14, 7]).textContent).toBe('0');
            done();
        });
    });
    describe('Autofill for manual calc ->', () => {
        let inst: any; let firstCellEle: HTMLElement; let secCellEle: HTMLElement; let redoCells: PreviousCellDetails[];
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: manualData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Apply autoFill', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            let td: HTMLElement = helper.invoke('getCell', [1, 12]);
            let coords = td.getBoundingClientRect();
            let autoFillCoords = autoFill.getBoundingClientRect();
            inst = helper.getInstance();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            inst.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            inst.selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
            expect(inst.selectionModule.dAutoFillCell).toBe('H2:H2');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('0');
            helper.click('#spreadsheet_autofilloptionbtn');
            helper.click('.e-dragfill-ddb ul li:nth-child(1)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('0');
            done();
        });
        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('');
            helper.setAnimationToNone(`#${helper.id}_ribbon .e-tab`, true);
            helper.switchRibbonTab(3);
            helper.getElement('#' + helper.id + '_calc_current_sheet').click();
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
            done();
        });
        it('Redo action', (done: Function) => {
            helper.triggerKeyNativeEvent(89, true);
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('0');
            done();
        });
        it('Fill Series with formula cell range', (done: Function) => {
            helper.edit('I3', '=D2');
            helper.invoke('numberFormat', ['$#,##0', 'I3']);
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('$10');
            let cell: any = inst.sheets[0].rows[2].cells[8];
            expect(cell.value).toBe('10');
            expect(cell.formula).toBe('=D2');
            expect(inst.sheets[0].rows[3].cells[8]).toBeUndefined();
            expect(inst.sheets[0].rows[4].cells[8]).toBeUndefined();
            firstCellEle = helper.invoke('getCell', [3, 8]);
            secCellEle = helper.invoke('getCell', [4, 8]);
            expect(firstCellEle.textContent).toBe('');
            expect(secCellEle.textContent).toBe('');
            const coords = secCellEle.getBoundingClientRect();
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            const autoFillCoords = autoFill.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
            inst.selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
            inst.selectionModule.mouseMoveHandler({ target: secCellEle, clientX: coords.left + 1, clientY: coords.top + 1 });
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, secCellEle);
            expect(inst.selectionModule.dAutoFillCell).toBe('I3:I3');
            expect(secCellEle.textContent).toBe('$10');
            expect(firstCellEle.textContent).toBe('$10');
            const firstCell: CellModel = inst.sheets[0].rows[3].cells[8];
            expect(firstCell.value).toBe('10');
            expect(firstCell.formula).toBe('=D3');
            const secCell: CellModel = inst.sheets[0].rows[4].cells[8];
            expect(secCell.value).toBe('10');
            expect(secCell.formula).toBe('=D4');
            helper.getElement('#' + helper.id + '_calc_current_sheet').click();
            expect(firstCell.value).toBe('20');
            expect(secCell.value).toBe('20');
            expect(secCellEle.textContent).toBe('$20');
            expect(firstCellEle.textContent).toBe('$20');
            done();
        });
        it('Undo/redo after Fill Series with formula cell range', (done: Function) => {
            helper.triggerKeyNativeEvent(90, true);
            expect(firstCellEle.textContent).toBe('');
            expect(secCellEle.textContent).toBe('');
            let firstCell: CellModel = inst.sheets[0].rows[3].cells[8];
            expect(firstCell.formula).toBe('');
            expect(firstCell.value).toBe('');
            let secCell: CellModel = inst.sheets[0].rows[4].cells[8];
            expect(secCell.formula).toBe('');
            expect(secCell.value).toBe('');
            redoCells = inst.undoredoModule.redoCollection[0].eventArgs.beforeActionData.cellDetails;
            expect(redoCells[0].value).toBe('');
            expect(redoCells[0].formula).toBe('');
            expect(redoCells[0].autoFillText).toBe('20');
            expect(redoCells[1].value).toBe('');
            expect(redoCells[1].formula).toBe('');
            expect(redoCells[1].autoFillText).toBe('20');
            helper.triggerKeyNativeEvent(89, true);
            expect(firstCellEle.textContent).toBe('$20');
            expect(secCellEle.textContent).toBe('$20');
            firstCell = inst.sheets[0].rows[3].cells[8];
            expect(firstCell.formula).toBe('=D3');
            expect(firstCell.value).toBe('20');
            secCell = inst.sheets[0].rows[4].cells[8];
            expect(secCell.formula).toBe('=D4');
            expect(secCell.value).toBe('20');
            done();
        });
        it('Undo/redo after edit the dependent cell and recalculate the formulas', (done: Function) => {
            helper.invoke('updateCell', [{ value: '100' }, 'D3']);
            let firstCell: CellModel = inst.sheets[0].rows[3].cells[8];
            expect(firstCell.value).toBe('20');
            expect(firstCellEle.textContent).toBe('$20');
            helper.getElement('#' + helper.id + '_calc_current_sheet').click();
            expect(firstCell.value).toBe('100');
            expect(firstCellEle.textContent).toBe('$100');
            helper.triggerKeyNativeEvent(90, true);
            firstCell = inst.sheets[0].rows[3].cells[8];
            expect(firstCellEle.textContent).toBe('');
            expect(firstCell.formula).toBe('');
            expect(firstCell.value).toBe('');
            expect(redoCells[0].value).toBe('');
            expect(redoCells[0].formula).toBe('');
            expect(redoCells[0].autoFillText).toBe('100');
            helper.triggerKeyNativeEvent(89, true);
            firstCell = inst.sheets[0].rows[3].cells[8];
            expect(firstCellEle.textContent).toBe('$100');
            expect(firstCell.formula).toBe('=D3');
            expect(firstCell.value).toBe('100');
            done();
        });
    });

    describe('UI Interaction with Manual calc mode ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });

        it('Merge action', (done: Function) => {
            // Forward reverse (selection from left to right)
            helper.invoke('selectRange', ['C9:B10']);
            helper.click('#' + helper.id + '_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
            helper.click('.e-merge-alert-dlg .e-primary');
            let cell: CellModel = helper.getInstance().sheets[0].rows[8].cells[1];
            expect(cell.rowSpan).toBe(2);
            expect(cell.colSpan).toBe(2);
            expect(helper.getInstance().sheets[0].rows[8].cells[2].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[9].cells[2].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[9].cells[2].rowSpan).toBe(-1);
            let td: HTMLTableCellElement = helper.invoke('getCell', [8, 1]);
            expect(td.colSpan).toBe(2);
            expect(td.rowSpan).toBe(2);
            expect(helper.invoke('getCell', [9, 2]).style.display).toBe('none');
            done();
        });

        it('Undo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            helper.switchRibbonTab(3);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_calc_current_sheet').click();
                expect(helper.invoke('getCell', [9, 2]).style.display).toBe('');
                helper.switchRibbonTab(1);
                done();
            });
        });

        it('Redo action', (done: Function) => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [9, 2]).style.display).toBe('none');
            done();
        });
    });

    describe('CalculationMode property binding ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], calculationMode: 'Manual' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });

        it('Property binding', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.calculationMode = 'Automatic';
            spreadsheet.dataBind();
            expect(spreadsheet.calculationMode).toBe('Automatic');
            done();
        });

        it('Value Check', (done: Function) => {
            expect(helper.invoke('getCell', [9, 3]).innerText).toBe('41');
            done();
        });

        it('UpdateCell calling', (done: Function) => {
            helper.invoke('updateCell', [{ value: '=DAYS(10, 0)' }, 'O5']);
            done();
        });

        it('Cell Value Check', (done: Function) => {
            expect(helper.invoke('getCell', [4, 14]).innerText).toBe('10');
            done();
        });

        it('UpdateCell calling without address', (done: Function) => {
            helper.invoke('selectRange', ['O5']);
            helper.invoke('updateCell', [{ value: '=DAYS(100, 0)' }]);
            done();
        });

        it('Cell Value Check-1', (done: Function) => {
            expect(helper.invoke('getCell', [4, 14]).innerText).toBe('100');
            done();
        });
    });
});