import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { DefineNameModel } from '../../../src';

Spreadsheet.Inject(BasicModule);

/**
 *  Formula bar spec
 */

describe('Spreadsheet formula bar module ->', () => {
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

        it('Name box editing', (done: Function) => {
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = 'TestName';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                nameBox.classList.remove('e-name-editing');
                let definedNames: DefineNameModel[] = helper.getInstance().definedNames;
                expect(definedNames.length).toBe(1);
                expect(definedNames[0].name).toBe('TestName');
                done();
            }, 20);
        });

        it('Name box pop up select', (done: Function) => {
            setTimeout(() => {
                let nameBoxElem: HTMLElement = helper.getElementFromSpreadsheet('.e-name-box .e-ddl-icon');
                helper.triggerMouseAction('mousedown', null, nameBoxElem, nameBoxElem);
                nameBoxElem.click();
                setTimeout(() => {
                    helper.click('#spreadsheet_name_box_popup .e-item-focus');
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('A1:A1');
                    done();
                }, 20);
            }, 20);
        });

        it('Collapse expand testing', (done: Function) => {
            setTimeout(() => {
                helper.click('.e-formula-bar-panel .e-drop-icon');
                expect(helper.hasClass('e-expanded', helper.getFormulaBarElement())).toBeTruthy();
                helper.click('.e-formula-bar-panel .e-drop-icon');
                expect(helper.hasClass('e-expanded', helper.getFormulaBarElement())).toBeFalsy();
                done();
            }, 20);
        });

    });

});