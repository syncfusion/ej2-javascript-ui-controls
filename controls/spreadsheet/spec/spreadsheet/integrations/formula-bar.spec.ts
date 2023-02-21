import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { DefineNameModel } from '../../../src';
import { getRangeAddress } from "../../../src/index";
import { getComponent } from '@syncfusion/ej2-base';

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
        it('Undo & Redo after adding Defined Name', (done: Function) => {
            let definedNames: DefineNameModel[] = helper.getInstance().definedNames;
            helper.click('#spreadsheet_undo');
            expect(definedNames.length).toBe(0);
            helper.click('#spreadsheet_redo');
            expect(definedNames.length).toBe(1);
            done();
        });

        it('Name box pop up select', (done: Function) => {
            setTimeout(() => {
                let nameBoxElem: HTMLElement = helper.getElementFromSpreadsheet('.e-name-box .e-ddl-icon');
                helper.triggerMouseAction('mousedown', null, nameBoxElem, nameBoxElem);
                nameBoxElem.click();
                setTimeout(() => {
                    helper.click('#spreadsheet_name_box_popup .e-active');
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
        it('Edit formual in Formula bar using shift key', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.edit('I1','=SUM(F2:F5);');
            helper.triggerKeyNativeEvent(13);
            helper.invoke('selectRange', ['I1']);
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            helper.triggerKeyEvent('keydown', 16, null, false, false, editorElem);
            expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('');
            helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('');
            done();
        });
        it('Edit formual in Formula bar using Space', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            helper.triggerKeyEvent('keyup', 32, null, false, false, editorElem);
            expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('');
            helper.triggerKeyNativeEvent(13);
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('');
            done();
        });
        it('Name box editing for Whole Row', (done: Function) => {
            helper.invoke('selectRange', [getRangeAddress([7, 0, 7, helper.getInstance().sheets[0].colCount - 1])]);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = 'Test';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                helper.invoke('selectRange', ['A1']);
                let nameBoxElem: HTMLElement = helper.getElementFromSpreadsheet('.e-name-box .e-ddl-icon');
                helper.triggerMouseAction('mousedown', null, nameBoxElem, nameBoxElem);
                nameBoxElem.click();
                setTimeout(() => {
                    helper.click('#spreadsheet_name_box_popup li:nth-child(2)');
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('A8:CV8');
                    done();
                }, 20);
            }, 20);
        });
        it('Name box editing for Whole Column', (done: Function) => {
            helper.invoke('selectRange', [getRangeAddress([0, 7, helper.getInstance().sheets[0].rowCount, 7])]);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = 'Test1';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                helper.invoke('selectRange', ['A1']);
                let nameBoxElem: HTMLElement = helper.getElementFromSpreadsheet('.e-name-box .e-ddl-icon');
                helper.triggerMouseAction('mousedown', null, nameBoxElem, nameBoxElem);
                nameBoxElem.click();
                setTimeout(() => {
                    helper.click('#spreadsheet_name_box_popup li:nth-child(3)');
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('H1:H101');
                    done();
                }, 20);
            }, 20);
        });
        it('Formula bar edit with Scrollig', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.getContentElement().parentElement.scrollTop = 400;
            setTimeout(() => {
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].topLeftCell).toEqual('D3');
                    done();
                }, 10);
            }, 20);
        });
        it('Formula bar edit alert with Protect Sheet', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.invoke('protectSheet', ['Sheet1', {}]);
            setTimeout(() => {
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                setTimeout(() => {
                    helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                    expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                    helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
        });
        it('Formula Insert Function Dialog alert with Protect Sheet', (done: Function) => {
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Close Formula Dialog by Cancel Button', (done: Function) => {
            helper.invoke('unprotectSheet', ['Sheet1']);
            setTimeout(() => {
                helper.click('.e-formula-bar-panel .e-insert-function');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                    expect(helper.getElement('.e-spreadsheet-function-dlg.e-dialog')).not.toBeNull();
                    helper.click('.e-spreadsheet-function-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.getElement('.e-spreadsheet-function-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });
        it('Click Ok Button in Formula Dialog with Editing', (done: Function) => {
            helper.invoke('selectRange', ['I4']);
            helper.triggerKeyNativeEvent(113);
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                helper.click('.e-spreadsheet-function-dlg .e-footer-content button:nth-child(1)');
                helper.getElement('.e-spreadsheet-edit').textContent = '=ABS(F5);';
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [3, 8]).textContent).toBe('300');
                done();
            });
        });
        it('Click Ok Button in Formula Dialog without Editing', (done: Function) => {
            helper.invoke('selectRange', ['I5']);
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                helper.click('.e-spreadsheet-function-dlg .e-footer-content button:nth-child(1)');
                helper.getElement('.e-spreadsheet-edit').textContent = '=ABS(F5);';
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [4, 8]).textContent).toBe('300');
                done();
            });
        });
    });

    describe('UI - Interaction', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Double Click in Formula Dialog->', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                let editorElem: HTMLDialogElement = <HTMLDialogElement> helper.getElementFromSpreadsheet('.e-spreadsheet-function-dlg .e-formula-list .e-list-parent .e-list-item');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('dblclick', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                helper.getElement('.e-spreadsheet-edit').textContent = '=ABS(F5);';
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [0, 8]).textContent).toBe('300');
                done();
            });
        });
        it('Double Click in Formula Dialog in with Editing->', (done: Function) => {
            helper.invoke('selectRange', ['I2']);
            helper.triggerKeyNativeEvent(113);
            helper.triggerKeyNativeEvent(13);
            helper.triggerKeyNativeEvent(113);
            helper.triggerKeyNativeEvent(114, false, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                let editorElem: HTMLDialogElement = <HTMLDialogElement> helper.getElementFromSpreadsheet('.e-spreadsheet-function-dlg .e-formula-list .e-list-parent .e-list-item');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('dblclick', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [1, 8]).textContent).toBe('');
                done();
            });
        });
        it('Selecting Formula Category in Formula Dialog->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout(() => {
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                const ddlObj: any = getComponent(helper.getElement('.e-spreadsheet-function-dlg .e-dlg-content .e-input-group').querySelector('.e-dropdownlist'), 'dropdownlist');
                ddlObj.showPopup();
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(2)');
                    expect(helper.getElement('#' + helper.id + '_formula_category').value).toBe('Math & Trig');
                    done();
                });
            }, 20);
        });
        it('Selecting "All" Formula Category in Formula Dialog->', (done: Function) => {
            helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
            const ddlObj: any = getComponent(helper.getElement('.e-spreadsheet-function-dlg .e-dlg-content .e-input-group').querySelector('.e-dropdownlist'), 'dropdownlist');
            ddlObj.showPopup();
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(1)');
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_formula_category').value).toBe('All');
                    helper.click('.e-spreadsheet-function-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.getElement('.e-spreadsheet-function-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });
    });

    describe('CR-issues->', () => {
        describe('EJ2-50374, EJ2-54291,EJ2-55782->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.numberFormat('dd/MM/yyyy', "B2");
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50374 - NameBox takes cell address as value instead navigates to corresponding cell', (done: Function) => {
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_name_box').click();
                    let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                    nameBox.value = 'F2';
                    helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('F2:F2');
                    nameBox.value = 'D5';
                    helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                    expect(helper.getInstance().sheets[0].selectedRange).toEqual('D5:D5');
                    done();   
                 }, 20); 
            });
            it('EJ2-54291 - For Custom Date format, value displayed in formula bar is incorrect->', (done: Function) => {
                helper.invoke('selectRange', ['B2']);
                helper.invoke('updateCell', [{ value: '19/11/2030' }, 'B2']);
                expect(helper.getInstance().sheets[0].rows[1].cells[1].format).toBe('dd/MM/yyyy');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('19/11/2030');
                expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('19/11/2030');
                done();
            });
            it('EJ2-55782 - Custom date (DD/MM/YY) formatted value data get interchanged for date and month values->', (done: Function) => {
                helper.invoke('selectRange', ['B3']);
                helper.invoke('updateCell', [{ value: '18/10/2020' }, 'B3']);
                expect(helper.invoke('getCell', [2, 1]).textContent).toBe('18/10/2020');
                expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('18/10/2020');
                helper.invoke('selectRange', ['B4']);
                helper.invoke('updateCell', [{ value: '02/04/21' }, 'B4']);
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('2/4/2021');
                expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('02/04/21');
                done();
            });
        });
    });
});