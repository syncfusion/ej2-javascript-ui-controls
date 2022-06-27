import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, DialogBeforeOpenEventArgs, Spreadsheet, dialog, getCell, SheetModel, ValidationModel } from "../../../src/index";
import { Dialog } from "../../../src/spreadsheet/services/index";


describe('Data validation ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('Public Method ->', () => {
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
        it('', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'TextLength', operator: 'LessThanOrEqualTo', value1: '12' }, 'A2:A7']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[0];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"TextLength","operator":"LessThanOrEqualTo","value1":"12"}');
            helper.invoke('addInvalidHighlight', ['A2:A7']);
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
            expect(td.style.color).toBe('rgb(255, 0, 0)');
            helper.invoke('removeInvalidHighlight', ['A2:A7']);
            expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(td.style.color).toBe('rgb(0, 0, 0)');
            helper.invoke('removeDataValidation', ['A2:A7']);
            expect(helper.getInstance().sheets[0].rows[1].cells[0].validation).toBeUndefined();
            done();
        });

        it('Add list validation', (done: Function) => {
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
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                expect(helper.getInstance().sheets[0].rows[1].cells[3].value).toBe(13);
                expect(helper.invoke('getCell', [1, 3]).innerText).toBe('13');
                helper.editInUI('15');
                setTimeout(() => {
                    expect(helper.getElements('.e-validationerror-dlg').length).toBe(1);
                    helper.setAnimationToNone('.e-validationerror-dlg');
                    helper.click('.e-validationerror-dlg .e-footer-content button:nth-child(2)');
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
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[5] as HTMLElement).click();
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '12';
                helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '25';
                helper.setAnimationToNone('.e-datavalidation-dlg');
                helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[4].validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"12","value2":"25","ignoreBlank":true,"inCellDropDown":null}');
                helper.editInUI('26');
                setTimeout(() => {
                    expect(helper.getElements('.e-validationerror-dlg').length).toBe(1);
                    helper.setAnimationToNone('.e-validationerror-dlg');
                    helper.click('.e-validationerror-dlg .e-footer-content button:nth-child(2)');
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
                expect(helper.getElements('.e-validationerror-dlg').length).toBe(0);
                done();
            });
        });

        it('Dialog interaction', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
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
                            helper.triggerKeyNativeEvent(9);
                            helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = 'dumm';
                            helper.triggerKeyEvent('keyup', 89, null, null, null, helper.getElements('.e-datavalidation-dlg .e-values e-input')[0]);
                            helper.setAnimationToNone('.e-datavalidation-dlg');
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
                        expect(helper.getElements('.e-validationerror-dlg').length).toBe(0);
                        done();
                    });
                });
            });
        });

        it('Add list validation for range of Whole column', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            setTimeout(() => {
                helper.click('.e-datavalidation-ddb li:nth-child(1)');
                setTimeout(() => {
                    let ddlElem: any = helper.getElements('.e-datavalidation-dlg .e-allow .e-dropdownlist')[0];
                    ddlElem.ej2_instances[0].value = 'List';
                    ddlElem.ej2_instances[0].dataBind();
                    helper.getElements('.e-datavalidation-dlg .e-values .e-input')[0].value = '=G:G';
                    helper.setAnimationToNone('.e-datavalidation-dlg');
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
        });
    });

    describe('CR-Issues ->', () => {
        describe('I282749, I300338, I303567 ->', () => {
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
                                helper.invoke('selectRange', ['A1']);
                                const filterCell: HTMLElement = helper.invoke('getCell', [0, 0]).querySelector('.e-filter-icon');
                                helper.triggerMouseAction(
                                    'mousedown', { x: filterCell.getBoundingClientRect().left + 1, y: filterCell.getBoundingClientRect().top + 1 },
                                    null, filterCell);
                                cell = helper.invoke('getCell', [0, 0]);
                                helper.triggerMouseAction(
                                    'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 },
                                    document, cell);
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
                    let dlg: HTMLElement = helper.getElement().querySelector('.e-datavalidation-dlg') as HTMLElement;
                    expect(!!dlg).toBeTruthy();
                    expect((dlg.querySelector('.e-cellrange .e-input') as HTMLInputElement).value).toBe('A1:A1');
                    expect((dlg.querySelector('.e-ignoreblank .e-checkbox') as HTMLInputElement).checked).toBeTruthy();
                    (helper.getInstance().serviceLocator.getService(dialog) as Dialog).hide();
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
                    let dlg: HTMLElement = helper.getElement().querySelector('.e-validationerror-dlg') as HTMLElement;
                    expect(!!dlg).toBeTruthy();
                    expect(dlg.querySelector('.e-dlg-content').textContent).toBe('Invalid value');
                    (spreadsheet.serviceLocator.getService(dialog) as Dialog).hide();
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
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                // Insert above the cell reference
                helper.openAndClickCMenuItem(0, 0, [6, 1], true);
                expect(getCell(0, 8, sheet).validation.value1).toBe('=A3:A6');
                setTimeout(() => {
                    // Insert inbetween the cell reference
                    helper.invoke('selectRange', ['A3']);
                    helper.openAndClickCMenuItem(2, 0, [6, 2], true);
                    expect(getCell(0, 8, sheet).validation.value1).toBe('=A3:A7');
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
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['I1']);
                helper.openAndClickCMenuItem(0, 8, [6, 1], null, true);
                expect(JSON.stringify(getCell(0, 8, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe(validation);
                expect(getCell(0, 10, sheet)).toBeNull();
                done();
            });

            it('Insert before with single column - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 8, sheet).validation)).toBe(validation);
                expect(getCell(0, 9, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 8, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert after with single column', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['J1']);
                helper.openAndClickCMenuItem(0, 9, [6, 2], null, true);
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert after with single column - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe(validation);
                expect(getCell(0, 10, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 9, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert before with mutliple column', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['K1:M1']);
                helper.openAndClickCMenuItem(0, 10, [6, 1], null, true);
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 12, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 13, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert before with mutliple column - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe(validation);
                expect(getCell(0, 11, sheet)).toBeNull();
                expect(getCell(0, 12, sheet)).toBeNull();
                expect(getCell(0, 13, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 10, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 12, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 13, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert after with mutliple column', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['L1:N1']);
                helper.openAndClickCMenuItem(0, 11, [6, 2], null, true);
                expect(JSON.stringify(getCell(0, 13, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 14, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 15, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 16, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert after with mutliple column - Undo & Redo', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A3:A7","ignoreBlank":true,"inCellDropDown":true}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(0, 13, sheet).validation)).toBe(validation);
                expect(getCell(0, 14, sheet)).toBeNull();
                expect(getCell(0, 15, sheet)).toBeNull();
                expect(getCell(0, 16, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(0, 13, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 14, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 15, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(0, 16, sheet).validation)).toBe(validation);
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
                const validation: string = '{"type":"List","value1":"=A4:A8"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A2']);
                helper.openAndClickCMenuItem(1, 0, [6, 1], true);
                expect(JSON.stringify(getCell(1, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(2, 11, sheet).validation)).toBe(validation);
                expect(getCell(3, 11, sheet)).toBeNull();
                done();
            });

            it('Insert above with single row - Undo & Redo', (done: Function) => {
                const validationAfterUndo: string = '{"type":"List","value1":"=A3:A7"}';
                const validation: string = '{"type":"List","value1":"=A4:A8"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(1, 11, sheet).validation)).toBe(validationAfterUndo);
                expect(getCell(2, 11, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(1, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(2, 11, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert below with single row', (done: Function) => {
                const validation: string = '{"type":"List","value1":"=A5:A9"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A3']);
                helper.openAndClickCMenuItem(2, 0, [6, 2], true);
                expect(JSON.stringify(getCell(2, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(3, 11, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert below with single row - Undo & Redo', (done: Function) => {
                const validationAfterUndo: string = '{"type":"List","value1":"=A4:A8"}';
                const validation: string = '{"type":"List","value1":"=A5:A9"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.click('#spreadsheet_undo');
                expect(JSON.stringify(getCell(2, 11, sheet).validation)).toBe(validationAfterUndo);
                expect(getCell(3, 11, sheet)).toBeNull();
                helper.click('#spreadsheet_redo');
                expect(JSON.stringify(getCell(2, 11, sheet).validation)).toBe(validation);
                expect(JSON.stringify(getCell(3, 11, sheet).validation)).toBe(validation);
                done();
            });

            it('Insert above with mutliple row', (done: Function) => {
                const validation: string = '{"type":"List","value1":"1,2"}';
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A10:A12']);
                helper.openAndClickCMenuItem(9, 0, [6, 1], true);
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
                const sheet: SheetModel = helper.invoke('getActiveSheet');
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
                const sheet: SheetModel = helper.invoke('getActiveSheet');
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
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A9:A10']);
                helper.openAndClickCMenuItem(8, 0, [6, 1], true);
                expect(getCell(8, 3, sheet)).toBeNull();
                expect(getCell(9, 3, sheet)).toBeNull();
                done();
            });

            it('Insert below with mutliple row - not to update case', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('selectRange', ['A18:A19']);
                helper.openAndClickCMenuItem(17, 0, [6, 2], true);
                expect(getCell(19, 3, sheet)).toBeNull();
                expect(getCell(20, 3, sheet)).toBeNull();
                done();
            });

            it('Clear all on column validation is not working', (done: Function) => {
                helper.getInstance().workbookDataValidationModule.validationHandler({
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
                    expect(helper.getElementFromSpreadsheet('.e-validationerror-dlg')).toBeNull();
                    helper.edit('G2', '4');
                    setTimeout(() => {
                        expect(helper.getElementFromSpreadsheet('.e-validationerror-dlg')).not.toBeNull();
                        helper.setAnimationToNone('.e-validationerror-dlg');
                        helper.click('.e-validationerror-dlg .e-footer-content button:nth-child(2)');
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

        describe('SF-362574->', () => {
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
        });
    });
});