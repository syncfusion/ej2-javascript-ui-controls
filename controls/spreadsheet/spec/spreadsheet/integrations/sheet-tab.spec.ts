import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

Spreadsheet.Inject(BasicModule);

/**
 *  Spreadsheet Sheet tab spec
 */

describe('Spreadsheet Sheet tab integration module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    { 
                        rangeSettings: [
                            { dataSource: defaultData }
                        ]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Add sheet icon testing', (done: Function) => {
            helper.click('.e-add-sheet-tab');
            expect(helper.getInstance().activeSheetTab).toBe(2);
            expect(helper.getInstance().sheets.length).toBe(2);
            done();
        });

        it('Sheets List icon testing', (done: Function) => {
            helper.click('.e-sheets-list');
            let popUpElem: HTMLElement = helper.getElement('.e-dropdown-popup.e-sheets-list')
            expect(popUpElem.firstElementChild.childElementCount).toBe(2);
            done();
        });

        it('Sheet rename testing', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = 'TestSheet';
            helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
            expect(helper.getInstance().sheets[1].name).toBe('TestSheet');
            done();
        });

        it('Sheet rename cancel testing', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            helper.triggerKeyEvent('keydown', 27, null, false, false, helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename'));
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename')).toBeNull();
            done();
        });

        it('Sheet rename same name alert testing', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.value = 'Sheet1';
            helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-sheet-panel .e-dialog.e-popup-open')).not.toBeNull();
                done();
            }, 10);
        });

    });

});