import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, DialogBeforeOpenEventArgs, Spreadsheet, getCell, SheetModel, ValidationModel, setCell } from '../../../src/index';
import { getComponent, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SpreadsheetModel } from '../../../src/spreadsheet/index';


describe('Data validation ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('Public Method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData
                    }],
                    rows: [{ cells: [{ validation: { type: 'List', value1: '=Sheet2!A2:A11' }, notes: 'Syncfusion' }] }]
                },
                {
                    ranges: [{ dataSource: defaultData }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Adding validation', (done: Function) => {
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0].validation)).toBe('{"type":"List","value1":"=Sheet2!A2:A11","ignoreBlank":true,"inCellDropDown":true}');
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
            expect(cellEle.querySelector('.e-addNoteIndicator')).not.toBeNull();
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'LessThanOrEqualTo', value1: '12' }, 'A2:A7']);
            const sheet: SheetModel = helper.getInstance().sheets[0];
            const cell: CellModel = sheet.rows[1].cells[0];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"TextLength","operator":"LessThanOrEqualTo","value1":"12"}');
            helper.invoke('addInvalidHighlight', ['A2:A7']);
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('removeInvalidHighlight', ['A2:A7']);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            helper.invoke('removeDataValidation', ['A2:A7']);
            expect(sheet.rows[1].cells[0].validation).toBeUndefined();
            helper.invoke('addDataValidation', [{ type: 'WholeNumber', operator: 'Between' }, 'B2:B7']);
            expect(sheet.rows[1].cells[1].validation).toBeUndefined();
            done();
        });
        it('Add list validation', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'D2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            helper.invoke('selectRange', ['D2']);
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(cellEle.querySelector('.e-validation-list')).toBeNull();
            expect(cellEle.querySelector('.e-addNoteIndicator')).not.toBeNull();
            const td: HTMLElement = helper.invoke('getCell', [1, 3]).children[0];
            expect(td.classList).toContain('e-validation-list');
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
            helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
            (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                expect(helper.getInstance().sheets[0].rows[1].cells[3].value).toBe(13);
                expect(helper.invoke('getCell', [1, 3]).innerText).toBe('13');
                helper.editInUI('15');
                setTimeout(() => {
                    expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                    done();
                }, 10);
            }, 10);
        });
        it('Add list validation using updateCell method and select formatted value from dropdown', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[7];
            expect(cell.validation).toBeUndefined();
            const cellEle: HTMLElement = helper.invoke('getCell', [1, 7]);
            expect(cellEle.children.length).toBe(0);
            helper.invoke('updateCell', [{ validation: { type: 'List', value1: '12.5%,24.7%,35.6%' } }, 'H2']);
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12.5%,24.7%,35.6%"}');
            expect(cellEle.children.length).toBe(1);
            let validationEle: Element = cellEle.children[0];
            expect(validationEle.classList).toContain('e-validation-list');
            let validationInput: any = validationEle.querySelector('.e-dropdownlist');
            validationInput.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: validationEle });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup.e-popup-open li:nth-child(2)');
                expect(cell.value).toBe('0.247');
                expect(cell.format).toBe('0.00%');
                expect(cellEle.innerText).toBe('24.70%');
                expect(helper.getElement(`#${helper.id}_formula_input`).value).toBe('24.70%');
                helper.invoke('updateCell', [{ validation: { type: 'List', value1: '$10.25,$20.35,$20.768' }, format: 'General' }, 'H2']);
                expect(cellEle.children.length).toBe(1);
                validationEle = cellEle.children[0];
                expect(validationEle.classList).toContain('e-validation-list');
                validationInput = validationEle.querySelector('.e-dropdownlist');
                validationInput.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: validationEle });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup.e-popup-open li:nth-child(3)');
                    expect(cell.value).toBe('20.768');
                    expect(cell.format).toBe('$#,##0.00');
                    expect(cellEle.innerText).toBe('$20.77');
                    expect(helper.getElement(`#${helper.id}_formula_input`).value).toBe('20.768');
                    done();
                }, 10);
            }, 10);
        });
        it('Removing list validation by changing the validation using updateCell method', (done: Function) => {
            helper.invoke('updateCell', [{ validation: { type: 'WholeNumber', operator: 'LessThan', value1: '20' } }, 'H2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[7];
            expect(cell.validation.type).toBe('WholeNumber');
            let cellEle: HTMLElement = helper.invoke('getCell', [1, 7]);
            expect(cellEle.querySelector('.e-validation-list')).toBeNull();
            expect(cellEle.innerText).toBe('$20.77');
            helper.invoke('updateCell', [{ validation: { type: 'List', value1: '100,200,200' } }, 'H3']);
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[7].validation)).toBe('{"type":"List","value1":"100,200,200"}');
            expect(helper.invoke('getCell', [2, 7]).querySelector('.e-validation-list')).toBeNull();
            done();
        });
        it('Changing allowDataValidation property and checking the list validation applied cell', (done: Function) => {
            helper.invoke('selectRange', ['H3:H3']);
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 7]);
            expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.allowDataValidation = false;
            spreadsheet.dataBind();
            expect(cellEle.querySelector('.e-validation-list')).toBeNull();
            spreadsheet.allowDataValidation = true;
            spreadsheet.dataBind();
            helper.invoke('selectRange', ['H2:H2']);
            expect(cellEle.querySelector('.e-validation-list')).toBeNull();
            helper.invoke('selectRange', ['H3:H3']);
            expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
            done();
        });
        it('907563-Data validation extend alert dialog should not be shown when selecting a range of cells with validation applied', (done: Function) => {
            helper.invoke('selectRange', ['V1:V10']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'V1:V10']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const validationAlert = helper.getElements('.e-extendvalidation-dlg.e-dialog');
                expect(validationAlert.length).toBe(0);
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).not.toBeNull();
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                done();
            });
        });
        it('907653-Data validation extend alert dialog shown mistakenly when selecting a validation applied column', (done: Function) => {
            helper.invoke('selectRange', ['B1:B100']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=A1:A5' }, 'B:B']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const validationAlert = helper.getElements('.e-extendvalidation-dlg.e-dialog');
                expect(validationAlert.length).toBe(0);
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).not.toBeNull();
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                done();
            });
        });
        it('Column list validation with formula dropdown checking', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=A1:A5' }, 'B:B']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).not.toBeNull();
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog .e-dlg-content .e-values .e-input').value).toBe('=A2:A6');
                helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                const tdEle: HTMLElement = helper.invoke('getCell', [1, 1]);
                const listEle: any = tdEle.querySelector('.e-dropdownlist');
                listEle.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: tdEle.firstElementChild });
                setTimeout(() => {
                    expect(helper.getElement('.e-ddl.e-popup li:nth-child(1)').textContent).toBe('Casual Shoes');
                    expect(helper.getElement('.e-ddl.e-popup li:nth-child(4)').textContent).toBe('Sandals & Floaters');
                    expect(helper.getElement('.e-ddl.e-popup li:nth-child(5)').textContent).toBe('Flip- Flops & Slippers');
                    helper.click('.e-ddl.e-popup li:nth-child(4)');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe('Sandals & Floaters');
                        expect(tdEle.innerText).toBe('Sandals & Floaters');
                        done();
                    });
                });
            });
        });
        it('Extend Alert dialog content changes checking', (done: Function) => {
            helper.invoke('selectRange', ['C2:B2']);
            const spreadsheet: any = helper.getInstance(); let dlgCont: string;
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs) => {
                if (args.dialogName === 'ExtendValidation') {
                    dlgCont = 'The selection contains some cells without data validation. Do you want to extend validation to these cells?';
                    expect(args.content).toBe(dlgCont);
                    expect(helper.getElement('.e-goto-dlg.e-dialog .e-dlg-content').textContent).toBe(dlgCont);
                    dlgCont = args.content = 'Do you want to extend validation to cells without data validation?';
                }
            };
            spreadsheet.dataBind();
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                expect(helper.getElement('.e-goto-dlg.e-dialog .e-dlg-content').textContent).toBe(dlgCont);
                helper.getElement('.e-goto-dlg.e-dialog .e-footer-content').children[0].click();
                spreadsheet.dialogBeforeOpen = undefined;
                setTimeout(() => {
                    expect(helper.getElement('.e-datavalidation-dlg.e-dialog .e-dlg-content .e-allowdata .e-allow .e-dropdownlist').value).toBe('List');
                    expect(helper.getElement('.e-datavalidation-dlg.e-dialog .e-dlg-content .e-values .e-input').value).toBe('=B2:B6');
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                    expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });
    });

    describe('931171-No results Found', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add list validation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.invoke('addDataValidation', [{
                type: 'List',
                value1: '=#REF!',
                ignoreBlank: true,
                inCellDropDown: true
            }, 'D2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"=#REF!","ignoreBlank":true,"inCellDropDown":true}');
            const cellElement: HTMLElement = helper.invoke('getCell', [1, 3]);
            const dropdownElement = cellElement.querySelector('.e-dropdownlist');
            const dropdownInstance = (dropdownElement as any).ej2_instances[0];
            dropdownInstance.dropDownClick({ preventDefault: function () { }, target: cellElement });
            setTimeout(() => {
                const popupElement = helper.getElements('.e-ddl.e-popup')[0];
                expect(popupElement).not.toBeNull();
                expect(popupElement.textContent).toBe('');
                dropdownInstance.hidePopup();
                setTimeout(() => {
                    done();
                });
            });
        });
    });
    
    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData
                    }],
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add Data validation', (done: Function) => {
            helper.invoke('selectRange', ['E3:E2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
                helper.editInUI('26');
                setTimeout(() => {
                    expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.invoke('getCell', [1, 4]).textContent).toBe('20');
                    done();
                });
            });
        });

        it('Highlight invalid data', (done: Function) => {
            helper.invoke('updateCell', [{ value: 26 }, 'E2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(255, 0, 0)');
                done();
            });
        });

        it('Remove highlight', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(3)');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(0, 0, 0)');
                done();
            });
        });

        it('Remove data validation', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(4)');
                expect(helper.getInstance().sheets[0].rows[1].cells[4].validation).toBeUndefined();
                helper.editInUI('30');
                expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(0);
                done();
            });
        });

        it('Dialog interaction', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: ddlElem.parentElement });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(5)');
                    ddlElem = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: ddlElem.parentElement });
                    setTimeout(() => {
                        helper.click('.e-ddl.e-popup li:nth-child(3)');
                        setTimeout(() => {
                            helper.triggerKeyNativeEvent(9);
                            helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = 'dumm';
                            helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                            helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                            // helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)'); // This case need to be fixed
                            // expect(helper.getElements('.e-datavalidation-dlg .e-values .e-dlg-error')[0].textContent).toBe('Please enter a correct value.'); // This case need to be fixed
                            helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '3';
                            helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"TextLength","operator":"EqualTo","value1":"3","value2":"","ignoreBlank":true,"inCellDropDown":null}');
                            done();
                        });
                    });
                });
            });
        });

        it('Add list validation for range', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=G2:G6' }, 'D2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"=G2:G6"}');
            helper.invoke('selectRange', ['D2']);
            const td: HTMLElement = helper.invoke('getCell', [1, 3]).children[0];
            expect(td.classList).toContain('e-validation-list');
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
            helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
            (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(4)');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[1].cells[3].value).toBe(11); // Check this now
                    expect(helper.invoke('getCell', [1, 3]).innerText).toBe('11'); // check this now
                    helper.editInUI('10');
                    setTimeout(() => {
                        expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(0);
                        done();
                    });
                });
            });
        });

        it('Add list validation for range of Whole column', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=G:G';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8].validation)).toBe('{"type":"List","operator":"Between","value1":"=G:G","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                const td: HTMLElement = helper.invoke('getCell', [0, 8]).children[0];
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    expect(helper.getElements('.e-ddl.e-popup ul')[0].textContent).toBe('Discount15711101336129');
                    helper.click('.e-ddl.e-popup li:nth-child(4)');
                    done();
                });
            });
        });

        it('Highlight invalid data after applying whole column validation', (done: Function) => {
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(2)');
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            const td: HTMLElement = helper.invoke('getCell', [1, 4]);
            expect(getCell(1, 4, sheet).validation.isHighlighted).toBeTruthy();
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            done();
        });

        it('Clear Highlight after applying whole column validation', (done: Function) => {
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(3)');
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            const td: HTMLElement = helper.invoke('getCell', [1, 4]);
            expect(getCell(1, 4, sheet).validation.isHighlighted).toBeFalsy();
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            done();
        });

        it('Whole number with negative value', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                helper.getElement('.e-datavalidation-dlg #minvalue').value = '-10';
                helper.getElement('.e-datavalidation-dlg #maxvalue').value = '-5';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content .e-primary');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"-10","value2":"-5","ignoreBlank":true,"inCellDropDown":null}');
                helper.editInUI('5');
                setTimeout(() => {
                    expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                    helper.editInUI('-5');
                    setTimeout(() => {
                        expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(0);
                        expect(helper.invoke('getCell', [1, 7]).textContent).toBe('-5');
                        done();
                    });
                });
            });
        });

        it('Text length does not accept negative value', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlObj : DropDownList = getComponent(helper.getElement('.e-datavalidation-dlg .e-allow .e-dropdownlist'), 'dropdownlist');
                ddlObj.value = 'Text Length';
                ddlObj.dataBind();
                helper.getElement('.e-datavalidation-dlg .e-minimum input').value = '-10';
                helper.getElement('.e-datavalidation-dlg .e-maximum input').value = '-5';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content .e-primary');
                expect(helper.getElement('.e-datavalidation-dlg .e-dlg-error').textContent).toBe('Please enter a correct value.');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(3)');
                expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                done();
            });
        });

        it('Undo on cell format removes data validation', (done: Function) => {
            helper.invoke('selectRange', ['E2']);
            helper.switchRibbonTab(1);
            helper.click('#' + helper.id + '_bold');
            helper.click('#' + helper.id + '_undo');
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[4];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"TextLength","operator":"EqualTo","value1":"3","value2":"","ignoreBlank":true,"inCellDropDown":null}');
            expect(cell.style).toBeUndefined();
            expect(helper.invoke('getCell', [1, 4]).style.fontWeight).toBe('');
            done();
        });
    });

    describe('EJ2-931141, EJ2-931143, EJ2-933042->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply data validation to the entire column', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg .e-cellrange .e-input')[0].value = 'D:D';
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].columns[3].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
                done();
            });
        });
        it('Reapply data validation to the data validation applied column', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg .e-cellrange .e-input')[0].value = 'D:D';
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '43';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '54';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].columns[3].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"43","value2":"54","ignoreBlank":true,"inCellDropDown":null}');
                done();
            });
        });
        it('Undo the reapplied data validation', (done: Function) => {
            expect(JSON.stringify(helper.getInstance().sheets[0].columns[3].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"43","value2":"54","ignoreBlank":true,"inCellDropDown":null}');
            helper.switchRibbonTab(1);
            helper.click('#' + helper.id + '_undo');
            expect(JSON.stringify(helper.getInstance().sheets[0].columns[3].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
            done();
        });
        it('Apply data validation to the entire column', (done: Function) => {
            helper.invoke('selectRange', ['E3']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg .e-cellrange .e-input')[0].value = 'E:E';
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].columns[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
                done();
            });
        });
        it('Clear intermediate validations within the applied column validation ranges ', (done: Function) => {
            helper.invoke('selectRange', ['E2:E5']);
            expect(JSON.stringify(helper.getInstance().sheets[0].columns[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            expect(JSON.stringify(helper.getInstance().sheets[0].columns[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null,"address":"E1:E1 E6:E1048576"}');
            done();
        });
        it('Undo the data validation removal action', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#' + helper.id + '_undo');
            expect(JSON.stringify(helper.getInstance().sheets[0].columns[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
            done();
        });
    });

    describe('Open pop up and then destroy spreadsheet ->', () => {
        const model: SpreadsheetModel = { sheets: [{ ranges: [{ dataSource: defaultData }] }]}
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet(model, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Open pop up and then destroy spreadsheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.invoke('destroy');
            setTimeout(() => {
                new Spreadsheet(model, '#' + helper.id);
                setTimeout(() => {
                    expect(document.getElementById('spreadsheet_datavalidation-popup') as HTMLElement).toBeNull;
                    helper.switchRibbonTab(4);
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    done();
                });
            });
        });
    });

    describe('UI Interaction III ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData
                    }],
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking for Extend validation dialog', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '15';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.invoke('selectRange', ['D2:D10']);
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                    helper.click('.e-goto-dlg .e-footer-content button:nth-child(3)');
                    done();
                });
            });
        });

        it('Clicking No option in Extend validation dialog', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                helper.getElements('.e-goto-dlg .e-primary')[1].click();
                setTimeout(() => {
                    const typeContainer: any = helper.getElement('.e-datavalidation-dlg.e-dialog .e-dlg-content .e-allowdata');
                    expect(typeContainer.querySelector('.e-allow .e-dropdownlist').value).toBe('Whole Number');
                    expect(typeContainer.querySelector('.e-data .e-dropdownlist').value).toBe('Between');
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                    expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });

        it('Checking for More validation dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThanOrEqualTo', value1: '20' }, 'E:E');
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'EqualTo', value1: '15' }, 'F4');
            helper.invoke('selectRange', ['E4:F4']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                helper.getElements('.e-goto-dlg .e-primary')[0].click();
                setTimeout(() => {
                    const typeContainer: any = helper.getElement('.e-datavalidation-dlg.e-dialog .e-dlg-content .e-allowdata');
                    expect(typeContainer.querySelector('.e-allow .e-dropdownlist').value).toBe('Whole Number');
                    expect(typeContainer.querySelector('.e-data .e-dropdownlist').value).toBe('Between');
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElement('.e-datavalidation-dlg .e-footer-content').children[1].click();
                    expect(helper.getElement('.e-datavalidation-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });

        it('Check MMinMaxError in Between Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D11:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Between';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '60';
                helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '45';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                expect(helper.getElements('.e-dlg-error')[0].textContent).toBe('The Maximum must be greater than or equal to the Minimum.');
                done();
            });
        });

        it('Check ListLengthError in List  Datavalidation', (done: Function) => {
            let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
            ddlElement.ej2_instances[0].value = 'List';
            ddlElement.ej2_instances[0].dataBind();
            helper.getElements('.e-datavalidation-dlg .e-input')[2].value = 'Syncfusion JavaScript (Essential JS 2) is a modern UI Controls library that has been built from the ground up to be lightweight, responsive, modular and touch friendly. It is written in TypeScript and has no external dependencies. It also includes complete support for Angular, React, Vue, ASP.NET MVC and ASP.NET Core frameworks.';
            helper.triggerKeyEvent('keyup', 110, null, null, null, helper.getElements('.e-datavalidation-dlg .e-input')[2]);
            helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
            helper.click('.e-datavalidation-dlg .e-primary');
            expect(helper.getElements('.e-dlg-error')[0].textContent).toBe('The list values allows only upto 256 characters');
            done();
        });

        it('Keyup handler other than code 13', (done: Function) => {
            let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
            ddlElement.ej2_instances[0].value = 'Whole Number';
            ddlElement.ej2_instances[0].dataBind();
            (helper.getElements('.e-datavalidation-dlg input')[3] as HTMLInputElement).value = '45';
            (helper.getElements('.e-datavalidation-dlg input')[4] as HTMLInputElement).value = '50';
            helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-datavalidation-dlg input')[3] as HTMLInputElement));
            var btnElem = (helper.getElements('.e-datavalidation-dlg .e-primary')[0] as HTMLInputElement).disabled;
            expect(btnElem).toBeFalsy();
            helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
            helper.click('.e-datavalidation-dlg .e-primary');
            done();
        });

        it('Open popup', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'C2']);
            helper.invoke('selectRange', ['C2']);
            const td1: HTMLElement = helper.invoke('getCell', [1, 2]).children[0];
            (td1.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td1.children[0] });
            setTimeout(() => {
                (helper.getElements('.e-list-item')[0] as HTMLElement) .click();
                done(); 
            });          
        });

        it('Defined name with Open popup', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDefinedName({name: 'value', refersTo: '=Sheet1!D2:D5'});
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=value' }, 'C3']);
            helper.invoke('selectRange', ['C3']);
            const td1: HTMLElement = helper.invoke('getCell', [2, 2]).children[0];
            (td1.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td1.children[0] });
            setTimeout(() => {
                const popupLength: number = document.getElementsByClassName('e-list-parent').length;
                expect(popupLength).toBe(1);
                (helper.getElements('.e-list-item')[0] as HTMLElement).click();
                done();
            });  
        });

        it('Defined name - text with apostofe', (done: Function) => {
            helper.invoke('updateCell', [{ value: '2"0' }, 'D3']);
            helper.invoke('selectRange', ['A1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=value';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0].validation)).toBe('{"type":"List","operator":"Between","value1":"=value","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                done();     
            });
        });

        it('Defined name with Open popup - without scrolling', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDefinedName({name: 'value1', refersTo: '=Sheet1!D50:D55'})
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=value1' }, 'F2']);
            helper.invoke('selectRange', ['F2']);
            const td1: HTMLElement = helper.invoke('getCell', [1, 5]).children[0];
            (td1.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td1.children[0] });
            setTimeout(() => {
                const popupLength: number = document.getElementsByClassName('e-list-parent').length;
                expect(popupLength).toBe(1);
                (helper.getElements('.e-list-item')[0] as HTMLElement).click();
                done();
            });         
        });

        it('List validation throws script error on providing the wrong defined name', (done: Function) => {
            helper.invoke('selectRange', ['J2:J10']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[2].value = '=Sync';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                expect(helper.getElements('.e-dlg-error')[0].textContent).toBe('A named range you specified cannot be found.');
                (document.querySelectorAll('.e-datavalidation-dlg.e-control.e-btn.e-lib.e-flat')[2] as HTMLElement).click();
                done();
            });
        });

        it('Applying bg color and font color on data validation highlighted cells', (done: Function) => {
            helper.invoke('addInvalidHighlight', []);
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cellEle.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('cellFormat', [{ backgroundColor: '#000080' }, 'A1']);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cellEle.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('cellFormat', [{ color: '#e7e6e6' }, 'A1']);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cellEle.style.color).toBe('rgb(255, 0, 0)');
            done();
        });

        it('ProtectSheet with Listvalidation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDefinedName({ name: 'value2', refersTo: '=Sheet1!D2:D5' });
            helper.invoke('addDataValidation', [{ type: 'List', value1: '=value2' }, 'E2']);
            helper.invoke('selectRange', ['E2']);
            helper.switchRibbonTab(4);
            spreadsheet.protectSheet('Sheet1', { selectCells: true });
            const ddlObj: any = getComponent(helper.invoke('getCell', [1, 4]).querySelector('.e-dropdownlist'), 'dropdownlist');
            ddlObj.showPopup();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_protect').textContent).toBe('Unprotect Sheet');
                (helper.getElements('.e-list-item')[0] as HTMLElement).click();
                expect(helper.getElements('.e-editAlert-dlg.e-dialog').length).toBe(1);
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                done();
            });         
        });
    });
 
    describe('UI Interaction II ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData
                    }],
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply undo & redo after Highlight the invalid Data', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                spreadsheet = helper.getInstance();
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null}');
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                helper.switchRibbonTab(1);
                helper.click('#spreadsheet_undo');
                expect(spreadsheet.sheets[0].rows[0].cells[7].validation).toBeUndefined();
                expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('');
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                done();
            });
        });
        it('Apply undo & redo after remove the Highlight', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(3)');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null}');
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 255)');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[7].validation).toBeUndefined();
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('');
            helper.click('#spreadsheet_redo');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null}');
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('');
            done();
        });
        it('Apply undo & redo after remove Validation', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(2)');
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 255)');
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            helper.click('#spreadsheet_redo');
            expect(helper.invoke('getCell', [0, 7]).style.backgroundColor).toBe('rgb(255, 255, 255)');
            done();
        });
        it('Add list validation and remove list validation', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'D2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            helper.invoke('selectRange', ['D2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            expect(JSON.stringify(cell.validation)).toBeUndefined();
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(3)');
            done();
        });

        it('List validation for row', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=3:3';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8].validation)).toBe('{"type":"List","operator":"Between","value1":"=3:3","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                const td: HTMLElement = helper.invoke('getCell', [0, 8]).children[0];
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                expect(helper.getElements('.e-ddl.e-popup ul')[0].textContent).toBe('Sports Shoes6/11/20145:56:32 AM2030600550');
                helper.click('.e-ddl.e-popup li:nth-child(4)');
                done();
            });
        });

        it('Full column selection with Listvalidation', (done: Function) => {
            helper.invoke('selectRange', ['A1:A200']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '11,12,13';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[199].cells[0].validation)).toBe('{"type":"List","operator":"Between","value1":"11,12,13","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.click('.e-datavalidation-dlg .e-clearall-btn');
                    helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                    expect(JSON.stringify(helper.getInstance().sheets[0].rows[199].cells[0].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"0","value2":"0","ignoreBlank":true,"inCellDropDown":null}');
                    done();
                });
            });
        });

        it('Key press in datavalidation dialog input', (done: Function) => {
            helper.invoke('selectRange', ['A2:A5']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                var btnElem = helper.getElements('.e-datavalidation-dlg .e-primary')[0].disabled;
                expect(btnElem).toBeTruthy();
                helper.triggerKeyEvent('keyup', 110, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0]);
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '11,12,13';
                btnElem = helper.getElements('.e-datavalidation-dlg .e-primary')[0].disabled;
                expect(btnElem).toBeFalsy();
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                done();
            });
        });

        it('Double click to open pop up', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            let td: HTMLElement = helper.invoke('getCell', [2, 0]);
            let coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, td);
            setTimeout(() => {
                helper.getElements('#spreadsheetlistValid_options .e-list-item')[0].click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['C3']);
                    expect(helper.invoke('getCell', [2, 0]).textContent).toBe('11');
                    done();
                });
            });
        });

        it('Providing formula in value1 and value2 input', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                (helper.getElements('.e-datavalidation-dlg input')[3] as HTMLInputElement).value = '=SUM(10,10)';
                (helper.getElements('.e-datavalidation-dlg input')[4] as HTMLInputElement).value = '=SUM(20,30)';
                helper.click('.e-datavalidation-dlg .e-primary');
                setTimeout(() => {
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(2)');
                    expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    done();
                });
            });
        });

        it('Equal To Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"EqualTo","value1":"10","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Not Equal To Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Not Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"NotEqualTo","value1":"10","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Greater Than Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '8';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"GreaterThan","value1":"8","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Lesss Than Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Less Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '15';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"LessThan","value1":"15","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });
        it('EJ2-895601-Data validation is not cleared properly, when columns have both column and cell validation.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Decimal', operator: 'GreaterThan', value1: '50.00' }, 'A:C');
            spreadsheet.addDataValidation({ type: 'Decimal', operator: 'GreaterThan', value1: '50.00' }, 'A6:CV8');
            helper.invoke('selectRange', ['A1:H11']);
            const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
            helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
            helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            const sheet = helper.getInstance().sheets[0];
            expect(sheet.rows[5].cells[2].validation).toBeUndefined();
            expect(sheet.rows[5].cells[3].validation).toBeUndefined();
            expect(sheet.rows[5].cells[4].validation).toBeUndefined();
            expect(sheet.rows[6].cells[2].validation).toBeUndefined();
            expect(sheet.rows[6].cells[3].validation).toBeUndefined();
            expect(sheet.rows[6].cells[4].validation).toBeUndefined();
            expect(sheet.rows[7].cells[2].validation).toBeUndefined();
            expect(sheet.rows[7].cells[3].validation).toBeUndefined();
            expect(sheet.rows[7].cells[4].validation).toBeUndefined();
            expect(sheet.columns[0].validation).toBeUndefined();
            expect(sheet.columns[1].validation).toBeUndefined();
            expect(sheet.columns[2].validation).toBeUndefined();
            done();
        });
        it('EJ2-923132 -Data validation is not cleared properly, when Rows have both column and cell validation.', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'A6:CV8']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'A:C']);
            helper.invoke('selectRange', ['A1:H11']);
            const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
            helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
            helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            const sheet: SheetModel = spreadsheet.sheets[0];
            expect(sheet.rows[5].cells[2].validation).toBeUndefined();
            expect(sheet.rows[5].cells[3].validation).toBeUndefined();
            expect(sheet.rows[5].cells[4].validation).toBeUndefined();
            expect(sheet.rows[6].cells[2].validation).toBeUndefined();
            expect(sheet.rows[6].cells[3].validation).toBeUndefined();
            expect(sheet.rows[6].cells[4].validation).toBeUndefined();
            expect(sheet.rows[7].cells[2].validation).toBeUndefined();
            expect(sheet.rows[7].cells[3].validation).toBeUndefined();
            expect(sheet.rows[7].cells[4].validation).toBeUndefined();
            expect(sheet.columns[0].validation).toBeUndefined();
            expect(sheet.columns[1].validation).toBeUndefined();
            expect(sheet.columns[2].validation).toBeUndefined();
            done();
        });

        it('Greater Than or equal to Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than Or Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"GreaterThanOrEqualTo","value1":"10","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Less Than or equal to Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Less Than Or Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"LessThanOrEqualTo","value1":"10","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('NotBetween Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Not Between';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '15';
                helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"NotBetween","value1":"15","value2":"25","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Between Datavalidation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Between';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '5';
                helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '15';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[3])).toBe('{"value":10,"validation":{"type":"WholeNumber","operator":"Between","value1":"5","value2":"15","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Equal To Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '41';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [9, 3]).style.backgroundColor).toBe('');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"EqualTo","value1":"41","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Greater Than Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '45';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"GreaterThan","value1":"45","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Less Than Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Less Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '35';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [8, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"LessThan","value1":"35","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Greater Than or Equal To Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than Or Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '50';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"GreaterThanOrEqualTo","value1":"50","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Less Than or Equal To Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Less Than Or Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '50';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"LessThanOrEqualTo","value1":"50","value2":"","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('Between Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlObj: any = getComponent(helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0], 'dropdownlist');
                ddlObj.value = 'Between';
                ddlObj.dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '45';
                helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '60';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"Between","value1":"45","value2":"60","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });

        it('NotBetween Datavalidation with blank cell range', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlObj: any = getComponent(helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0], 'dropdownlist');
                ddlObj.value = 'Not Between';
                ddlObj.dataBind();
                helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '30';
                helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '45';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [10, 3]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[3])).toBe('{"validation":{"type":"WholeNumber","operator":"NotBetween","value1":"30","value2":"45","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}}');
                done();
            });
        });
        it('Clear highlight on removing data validation from column', (done: Function) => {
            helper.invoke('selectRange', ['E1:E100']);
            helper.invoke('addDataValidation', [{ ignoreBlank: true, type: 'WholeNumber', operator: 'EqualTo', value1: '20', value2: '' }, 'E:E']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(2)');
            let cellEle: HTMLElement = helper.invoke('getCell', [2, 4]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(cellEle.style.color).toBe('rgb(255, 0, 0)');
            expect(helper.getInstance().sheets[0].columns[4].validation.isHighlighted).toBeTruthy();
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(4)');
            expect(helper.getInstance().sheets[0].columns[4].validation).toBeUndefined();
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(cellEle.style.color).toBe('rgb(0, 0, 0)');
            done();
        });
    });         

    describe('EJ2-923128 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add data validation for cell', (done: Function) => {
            helper.invoke('selectRange', ['E2:E11']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '15';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"15","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
                done();
            });
        });
        it('Highlight invalid data for cell', (done: Function) => {
            helper.invoke('selectRange', ['E2:E11']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(255, 0, 0)');
                done();
            });
        });
        it('Edit the data validation rule for already applied in the cells', (done: Function) => {
            helper.invoke('selectRange', ['E2:E11']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '25';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '40';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"25","value2":"40","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(255, 0, 0)');
                expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(0, 0, 0)');
                done();
            });
        });
        it('Add data validation for full column', (done: Function) => {
            helper.invoke('selectRange', ['F1:F100']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '250';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '350';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].columns[5].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"250","value2":"350","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                done();
            });
        });
        it('Highlight invalid data for column', (done: Function) => {
            helper.invoke('selectRange', ['F1:F100']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('rgb(255, 0, 0)');
                done();
            });
        });
        it('Edit the data validation rule for already applied in the columns', (done: Function) => {
            helper.invoke('selectRange', ['F1:F100']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '300';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '650';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].columns[5].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"300","value2":"650","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(helper.invoke('getCell', [1, 5]).style.color).toBe('rgb(255, 0, 0)');
                expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(helper.invoke('getCell', [2, 5]).style.color).toBe('rgb(0, 0, 0)');
                done();
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I282749, I300338, I303567, EJ2-62856 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Employee ID': '', 'Employee Name': '', 'Gender': '', 'Department': '',
                    'Date of Joining': '', 'Salary': '', 'City': '' }] }], selectedRange: 'A1:A10' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
                        spreadsheet.cellFormat({ fontWeight: 'bold' }, 'E31:F31');
                        spreadsheet.cellFormat({ textAlign: 'right' }, 'E31');
                        spreadsheet.numberFormat('$#,##0.00', 'F2:F31');
                        spreadsheet.addDataValidation(
                            { type: 'List', operator: 'Between', value1: '1,2', value2: '', ignoreBlank: true, inCellDropDown: true,
                            isHighlighted: true }, 'A2:A100');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell alignment and filtering issue ~ from 275309 (while applying data validation)', (done: Function) => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                helper.invoke('selectRange', ['A2']);
                setTimeout((): void => {
                    let ddl: HTMLElement = helper.invoke('getCell', [1, 0]).querySelector('.e-ddl') as HTMLElement;
                    helper.triggerMouseAction('mousedown', { x: ddl.getBoundingClientRect().left + 2, y:
                        ddl.getBoundingClientRect().top + 2 }, ddl, ddl);
                    let cell: HTMLElement = helper.invoke('getCell', [1, 0]);
                    helper.triggerMouseAction(
                        'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 },
                        document, cell);
                    setTimeout((): void => {
                        helper.getElement('#' + helper.getElement().id + 'listValid_popup .e-list-item').click();
                        helper.invoke('selectRange', ['A3']);
                        setTimeout((): void => {
                            ddl = helper.invoke('getCell', [2, 0]).querySelector('.e-ddl') as HTMLElement;
                            helper.triggerMouseAction('mousedown', { x: ddl.getBoundingClientRect().left + 2, y:
                                ddl.getBoundingClientRect().top + 2 }, ddl, ddl);
                            cell = helper.invoke('getCell', [2, 0]);
                            helper.triggerMouseAction(
                                'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 },
                                document, cell);
                            setTimeout((): void => {
                                helper.getElement('#' + helper.getElement().id + 'listValid_popup .e-list-item:last-child').click();
                                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                                helper.invoke('selectRange', ['A1']);
                                helper.invoke('getCell', [0, 0]).focus();
                                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                                setTimeout((): void => {
                                    helper.getElement().getElementsByClassName('e-ftrchk')[2].click();
                                    helper.getElement('.e-excelfilter .e-footer-content .e-btn.e-primary').click();
                                    const spreadsheet: Spreadsheet = helper.getInstance();
                                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                                    helper.invoke('selectRange', ['A4']);
                                    setTimeout((): void => {
                                        expect(!!helper.invoke('getCell', [3, 0]).querySelector('.e-validation-list')).toBeTruthy();
                                        expect(!!helper.invoke('getCell', [4, 0]).querySelector('.e-validation-list')).toBeFalsy();
                                        done();
                                    }, 101);
                                }, 100);
                            }, 10);
                        }, 10);
                    }, 10);
                }, 10);
            });
            it('Data validation list does not perform properly while editing', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: 'List', value1: '1,2,3,4' }, 'H1']);
                helper.invoke('selectRange', ['H1']);
                let td: HTMLElement = helper.invoke('getCell', [0, 7]);
                let coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
                helper.getElement('.e-spreadsheet-edit').textContent = 'text';
                helper.triggerKeyNativeEvent(13);
                    helper.click('.e-validation-error-dlg .e-primary');
                    setTimeout(() => {
                        helper.getElement('#' + helper.id + 'listValid_options li:nth-child(1)').click();
                        expect(helper.getInstance().editModule.isEdit).toBe(false);
                        expect(helper.getInstance().sheets[0].rows[0].cells[7].value).toBe(1);
                        done();
                    });
            });
        });
        describe('EJ2-867782 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{

                    }, {
                        rows: [
                            { cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] },
                            { cells: [{ value: '4' }] }, { cells: [{ value: '5' }] }, { cells: [{ value: '6' }] },
                            { cells: [{ value: '7' }] }, { cells: [{ value: '8' }] }, { cells: [{ value: '9' }] }]
                    },
                    {

                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Exception is raised after renaming the sheet in list data validation ->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.activeSheetIndex = 0;
                helper.invoke('addDataValidation', [{ type: 'List', value1: '=Sheet2!A1:A10' }, 'A1:A4']);
                spreadsheet.activeSheetIndex = 1;
                spreadsheet.dataBind();
                helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                setTimeout(() => {
                    editorElem.click();
                    editorElem.value = 'Hello';
                    helper.triggerKeyNativeEvent(13, false, false, editorElem);
                    expect(helper.getInstance().sheets[1].name).toBe('Hello');
                    setTimeout(() => {
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0].validation)).toBe('{"type":"List","value1":"=Hello!A1:A10"}');
                        done();
                    });
                });
            });
        });
        describe('I301019, I300657 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: 'Food', validation: { type: 'Decimal', operator: 'NotEqualTo', ignoreBlank: true,
                    value1: '0' } }] }], selectedRange: 'A1:A1' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('unexcepted set validations from cellbuilder', (done: Function) => {
                helper.getElement('#' + helper.id + '_ribbon .e-tab-header .e-toolbar-item:nth-child(6)').click();
                helper.getElement('#' + helper.id + '_datavalidation').click();
                helper.getElement('#' + helper.id + '_datavalidation-popup .e-item').click();
                setTimeout((): void => { // Data validation model is not set properly in dialog.
                    let dlg: HTMLElement = helper.getElement().querySelector('.e-datavalidation-dlg.e-dialog') as HTMLElement;
                    expect(!!dlg).toBeTruthy();
                    expect((dlg.querySelector('.e-cellrange .e-input') as HTMLInputElement).value).toBe('A1:A1');
                    expect((dlg.querySelector('.e-ignoreblank .e-checkbox') as HTMLInputElement).checked).toBeTruthy();
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.click('.e-datavalidation-dlg .e-dlg-closeicon-btn');
                    setTimeout((): void => {
                        done();
                    });
                });
            });
            it('custom message on spreadsheet validation', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    if (args.dialogName === 'ValidationErrorDialog') { args.content = 'Invalid value'; }
                };
                spreadsheet.dataBind();
                helper.edit('A1', '0');
                setTimeout((): void => {
                    var dlg = helper.getElement('.e-validation-error-dlg.e-dialog');
                    expect(!!dlg).toBeTruthy();
                    expect(dlg.querySelector('.e-dlg-content').textContent).toBe('Invalid value');
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    helper.click('.e-validation-error-dlg .e-dlg-closeicon-btn');
                    setTimeout((): void => {
                        done();
                    });
                });
            });
        });
        describe('I275309 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.addDataValidation(
                            { type: 'List', operator: 'Between', value1: '1', value2:'1', ignoreBlank: true, inCellDropDown: true,
                            isHighlighted: true }, 'X1:X10');
                        spreadsheet.addDataValidation(
                            { type: 'List', operator: 'Between', value1: '2', value2:'2', ignoreBlank: true, inCellDropDown: true,
                            isHighlighted: true }, 'Y1:Y10');
                        spreadsheet.addDataValidation(
                            { type: 'List', operator: 'Between', value1: '3', value2:'3', ignoreBlank: true, inCellDropDown: true,
                            isHighlighted: true }, 'Z1:Z10');
                        spreadsheet.autoFit('1:100');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Dropdownlist added randomly in cells while directly scrolling the spreadsheet', (done: Function) => {
                helper.invoke('goTo', ['G1']);
                setTimeout((): void => {
                    helper.invoke('goTo', ['Q1']);
                    setTimeout((): void => {
                        helper.invoke('goTo', ['V1']);
                        helper.invoke('selectRange', ['X1']);
                        setTimeout((): void => {
                            expect(!!helper.invoke('getCell', [0, 23]).querySelector('.e-validation-list')).toBeTruthy();
                            helper.invoke('selectRange', ['Z1']);
                            setTimeout((): void => {
                                expect(!!helper.invoke('getCell', [0, 25]).querySelector('.e-validation-list')).toBeTruthy();
                                helper.invoke('selectRange', ['AA1']);
                                setTimeout((): void => {
                                    expect(!!helper.invoke('getCell', [0, 26]).querySelector('.e-validation-list')).toBeFalsy();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('EJ2-56780, EJ2-57644 ->', () => {
            let sheet: SheetModel;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        ranges: [{ dataSource: defaultData }],
                        rows: [{ cells: [{ index: 8, validation: { type: 'List', value1: '=A2:A5' } }] },
                            { index: 5, cells: [{ index: 3, validation: { type: 'List', value1: '1,2' } }] }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Insert row above and between the cells referred in list validation', (done: Function) => {
                helper.setAnimationToNone('#spreadsheet_contextmenu');
                sheet = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A2']);
                // Insert above the cell reference
                helper.openAndClickCMenuItem(1, 0, [6, 1], true);
                expect(getCell(1, 8, sheet).validation.value1).toBe('=A4:A7');
                setTimeout(() => {
                    // Insert inbetween the cell reference
                    helper.invoke('selectRange', ['A3']);
                    helper.openAndClickCMenuItem(2, 0, [6, 2], true);
                    expect(getCell(0, 8, sheet).validation.value1).toBe('=A3:A7');
                    expect(getCell(1, 8, sheet).validation.value1).toBe('=A5:A8');
                    helper.invoke('selectRange', ['I1']);
                    const ddl: any = helper.invoke('getCell', [0, 8]).querySelector('.e-dropdownlist');
                    ddl.ej2_instances[0].showPopup();
                    setTimeout(() => {
                        const popup: HTMLElement = helper.getElement('.e-ddl.e-popup ul');
                        expect(popup.childElementCount).toBe(5);
                        expect(popup.children[1].textContent).toBe('');
                        ddl.ej2_instances[0].hidePopup();
                        done();
                    });
                });
            });

            it('Insert before with single column', (done: Function) => {
                helper.invoke('selectRange', ['J1']);
                helper.openAndClickCMenuItem(0, 9, [6, 1], null, true);
                expect(JSON.stringify(getCell(0, 8, sheet).validation)).toBe('{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe('{"type":"List","value1":"=B3:B7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(1, 8, sheet).validation)).toBe('{"type":"List","value1":"=A5:A8"}');
                expect(JSON.stringify(getCell(1, 9, sheet).validation)).toBe('{"type":"List","value1":"=B5:B8"}');
                expect(getCell(0, 10, sheet)).toBeNull();
                done();
            });

            it('Insert before with single column - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 8, sheet).validation)).toBe('{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}');
                expect(getCell(0, 9, sheet)).toBeNull();
                expect(JSON.stringify(getCell(1, 8, sheet).validation)).toBe('{"type":"List","value1":"=A5:A8"}');
                expect(getCell(1, 9, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe('{"type":"List","value1":"=B3:B7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(1, 9, sheet).validation)).toBe('{"type":"List","value1":"=B5:B8"}');
                done();
            });

            it('Insert after with single column', (done: Function) => {
                helper.invoke('selectRange', ['J1']);
                helper.openAndClickCMenuItem(0, 9, [6, 2], null, true);
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe('{"type":"List","value1":"=B3:B7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe('{"type":"List","value1":"=C3:C7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(1, 9, sheet).validation)).toBe('{"type":"List","value1":"=B5:B8"}');
                expect(JSON.stringify(getCell(1, 10, sheet).validation)).toBe('{"type":"List","value1":"=C5:C8"}');
                done();
            });

            it('Insert after with single column - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe('{"type":"List","value1":"=B3:B7","ignoreBlank":true,"inCellDropDown":true}');
                expect(getCell(0, 10, sheet)).toBeNull();
                expect(JSON.stringify(getCell(1, 9, sheet).validation)).toBe('{"type":"List","value1":"=B5:B8"}');
                expect(getCell(1, 10, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe('{"type":"List","value1":"=B3:B7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe('{"type":"List","value1":"=C3:C7","ignoreBlank":true,"inCellDropDown":true}');
                expect(JSON.stringify(getCell(1, 9, sheet).validation)).toBe('{"type":"List","value1":"=B5:B8"}');
                expect(JSON.stringify(getCell(1, 10, sheet).validation)).toBe('{"type":"List","value1":"=C5:C8"}');
                done();
            });

            it('Insert before with mutliple column', (done: Function) => {
                helper.invoke('selectRange', ['L1:N1']);
                helper.openAndClickCMenuItem(0, 10, [6, 1], null, true);
                expect(getCell(0, 10, sheet).validation.value1).toBe('=C3:C7');
                expect(getCell(0, 11, sheet).validation.value1).toBe('=D3:D7');
                expect(getCell(0, 12, sheet).validation.value1).toBe('=E3:E7');
                expect(getCell(0, 13, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(1, 10, sheet).validation.value1).toBe('=C5:C8');
                expect(getCell(1, 11, sheet).validation.value1).toBe('=D5:D8');
                expect(getCell(1, 12, sheet).validation.value1).toBe('=E5:E8');
                expect(getCell(1, 13, sheet).validation.value1).toBe('=F5:F8');
                done();
            });

            it('Insert before with mutliple column - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(getCell(0, 10, sheet).validation.value1).toBe('=C3:C7');
                expect(getCell(0, 11, sheet)).toBeNull();
                expect(getCell(0, 12, sheet)).toBeNull();
                expect(getCell(0, 13, sheet)).toBeNull();
                expect(getCell(1, 10, sheet).validation.value1).toBe('=C5:C8');
                expect(getCell(1, 11, sheet)).toBeNull();
                expect(getCell(1, 12, sheet)).toBeNull();
                expect(getCell(1, 13, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(getCell(0, 10, sheet).validation.value1).toBe('=C3:C7');
                expect(getCell(0, 11, sheet).validation.value1).toBe('=D3:D7');
                expect(getCell(0, 12, sheet).validation.value1).toBe('=E3:E7');
                expect(getCell(0, 13, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(1, 10, sheet).validation.value1).toBe('=C5:C8');
                expect(getCell(1, 11, sheet).validation.value1).toBe('=D5:D8');
                expect(getCell(1, 12, sheet).validation.value1).toBe('=E5:E8');
                expect(getCell(1, 13, sheet).validation.value1).toBe('=F5:F8');
                done();
            });

            it('Insert after with mutliple column', (done: Function) => {
                helper.invoke('selectRange', ['J1:L100']);
                helper.openAndClickCMenuItem(0, 9, [6, 2], null, true);
                expect(getCell(0, 13, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(0, 14, sheet).validation.value1).toBe('=G3:G7');
                expect(getCell(0, 15, sheet).validation.value1).toBe('=E3:E7');
                expect(getCell(0, 16, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(1, 13, sheet).validation.value1).toBe('=F5:F8');
                expect(getCell(1, 14, sheet).validation.value1).toBe('=G5:G8');
                expect(getCell(1, 15, sheet).validation.value1).toBe('=E5:E8');
                expect(getCell(1, 16, sheet).validation.value1).toBe('=F5:F8');
                done();
            });

            it('Insert after with mutliple column - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(getCell(0, 13, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(0, 14, sheet)).toBeNull();
                expect(getCell(0, 15, sheet)).toBeNull();
                expect(getCell(0, 16, sheet)).toBeNull();
                expect(getCell(1, 13, sheet).validation.value1).toBe('=F5:F8');
                expect(getCell(1, 14, sheet)).toBeNull();
                expect(getCell(1, 15, sheet)).toBeNull();
                expect(getCell(1, 16, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(getCell(0, 13, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(0, 14, sheet).validation.value1).toBe('=G3:G7');
                expect(getCell(0, 15, sheet).validation.value1).toBe('=E3:E7');
                expect(getCell(0, 16, sheet).validation.value1).toBe('=F3:F7');
                expect(getCell(1, 13, sheet).validation.value1).toBe('=F5:F8');
                expect(getCell(1, 14, sheet).validation.value1).toBe('=G5:G8');
                expect(getCell(1, 15, sheet).validation.value1).toBe('=E5:E8');
                expect(getCell(1, 16, sheet).validation.value1).toBe('=F5:F8');
                done();
            });

            it('Insert before with mutliple column - not to update case', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['G1:I1']);
                helper.openAndClickCMenuItem(0, 6, [6, 1], null, true);
                expect(getCell(0, 6, sheet)).toBeNull();
                expect(getCell(0, 7, sheet)).toBeNull();
                expect(getCell(0, 8, sheet)).toBeNull();
                done();
            });

            it('Insert after with mutliple column - not to update case', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['T1:U1']);
                helper.openAndClickCMenuItem(0, 19, [6, 2], null, true);
                expect(getCell(0, 21, sheet)).toBeNull();
                expect(getCell(0, 22, sheet)).toBeNull();
                done();
            });

            it('Insert above with single row', (done: Function) => {
                helper.invoke('selectRange', ['A3']);
                helper.openAndClickCMenuItem(2, 0, [6, 1], true);
                expect(getCell(1, 11, sheet).validation.value1).toBe('=A6:A9');
                expect(getCell(2, 11, sheet).validation.value1).toBe('=A7:A10');
                expect(getCell(3, 11, sheet).validation).toBeUndefined();
                done();
            });

            it('Insert above with single row - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(getCell(1, 11, sheet).validation.value1).toBe('=A5:A8');
                expect(getCell(2, 11, sheet).validation).toBeUndefined();
                helper.click('#spreadsheet_redo');
                expect(getCell(1, 11, sheet).validation.value1).toBe('=A6:A9');
                expect(getCell(2, 11, sheet).validation.value1).toBe('=A7:A10');
                done();
            });

            it('Insert below with single row', (done: Function) => {
                helper.invoke('selectRange', ['A3']);
                helper.openAndClickCMenuItem(2, 0, [6, 2], true);
                expect(getCell(2, 11, sheet).validation.value1).toBe('=A8:A11');
                expect(getCell(3, 11, sheet).validation.value1).toBe('=A9:A12');
                done();
            });

            it('Insert below with single row - Undo & Redo', (done: Function) => {
                helper.click('#spreadsheet_undo');
                expect(getCell(2, 11, sheet).validation.value1).toBe('=A7:A10');
                expect(getCell(3, 11, sheet).validation).toBeUndefined();
                helper.click('#spreadsheet_redo');
                expect(getCell(2, 11, sheet).validation.value1).toBe('=A8:A11');
                expect(getCell(3, 11, sheet).validation.value1).toBe('=A9:A12');
                done();
            });

            it('Insert above with mutliple row', (done: Function) => {
                const validation: string = '{"type":"List","value1":"1,2"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A11:A13']);
                helper.openAndClickCMenuItem(10, 0, [6, 1], true);
                expect(JSON.stringify(getCell(9, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(10, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(11, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(12, 3, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert above with mutliple row - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"1,2"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(9, 3, sheet).validation)).toBe(validation);
                expect(getCell(10, 3, sheet).validation).toBeUndefined();
                expect(getCell(11, 3, sheet).validation).toBeUndefined();
                expect(getCell(12, 3, sheet).validation).toBeUndefined();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(9, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(10, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(11, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(12, 3, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert below with mutliple row', (done: Function) => {
                const validation: string = '{"type":"List","value1":"1,2"}';
                helper.invoke('selectRange', ['A9:A11']);
                helper.openAndClickCMenuItem(8, 0, [6, 2], true);
                expect(JSON.stringify(getCell(12, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(13, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(14, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(15, 3, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert below with mutliple row - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"1,2"}';
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(12, 3, sheet).validation)).toBe(validation);
                expect(getCell(13, 3, sheet).validation).toBeUndefined();
                expect(getCell(14, 3, sheet).validation).toBeUndefined();
                expect(getCell(15, 3, sheet).validation).toBeUndefined();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(12, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(13, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(14, 3, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(15, 3, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert above with mutliple row - not to update case', (done: Function) => {
                helper.invoke('selectRange', ['A9:A10']);
                helper.openAndClickCMenuItem(8, 0, [6, 1], true);
                expect(getCell(8, 3, sheet)).toBeNull();
                expect(getCell(9, 3, sheet)).toBeNull();
                done();
            });

            it('Insert below with mutliple row - not to update case', (done: Function) => {
                helper.invoke('selectRange', ['A18:A19']);
                helper.openAndClickCMenuItem(17, 0, [6, 2], true);
                expect(getCell(19, 3, sheet)).toBeNull();
                expect(getCell(20, 3, sheet)).toBeNull();
                done();
            });

            it('Clear all on column validation is not working', (done: Function) => {
                helper.getInstance().workbookDataValidationModule.updateValidationHandler({
                    range: 'Sheet1!G:G', rules: {
                        type: 'List', operator: 'Between', value1: '1', value2: '', ignoreBlank: true, inCellDropDown: true
                    }
                });
                helper.invoke('selectRange', ['G3:G5']);
                helper.click(`#${helper.id}_clear`);
                helper.click('.e-clear-ddb ul li');
                const validation: ValidationModel = helper.getInstance().sheets[0].columns[6].validation;
                expect(validation.address).toBe('G1:G2 G6:G1048576');
                helper.edit('G3', '4');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-validation-error-dlg.e-dialog')).toBeNull();
                    helper.edit('G2', '4');
                    setTimeout(() => {
                        expect(helper.getElementFromSpreadsheet('.e-validation-error-dlg.e-dialog')).not.toBeNull();
                        helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                        helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                        // Clearing another range
                        helper.invoke('selectRange', ['G10:G14']);
                        helper.click(`#${helper.id}_clear`);
                        helper.click('.e-clear-ddb ul li');
                        expect(validation.address).toBe('G1:G2 G6:G9 G15:G1048576');
                        // Clearing between the range
                        helper.invoke('selectRange', ['G12:G16']);
                        helper.click(`#${helper.id}_clear`);
                        helper.click('.e-clear-ddb ul li');
                        expect(validation.address).toBe('G1:G2 G6:G9 G17:G1048576');
                        // Clearing between the range
                        helper.invoke('selectRange', ['G2:G3']);
                        helper.click(`#${helper.id}_clear`);
                        helper.click('.e-clear-ddb ul li');
                        expect(validation.address).toBe('G1:G1 G6:G9 G17:G1048576');
                        done();
                    });
                });
            });
        });

        describe('SF-362574, EJ2-65349 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('IsHighlighted property is enabled if data is filtered', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThanOrEqualTo', value1: '99999' }, 'E1:E11');
                expect(spreadsheet.sheets[0].rows[0].cells[4].validation.isHighlighted).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[8].cells[4].validation.isHighlighted).toBeUndefined();
                spreadsheet.applyFilter(
                    [{ value: 310, field: 'F', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false }],
                    'A1:H11').then((): void => {
                    expect(spreadsheet.sheets[0].rows[0].cells[4].validation.isHighlighted).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[8].cells[4].validation.isHighlighted).toBeUndefined();
                    setTimeout((): void => {
                        done();
                    });
                });
            });
            it('To fix the issue with date formula (TODAY()) in data validation input field', (done: Function) => {
                helper.edit('B9', '11/30/2050');
                helper.getInstance().addDataValidation({ type: 'Date', operator: 'LessThanOrEqualTo', value1: '=TODAY()' }, 'B1:B11');
                helper.getInstance().addDataValidation({ type: 'Time', operator: 'LessThanOrEqualTo', value1: '=TIME(10,56,00)' }, 'C1:C11');
                expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [7, 1]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('');
                helper.invoke('selectRange', ['B1:B11']);
                helper.switchRibbonTab(4);
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
                    expect(helper.invoke('getCell', [7, 1]).style.backgroundColor).toBe('');
                    expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(3)');
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(1)');
                    setTimeout(() => {
                        helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=DATE(2022,11,18)';
                        helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                        helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                        helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                        helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                        helper.click('.e-datavalidation-ddb li:nth-child(2)');
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
                            expect(helper.invoke('getCell', [7, 1]).style.backgroundColor).toBe('');
                            expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                            helper.click('.e-datavalidation-ddb li:nth-child(3)');
                            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                            helper.click('.e-datavalidation-ddb li:nth-child(1)');
                            setTimeout(() => {
                                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=DATEVALUE("11/18/2022")';
                                helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                                helper.click('.e-datavalidation-ddb li:nth-child(2)');
                                setTimeout(() => {
                                    expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                                    expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
                                    expect(helper.invoke('getCell', [7, 1]).style.backgroundColor).toBe('');
                                    expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                                    helper.click('.e-datavalidation-ddb li:nth-child(3)');
                                    helper.invoke('selectRange', ['C1:C11']);
                                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                                    helper.click('.e-datavalidation-ddb li:nth-child(2)');
                                    setTimeout(() => {
                                        expect(helper.invoke('getCell', [0, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                                        expect(helper.invoke('getCell', [1, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                                        expect(helper.invoke('getCell', [8, 2]).style.backgroundColor).toBe('');
                                        expect(helper.invoke('getCell', [9, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
            it('EJ2-931167 - Active cell not changed and invalid value not updated when validation retry alert is prevented', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    if (args.dialogName === 'ValidationErrorDialog') {
                        args.cancel = true;
                    }
                };
                helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'EqualTo', value1: '3' }, 'H11']);
                helper.invoke('addInvalidHighlight', ['H11']);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[7])).toBe('{"value":55,"validation":{"type":"TextLength","operator":"EqualTo","value1":"3","isHighlighted":true}}');
                helper.invoke('selectRange', ['H11']);
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '1';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[10].cells[7].value).toBe(1);
                    expect(helper.getInstance().sheets[0].activeCell).toBe('H12');
                    spreadsheet.dialogBeforeOpen = undefined;
                    done();
                });
            });
        });
        describe('EJ2-67132->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Script error throws while performing undo after applying the list validation->', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: 'List', value1: '1,2,3' }, 'A2:B2']);
                helper.invoke('selectRange', ['A2']);
                let td: HTMLElement = helper.invoke('getCell', [1, 0]).children[0];
                expect(td.classList).toContain('e-validation-list');
                const coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
                helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                    expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                    helper.invoke('selectRange', ['B2']);
                    td = helper.invoke('getCell', [1, 1]).children[0];
                    expect(td.classList).toContain('e-validation-list');
                    const coords: ClientRect = td.getBoundingClientRect();
                    helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
                    helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
                    (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                    setTimeout(() => {
                        helper.click('.e-ddl.e-popup li:nth-child(2)');
                        expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                        expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                        helper.invoke('selectRange', ['A2']);
                        td = helper.invoke('getCell', [1, 0]).children[0];
                        expect(td.classList).toContain('e-validation-list');
                        const coords: ClientRect = td.getBoundingClientRect();
                        helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
                        helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
                        (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                        setTimeout(() => {
                            helper.click('.e-ddl.e-popup li:nth-child(3)');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(3);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('3');
                            helper.click('#spreadsheet_undo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                            helper.click('#spreadsheet_undo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBeUndefined();
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('');
                            helper.click('#spreadsheet_undo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBeUndefined();
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBeUndefined();
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('');
                            helper.click('#spreadsheet_redo');
                            helper.click('#spreadsheet_redo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                            helper.click('#spreadsheet_redo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(3);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('3');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                            helper.click('#spreadsheet_undo');
                            helper.click('#spreadsheet_undo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBeUndefined();
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('');
                            helper.click('#spreadsheet_redo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(1);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('1');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                            helper.click('#spreadsheet_redo');
                            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe(3);
                            expect(helper.invoke('getCell', [1, 0]).innerText).toBe('3');
                            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toBe(2);
                            expect(helper.invoke('getCell', [1, 1]).innerText).toBe('2');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-893509 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The list validation does not work properly with formatted numbers when entering a value in a cell through editing', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.edit('I6', '12%');
                helper.edit('I7', '$20');
                helper.edit('I8', '50%');
                helper.edit('I9', '$100');
                helper.invoke('addDataValidation', [{ type: 'List', value1: '12%,17%,20%,$45,$50,1,0.5,0.15', inCellDropDown: false }, 'I:I']);
                helper.edit('I1', '12%');
                const sheet: any = spreadsheet.sheets[0];
                expect(sheet.rows[0].cells[8].value).toBe('0.12');
                helper.edit('I2', '17%');
                expect(sheet.rows[1].cells[8].value).toBe('0.17');
                helper.edit('I3', '20%');
                expect(sheet.rows[2].cells[8].value).toBe('0.2');
                helper.edit('I4', '$45');
                expect(sheet.rows[3].cells[8].value).toBe('45');
                helper.edit('I5', '$50');
                expect(sheet.rows[4].cells[8].value).toBe('50');
                helper.edit('I6', '$50');
                expect(sheet.rows[5].cells[8].value).toBe(50);
                helper.edit('I7', '12%');
                expect(sheet.rows[6].cells[8].value).toBe(0.12);
                helper.edit('I8', '$45');
                expect(sheet.rows[7].cells[8].value).toBe(45);
                helper.edit('I9', '20%');
                expect(sheet.rows[8].cells[8].value).toBe(0.2);
                helper.edit('I10', '0.12');
                expect(sheet.rows[9].cells[8].value).toBe(0.12);
                helper.edit('I11', '0.17');
                expect(sheet.rows[10].cells[8].value).toBe(0.17);
                helper.edit('I12', '0.2');
                expect(sheet.rows[11].cells[8].value).toBe(0.2);
                helper.edit('I13', '100%');
                expect(sheet.rows[12].cells[8].value).toBe('1');
                helper.edit('I14', '15%');
                expect(sheet.rows[13].cells[8].value).toBe('0.15');
                helper.edit('I15', '50%');
                expect(sheet.rows[14].cells[8].value).toBe('0.5');
                helper.invoke('addDataValidation', [{ type: 'List', value1: '=I1:I15' }, 'J:J']);
                helper.edit('J1', '12%');
                expect(sheet.rows[0].cells[9].value).toBe('0.12');
                helper.edit('J2', '17%');
                expect(sheet.rows[1].cells[9].value).toBe('0.17');
                helper.edit('J3', '20%');
                expect(sheet.rows[2].cells[9].value).toBe('0.2');
                helper.edit('J4', '$45');
                expect(sheet.rows[3].cells[9].value).toBe('45');
                helper.edit('J5', '$50');
                expect(sheet.rows[4].cells[9].value).toBe('50');
                helper.edit('J6', '$50');
                expect(sheet.rows[5].cells[8].value).toBe(50);
                helper.edit('J7', '12%');
                expect(sheet.rows[6].cells[9].value).toBe('0.12');
                helper.edit('J8', '$45');
                expect(sheet.rows[7].cells[8].value).toBe(45);
                helper.edit('J9', '20%');
                expect(sheet.rows[8].cells[9].value).toBe('0.2');
                helper.edit('J10', '0.12');
                expect(sheet.rows[9].cells[9].value).toBe(0.12);
                helper.edit('J11', '0.17');
                expect(sheet.rows[10].cells[9].value).toBe(0.17);
                helper.edit('J12', '0.2');
                expect(sheet.rows[11].cells[9].value).toBe(0.2);
                helper.edit('J13', '100%');
                expect(sheet.rows[12].cells[9].value).toBe('1');
                helper.edit('J14', '15%');
                expect(sheet.rows[13].cells[9].value).toBe('0.15');
                helper.edit('J15', '50%');
                expect(sheet.rows[14].cells[9].value).toBe('0.5');
                done();
            });
        });
        describe('EJ-899038 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        rows: [{ cells: [{ value: '1' }], height: 20 },
                        { cells: [{ value: '2' }], height: 20 }, { cells: [{ value: '3' }], height: 14 }, { cells: [{ value: '3' }], height: 14 },
                        { cells: [{ value: '4' }], height: 14 }, { cells: [{ value: '5' }], height: 14 }, { cells: [{ value: '6' }], height: 14 }, { cells: [{ value: '7' }], height: 14 }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Selection misalignment occurs when selecting a cell with list data validation and a minimum row height', (done: Function) => {
                helper.getInstance().addDataValidation({ type: 'List', value1: '1,2,3,4,5', ignoreBlank: true }, `A:A`)
                helper.invoke('selectRange', ['A2:A2']);
                var td: HTMLElement = helper.invoke('getCell', [1, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe(null);
                helper.getInstance().setRowHeight(16, 2);
                helper.invoke('selectRange', ['A3:A3']);
                td = helper.invoke('getCell', [2, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe('height: 15px;');
                var td: HTMLElement = helper.invoke('getCell', [1, 0]);
                expect((td.children).length.toString()).toEqual('0');
                helper.getInstance().setRowHeight(12, 3);
                helper.invoke('selectRange', ['A4:A4']);
                td = helper.invoke('getCell', [3, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe('height: 11px;');
                helper.getInstance().setRowHeight(32, 3);
                helper.invoke('selectRange', ['A4:A4']);
                td = helper.invoke('getCell', [3, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe("");
                helper.getInstance().setRowHeight(11, 3);
                td = helper.invoke('getCell', [3, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe('height: 10px;');
                helper.getInstance().setRowHeight(30, 4);
                helper.invoke('selectRange', ['A5:A5']);
                td = helper.invoke('getCell', [4, 0]);
                expect(td.children[0].classList).toContain('e-validation-list');
                expect(td.children[0].getAttribute('style')).toBe(null);
                done();
            });
        });
        describe('EJ2-939916 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenColumns: 3, frozenRows: 2 }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Unable to Open List Validation Dropdown When Merged Cells Exist Between Freeze and Unfreeze Areas', (done: Function) => {
                helper.getInstance().addDataValidation({ type: 'List', inCellDropDown: true, value1: '10,20,30' }, 'D2:D10');
                helper.getInstance().merge('B8:E8');
                const cell: CellModel = helper.getInstance().sheets[0].rows[4].cells[3];
                expect(JSON.stringify(cell.validation)).toBe('{"type":"List","inCellDropDown":true,"value1":"10,20,30"}');
                helper.invoke('selectRange', ['D5']);
                const td: HTMLElement = helper.invoke('getCell', [4, 3]).children[0];
                expect(td.classList).toContain('e-validation-list');
                const coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
                helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(2)');
                    expect(helper.getInstance().sheets[0].rows[4].cells[3].value).toBe(20);
                    expect(helper.invoke('getCell', [4, 3]).innerText).toBe('20');
                    helper.editInUI('15');
                    setTimeout(() => {
                        expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                        helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                        helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                        done();
                    }, 10);
                }, 10);
            });
        });
    });

    describe('Localization is not updated for apply  button in the data Validation Pop-up ->',()=>{
        describe('EJ2-55546->', () => {
            beforeAll((done: Function)=> {
                L10n.load({
                    'de-DE': {
                        'spreadsheet': {
                            'Cut': 'Schneiden',
                            'Copy': 'Kopieren',
                            'Paste': 'Paste',
                            'PasteSpecial': 'paste spezial',
                            'All': 'Alles',
                            'Values': 'Werte',
                            'Formats': 'Formate',
                            'Font': 'Schriftart',
                            'FontSize': 'Schriftgröße',
                            'Bold': 'Fett gedruckt',
                            'Italic': 'Kursiv',
                            'Underline': 'Unterstreichen',
                            'Strikethrough': 'Durchgestrichen',
                            'TextColor': 'Textfarbe',
                            'FillColor': 'Füllfarbe',
                            'HorizontalAlignment': 'Horizontale Ausrichtung',
                            'AlignLeft': 'Linksbündig ausrichten',
                            'AlignCenter': 'Center',
                            'AlignRight': 'Rechtsbündig ausrichten',
                            'VerticalAlignment': 'Vertikale Ausrichtung',
                            'AlignTop': 'Oben ausrichten',
                            'AlignMiddle': 'Mitte ausrichten',
                            'AlignBottom': 'Unten ausrichten',
                            'InsertFunction': 'Funktion einfügen',
                            'Insert': 'Einfügen',
                            'Delete': 'Löschen',
                            'Rename': 'Umbenennen',
                            'Hide': 'verbergen',
                            'Unhide': 'Sichtbar machen',
                            'NameBox': 'Namensfeld',
                            'ShowHeaders': 'Kopfzeilen anzeigen',
                            'HideHeaders': 'Header ausblenden',
                            'ShowGridLines': 'Gitternetzlinien anzeigen',
                            'HideGridLines': 'Gitternetzlinien ausblenden',
                            'AddSheet': 'Blatt hinzufügen',
                            'ListAllSheets': 'Alle Blätter auflisten',
                            'FullScreen': 'Vollbild',
                            'CollapseToolbar': 'Zusammenbruch symbolleiste',
                            'ExpandToolbar': 'Erweitern Symbolleiste',
                            'CollapseFormulaBar': 'Collapse Formelleiste',
                            'ExpandFormulaBar': 'Expand Formelleiste',
                            'File': 'Datei',
                            'Home': 'Huis',
                            'Formulas': 'Formeln',
                            'View': 'Aussicht',
                            'New': 'Neu',
                            'Open': 'Öffnen',
                            'SaveAs': 'Speichern als',
                            'ExcelXlsx': 'Microsoft Excel',
                            'ExcelXls': 'Microsoft Excel 97-2003',
                            'CSV': 'Comma-separated values',
                            'FormulaBar': 'Formelleiste',
                            'Ok': 'OK',
                            'Close': 'Schließen',
                            'Cancel': 'Abbrechen',
                            'Apply': 'Sich bewerben',
                            'MoreColors': 'Mehr Farben',
                            'StandardColors': 'Standard farben',
                            'General': 'Allgemeines',
                            'Number': 'Nummer',
                            'Currency': 'Währung',
                            'Accounting': 'Buchhaltung',
                            'ShortDate': 'Kurzes Date',
                            'LongDate': 'Langes Datum',
                            'Time': 'Zeit',
                            'Percentage': 'Prozentsatz',
                            'Fraction': 'Fraktion',
                            'Scientific': 'Wissenschaft',
                            'Text': 'Text',
                            'NumberFormat': 'Zahlenformat',
                            'MobileFormulaBarPlaceHolder': 'Wert oder Formel eingeben',
                            'PasteAlert': 'Sie können dies hier nicht einfügen, da der Kopierbereich und der Einfügebereich nicht dieselbe Größe haben. Bitte versuchen Sie es in einem anderen Bereich.',
                            'DestroyAlert': 'Möchten Sie die aktuelle Arbeitsmappe wirklich löschen, ohne sie zu speichern, und eine neue Arbeitsmappe erstellen?',
                            'SheetRenameInvalidAlert': 'Der Blattname enthält ein ungültiges Zeichen.',
                            'SheetRenameEmptyAlert': 'Der Blattname darf nicht leer sein.',
                            'SheetRenameAlreadyExistsAlert': 'Der Blattname ist bereits vorhanden. Bitte geben Sie einen anderen Namen ein.',
                            'DeleteSheetAlert': 'Möchten Sie dieses Blatt wirklich löschen?',
                            'DeleteSingleLastSheetAlert': 'Eine Arbeitsmappe muss mindestens ein sichtbares Arbeitsblatt enthalten.',
                            'PickACategory': 'Wählen Sie eine Kategorie',
                            'Description': 'Beschreibung',
                            'UnsupportedFile': 'Nicht unterstützte Datei',
                            'InvalidUrl': 'Ungültige URL',
                            'SUM': 'Fügt eine Reihe von Zahlen und / oder Zellen hinzu.',
                            'SUMIF': 'Fügt die Zellen basierend auf der angegebenen Bedingung hinzu.',
                            'SUMIFS': 'Fügt die Zellen basierend auf den angegebenen Bedingungen hinzu.',
                            'ABS': 'Gibt den Wert einer Zahl ohne Vorzeichen zurück.',
                            'RAND': 'Gibt eine Zufallszahl zwischen 0 und 1 zurück.',
                            'RANDBETWEEN': 'Gibt eine zufällige Ganzzahl basierend auf angegebenen Werten zurück.',
                            'FLOOR': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors ab.',
                            'CEILING': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors.',
                            'PRODUCT': 'Multipliziert eine Reihe von Zahlen und / oder Zellen.',
                            'AVERAGE': 'Berechnen Sie den Durchschnitt für die Reihe von Zahlen und / oder Zellen ohne Text.',
                            'AVERAGEIF': 'Berechnet den Durchschnitt für die Zellen basierend auf der angegebenen Bedingung.',
                            'AVERAGEIFS': 'Berechnet den Durchschnitt für die Zellen basierend auf den angegebenen Bedingungen.',
                            'AVERAGEA': 'Berechnet den Durchschnitt für die Zellen, wobei WAHR als 1, text und FALSCH als 0 ausgewertet werden.',
                            'COUNT': 'Zählt die Zellen, die numerische Werte in einem Bereich enthalten.',
                            'COUNTIF': 'Zählt die Zellen basierend auf der angegebenen Bedingung.',
                            'COUNTIFS': 'Zählt die Zellen basierend auf den angegebenen Bedingungen.',
                            'COUNTA': 'Zählt die Zellen, die Werte in einem Bereich enthalten.',
                            'MIN': 'Gibt die kleinste Anzahl der angegebenen Argumente zurück.',
                            'MAX': 'Gibt die größte Anzahl der angegebenen Argumente zurück.',
                            'DATE': 'Gibt das Datum basierend auf einem bestimmten Jahr, Monat und Tag zurück.',
                            'DAY': 'Gibt den Tag ab dem angegebenen Datum zurück.',
                            'DAYS': 'Gibt die Anzahl der Tage zwischen zwei Daten zurück.',
                            'IF': 'Gibt einen Wert basierend auf dem angegebenen Ausdruck zurück.',
                            'IFS': 'Gibt einen Wert zurück, der auf den angegebenen mehreren Ausdrücken basiert.',
                            'AND': 'Gibt WAHR zurück, wenn alle Argumente WAHR sind, andernfalls wird FALSCH zurückgegeben.',
                            'OR': 'Gibt WAHR zurück, wenn eines der Argumente WAHR ist, andernfalls wird FALSCH zurückgegeben.',
                            'IFERROR': 'Gibt einen Wert zurück, wenn kein Fehler gefunden wurde. Andernfalls wird der angegebene Wert zurückgegeben.',
                            'CHOOSE': 'Gibt einen Wert aus der Werteliste basierend auf der Indexnummer zurück.',
                            'INDEX': 'Gibt einen Wert der Zelle in einem bestimmten Bereich basierend auf der Zeilen- und Spaltennummer zurück.',
                            'FIND': 'Gibt die Position eines Strings innerhalb eines anderen Strings zurück, wobei die Groß- und Kleinschreibung beachtet wird.',
                            'CONCATENATE': 'Kombiniert zwei oder mehr Zeichenfolgen.',
                            'CONCAT': 'Verkettet eine Liste oder einen Bereich von Textzeichenfolgen.',
                            'SUBTOTAL': 'Gibt die Zwischensumme für einen Bereich unter Verwendung der angegebenen Funktionsnummer zurück.',
                            'RADIANS': 'Konvertiert Grad in Bogenmaß.',
                            'MATCH': 'Gibt die relative Position eines angegebenen Wertes im angegebenen Bereich zurück.',
                            'DefineNameExists': 'Dieser Name ist bereits vorhanden, versuchen Sie es mit einem anderen Namen.',
                            'CircularReference': 'Wenn eine Formel auf einen oder mehrere Zirkelverweise verweist, kann dies zu einer falschen Berechnung führen.',
                            'CustomFormat': 'Formats de nombre personnalisés',
                            'CustomFormatPlaceholder': 'Geben Sie ein benutzerdefiniertes Format ein oder wählen Sie es aus',
                            'APPLY':'Sich bewerben'
                        }
                    }
                });
                helper.initializeSpreadsheet({locale:'de-DE'},done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('apply button is not updated while applying localization', (done: Function) => {
                helper.switchRibbonTab(4);
                helper.getElement('#' + helper.id + '_datavalidation').click();
                helper.getElement('#' + helper.id + '_datavalidation-popup li:nth-child(1)').click();
                const footer: HTMLElement = helper.getElement('.e-footer-content button:nth-child(2)');
                expect(footer.textContent).toBe('Sich bewerben');
                done();
            });
        });
    });
    describe('CR - Issues->', () => {
        describe('EJ2-50373, EJ2-50399, EJ2-60806, EJ2-50626, EJ2-51866, EJ2-917793 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ cells: [{ value: '1' }] },
                    { cells: [{ value: '2' }] }, { cells: [{ value: '' }] }, { cells: [{ value: '3' }] },
                    { cells: [{ value: '4' }] },  { cells: [{ value: '5' }] }] }], activeSheetIndex: 0
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50373 - Data Validation not properly working when input value is given with Date Format', (done: Function) => {
                helper.invoke('selectRange', ['B2:B10']);
                helper.switchRibbonTab(4);
                helper.getElement('#'+helper.id+'_datavalidation').click();
                helper.getElement('#'+helper.id+'_datavalidation-popup li:nth-child(1)').click();
                setTimeout(() => {
                    let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].value = 'Date';
                    ddlElem.ej2_instances[0].dataBind();
                    let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                    ddlElement.ej2_instances[0].value = 'Equal To';
                    ddlElement.ej2_instances[0].dataBind();
                    helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '6/23/2014';
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(2)');
                    expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(helper.invoke('getCell', [4, 1]).style.color).toBe('rgb(255, 0, 0)');
                    expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBeNull;
                    expect(helper.invoke('getCell', [5, 1]).style.color).toBeNull;
                    done();
                });
            });

            it('EJ2-50373 - Data Validation not properly working when input value is given with Time Format', (done: Function) => {
                helper.invoke('selectRange', ['C2:C10']);
                (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[5] as HTMLElement).click();
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.getElement('#'+helper.id+'_datavalidation-popup li:nth-child(1)').click();
                setTimeout(() => {
                    let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].value = 'Time';
                    ddlElem.ej2_instances[0].dataBind();
                    let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                    ddlElement.ej2_instances[0].value = 'Equal To';
                    ddlElement.ej2_instances[0].dataBind();
                    helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '12:43:59 AM';
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(2)');
                    expect(helper.invoke('getCell', [4, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(helper.invoke('getCell', [4, 2]).style.color).toBe('rgb(255, 0, 0)');
                    expect(helper.invoke('getCell', [5, 2]).style.backgroundColor).toBeNull;
                    expect(helper.invoke('getCell', [5, 2]).style.color).toBeNull;
                    done();
                });
            });

            it('EJ2-50399 - In Data validation, highlight cell color is removed if we double click on the cell', (done: Function) => {
                helper.invoke('selectRange', ['C2']);
                let td: HTMLElement = helper.invoke('getCell', [1, 2]);
                let coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, td);
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    let dialog: HTMLElement = helper.getElement('.e-validation-error-dlg.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                    "This value doesn't match the data validation restrictions defined for the cell.");
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.invoke('getCell', [1, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(helper.invoke('getCell', [1, 2]).style.color).toBe('rgb(255, 0, 0)');
                    done();
                });
            });

            it('EJ2-60806 - Clear Highlight is not working after Hyperlink to Data Validation applied cells', (done: Function) => {
                helper.getInstance().addDataValidation({ type: "Decimal", operator: "Between", value1: "0", value2: "40" }, 'H2:H11');
                helper.invoke('addInvalidHighlight', ['H2:H11']);
                helper.invoke('selectRange', ['H3']);
                helper.getInstance().addHyperlink('www.syncfusion.com', 'H3', 50);
                let td: HTMLElement = helper.invoke('getCell', [2, 7]);
                helper.invoke('removeInvalidHighlight', ['H2:H11']);
                expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
                done();                
            });

            it('EJ2-50626 - When DataValidation using list is applied, it shows duplicate values in formula bar', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "A,B,C" }, 'D2']);
                helper.invoke('selectRange', ['D2']);
                const ddlObj: any = getComponent(helper.invoke('getCell', [1, 3]).querySelector('.e-dropdownlist'), 'dropdownlist');
                ddlObj.showPopup();
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('A');
                    done();
                });
            });  

            it('EJ2-51866 - List type data validation issue while refer another sheet ranges as value->', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "=Sheet2!$A1:$A6" }, 'E2']);
                helper.invoke('selectRange', ['E2']);
                const ddlObj: any = getComponent(helper.invoke('getCell', [1, 4]).querySelector('.e-dropdownlist'), 'dropdownlist');
                ddlObj.showPopup();
                setTimeout(() => {
                    let popUpElem: HTMLElement = helper.getElement('.e-popup-open .e-dropdownbase');
                    expect(popUpElem.firstElementChild.childElementCount).toBe(6);
                    expect(popUpElem.firstElementChild.textContent).toBe('12345');
                    helper.click('.e-ddl.e-popup li:nth-child(4)');
                    done();
                });
            });  
            it('EJ2-56561 - inaccurate "isHighlighted" property value In datavalidation->', (done: Function) => {
                helper.invoke('selectRange', ['H2:H11']);
                helper.getElement('#'+helper.id+'_datavalidation').click();
                helper.getElement('#'+helper.id+'_datavalidation-popup li:nth-child(1)').click();
                setTimeout(() => {
                    helper.getElements('.e-datavalidation-dlg .e-input')[3].value = '50';
                    helper.getElements('.e-datavalidation-dlg .e-input')[4].value = '100';
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                    helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                    helper.click('.e-datavalidation-ddb li:nth-child(2)');
                    expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(255, 0, 0)');
                    expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBeNull;
                    expect(helper.invoke('getCell', [2, 7]).style.color).toBeNull;
                    expect(helper.invoke('getCell', [2, 7]).isValidCell).toBeFalsy();
                    done();
                });
            }); 
            it('EJ2-917793 - Script error occurs while selecting the cells in which list validation values contain an equal sign ->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('addDataValidation', [{ type: 'List', value1: 'test=texttable,text=linear,text=dynamic' }, 'D2:D11']);
                const cell: CellModel = spreadsheet.sheets[0].rows[1].cells[3];
                expect(JSON.stringify(cell.validation)).toBe('{"type":"List","operator":"Between","value1":"test=texttable,text=linear,text=dynamic","ignoreBlank":true,"inCellDropDown":true,"isHighlighted":true}');
                helper.invoke('selectRange', ['D2']);
                const td: HTMLElement = helper.invoke('getCell', [1, 3]).children[0];
                expect(td.classList).toContain('e-validation-list');
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    const sheet: SheetModel = spreadsheet.sheets[0];
                    expect(sheet.rows[1].cells[3].value).toBe('test=texttable');
                    expect(helper.invoke('getCell', [1, 3]).innerText).toBe('test=texttable');
                    helper.invoke('addInvalidHighlight', ['D2:D11']);
                    let td: HTMLElement = helper.invoke('getCell', [1, 3]);
                    expect(td.style.backgroundColor).toBe('');
                    expect(td.style.color).toBe('');
                    td = helper.invoke('getCell', [4, 3]);
                    expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
                    expect(td.style.color).toBe('rgb(255, 0, 0)');
                    setCell(4, 3, sheet, { value: 'text=linear' }, true);
                    helper.invoke('addInvalidHighlight', ['D2:D11']);
                    expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
                    expect(td.style.color).toBe('rgb(0, 0, 0)');
                    done();
                });
            });
            it('EJ2-952566 -> Custom data validation formula is not retained as entered', (done: Function) => {
                helper.edit('A1', '135SOL123')
                helper.invoke('selectRange', ['A5:A6']);
                helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                setTimeout(() => {
                    const ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].value = 'Custom';
                    ddlElem.ej2_instances[0].dataBind();
                    helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=COUNTIF(A1:A1,135SOL???)';
                    helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                    helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                    expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[0].validation)).toBe('{"type":"Custom","value1":"=COUNTIF(A1:A1,135SOL???)","ignoreBlank":true,"inCellDropDown":null,"isHighlighted":true}');
                    done();
                });
            });
        });
    });
    describe('EJ2-65124->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: [{
                            "Rate Card Country": "USA",
                            "Rate Card Currency": "CHF",
                            "Level": "1",
                            "Age": "21",
                            "Start Date": "11/11/2022",
                            "End Date": "11/11/2022",
                            "decimal": "17.23",
                            "Octane": "17.23",
                            "Name": "Seenu",
                            "City": "THJAJ",
                            "Time1": "8:00 AM",
                            "Time2": "8:00 AM"
                        },
                        {
                            "Rate Card Country": "",
                            "Rate Card Currency": "",
                            "Level": "",
                            "Age": "",
                            "Start Date": "",
                            "End Date": "",
                            "decimal": "",
                            "Octane": "",
                            "Name": "",
                            "City": "",
                            "Time1": "",
                            "Time2": ""
                        },
                        {
                            "Rate Card Country": "CD",
                            "Rate Card Currency": "GP-British-Pound",
                            "Level": "22",
                            "Age": "30",
                            "Start Date": "09/09/2022",
                            "End Date": "09/09/2022",
                            "decimal": "1.2",
                            "Octane": "1.2",
                            "Name": "Pa",
                            "City": "VK",
                            "Time1": "6:00 AM",
                            "Time2": "6:00 AM"
                        }]
                    }], selectedRange: 'A1:A10'
                }],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.addDataValidation({ type: 'List', value1: 'Brazil,Canada,India,Italy,Japan,Philippines,Slovakia,Spain,UK,USA', ignoreBlank: true }, `A2:A5`);
                    spreadsheet.addDataValidation({ type: 'List', value1: 'AED,AUD,CAD,CHF,EUR,GBP,HKD,INR,JPY,NOK,NZD,PHP,SAR,SEK,USD,ZAR,SGD', ignoreBlank: false }, `B2:B5`);
                    spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '1', value2: '12', ignoreBlank: true }, `C2:C5`);
                    spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '1', value2: '22', ignoreBlank: false }, `D2:D5`);
                    spreadsheet.addDataValidation({ type: 'Date', operator: 'GreaterThan', value1: '10/10/2022', ignoreBlank: true }, `E2:E5`);
                    spreadsheet.addDataValidation({ type: 'Date', operator: 'GreaterThan', value1: '10/10/2022', ignoreBlank: false }, `F2:F5`);
                    spreadsheet.addDataValidation({ type: 'Decimal', operator: 'GreaterThan', value1: '15.15', ignoreBlank: true }, `G2:G5`);
                    spreadsheet.addDataValidation({ type: 'Decimal', operator: 'GreaterThan', value1: '15.15', ignoreBlank: false }, `H2:H5`);
                    spreadsheet.addDataValidation({ type: 'TextLength', operator: 'GreaterThan', value1: '3', ignoreBlank: true }, 'I2:I5');
                    spreadsheet.addDataValidation({ type: 'TextLength', operator: 'GreaterThan', value1: '3', ignoreBlank: false }, 'J2:J5');
                    spreadsheet.addDataValidation({ type: 'Time', operator: 'GreaterThan', value1: '7:00:00 AM', ignoreBlank: true }, 'K2:K5');
                    spreadsheet.addDataValidation({ type: 'Time', operator: 'GreaterThan', value1: '7:00:00 AM', ignoreBlank: false }, 'L2:L5');
                    spreadsheet.addInvalidHighlight('A2:A5');
                    spreadsheet.addInvalidHighlight('B2:B5');
                    spreadsheet.addInvalidHighlight('C2:C5');
                    spreadsheet.addInvalidHighlight('D2:D5');
                    spreadsheet.addInvalidHighlight('E2:E5');
                    spreadsheet.addInvalidHighlight('F2:F5');
                    spreadsheet.addInvalidHighlight('G2:G5');
                    spreadsheet.addInvalidHighlight('H2:H5');
                    spreadsheet.addInvalidHighlight('I2:I5');
                    spreadsheet.addInvalidHighlight('J2:J5');
                    spreadsheet.addInvalidHighlight('K2:K5');
                    spreadsheet.addInvalidHighlight('L2:L5');
                }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Data validation ignoreBlank: true property is not working as expected', (done: Function) => {
            expect(helper.invoke('getCell', [1, 0]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 0]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 0]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 2]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 2]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 2]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 3]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 3]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 5]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 6]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 6]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 6]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 7]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 8]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 8]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 8]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 9]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 9]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 9]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 10]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 10]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [3, 10]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 11]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 11]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 11]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            done();
        });
    });

    describe('EJ2-69858 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ranges: [{dataSource : defaultData}]}],
            }, done)
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('The cell is still highlighted if we provide the valid data in the data validation applied cell', (done: Function) => {
            helper.getInstance().addDataValidation({ type: 'List', value1: 'Loafers,Semi Formals', ignoreBlank: true }, `A:A`)
            helper.invoke('addInvalidHighlight', ['A:A']);
            helper.invoke('selectRange', ['A4'])
            helper.edit('A4', 'Loafers')
            helper.invoke('selectRange', ['A5'])
            helper.edit('A5', 'Semi Formals')
            expect(helper.invoke('getCell', [3,0]).style.backgroundColor).toBe('rgb(255, 255, 255)')
            expect(helper.invoke('getCell', [3,0]).style.color).toBe('rgb(0, 0, 0)')
            expect(helper.invoke('getCell', [4,0]).style.backgroundColor).toBe('rgb(255, 255, 255)')
            expect(helper.invoke('getCell', [4,0]).style.color).toBe('rgb(0, 0, 0)')
            helper.getInstance().addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '0', value2: '10', ignoreBlank: false }, `D:D`)
            helper.invoke('addInvalidHighlight', ['D:D']);
            helper.invoke('selectRange', ['D4'])
            helper.edit('D4', '2')
            helper.invoke('selectRange', ['D5'])
            helper.edit('D5', '10')
            expect(helper.invoke('getCell', [3,3]).style.backgroundColor).toBe('rgb(255, 255, 255)')
            expect(helper.invoke('getCell', [3,3]).style.color).toBe('rgb(0, 0, 0)')
            expect(helper.invoke('getCell', [4,3]).style.backgroundColor).toBe('rgb(255, 255, 255)')
            expect(helper.invoke('getCell', [4,3]).style.color).toBe('rgb(0, 0, 0)')
            done()
        });
        it('Check isValidCell() public method with and without parameters', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'GreaterThan', value1: '10', ignoreBlank: true }, `G:G`);
            expect(JSON.stringify(spreadsheet.sheets[0].columns[6].validation)).toBe('{"type":"WholeNumber","operator":"GreaterThan","value1":"10","ignoreBlank":true}');
            helper.invoke('selectRange', ['G4']);
            expect(spreadsheet.isValidCell()).toBeFalsy();
            expect(spreadsheet.isValidCell('G5')).toBeTruthy();
            expect(spreadsheet.isValidCell('Sheet1!G10')).toBeTruthy();
            expect(spreadsheet.isValidCell('\'Sheet1\'!G8')).toBeFalsy();
            expect(spreadsheet.isValidCell('\'Sheet1\'!G8')).toBeFalsy();
            helper.invoke('selectRange', ['G9:G7']);
            expect(spreadsheet.isValidCell()).toBeFalsy();
            expect(spreadsheet.isValidCell('Sheet1!G5:G2')).toBeTruthy();
            done()
        });
        it('Highlight will not apply automatically when adding validation through public method checking', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('addInvalidHighlight');
            expect(spreadsheet.sheets[0].columns[6].validation.isHighlighted).toBeTruthy();
            helper.invoke('addDataValidation', [{ type: 'Decimal', operator: 'LessThanOrEqualTo', value1: '10.25', ignoreBlank: true }, 'H1']);
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[7].validation)).toBe('{"type":"Decimal","operator":"LessThanOrEqualTo","value1":"10.25","ignoreBlank":true}');
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(2)');
            expect(spreadsheet.sheets[0].rows[0].cells[7].validation.isHighlighted).toBeTruthy();
            helper.invoke('addDataValidation', [{ type: 'Decimal', operator: 'GreaterThanOrEqualTo', value1: '20.75', ignoreBlank: true }, 'H2']);
            expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[7].validation)).toBe('{"type":"Decimal","operator":"GreaterThanOrEqualTo","value1":"20.75","ignoreBlank":true}');
            helper.invoke('addDataValidation', [{ type: 'Decimal', operator: 'NotEqualTo', value1: '15.5', ignoreBlank: true, isHighlighted: true }, 'H3']);
            expect(JSON.stringify(spreadsheet.sheets[0].rows[2].cells[7].validation)).toBe('{"type":"Decimal","operator":"NotEqualTo","value1":"15.5","ignoreBlank":true,"isHighlighted":true}');
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(3)');
            expect(spreadsheet.sheets[0].columns[6].validation.isHighlighted).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[7].validation.isHighlighted).toBeUndefined();
            done()
        });
    });
    describe('EJ2-851197, EJ2-875556 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ranges: [{dataSource : defaultData}]}],
            }, done)
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('Pop-up positioned wrongly to the top left of spreadsheet when entering data greater than the rule applied', (done: Function) => {
            helper.getInstance().addDataValidation({ type: 'List', value1: 'A,B,C,D', ignoreBlank: true }, 'A2:A11');
            helper.getInstance().addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '10', value2: '20', ignoreBlank: true }, 'D2:D11');
            helper.invoke('selectRange', ['A2']);
            const td: HTMLElement = helper.invoke('getCell', [1, 0]).children[0];
            expect(td.classList).toContain('e-validation-list');
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
            helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
            (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
            setTimeout(() => {
                helper.invoke('selectRange', ['D2']);
                let td: HTMLElement = helper.invoke('getCell', [1, 3]);
                let coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
                helper.getElement('.e-spreadsheet-edit').textContent = '33';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    helper.click('.e-validation-error-dlg .e-primary');
                    setTimeout(() => {
                        expect(document.getElementById('spreadsheetlistValid_popup') as HTMLElement).toBeNull();
                        done()
                    });
                });
            });
        });
        it('The cell value is not correctly displayed in formula bar', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['G2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
            ddlElement.ej2_instances[0].value = 'List';
            ddlElement.ej2_instances[0].dataBind();
            helper.getElements('.e-datavalidation-dlg .e-input')[2].value = '1,2,3,4';
            helper.click('.e-datavalidation-dlg .e-primary');
            helper.invoke('updateCell', [{ value: 'friday' }, 'G2']);
            expect(spreadsheet.sheets[0].rows[1].cells[6].value).toBe('friday');
            setTimeout(() => {
                expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                helper.click('.e-validation-error-dlg .e-primary');
                setTimeout(() => {
                    const ddlObj: any = getComponent(helper.invoke('getCell', [1, 6]).querySelector('.e-dropdownlist'), 'dropdownlist');
                    ddlObj.showPopup();
                    setTimeout(() => {
                        helper.click('.e-ddl.e-popup li:nth-child(2)');
                        var formulaBar = helper.getElement('#' + helper.id + '_formula_input');
                        expect(formulaBar.value).toBe('2');
                        done();
                    });
                })
            })
        });
    });

    describe('Testing Apply data validation and remove data validation cases ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Apply Data Validation using updateAction method', (done: Function) => {
            let args = { action: 'validation', eventArgs: { type: 'List', operator: 'Between', value1: '1,2', value2: '', ignoreBlank: true, inCellDropDown: true, range: 'Sheet1!C:C' } };
            helper.getInstance().updateAction(args);
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
        it('Add List Data validation with sheet reference', (done: Function) => {
            helper.invoke('selectRange', ['I2:CV2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=Sheet1!A1:A10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8].validation)).toBe('{"type":"List","operator":"Between","value1":"=Sheet1!A1:A10","value2":"","ignoreBlank":true,"inCellDropDown":true}');
                done();
            });
        });
        it('Edit a cell with data validation.', (done: Function) => {
            helper.getInstance().addDataValidation({ operator: 'Between', value1: '10', value2: '=20', ignoreBlank: true }, 'D2:D11');
            helper.edit('D4', '=sum(10,20,30)');
            helper.edit('D5', '1000%');
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
        it('Edit a cell with DateTime data validation.', (done: Function) => {
            helper.getInstance().addDataValidation({ type: 'Date', operator: 'Between', value1: '=TODAY()', value2: '10/10/2022' }, 'B1:B11');
            helper.edit('B4', '=sum(10,20,30)');
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
        it('Edit a cell with DateTime data validation with percentage values.', (done: Function) => {
            helper.getInstance().addDataValidation({ type: 'Date', operator: 'Between', value1: '=TODAY()', value2: '1000%' }, 'C1:C11');
            helper.edit('C4', '=sum(10,20,30)');
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
        it('Empty value in validation in UI dialog.', (done: Function) => {
            helper.invoke('selectRange', ['E3:E2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Empty value in validation in UI dialog.', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Greater Than';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-primary');
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Close list validation drop down using Alt + Up Arrow.', function (done) {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'D2']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            helper.invoke('selectRange', ['D2']);
            const td: HTMLElement = helper.invoke('getCell', [1, 3]).children[0];
            expect(td.classList).toContain('e-validation-list');
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, document, td);
            helper.triggerMouseAction('mousedup', { x: coords.left, y: coords.top }, document, td);
            (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
            setTimeout(() => {
                helper.triggerKeyNativeEvent(38, false, false, td.children[0], 'keydown', true);
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Invalid Sheet Name in list validation dialog', (done: Function) => {
            helper.invoke('selectRange', ['I2:CV2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=Sheet!A1:A10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Invalid row/column refernce in list validation dialog', (done: Function) => {
            helper.invoke('selectRange', ['I2:CV2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].value = 'List';
                ddlElem.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=Sheet1!A1:C10';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Date format changed when changing the list validation value with percentage formatted value', (done: Function) => {
            helper.invoke('selectRange', ['B4']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '10.33%,$20.5' }, 'B4']);
            const cell: any = helper.getInstance().sheets[0].rows[3].cells[1];
            expect(cell.value).toBe('41847');
            expect(cell.format).toBe('m/d/yyyy');
            const cellEle: HTMLElement = helper.invoke('getCell', [3, 1]);
            expect(cellEle.textContent).toBe('7/27/2014');
            const formatBtn: HTMLElement = helper.getElementFromSpreadsheet(`#${helper.id}_number_format`);
            expect(formatBtn.textContent).toBe('Short Date');
            const listEle: Element = cellEle.children[0];
            expect(listEle.classList).toContain('e-validation-list');
            (listEle.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: listEle.children[0] });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(1)');
                expect(cell.value).toBe(0.1033);
                expect(cell.format).toBe('0.00%');
                expect(cellEle.lastChild.textContent).toBe('10.33%');
                expect(formatBtn.textContent).toBe('Percentage');
                expect()
                done();
            });
        });
        it('Date format changed when changing the list validation value with currency formatted value', (done: Function) => {
            helper.invoke('selectRange', ['B5']);
            helper.invoke('addDataValidation', [{ type: 'List', value1: '10.33%,$20.5' }, 'B5']);
            const cell: any = helper.getInstance().sheets[0].rows[4].cells[1];
            expect(cell.value).toBe('41964');
            expect(cell.format).toBe('m/d/yyyy');
            const cellEle: HTMLElement = helper.invoke('getCell', [4, 1]);
            expect(cellEle.textContent).toBe('11/21/2014');
            const formatBtn: HTMLElement = helper.getElementFromSpreadsheet(`#${helper.id}_number_format`);
            expect(formatBtn.textContent).toBe('Short Date');
            const listEle: Element = cellEle.children[0];
            expect(listEle.classList).toContain('e-validation-list');
            (listEle.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: listEle.children[0] });
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                expect(cell.value).toBe(20.5);
                expect(cell.format).toBe('$#,##0.00');
                expect(cellEle.lastChild.textContent).toBe('$20.50');
                expect(formatBtn.textContent).toBe('Currency');
                done();
            });
        });
    });
    describe('Data validation with differnt listSeperators ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ranges: [{dataSource : defaultData}]}], listSeparator : ';'
            }, done)
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('Data validation with differnt listSeperators', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'List', value1: 'A;B;C;D', ignoreBlank: true }, 'A2:A11');
            setTimeout(() => {
                expect(JSON.stringify(spreadsheet.sheets[0].rows[3].cells[0].validation)).toBe('{"type":"List","value1":"A;B;C;D","ignoreBlank":true}')
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
    });
    describe('EJ2-875571 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ index: 0, cells: [{ value: '10' }, { value: '10' }] }] }],
                activeSheetIndex: 1
            }, done);
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('Script error occurs while applying data validation for formula applied cells', (done: Function) => {
            helper.edit('C1', '=A1+B1');
            helper.getInstance().addDataValidation({ type: 'WholeNumber', operator: 'EqualTo', value1: '20', ignoreBlank: true }, 'A1:CV1');
            helper.edit('D1', '30');
            setTimeout(() => {
                expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                helper.invoke('removeDataValidation', ['A1:CV1']);
                done();
            });
        });
        it('UI -> Script error occurs while applying data validation for formula applied cells', (done: Function) => {
            helper.edit('C1', '=A1+B1');
            helper.switchRibbonTab(4);
            helper.invoke('selectRange', ['A1:CV1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-data .e-dropdownlist')[0];
                ddlElement.ej2_instances[0].value = 'Equal To';
                ddlElement.ej2_instances[0].dataBind();
                helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '20';
                expect(helper.getElements('.e-datavalidation-dlg .e-cellrange .e-input')[0].value).toBe('A1:CV1'); 
                helper.click('.e-datavalidation-dlg .e-primary');
                setTimeout(() => {
                    helper.edit('D1', '30');
                    helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                    expect(helper.getElements('.e-validation-error-dlg.e-dialog').length).toBe(1);
                    helper.click('.e-validation-error-dlg .e-footer-content button:nth-child(2)');
                    done();
                })
            });
        });
    });
    describe('EJ2-907542 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    columns: [{ width: 350 }, { width: 350 }, { validation: { operator: 'EqualTo', type: 'Time', value1: '10:23:34 PM', value2: '12:00:00' }, width: 350 }, { width: 350 }],
                    ranges: [{ dataSource: defaultData }]
                }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Time data validation is not updated properly on the saved Excel file', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.sheets[0].columns[2].validation).toBeDefined();
            const skipProps: string[] = ['dataSource', 'startCell', 'query', 'showFieldAsHeader'];
            for (let i: number = 0, sheetCount: number = spreadsheet.sheets.length; i < sheetCount; i++) {
                spreadsheet.workbookSaveModule.getStringifyObject(spreadsheet.sheets[i], skipProps, i);
            }
            done();
        });
        it('Time data validation checking with public method', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.invoke('addDataValidation', [{ type: 'Time', operator: 'EqualTo', value1: '22:23:34' }, 'D2']);
            const cell: CellModel = spreadsheet.sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"Time","operator":"EqualTo","value1":"22:23:34"}');
            expect(spreadsheet.sheets[0].rows[1].cells[3].validation).toBeDefined();
            const skipProps: string[] = ['dataSource', 'startCell', 'query', 'showFieldAsHeader'];
            for (let i: number = 0, sheetCount: number = spreadsheet.sheets.length; i < sheetCount; i++) {
                spreadsheet.workbookSaveModule.getStringifyObject(spreadsheet.sheets[i], skipProps, i);
            }
            done();
        });
    });

    describe('EJ2-914385 -> Providing support for custom data validation', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert, Delete Row - Cell validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C2', ignoreBlank: true }, 'E1:F7');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C3');
                expect(spreadsheet.sheets[0].rows[1].cells[4].value.toString()).toBe('20');
                expect(spreadsheet.sheets[0].rows[1].cells[5].validation.value1).toBe('=D3');
                expect(spreadsheet.sheets[0].rows[1].cells[5].value.toString()).toBe('200');
                spreadsheet.insertRow(1, 1);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[1].cells[5].validation.value1).toBe('=D4');
                    expect(spreadsheet.sheets[0].rows[1].cells[5].value).toBe(undefined);
                    spreadsheet.delete(1, 1, "Row");
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C3')
                        expect(spreadsheet.sheets[0].rows[1].cells[4].value.toString()).toBe('20');
                        spreadsheet.insertColumn(1, 3);
                        setTimeout(() => {
                            expect(spreadsheet.sheets[0].rows[1].cells[3]).toBe(null);
                            expect(spreadsheet.sheets[0].rows[1].cells[7].validation.value1).toBe('=F3');
                            expect(spreadsheet.sheets[0].rows[1].cells[7].value.toString()).toBe('20');
                            spreadsheet.delete(1, 3, "Column");
                            setTimeout(() => {
                                expect(spreadsheet.sheets[0].rows[1].cells[7].value.toString()).toBe('10');
                                expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C3');
                                expect(spreadsheet.sheets[0].rows[1].cells[4].value.toString()).toBe('20');
                                helper.getInstance().addDataValidation({ type: 'Custom', operator: 'EqualTo', value1: '=A8', ignoreBlank: true }, 'A8:CV8');
                                setTimeout(() => {
                                    expect(spreadsheet.sheets[0].rows[7].cells[2].validation.value1).toBe('=C8');
                                    expect(spreadsheet.sheets[0].rows[7].cells[3].validation.value1).toBe('=D8')
                                    expect(spreadsheet.sheets[0].rows[7].cells[4].validation.value1).toBe('=E8');
                                    done();
                                });
                            });
                        });
                    });
                }, 5);
            });
        });
        it('Clear validation - Cell, Column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=SUM(D1:D2)', ignoreBlank: true }, 'A:A');
            expect(spreadsheet.sheets[0].columns[0].validation.value1).toBe('=SUM(D1:D2)');
            helper.invoke('removeDataValidation', ['A2:A7']);
            expect(spreadsheet.sheets[0].columns[0].validation.address).toBe('A1:A1 A8:A1048576');
            helper.getInstance().addDataValidation({ type: 'Custom', value1: '=SUM(D1:D2)', ignoreBlank: true }, 'B2:B10');
            expect(spreadsheet.sheets[0].rows[2].cells[1].validation.value1).toBe('=SUM(D2:D3)');
            expect(spreadsheet.sheets[0].rows[3].cells[1].validation.value1).toBe('=SUM(D3:D4)');
            expect(spreadsheet.sheets[0].rows[4].cells[1].validation.value1).toBe('=SUM(D4:D5)');
            expect(spreadsheet.sheets[0].rows[6].cells[1].validation.value1).toBe('=SUM(D6:D7)');
            helper.invoke('removeDataValidation', ['B4:B6']);
            expect(spreadsheet.sheets[0].rows[2].cells[1].validation.value1).toBe('=SUM(D2:D3)');
            expect(spreadsheet.sheets[0].rows[3].cells[1].validation).toBe(undefined);
            expect(spreadsheet.sheets[0].rows[4].cells[1].validation).toBe(undefined);
            expect(spreadsheet.sheets[0].rows[6].cells[1].validation.value1).toBe('=SUM(D6:D7)');
            done();
        });
    });

    describe('EJ2-914385 -> Checking insert with custom data validation ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{ cells: [{ index: 8, validation: { type: 'Custom', value1: '=A2' } }] },
                    { index: 5, cells: [{ index: 3, validation: { type: 'Custom', value1: '12' } }] }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert before with single column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['I1']);
            helper.openAndClickCMenuItem(0, 8, [6, 1], null, true);
            expect(spreadsheet.sheets[0].rows[0].cells[9].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[10]).toBeUndefined();
            done();
        });
        it('Insert before with single column - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[8].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[9]).toBeUndefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[10]).toBeUndefined();
            done();
        });
        it('Insert after with single column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['J1']);
            helper.openAndClickCMenuItem(0, 9, [6, 2], null, true);
            expect(spreadsheet.sheets[0].rows[0].cells[9].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=B2');
            done();
        });
        it('Insert after with single column - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[10]).toBeUndefined();;
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[9].validation.value1).toBe('=A2');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=B2');
            done();
        });
        it('Insert before with mutliple column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['K1:M1']);
            helper.openAndClickCMenuItem(0, 10, [6, 1], null, true);
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[11].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[0].cells[12].validation.value1).toBe('=D2');
            done();
        });
        it('Insert before with mutliple column - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[11]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[12]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[13]).toBeUndefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[11].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[0].cells[12].validation.value1).toBe('=D2');
            done();
        });
        it('Insert after with mutliple column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['L1:N1']);
            helper.openAndClickCMenuItem(0, 11, [6, 2], null, true);
            expect(spreadsheet.sheets[0].rows[0].cells[13].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[14].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[0].cells[15].validation.value1).toBe('=D2');
            expect(spreadsheet.sheets[0].rows[0].cells[16].validation.value1).toBe('=E2');
            done();
        });
        it('Insert after with mutliple column - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[0].cells[13].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[14]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[15]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[16]).toBeUndefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[0].cells[13].validation.value1).toBe('=B2');
            expect(spreadsheet.sheets[0].rows[0].cells[14].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[0].cells[15].validation.value1).toBe('=D2');
            expect(spreadsheet.sheets[0].rows[0].cells[16].validation.value1).toBe('=E2');
            done();
        });
        it('Insert above with single row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C2', ignoreBlank: true }, 'E1:E7');
            helper.invoke('selectRange', ['E2']);
            helper.openAndClickCMenuItem(1, 0, [6, 1], true);
            expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[1].cells[4].value).toBeUndefined();
            done();
        });
        it('Insert above with single row - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[1].cells[4].value).toBeDefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=C4');
            done();
        });
        it('Insert below with single row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['E3']);
            helper.openAndClickCMenuItem(2, 0, [6, 2], true);
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=C5');
            expect(spreadsheet.sheets[0].rows[3].cells[4].validation.value1).toBe('=C6');
            done();
        });
        it('Insert below with single row - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[3].cells[4].value).toBeDefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=C5');
            expect(spreadsheet.sheets[0].rows[3].cells[4].validation.value1).toBe('=C6');
            done();
        });
        it('Insert above with mutliple row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A5:A7']);
            helper.openAndClickCMenuItem(4, 0, [6, 1], true);
            expect(spreadsheet.sheets[0].rows[4].cells[4].validation.value1).toBe('=C10');
            expect(spreadsheet.sheets[0].rows[5].cells[4].validation.value1).toBe('=C11');
            expect(spreadsheet.sheets[0].rows[6].cells[4].validation.value1).toBe('=C12');
            done();
        });
        it('Insert above with mutliple row - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[4].cells[4].validation.value1).toBe('=C6');
            expect(spreadsheet.sheets[0].rows[9].cells[4].validation).toBeUndefined();
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[4].cells[4].validation.value1).toBe('=C10');
            expect(spreadsheet.sheets[0].rows[5].cells[4].validation.value1).toBe('=C11');
            expect(spreadsheet.sheets[0].rows[6].cells[4].validation.value1).toBe('=C12');
            helper.click('#spreadsheet_undo');
            done();
        });
        it('Insert below with mutliple row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C2', ignoreBlank: true }, 'E11:E13');
            helper.invoke('selectRange', ['A11:A13']);
            helper.openAndClickCMenuItem(10, 0, [6, 2], true);
            expect(spreadsheet.sheets[0].rows[10].cells[4].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[11].cells[4].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[12].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[13].cells[4].validation.value1).toBe('=C5');
            done();
        });
        it('Insert below with mutliple row - Undo & Redo', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.click('#spreadsheet_undo');
            expect(spreadsheet.sheets[0].rows[10].cells[4].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[11].cells[4].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[12].cells[4].validation.value1).toBe('=C4');
            helper.click('#spreadsheet_redo');
            expect(spreadsheet.sheets[0].rows[10].cells[4].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[11].cells[4].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[12].cells[4].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[13].cells[4].validation.value1).toBe('=C5');
            done();
        });
    });

    describe('EJ2-914385 -> Checking custom data validations  ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ cells: [{ value: 'test' }] }] }], activeSheetIndex: 0 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Applying custom data validation to single cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C2', ignoreBlank: true }, 'D2');
            expect(spreadsheet.sheets[0].rows[1].cells[3].validation.value1).toBe('=C2');
            expect(spreadsheet.sheets[0].rows[1].cells[3].validation.type).toBe('Custom');
            done();
        });
        it('Applying custom data validation to range of cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C3', ignoreBlank: true }, 'D3:E4');
            expect(spreadsheet.sheets[0].rows[2].cells[3].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[2].cells[3].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=D3');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.type).toBe('Custom');
            done();
        });
        it('Applying custom data validation to single column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=D1', ignoreBlank: true }, 'F:F');
            expect(spreadsheet.sheets[0].columns[5].validation.value1).toBe('=D1');
            expect(spreadsheet.sheets[0].columns[5].validation.type).toBe('Custom');
            done();
        });
        it('Applying custom data validation to multiple column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=E1', ignoreBlank: true }, 'G:H');
            expect(spreadsheet.sheets[0].columns[6].validation.value1).toBe('=E1');
            expect(spreadsheet.sheets[0].columns[6].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].columns[7].validation.value1).toBe('=F1');
            expect(spreadsheet.sheets[0].columns[7].validation.type).toBe('Custom');
            done();
        });
        it('Clear custom data validation in cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('removeDataValidation', ['D3:E4']);
            expect(spreadsheet.sheets[0].rows[2].cells[3].validation).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation).toBeUndefined();
            done();
        });
        it('Clear custom data validation in in betweeen column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('removeDataValidation', ['F2:F7']);
            expect(spreadsheet.sheets[0].columns[5].validation.address).toBe('F1:F1 F8:F1048576');
            done();
        });
        it('Checking formula value as defined name', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.sheets[0];
            spreadsheet.addDefinedName({ name: "Hello", refersTo: "D1", scope: 'Workbook' });
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=Hello', ignoreBlank: true }, 'A1:A10');
            helper.invoke('addInvalidHighlight', ['A1:A10']);
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('removeInvalidHighlight', ['A1:A10']);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            helper.invoke('removeDataValidation', ['A1:A10']);
            expect(sheet.rows[1].cells[0].validation).toBeUndefined();
            done();
        });
        it('Checking formula value as cross sheet references', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.sheets[0];
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=Sheet1!A1', ignoreBlank: true }, 'A1:A10');
            helper.invoke('addInvalidHighlight', ['A1:A10']);
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('removeInvalidHighlight', ['A1:A10']);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            helper.invoke('removeDataValidation', ['A1:A10']);
            expect(sheet.rows[1].cells[0].validation).toBeUndefined();
            done();
        });
        it('Data validation input value2 is not maintained properly', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '10', value2: '50', ignoreBlank: true }, 'H2:H11');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"10","value2":"50","ignoreBlank":true}');
            spreadsheet.autoFill('I5:K5', 'H5', 'Right', 'FillSeries');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[8].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"10","value2":"50","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[9].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"10","value2":"50","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[10].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"10","value2":"50","ignoreBlank":true}');
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'Between', value1: '=D2', value2: '=E2', ignoreBlank: true }, 'H2:H11');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=D2","value2":"=E2","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[2].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=D3","value2":"=E3","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[3].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=D4","value2":"=E4","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=D5","value2":"=E5","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[5].cells[7].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=D6","value2":"=E6","ignoreBlank":true}');
            spreadsheet.autoFill('I5:K5', 'H5', 'Right', 'FillSeries');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[8].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=E5","value2":"=F5","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[9].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=F5","value2":"=G5","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[10].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"=G5","value2":"=H5","ignoreBlank":true}');
            done();
        });
    });

    describe('EJ2-931156 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }],
            }, done)
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Column validation not checked and highlight not updated when cell contains invalid data based on column validation.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Date', operator: 'LessThanOrEqualTo', value1: '=TODAY()' }, 'B1:B11');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[2].cells[1].validation)).toBe('{"type":"Date","operator":"LessThanOrEqualTo","value1":"=TODAY()"}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[3].cells[1].validation)).toBe('{"type":"Date","operator":"LessThanOrEqualTo","value1":"=TODAY()"}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[4].cells[1].validation)).toBe('{"type":"Date","operator":"LessThanOrEqualTo","value1":"=TODAY()"}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[5].cells[1].validation)).toBe('{"type":"Date","operator":"LessThanOrEqualTo","value1":"=TODAY()"}');
            spreadsheet.addDataValidation({ type: 'Date', operator: 'GreaterThanOrEqualTo', value1: '=TODAY()' }, 'B:B');
            expect(JSON.stringify(spreadsheet.sheets[0].columns[1].validation)).toBe('{"type":"Date","operator":"GreaterThanOrEqualTo","value1":"=TODAY()"}');
            spreadsheet.addInvalidHighlight('B1:B11');
            expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [2, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [5, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [6, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [7, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [9, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [10, 1]).style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(helper.invoke('getCell', [0, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [2, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [3, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [4, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [5, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [6, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [7, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [8, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [9, 1]).style.color).toBe('rgb(255, 0, 0)');
            expect(helper.invoke('getCell', [10, 1]).style.color).toBe('rgb(255, 0, 0)');
            done();
        });
    });

    describe('UI Interaction for the Custom Data validation cases ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Dialog interaction for custom data validation', (done: Function) => {
            helper.invoke('selectRange', ['C2:C3']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: ddlElem.parentElement });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(7)');
                    setTimeout(() => {
                        helper.triggerKeyNativeEvent(9);
                        helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=D2';
                        const formula: any = helper.getElements('.e-datavalidation-dlg .e-values .e-header')[0];
                        expect(formula.textContent).toBe('Formula');
                        helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                        helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                        helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[2].validation)).toBe('{"type":"Custom","value1":"=D2","ignoreBlank":true,"inCellDropDown":null}');
                        done();
                    });
                });
            });
        });
        it('Add Custom Data validation for a range', (done: Function) => {
            helper.invoke('selectRange', ['E2:E3']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: ddlElem.parentElement });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(7)');
                    setTimeout(() => {
                        helper.triggerKeyNativeEvent(9);
                        helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=D3';
                        helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                        helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                        helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"Custom","value1":"=D3","ignoreBlank":true,"inCellDropDown":null}');
                        done();
                    });
                });
            });
        });
        it('Add custom validation for range of Whole column', (done: Function) => {
            helper.invoke('selectRange', ['I1:I200']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                ddlElem.ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: ddlElem.parentElement });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(7)');
                    setTimeout(() => {
                        helper.triggerKeyNativeEvent(9);
                        helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=F1';
                        helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                        helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                        helper.click('.e-datavalidation-dlg .e-footer-content button:nth-child(2)');
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8].validation)).toBe('{"type":"Custom","value1":"=F1","ignoreBlank":true,"inCellDropDown":null}');
                        done();
                    });
                });
            });
        });
        it('Highlight invalid data after applying whole column validation', (done: Function) => {
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(2)');
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            const td: HTMLElement = helper.invoke('getCell', [1, 8]);
            expect(getCell(1, 8, sheet).validation.isHighlighted).toBeTruthy();
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Clear Highlight after applying whole column validation', (done: Function) => {
            helper.click(`#${helper.id}_datavalidation`);
            helper.click('.e-datavalidation-ddb li:nth-child(3)');
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            const td: HTMLElement = helper.invoke('getCell', [1, 8]);
            expect(getCell(1, 8, sheet).validation.isHighlighted).toBeUndefined();
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
    });

    describe('EJ2-914385 -> Checking custom data validations cases ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ name: 'Check', ranges: [{ dataSource: defaultData }] }, { name: 'Checking', rows: [{ cells: [{ value: '10' }] }] }], activeSheetIndex: 0 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Applying custom data validation to the column and clear in between validation of the column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=A1', ignoreBlank: true }, 'F:F');
            expect(spreadsheet.sheets[0].columns[5].validation.value1).toBe('=A1');
            expect(spreadsheet.sheets[0].columns[5].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['F1:F11']);
            helper.invoke('removeDataValidation', ['F2:F7']);
            expect(spreadsheet.sheets[0].columns[5].validation.address).toBe('F1:F1 F8:F1048576');
            let td: HTMLElement = helper.invoke('getCell', [0, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            td = helper.invoke('getCell', [2, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            td = helper.invoke('getCell', [9, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            done();
        });
        it('Checking invalid highlight with address property in the column validation', (done: Function) => {
            helper.invoke('addInvalidHighlight', ['F1:F11']);
            let td: HTMLElement = helper.invoke('getCell', [0, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            td = helper.invoke('getCell', [2, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            td = helper.invoke('getCell', [9, 5]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            done();
        });
        it('Checking time value in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=C3', ignoreBlank: true }, 'D3:D4');
            expect(spreadsheet.sheets[0].rows[2].cells[3].validation.value1).toBe('=C3');
            expect(spreadsheet.sheets[0].rows[2].cells[3].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[3].cells[3].validation.value1).toBe('=C4');
            expect(spreadsheet.sheets[0].rows[3].cells[3].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['D3:D4']);
            let td: HTMLElement = helper.invoke('getCell', [2, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [3, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking Empty cell value in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=K5', ignoreBlank: true }, 'D5:D6');
            expect(spreadsheet.sheets[0].rows[4].cells[3].validation.value1).toBe('=K5');
            expect(spreadsheet.sheets[0].rows[4].cells[3].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[5].cells[3].validation.value1).toBe('=K6');
            expect(spreadsheet.sheets[0].rows[5].cells[3].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['D5:D6']);
            let td: HTMLElement = helper.invoke('getCell', [4, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [5, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking Empty cell value with cross sheet references in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=Checking!K7', ignoreBlank: true }, 'D7:D8');
            expect(spreadsheet.sheets[0].rows[6].cells[3].validation.value1).toBe('=Checking!K7');
            expect(spreadsheet.sheets[0].rows[6].cells[3].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[7].cells[3].validation.value1).toBe('=Checking!K8');
            expect(spreadsheet.sheets[0].rows[7].cells[3].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['D7:D8']);
            let td: HTMLElement = helper.invoke('getCell', [6, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [7, 3]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking cross sheet references in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=Checking!A1', ignoreBlank: true }, 'E1:E2');
            expect(spreadsheet.sheets[0].rows[0].cells[4].validation.value1).toBe('=Checking!A1');
            expect(spreadsheet.sheets[0].rows[0].cells[4].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[1].cells[4].validation.value1).toBe('=Checking!A2');
            expect(spreadsheet.sheets[0].rows[1].cells[4].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['E1:E2']);
            let td: HTMLElement = helper.invoke('getCell', [0, 4]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [1, 4]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking cross sheet references with formulas in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=SUM(Checking!A1,10)', ignoreBlank: true }, 'E3:E4');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.value1).toBe('=SUM(Checking!A1,10)');
            expect(spreadsheet.sheets[0].rows[2].cells[4].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[3].cells[4].validation.value1).toBe('=SUM(Checking!A2,10)');
            expect(spreadsheet.sheets[0].rows[3].cells[4].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['E3:E4']);
            let td: HTMLElement = helper.invoke('getCell', [2, 4]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [3, 4]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking formulas in custom data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=ISNUMBER(D1)', ignoreBlank: true }, 'G1:G10');
            expect(spreadsheet.sheets[0].rows[0].cells[6].validation.value1).toBe('=ISNUMBER(D1)');
            expect(spreadsheet.sheets[0].rows[0].cells[6].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[1].cells[6].validation.value1).toBe('=ISNUMBER(D2)');
            expect(spreadsheet.sheets[0].rows[1].cells[6].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['G1:G10']);
            let td: HTMLElement = helper.invoke('getCell', [1, 6]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [2, 6]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
        it('Checking custom validation applied cell contains the formula referencing the same cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=H1>10', ignoreBlank: true }, 'H1:H11');
            expect(spreadsheet.sheets[0].rows[0].cells[7].validation.value1).toBe('=H1>10');
            expect(spreadsheet.sheets[0].rows[0].cells[7].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[5].cells[7].validation.value1).toBe('=H6>10');
            expect(spreadsheet.sheets[0].rows[5].cells[7].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['H1:H11']);
            let td: HTMLElement = helper.invoke('getCell', [0, 7]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [1, 7]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.edit('H2', '15');
            helper.invoke('addInvalidHighlight', ['H1:H11']);
            td = helper.invoke('getCell', [1, 7]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            done();
        });
        it('Checking custom validation applied cells in empty cells contains the formula referencing the same cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=K1+K2>10', ignoreBlank: true }, 'K1:K11');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.value1).toBe('=K1+K2>10');
            expect(spreadsheet.sheets[0].rows[0].cells[10].validation.type).toBe('Custom');
            expect(spreadsheet.sheets[0].rows[5].cells[10].validation.value1).toBe('=K6+K7>10');
            expect(spreadsheet.sheets[0].rows[5].cells[10].validation.type).toBe('Custom');
            helper.invoke('addInvalidHighlight', ['K1:K11']);
            let td: HTMLElement = helper.invoke('getCell', [0, 10]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            td = helper.invoke('getCell', [1, 10]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            helper.edit('K2', '15');
            helper.invoke('addInvalidHighlight', ['K1:K11']);
            td = helper.invoke('getCell', [1, 10]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            done();
        });
    });

    describe('EJ2-923159, EJ2-931175, EJ2-931177, EJ2-931134, EJ2-931179 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }]
            }, done)
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('Script error occurs when deleting a reference sheet used in data validation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'List', value1: 'Sheet2!A1', ignoreBlank: true }, 'A2:A11');
            setTimeout(() => {
                expect(JSON.stringify(spreadsheet.sheets[0].rows[1].cells[0].validation)).toBe('{"type":"List","value1":"Sheet2!A1","ignoreBlank":true}');
                spreadsheet.delete(1, 1, 'Sheet');
                setTimeout(() => {
                    helper.invoke('selectRange', ['A2']);
                    const td: HTMLElement = helper.invoke('getCell', [1, 0]).children[0];
                    expect(td.classList).toContain('e-validation-list');
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    done();
                });
            });
        });
        it('Applying custom data validation to the column and checking copy/paste for formula reference upadation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.addDataValidation({ type: 'Custom', value1: '=B1', ignoreBlank: true }, 'B:B');
            expect(spreadsheet.sheets[0].columns[1].validation.value1).toBe('=B1');
            expect(spreadsheet.sheets[0].columns[1].validation.type).toBe('Custom');
            helper.invoke('copy', ['B5']).then(() => {
                helper.invoke('paste', ['J10']);
                expect(spreadsheet.sheets[0].rows[9].cells[9].validation.value1).toBe('=J10');
                expect(spreadsheet.sheets[0].rows[9].cells[9].validation.type).toBe('Custom');
                done();
            });
        });
        it('Checking cut/paste for formula reference upadation', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('cut', ['B2:B4']).then(() => {
                helper.invoke('paste', ['J11']);
                expect(spreadsheet.sheets[0].rows[10].cells[9].validation.value1).toBe('=B2');
                expect(spreadsheet.sheets[0].rows[10].cells[9].validation.type).toBe('Custom');
                expect(spreadsheet.sheets[0].rows[11].cells[9].validation.value1).toBe('=B3');
                expect(spreadsheet.sheets[0].rows[11].cells[9].validation.type).toBe('Custom');
                expect(spreadsheet.sheets[0].rows[12].cells[9].validation.value1).toBe('=B4');
                expect(spreadsheet.sheets[0].rows[12].cells[9].validation.type).toBe('Custom');
                done();
            });
        });

        it('Column data validation not removed from cells during cut/paste action', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let cellEle: HTMLElement;
            spreadsheet.addDataValidation({ type: 'List', value1: '1,2,3,4,5,6', ignoreBlank: true }, 'C:C');
            helper.invoke('cut', ['C2:C4']).then(() => {
                helper.invoke('paste', ['I2:I4']);
                expect(spreadsheet.sheets[0].rows[1].cells[8].validation.value1).toBe('1,2,3,4,5,6');
                expect(spreadsheet.sheets[0].rows[1].cells[8].validation.type).toBe('List');
                spreadsheet.selectRange('I2');
                setTimeout(() => {
                    cellEle = helper.invoke('getCell', [1, 8]);
                    expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
                    expect(spreadsheet.sheets[0].rows[2].cells[8].validation.value1).toBe('1,2,3,4,5,6');
                    expect(spreadsheet.sheets[0].rows[2].cells[8].validation.type).toBe('List');
                    spreadsheet.selectRange('I3');
                    setTimeout(() => {
                        cellEle = helper.invoke('getCell', [2, 8]);
                        expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
                        expect(spreadsheet.sheets[0].rows[3].cells[8].validation.value1).toBe('1,2,3,4,5,6');
                        expect(spreadsheet.sheets[0].rows[3].cells[8].validation.type).toBe('List');
                        spreadsheet.selectRange('I4');
                        setTimeout(() => {
                            cellEle = helper.invoke('getCell', [3, 8]);
                            expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
                            expect(spreadsheet.sheets[0].rows[1].cells[2]).toBeNull();
                            expect(spreadsheet.sheets[0].rows[2].cells[2]).toBeNull();
                            expect(spreadsheet.sheets[0].rows[3].cells[2]).toBeNull();
                            done();
                        });
                    });
                });
            });
        });

        it('Incorrect error message shown for invalid defined name in list validation input.', (done: Function) => {
            helper.invoke('selectRange', ['D9:D13']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            let ddlElement: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
            ddlElement.ej2_instances[0].value = 'List';
            ddlElement.ej2_instances[0].dataBind();
            helper.getElements('.e-datavalidation-dlg .e-input')[2].value = '=Syncfusion'
            helper.triggerKeyEvent('keyup', 110, null, null, null, helper.getElements('.e-datavalidation-dlg .e-input')[2]);
            helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
            helper.click('.e-datavalidation-dlg .e-primary');
            expect(helper.getElements('.e-dlg-error')[0].textContent).toBe('A named range you specified cannot be found.');
            done();
        });
    });

    describe('EJ2-914948 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }],
            }, done)
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing data validation for readonly applied cells through UI Interaction', (done: Function) => {
            helper.invoke('setRangeReadOnly', [true, 'A1:H11', 0]);
            helper.invoke('selectRange', ['D2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                setTimeout(() => {
                    const dialog: HTMLElement = helper.getElement('.e-readonly-alert-dlg.e-dialog');
                    expect(dialog.querySelector('.e-dlg-content').textContent).toBe('You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.');
                    (dialog.querySelector('.e-readonly-alert-dlg.e-btn.e-primary') as HTMLElement).click();
                    expect(helper.getInstance().sheets[0].rows[1].cells[3].isReadOnly).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[1].cells[3].validation).toBeUndefined();
                    done();
                });
            });
        });
        it('Testing data validation for readonly applied columns through UI Interaction', (done: Function) => {
            helper.invoke('selectRange', ['E1:E200']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                setTimeout(() => {
                    const dialog: HTMLElement = helper.getElement('.e-readonly-alert-dlg.e-dialog');
                    expect(dialog.querySelector('.e-dlg-content').textContent).toBe('You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.');
                    (dialog.querySelector('.e-readonly-alert-dlg.e-btn.e-primary') as HTMLElement).click();
                    expect(helper.getInstance().sheets[0].columns[4].validation).toBeUndefined();
                    done();
                });
            });
        });
    });

    describe('EJ2-931183, EJ2-931159, EJ2-931162 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }]
            }, done)
        })
        afterAll(() => {
            helper.invoke('destroy');
        })
        it('Data validation not applied to hyperlink cells without cell value', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.triggerKeyNativeEvent(46);
            expect(helper.getInstance().sheets[0].rows[1].cells[7].value).toBeUndefined();
            helper.invoke('addHyperlink', ['www.google.com', 'H2']);
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'EqualTo', value1: '10' }, 'H2:H2']);
            helper.invoke('addInvalidHighlight', ['H2:H2']);
            let td: HTMLElement = helper.invoke('getCell', [1, 7]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            done();
        });
        it('Data validation not applied to hyperlink cells without cell value - I', (done: Function) => {
            helper.invoke('selectRange', ['H3']);
            helper.triggerKeyNativeEvent(46);
            expect(helper.getInstance().sheets[0].rows[2].cells[7].value).toBeUndefined();
            helper.invoke('addHyperlink', ['http://www.google.com', 'H3']);
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'EqualTo', value1: '21' }, 'H3:H3']);
            helper.invoke('addInvalidHighlight', ['H3:H3']);
            let td: HTMLElement = helper.invoke('getCell', [2, 7]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('rgb(0, 0, 238)');
            done();
        });
        it('Data validation not applied to hyperlink cells without cell value - II', (done: Function) => {
            helper.invoke('selectRange', ['H4']);
            helper.triggerKeyNativeEvent(46);
            expect(helper.getInstance().sheets[0].rows[3].cells[7].value).toBeUndefined();
            helper.edit('H4', 'Syncfusion');
            helper.invoke('addHyperlink', [{ address: 'https://ej2.syncfusion.com/', }, 'H4'])
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'EqualTo', value1: '27' }, 'H4:H4']);
            helper.invoke('addInvalidHighlight', ['H4:H4']);
            let td: HTMLElement = helper.invoke('getCell', [3, 7]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.edit('H4', 'SyncfusionSyncfusionSyncfus');
            setTimeout(() => {
                expect(td.style.backgroundColor).toBe('');
                expect(td.style.color).toBe('rgb(0, 0, 238)');
                done();
            });
        });
        it('Data validation not applied to hyperlink cells without cell value - III', (done: Function) => {
            helper.invoke('selectRange', ['H14']);
            helper.invoke('addHyperlink', [{ address: '', }, 'H14'])
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'EqualTo', value1: '14' }, 'H14:H14']);
            helper.invoke('addInvalidHighlight', ['H14:H14']);
            let td: HTMLElement = helper.invoke('getCell', [13, 7]);
            expect(helper.getInstance().sheets[0].rows[13].cells[7].value).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[13].cells[7].hyperlink.address).toBe('');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[13].cells[7].validation)).toBe('{"type":"TextLength","operator":"EqualTo","value1":"14","isHighlighted":true}');
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('rgb(0, 0, 238)');
            done();
        });

        it('Data validation applied to cells instead of the entire column when using addDataValidation method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['D1:D100']);
            spreadsheet.addDataValidation({ type: 'List', operator: 'Between', value1: '10,30,40', ignoreBlank: true });
            expect(JSON.stringify(spreadsheet.sheets[0].columns[3].validation)).toBe('{"type":"List","operator":"Between","value1":"10,30,40","ignoreBlank":true}');
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[3].validation)).toBeUndefined();
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[3].validation)).toBeUndefined();
            expect(JSON.stringify(spreadsheet.sheets[0].rows[0].cells[3].validation)).toBeUndefined();
            done();
        });

        it('Column data validation not removed when using removeDataValidation method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['D1:D100']);
            expect(JSON.stringify(spreadsheet.sheets[0].columns[3].validation)).toBe('{"type":"List","operator":"Between","value1":"10,30,40","ignoreBlank":true}');
            spreadsheet.removeDataValidation();
            expect(JSON.stringify(spreadsheet.sheets[0].columns[3].validation)).toBeUndefined();
            done();
        });
    });
});