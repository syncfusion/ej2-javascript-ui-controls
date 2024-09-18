import { SpreadsheetModel, Spreadsheet, SheetModel, DialogBeforeOpenEventArgs } from '../../../src/index';
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
});
