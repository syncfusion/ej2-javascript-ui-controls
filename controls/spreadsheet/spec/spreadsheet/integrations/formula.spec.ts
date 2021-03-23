import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel } from '../../../src';

Spreadsheet.Inject(BasicModule);

/**
 *  Formula spec
 */

describe('Spreadsheet formula module ->', () => {
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

        // it('Formula edit testing', (done: Function) => {
        //     let td: HTMLTableCellElement = helper.invoke('getCell', [5, 4]);
        //     let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
        //     //Selection update.
        //     helper.triggerMouseAction('mousedown', { x: coords.x, y: coords.y }, null, td);
        //     helper.triggerMouseAction('mouseup', { x: coords.x, y: coords.y }, null, td);
        //     //Start edit.
        //     helper.triggerMouseAction('dblclick', { x: coords.x, y: coords.y }, null, td);
        //     let editorElem: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
        //     editorElem.textContent = '=S';
        //     //key up & down - S key for update internal properties.
        //     helper.triggerKeyEvent('keydown', 83, null, false, false, editorElem);
        //     helper.triggerKeyEvent('keyup', 83, null, false, false, editorElem);
        //     setTimeout(() => {
        //         let formulaPopupLi: HTMLElement = helper.getElement('#spreadsheet_ac_popup li');
        //         expect(formulaPopupLi).not.toBeNull();
        //         expect(formulaPopupLi.textContent).toBe('SUM');
        //         setTimeout(() => {
        //             helper.triggerKeyEvent('keydown', 9, null, false, false, editorElem); //Tab key
        //             setTimeout(() => {
        //                 expect(editorElem.textContent).toBe('=SUM(');
        //                 editorElem.textContent = editorElem.textContent + '10,20';
        //                 //key down - S key for update internal properties.
        //                 helper.triggerKeyEvent('keydown', 48, null, false, false, editorElem);
        //                 //Enter key
        //                 helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
        //                 helper.invoke('getData', ['Sheet1!E6']).then((values: Map<string, CellModel>) => {
        //                     expect(values.get('E6').formula).toEqual('=SUM(10,20)');
        //                     expect(values.get('E6').value).toEqual('30');
        //                     done();
        //                 });
        //             }, 10);
        //         }, 10);
        //     }, 110);
        // });

    });

    describe('CR-Issues ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '25' }] }] }] }, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        describe('I311951 ->', () => {
            it('Formula with percentage not working', (done: Function) => {
                helper.edit('A2', '=A1*5%');
                const inst: Spreadsheet = helper.getInstance();
                expect(inst.sheets[0].rows[1].cells[0].formula).toEqual('=A1*5%');
                expect(inst.sheets[0].rows[1].cells[0].value).toEqual('1.25');
                expect(inst.getCell(1, 0).textContent).toEqual('1.25');
                inst.selectRange('A2');
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('=A1*5%');
                    done();
                });
            });
        });
    });
});