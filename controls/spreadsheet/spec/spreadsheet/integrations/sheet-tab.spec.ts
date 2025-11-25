import { SpreadsheetModel, Spreadsheet, SheetModel, DialogBeforeOpenEventArgs, ImageModel, focus } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';

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
                        ranges: [{ dataSource: defaultData }]
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
            expect(helper.getInstance().activeSheetIndex).toBe(1);
            expect(helper.getInstance().sheets.length).toBe(2);
            done();
        });

        // it('Sheets List icon testing', (done: Function) => {
        //     helper.click('.e-sheets-list');
        //     let popUpElem: HTMLElement = helper.getElement('.e-dropdown-popup.e-sheets-list')
        //     expect(popUpElem.firstElementChild.childElementCount).toBe(2);
        //     done();
        // });

        it('Sheet rename testing', (done: Function) => {
            helper.invoke('updateCell', [{ value: '10' }, 'Sheet2!B1']);
            helper.invoke('updateCell', [{ formula: '=Sheet2!B1' }, 'Sheet2!B2']);
            const sheet: SheetModel = helper.getInstance().sheets[1];
            expect(sheet.rows[1].cells[1].formula).toBe('=Sheet2!B1');
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = 'TestSheet';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            expect(sheet.name).toBe('TestSheet');
            expect(sheet.rows[1].cells[1].formula).toBe('=TestSheet!B1');
            done();
        });

        it('Sheet rename cancel testing', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            helper.triggerKeyNativeEvent(27, false, false, helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename'));
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename')).toBeNull();
            done();
        });

        it('Sheet rename same name alert testing', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.value = 'Sheet1';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dlg-closeicon-btn');
                helper.triggerKeyNativeEvent(27, false, false, editorElem);
                done();
            }, 10);
        });
        it('Copy/paste formula cell reference update checking', (done: Function) => {
            helper.invoke('updateCell', [{ formula: '=SUM(TestSheet!D2:D4)' }, 'Sheet1!A1']);
            helper.invoke('updateCell', [{ formula: "=SUM('TestSheet'!D2:D4)" }, 'Sheet1!A2']);
            helper.invoke('copy', ['Sheet1!A1:A2']).then((): void => {
                helper.invoke('paste', ['B1']);
                setTimeout((): void => {
                    const sheet: SheetModel = helper.getInstance().sheets[1];
                    expect(sheet.rows[0].cells[1].formula).toBe('=SUM(TestSheet!E2:E4)');
                    expect(sheet.rows[1].cells[1].formula).toBe("=SUM('TestSheet'!E2:E4)");
                    done();
                });
            });
        });
        it('Delete sheet formula reference update checking', (done: Function) => {
            helper.invoke('delete', [1]);
            const sheet: SheetModel = helper.getInstance().sheets[0];
            expect(sheet.rows[0].cells[0].formula).toBe('=SUM(#REF!D2:D4)');
            expect(sheet.rows[1].cells[0].formula).toBe('=SUM(#REF!D2:D4)');
            done();
        });
        it('Sheet rename invalid dialog cancel action testing', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                expect(args.dialogName).toBe('SheetRenameDialog');
                args.cancel = true;
            };
            spreadsheet.dataBind();
            helper.triggerMouseAction(
                'dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'),
                helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            focus(editorElem);
            editorElem.value = '*Test';
            editorElem.setSelectionRange(1, 1);
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull();
                expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                expect(document.activeElement).toBe(editorElem);
                helper.triggerKeyNativeEvent(27, false, false, editorElem);
                expect(spreadsheet.sheets[0].name).toBe('Sheet1');
                spreadsheet.dialogBeforeOpen = undefined;
                spreadsheet.dataBind();
                done();
            }, 10);
        });
    });

    describe('List all sheets, rename sheet and hide sheet testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }, { }, { }, { }, { }, { }, { }, { },
            { }, { }, { }, { }, { },  { }, { }, { }, { }, { }, { }, { state: 'VeryHidden' }], activeSheetIndex: 1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Open list all sheet with more than 20 sheets', (done: Function) => {
            helper.click('.e-sheets-list');
            setTimeout(() => {
                let popUpElem: HTMLElement = helper.getElement('.e-dropdown-popup.e-sheets-list')
                expect(popUpElem.firstElementChild.childElementCount).toBe(21);
                helper.click('.e-sheets-list');
                done();
            });
        });
        it('Hide sheet', (done: Function) => {
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(0);
                    done();
                });
            });
        });
        it('Click hidden sheet in list all sheet popup with protected workbook', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                helper.click('.e-protectworkbook-dlg .e-primary');
                helper.click('.e-sheets-list');
                helper.getElement('.e-dropdown-popup.e-sheets-list .e-hide').click();
                setTimeout(() => {
                    expect(helper.getInstance().sheets.length).toBe(21);
                    expect(helper.getInstance().activeSheetIndex).toBe(0);
                    done();
                });
            });
        });
        it('Open context menu with disabled item to check delete item', (done: Function) => {
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).toContain('e-disabled');
                done();
            });
        });
        it('Rename sheet after disabling rename item', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename')).toBeNull();
            done();
        });
        it('Rename sheet name and mouse down by clicking in spreadsheet', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                editorElem.click();
                editorElem.value = '123';
                helper.click('.e-sheets-list');
                setTimeout(() =>{ 
                    helper.click('.e-sheets-list');
                    done();
                });
            });
        });
        it('Rename sheet name with invalid characters', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = '///';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            setTimeout(() => {
                //expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Rename sheet name with empty characters', (done: Function) => {
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = '  ';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            expect(helper.getInstance().sheets[0].name).toBe('  ');
            done();
        });
        it('Rename sheet name with no name', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = '';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            setTimeout(() => {
                //expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Rename sheet name with empty characters', (done: Function) => {
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = 'Price Details';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            expect(helper.getInstance().sheets[0].name).toBe('Price Details');
            done();
        });
        it('Cancelling rename sheet dialog error', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = '///';
            helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull(); 
                editorElem.click();
                editorElem.value = 'Price Details';
                helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
                done();
            });
        });
        it('Cancelling delete sheet alert dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-delete-sheet-dlg.e-popup-open')).toBeNull();
                    done();
                });
            });
        });
    });

    describe('Cancelling hide sheet->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }],
                actionBegin(args: any) {
                    if (args.action === 'hideSheet') {
                      args.args.eventArgs.cancel = true;
                    }
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Cancelling hide sheet in action begin event', (done: Function) => {
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(0);
                    expect(helper.getInstance().sheets.length).toBe(2);
                    done();
                });
            });
        });
    });

    describe('Delete empty sheet testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }, { }], activeSheetIndex: 1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete empty sheet', (done: Function) => {
            expect(helper.getInstance().activeSheetIndex).toBe(1);
            expect(helper.getInstance().sheets.length).toBe(3);
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(function () {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    expect(helper.getInstance().sheets.length).toBe(2);
                    done();
                });
            });
        });
        it('Destroy the active sheet', (done: Function) => {
            helper.getInstance().sheetTabsModule.destroySheet();
            setTimeout(function () {
                expect(helper.getInstance().activeSheetIndex).toBe(0);
                expect(helper.getInstance().sheets.length).toBe(1);
                done();
            });
        });
        it('Delete the single sheet in workbook to check the error', (done: Function) => {
            helper.getInstance().sheetTabsModule.removeSheetTab({ index: 0 });
            setTimeout(function () {
                //expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Cancelling the single sheet delete error dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            helper.getInstance().sheetTabsModule.removeSheetTab(0);
            setTimeout(function () {
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull();
                done();
            });
        });
    });

    describe('EJ2-844958 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ definedNames: [{ name: 'NR', refersTo: "='Sheet1'!D1:E5" }, { name: 'DF', refersTo: "='Sheet1'!E6:H10" }, { name: 'NE', refersTo: "='Sheet1'!D2:E7" }], sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }], activeSheetIndex: 0 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete the sheet after the use of named range applied formula', (done: Function) => {
            helper.invoke('updateCell', [{ formula: '=SUM(NR)' }, 'Sheet2!J1']);
            helper.invoke('updateCell', [{ formula: '=SUM(DF,NR,NE)' }, 'Sheet2!J2']);
            helper.invoke('updateCell', [{ formula: '=SUM(NR,Sheet1!H2;H10,NE,1,4,DF)' }, 'Sheet2!J3']);
            helper.invoke('updateCell', [{ formula: '=SUM(Sheet1!D1:E5)' }, 'Sheet2!J4']);
            helper.getInstance().delete(0, 0, 'Sheet');
            setTimeout((): void => {
                const sheet: SheetModel = helper.getInstance().sheets[0];
                expect(helper.getInstance().activeSheetIndex).toBe(0);
                expect(helper.invoke('getCell', [0, 9]).textContent).toBe('#REF!');
                expect(sheet.rows[0].cells[9].formula).toBe('=SUM(NR)');
                expect(helper.invoke('getCell', [1, 9]).textContent).toBe('#REF!');
                expect(sheet.rows[1].cells[9].formula).toBe("=SUM(DF,NR,NE)");
                expect(helper.invoke('getCell', [2, 9]).textContent).toBe('#REF!');
                expect(sheet.rows[2].cells[9].formula).toBe("=SUM(NR,#REF!H2;H10,NE,1,4,DF)");
                expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#REF!');
                expect(sheet.rows[3].cells[9].formula).toBe("=SUM(#REF!D1:E5)");
                done();
            });
        });
    });

    describe('CR Issues ->', () => {
        describe('EJ2-917412 - Sheet name with Exclamation Mark ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ name: 'Sheet!12!34', rows: [{ cells: [{ value: 'Welcome to Spreadsheet!!!' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Script error occurs while importing an excel file with exclamation mark in the sheet name', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.activeSheetIndex).toBe(0);
                expect(spreadsheet.sheets[0].name).toBe('Sheet!12!34');
                spreadsheet.cellFormat({ fontSize: '13pt' }, 'Sheet!12!34!A1');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('13pt');
                spreadsheet.updateCell({value: 'Spreadsheet'}, 'Sheet!12!34!A2');
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Spreadsheet');
                spreadsheet.numberFormat('$#,##0.00', 'Sheet!12!34!A3');
                expect(spreadsheet.sheets[0].rows[2].cells[0].format).toBe('$#,##0.00');
                spreadsheet.freezePanes(2, 3);
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('D3');
                    done();
                });
            });

            it('Insert images with exclamation mark in the sheet name ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertImage([{ src: "https://www.w3schools.com/images/w3schools_green.jpg" }], "Sheet!12!34!D3");
                const image: ImageModel[] = spreadsheet.sheets[0].rows[2].cells[3].image;
                expect(image[0].height).toBe(300);
                expect(image[0].width).toBe(400);
                expect(image[0].top).toBe(43);
                expect(image[0].left).toBe(192);
                expect(image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                const imageId: string = image[0].id;
                spreadsheet.deleteImage(imageId, 'Sheet!12!34!D3');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                    done();
                });
            });

            it('Chart cases with exclamation mark in the sheet name ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertChart([{ type: 'Column', theme: 'Material', range: 'Sheet!12!34!E1:F4', }]);
                setTimeout(() => {
                    let chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    expect(spreadsheet.sheets[0].rows[0].cells[4].chart[0].range).toBe('Sheet!12!34!E1:F4');
                    spreadsheet.deleteChart();
                    chart = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).toBeNull();
                    done();
                });
            });

            it('Data validation with exclamation mark in the sheet name ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.edit('E4', '20');
                spreadsheet.addDataValidation({ type: 'List', value1: '=Sheet!12!34!A1' }, 'Sheet!12!34!E4');
                helper.invoke('addInvalidHighlight', ['Sheet!12!34!E4']);
                let td: HTMLElement = helper.invoke('getCell', [3, 4]);
                expect(td.style.backgroundColor).toBe('rgb(255, 255, 0)');
                expect(td.style.color).toBe('rgb(255, 0, 0)');
                helper.edit('E4', 'Welcome to Spreadsheet!!!');
                td = helper.invoke('getCell', [3, 4]);
                expect(td.style.backgroundColor).toBe('rgb(255, 255, 255)');
                expect(td.style.color).toBe('rgb(0, 0, 0)');
                spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThanOrEqualTo', value1: '20' }, 'Sheet!12!34!D2:D11');
                spreadsheet.addInvalidHighlight();
                done();
            });

            it('Editing, Find and Replace cases with exclamation mark in the sheet name ', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.edit('A5','10');
                helper.edit('A6','10');
                helper.edit('A7', '10');
                helper.edit('A8', '10');
                expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe(10);
                expect(spreadsheet.sheets[0].rows[5].cells[0].value).toBe(10);
                expect(spreadsheet.sheets[0].rows[6].cells[0].value).toBe(10);
                expect(spreadsheet.sheets[0].rows[7].cells[0].value).toBe(10);
                spreadsheet.replaceHandler({
                    value: '10',
                    mode: 'Sheet',
                    isCSen: false,
                    isEMatch: false,
                    searchBy: 'By Row',
                    findOpt: 'next',
                    replaceValue: '100',
                    replaceBy: 'replaceAll',
                    sheetIndex: 0,
                    isAction: true
                });
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe(100);
                    expect(spreadsheet.sheets[0].rows[5].cells[0].value).toBe(100);
                    expect(spreadsheet.sheets[0].rows[6].cells[0].value).toBe(100);
                    expect(spreadsheet.sheets[0].rows[7].cells[0].value).toBe(100);
                    helper.triggerKeyNativeEvent(71, true);
                    setTimeout(() => {
                        helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                        const goToText: HTMLInputElement = helper.getElementFromSpreadsheet('.e-goto-dlg .e-text-goto') as HTMLInputElement;
                        helper.click('.e-goto-dlg .e-btn-goto-ok'); // Check this now
                        expect(helper.getElementFromSpreadsheet('.e-goto-alert-span').textContent).toBe('Reference value is not valid.');
                        goToText.value = 'Sheet!12!34!H10';
                        helper.click('.e-goto-dlg .e-btn-goto-ok');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('H10:H10');
                        expect(helper.getElementFromSpreadsheet('.e-goto-dlg.e-dialog')).toBeNull(); // Need to check this
                        done();
                    });
                });
            });

            it('Hyperlink cases with exclamation mark in the sheet name ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.addHyperlink('Sheet!12!34!A45', 'Sheet!12!34!A5', 'Hyperlink');
                expect(spreadsheet.sheets[0].rows[4].cells[0].hyperlink).toBe('Sheet!12!34!A45');
                expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Hyperlink');
                helper.invoke('selectRange', ['A5']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 2, [12]);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A45:A45');
                    spreadsheet.removeHyperlink('Sheet!12!34!A5');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].hyperlink).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Hyperlink');
                    done();
                }, 20);
            });
        });
        
        describe('I328870, fb24295, EJ2-50411, EJ2-52987, EJ2-50389, EJ2-50564,  ->', () => {
            let spreadsheet: Spreadsheet;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }], activeSheetIndex: 1 }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Cannot hide sheet by using HIDE context menu option in Spreadsheet', (done: Function) => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets.length).toBe(2);
                var td = helper.getElement('.e-sheet-tab  .e-text-wrap');
                var coords = td.getBoundingClientRect();
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(null, null, [5], null, null, null, true, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item.e-active'));
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    done();
                });
            });
            it('fb24295 - Count not getting displayed properly', (done: Function) => {
                helper.invoke('selectRange', ['D2:D5']);
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 4');
                done();
            });
            it('EJ2-50411 - Aggregate - Count value is changed if we select any option in aggregate', (done: Function) => {
                helper.invoke('selectRange', ['H2:H11']);
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 10');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 10');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 554');
                done();
            });
            it('EJ2-52987 - Sheet Name Does Not Support Carrot Bracket->', (done: Function) => {
                helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                editorElem.click();
                editorElem.value = '<TestSheet>';
                helper.triggerKeyNativeEvent(13, false, false, editorElem);
                expect(spreadsheet.sheets[0].name.toString()).toBe('<TestSheet>');
                done();
            });
            it('EJ2-50389, EJ2-50564 - Cannot Rename the sheet by using RENAME context menu option in Spreadsheet', (done: Function) => {
                helper.click('.e-add-sheet-tab');
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets.length).toBe(3);
                setTimeout(() => {
                    helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                    let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                    editorElem.click();
                    editorElem.value = 'New Sheet';
                    helper.triggerKeyNativeEvent(13, false, false, editorElem);
                    expect(spreadsheet.sheets[1].name).toBe('New Sheet');
                    done();
                });
            });
            it('SF-496196 - Sheet tabs hide/show by openFromJson action', (done: Function) => {
                expect(helper.getElement(`#${helper.id}_sheet_tab_panel`).classList.contains('e-sheet-tab-panel')).toBeTruthy();
                spreadsheet.openFromJson({ file: { 'Workbook': {'showSheetTabs': false, 'sheets': [{}] } } });
                expect(spreadsheet.showSheetTabs).toBeFalsy();
                expect(helper.getElement(`#${helper.id}_sheet_tab_panel`)).toBeNull();
                spreadsheet.openFromJson({ file: { 'Workbook': {'showSheetTabs': null, 'sheets': [{}] } } });
                expect(spreadsheet.showSheetTabs).toBeFalsy();
                expect(helper.getElement(`#${helper.id}_sheet_tab_panel`)).toBeNull();
                spreadsheet.openFromJson({ file: { 'Workbook': {'showSheetTabs': true, 'sheets': [{}] } } });
                expect(spreadsheet.showSheetTabs).toBeTruthy();
                expect(helper.getElement(`#${helper.id}_sheet_tab_panel`).classList.contains('e-sheet-tab-panel')).toBeTruthy();
                spreadsheet.openFromJson({ file: { 'Workbook': { 'sheets': [{}] } } });
                setTimeout(() => {
                    expect(spreadsheet.showSheetTabs).toBeTruthy();
                    expect(helper.getElement(`#${helper.id}_sheet_tab_panel`).classList.contains('e-sheet-tab-panel')).toBeTruthy();
                    done();
                });
            });
        });
        describe('CR-Issues ->', () => {
            describe('EJ2-60868 ->', () => {
                beforeEach((done: Function) => {
                    helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'Welcome to Spreadsheet!!!' }] }] }], isProtected: true }, done);
                });
                afterEach(() => {
                    helper.invoke('destroy');
                });
                it('Disable insert options in the context menu while the workbook is protected', (done: Function) => {
                    let sheetTabEle: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item.e-active');
                    let coords: DOMRect = <DOMRect>sheetTabEle.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTabEle);
                    setTimeout(() => {
                        expect(helper.getElement('#' + helper.id + '_contextmenu').querySelector('.e-disabled').textContent).toBe('Insert');
                        done();
                    });
                });
            });
        });
    
        describe('EJ2-942093 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Hidden cells were included while calculating the aggregate values', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['D2:H11']);
                expect(spreadsheet.sheets[0].selectedRange).toEqual('D2:H11');
                let aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
                expect(aggregateBtn).not.toBeNull();
                expect(aggregateBtn.textContent).toBe('Sum: 5803');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                expect(aggregateBtn.textContent).toBe('Count: 50');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                expect(aggregateBtn.textContent).toBe('Sum: 5803');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                expect(aggregateBtn.textContent).toBe('Avg: 116.06');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                expect(aggregateBtn.textContent).toBe('Min: 1');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(5)');
                expect(aggregateBtn.textContent).toBe('Max: 1210');
                helper.invoke('hideRow', [2, 5]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                    helper.invoke('selectRange', ['D2:H11']);
                    aggregateBtn = helper.getElement(`#${helper.id}_aggregate`);
                    expect(aggregateBtn).not.toBeNull();
                    expect(aggregateBtn.textContent).toBe('Max: 1210');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                    expect(aggregateBtn.textContent).toBe('Count: 30');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                    expect(aggregateBtn.textContent).toBe('Sum: 3896');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                    expect(aggregateBtn.textContent).toBe('Avg: 129.87');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                    expect(aggregateBtn.textContent).toBe('Min: 1');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(5)');
                    expect(aggregateBtn.textContent).toBe('Max: 1210');
                    helper.invoke('hideColumn', [4, 5]);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].columns[4].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].columns[5].hidden).toBeTruthy();
                        helper.invoke('selectRange', ['D2:H11']);
                        aggregateBtn = helper.getElement(`#${helper.id}_aggregate`);
                        expect(aggregateBtn).not.toBeNull();
                        expect(aggregateBtn.textContent).toBe('Max: 166');
                        helper.click('#' + helper.id + '_aggregate');
                        helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                        expect(aggregateBtn.textContent).toBe('Count: 18');
                        helper.click('#' + helper.id + '_aggregate');
                        helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                        expect(aggregateBtn.textContent).toBe('Sum: 576');
                        helper.click('#' + helper.id + '_aggregate');
                        helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                        expect(aggregateBtn.textContent).toBe('Avg: 32');
                        helper.click('#' + helper.id + '_aggregate');
                        helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                        expect(aggregateBtn.textContent).toBe('Min: 1');
                        helper.click('#' + helper.id + '_aggregate');
                        helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(5)');
                        expect(aggregateBtn.textContent).toBe('Max: 166');
                        done();
                    });
                });
            });
            it('EJ2-949377- Implement RTL mode support for spreadsheet sheet tabs', (done: Function) => {
                helper.setModel('enableRtl', true);
                expect(helper.hasClass('e-rtl', document.getElementById(helper.id))).toBe(true);
                helper.invoke('selectRange', ['H1:H11']);
                helper.click('#' + helper.id + '_aggregate');
                const aggregateBtn = helper.getElement(`#${helper.id}_aggregate-popup`);
                expect(aggregateBtn).not.toBeNull();
                helper.click('#' + helper.id + '_aggregate');
                helper.click('.e-sheets-list');
                const popUpElem: HTMLElement = helper.getElement('.e-dropdown-popup.e-sheets-list')
                expect(popUpElem).not.toBeNull();
                helper.click('.e-sheets-list');
                done();
            });
        });
    });

    describe('Checking update action method with sheet tabs cases. ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}, {}], activeSheetIndex: 1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Sheet Switch through update action method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'gotoSheet', eventArgs: { currentSheetIndex: 0, previousSheetIndex: 1 } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(0);
                done();
            });
        });
        it('Sheet Delete through update action method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'delete', eventArgs: { modelType: 'Sheet', startIndex: 1, endIndex: 1 } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
        it('Delete Row through update action method with wrong activeSheetIndex', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'delete', eventArgs: { modelType: 'Row', activeSheetIndex: 5 } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
        it('Insert Row through update action method with wrong activeSheetIndex', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'insert', eventArgs: { modelType: 'Row', activeSheetIndex: 5 } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
    });

    describe('EJ2:967458,EJ2-990901 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Aggregate calculation for discontinuous ranges with and without overlapping cells', (done: Function) => {
            helper.invoke('selectRange', ['D2:D5 F2:F5']);
            setTimeout(() => {
                let aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
                expect(aggregateBtn).not.toBeNull();
                expect(aggregateBtn.textContent).toBe('Sum: 1465');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                expect(aggregateBtn.textContent).toBe('Count: 8');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                expect(aggregateBtn.textContent).toBe('Avg: 183.13');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                expect(aggregateBtn.textContent).toBe('Min: 10');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(5)');
                expect(aggregateBtn.textContent).toBe('Max: 600');
                helper.invoke('selectRange', ['D2:E5 E4:F6']);
                setTimeout(function () {
                    let aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
                    expect(aggregateBtn).not.toBeNull();
                    expect(aggregateBtn.textContent).toBe('Max: 300');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                    expect(aggregateBtn.textContent).toBe('Count: 12');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                    expect(aggregateBtn.textContent).toBe('Sum: 1060');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                    expect(aggregateBtn.textContent).toBe('Avg: 88.33');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                    expect(aggregateBtn.textContent).toBe('Min: 10');
                    done();
                });
            });
        });
        it('EJ2-990901 - Dropdown Missing in Aggregate Column When Selecting Cells with Containing Text and Numbers', (done: Function) => {
            helper.edit('A3', '76');
            helper.edit('A5', '45');
            helper.edit('A7', '23');
            helper.edit('A9', '12');
            helper.invoke('selectRange', ['A1:A10']);
            setTimeout(() => {
                let aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
                expect(aggregateBtn).not.toBeNull();
                expect(aggregateBtn.textContent).toBe('Count: 10');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                expect(aggregateBtn.textContent).toBe('Sum: 156');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                expect(aggregateBtn.textContent).toBe('Avg: 39');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                expect(aggregateBtn.textContent).toBe('Min: 12');
                helper.click('#' + helper.id + '_aggregate');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(5)');
                expect(aggregateBtn.textContent).toBe('Max: 76');
                helper.invoke('selectRange', ['A3:A9']);
                setTimeout(() => {
                    let aggregateBtn: HTMLElement = helper.getElement(`#${helper.id}_aggregate`);
                    expect(aggregateBtn).not.toBeNull();
                    expect(aggregateBtn.textContent).toBe('Max: 76');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                    expect(aggregateBtn.textContent).toBe('Count: 7');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(2)');
                    expect(aggregateBtn.textContent).toBe('Sum: 156');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                    expect(aggregateBtn.textContent).toBe('Avg: 39');
                    helper.click('#' + helper.id + '_aggregate');
                    helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(4)');
                    expect(aggregateBtn.textContent).toBe('Min: 12');
                    helper.click('#' + helper.id + '_aggregate');
                    done();
                });
            });
        });
    });
});
