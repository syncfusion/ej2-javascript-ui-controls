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
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                done();
            }, 10);
        });

    });

    describe('CR Issues ->', () => {
        describe('I328870 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cannot hide sheet by using HIDE context menu option in Spreadsheet', (done: Function) => {
                expect(helper.getInstance().activeSheetIndex).toBe(0);
                expect(helper.getInstance().sheets.length).toBe(2);
                var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                var coords = td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(function () {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });
        describe('fb24295 ->', ()=> {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows:[{ cells: [{ value: '1'},] }, {cells: [{ value: '2'}] }, 
                { cells: [{ value: '0' }] }, {cells: [{ value: '5' }] } ], selectedRange: 'A1:A4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Count not getting displayed properly', (done: Function) => {
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 4');
                done();
            });
        });
        describe('EJ2-50389, EJ2-50564->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            })
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cannot Rename the sheet by using RENAME context menu option in Spreadsheet', (done: Function) => {
                helper.click('.e-add-sheet-tab');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                setTimeout(() => {
                    helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                    let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                    editorElem.click();
                    editorElem.value = 'New Sheet';
                    helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
                    expect(helper.getInstance().sheets[1].name).toBe('New Sheet');
                    done();
                });
            });
        });
        describe('EJ2-50411->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }],selectedRange: 'H2:H11' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Aggregate - Count value is changed if we select any option in aggregate', (done: Function) => {
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 10');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 10');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 554');
                done();
            });
        });
        describe('EJ2-52987->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Sheet Name Does Not Support Carrot Bracket->', (done: Function) => {
                helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                editorElem.click();
                editorElem.value = '<TestSheet>';
                helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
                expect(helper.getInstance().sheets[0].name.toString()).toBe('<TestSheet>');
                done();
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
});