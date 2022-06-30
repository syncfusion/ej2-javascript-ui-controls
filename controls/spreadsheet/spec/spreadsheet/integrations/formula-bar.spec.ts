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
                        ranges: [{ dataSource: defaultData }]
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
        it('Formula bar update for updateCell', (done: Function) => {
            helper.getInstance().updateCell({ value: "updated value" }, helper.getInstance().getActiveSheet().activeCell);
            expect(helper.getElement('#' + helper.id + '_formula_input').value).toBe("updated value");
            helper.invoke('selectRange', ['A2']);
            helper.getInstance().updateCell({ formula: "=sum(1+1)" }, helper.getInstance().getActiveSheet().activeCell);
            expect(helper.getElement('#' + helper.id + '_formula_input').value).toBe("=sum(1+1)");
            done();
        });
    });

    describe('CR-issues->', () => {
        describe('EJ2-50374->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('NameBox takes cell address as value instead navigates to corresponding cell', (done: Function) => {
                helper.getElement('#' + helper.id + '_name_box').click();
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.value = 'F2';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                expect(helper.getInstance().sheets[0].selectedRange).toEqual('F2:F2');
                setTimeout(() => {
                    nameBox.value = 'D5';
                    helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('D5:D5');
                    done();
                });      
            });
        });
        describe('EJ2-54291->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'B2' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.numberFormat('dd/MM/yyyy', "B2");
                    }  
                }
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('For Custom Date format, value displayed in formula bar is incorrect->', (done: Function) => {
                helper.edit('B2', '19/11/2030');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[1].format).toBe('dd/MM/yyyy');
                    expect(helper.invoke('getCell', [1, 1]).textContent).toBe('19/11/2030');
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('19/11/2030');
                    done();
                });
            });
        });
        describe('EJ2-55782->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Custom date (DD/MM/YY) formatted value data get interchanged for date and month values->', (done: Function) => {
                helper.edit('B2', '18/10/2020');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 1]).textContent).toBe('18/10/2020');
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('18/10/2020');
                    helper.edit('B3', '02/04/21');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [2, 1]).textContent).toBe('2/4/2021');
                        expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('2/4/2021');
                        done();
                    });
                });
            });
        });
    });
});