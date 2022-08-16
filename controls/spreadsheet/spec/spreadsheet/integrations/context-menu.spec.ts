import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, SheetModel } from '../../../src/index';

Spreadsheet.Inject(BasicModule);

/**
 *  Context menu spec
 */

describe('Spreadsheet context menu module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI interaction checking ->', () => {

        describe('Content context menu checking ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [
                        {
                            ranges: [{ dataSource: defaultData }]
                        }
                    ],
                    beforeDataBound: (): void => {
                        let spreadsheet: Spreadsheet = helper.getInstance();
                        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Sheet1') {
                            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                        }
                    },
                };
                helper.initializeSpreadsheet(model, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Cut checking', (done: Function) => {
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li');
                    setTimeout(() => {
                        let clipboardModule: any = helper.getModel('clipboardModule');
                        expect(clipboardModule.copiedInfo.isCut).toBeTruthy();
                        expect(clipboardModule.copiedInfo.range[0]).toBe(0);
                        expect(clipboardModule.copiedInfo.range[1]).toBe(0);
                        helper.invoke('selectRange', ['K1']);
                        td = helper.invoke('getCell', [0, 10]);
                        coords = <DOMRect>td.getBoundingClientRect();
                        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                        setTimeout(() => {
                            helper.click('#' + helper.id + '_cmenu_paste');
                            helper.invoke('getData', ['Sheet1!K1']).then((values: Map<string, CellModel>) => {
                                expect(values.get('K1').value).toEqual('Item Name');
                                expect(values.get('K1').style.fontWeight).toEqual('bold');
                                expect(values.get('K1').style.textAlign).toEqual('center');
                                done();
                            });
                        });
                    }, 10);
                }, 10);
            });

            it('Copy checking', (done: Function) => {
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 10]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                    setTimeout(() => {
                        let clipboardModule: any = helper.getModel('clipboardModule');
                        expect(clipboardModule.copiedInfo.isCut).toBeFalsy();
                        expect(clipboardModule.copiedInfo.range[0]).toBe(0);
                        expect(clipboardModule.copiedInfo.range[1]).toBe(10);
                        helper.invoke('selectRange', ['K2']);
                        td = helper.invoke('getCell', [1, 10]);
                        coords = <DOMRect>td.getBoundingClientRect();
                        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                        setTimeout(() => {
                            helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
                            helper.invoke('getData', ['Sheet1!K2']).then((values: Map<string, CellModel>) => {
                                expect(values.get('K2').value).toEqual('Item Name');
                                expect(values.get('K2').style.fontWeight).toEqual('bold');
                                expect(values.get('K2').style.textAlign).toEqual('center');
                                done();
                            });
                        });
                    }, 10);
                }, 10);
            });

            it('Paste checking', (done: Function) => {
                helper.invoke('selectRange', ['K3']);
                let td: HTMLTableCellElement = helper.invoke('getCell', [2, 10]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
                    setTimeout(() => {
                        helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K3').value).toEqual('Item Name');
                            expect(values.get('K3').style.fontWeight).toEqual('bold');
                            expect(values.get('K3').style.textAlign).toEqual('center');
                            done();
                        });
                    }, 10);
                }, 10);
            });

            it('Paste special -> values checking', (done: Function) => {
                helper.invoke('selectRange', ['K4']);
                helper.openAndClickCMenuItem(3, 10, [4, 1]);
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                expect(sheet.rows[3].cells[10].value).toEqual('Item Name');
                expect(sheet.rows[3].cells[10].style).toBeUndefined();
                done();
            });

            it('Paste special -> formats checking', (done: Function) => {
                helper.invoke('selectRange', ['K5']);
                let cElem: HTMLTableCellElement = helper.invoke('getCell', [4, 10]);
                let coords: DOMRect = <DOMRect>cElem.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cElem);
                setTimeout(() => {
                    cElem = helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)');
                    coords = <DOMRect>cElem.getBoundingClientRect();
                    helper.triggerMouseAction('mouseover', { x: coords.x, y: coords.y }, cElem.parentElement.parentElement, cElem);
                    setTimeout(() => {
                        helper.click('.e-spreadsheet-contextmenu .e-ul li:nth-child(2)');
                        helper.invoke('getData', ['Sheet1!K5']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K5').style.fontWeight).toEqual('bold');
                            expect(values.get('K5').style.textAlign).toEqual('center');
                            done();
                        }, 10);
                    }, 10);
                }, 10);
            });

        });

    });

    describe('Public method checking ->', () => {
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

        it('addContextMenuItems', (done: Function) => {
            helper.getInstance().contextMenuBeforeOpen = (args: any) => {
                helper.invoke('addContextMenuItems', [[{ text: 'Custom Item 1' }], 'Paste Special', false]);
                helper.invoke('addContextMenuItems', [[{ text: 'Custom Item 2' }], 'Paste Special']);
            }
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(11);
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)').textContent).toBe('Custom Item 1');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').textContent).toBe('Custom Item 2');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(6)');
                setTimeout(() => {
                    helper.getInstance().contextMenuBeforeOpen = null;
                    done();
                });
            });
        });

        it('removeContextMenuItems', (done: Function) => {
            helper.getInstance().contextMenuBeforeOpen = (args: any) => {
                helper.invoke('removeContextMenuItems', [['Cut']]);
            }
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(8);
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(1)').textContent).toBe('Copy');
                helper.getInstance().contextMenuBeforeOpen = null;
                done();
            });
        });

        it('enableContextMenuItems', (done: Function) => {
            helper.getInstance().contextMenuBeforeOpen = (args: any) => {
                helper.invoke('enableContextMenuItems', [['Hyperlink'], false]);
            }
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                helper.getInstance().contextMenuBeforeOpen = null;
                done();
            });
        });
    });
    describe('Insert, Delete, Hide Option need to be disabled after Protect the Workbook->', function () {
        beforeAll(function (done) {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(function () {
            helper.invoke('destroy');
        });
        it('Insert, Delete, Hide Option need to be disabled', function (done) {
            helper.getElement('#' + helper.id + '_sheet_tab_panel button:nth-child(1)').click();
            helper.switchRibbonTab(4);
            helper.getElement('#' + helper.id + '_protectworkbook').click();
            (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = '123';
            (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = '123';
            helper.click('.e-protectworkbook-dlg .e-primary');
            
            var cElem:HTMLElement = helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item:nth-child(3)');
            var cMenu: DOMRect = <DOMRect>cElem.getBoundingClientRect()
            helper.triggerMouseAction('contextmenu', { x:  cMenu.left + 1, y: cMenu.top + 1 }, null, cElem);
              
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(1)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(5)').classList).toContain('e-disabled');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });
        it('Protect workbook does not prevent rename and moving the sheets', function (done) {
            helper.getElement('#' + helper.id + '_sheet_tab_panel button:nth-child(1)').click();
            helper.switchRibbonTab(4);
            helper.getElement('#' + helper.id + '_protectworkbook').click();
            (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = '123';
            (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = '123';
            helper.click('.e-protectworkbook-dlg .e-primary');

            var cElem:HTMLElement = helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item:nth-child(3)');
            var cMenu: DOMRect = <DOMRect>cElem.getBoundingClientRect()
            helper.triggerMouseAction('contextmenu', { x:  cMenu.left + 1, y: cMenu.top + 1 }, null, cElem);

            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').classList).toContain('e-disabled');
                expect(helper.getInstance().sheets[1].name).toBe('Sheet2');
                done();
            });
        });
    });
    describe('CR-Issues->', () => {
        describe('EJ2-51327', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Hide Column option need to remove when there is no row selected', (done: Function) => {
                helper.invoke('selectRange', ['B1']);
                let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
                let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').click();
                    setTimeout(() => {
                        helper.invoke('selectRange', ['A1:C1']);
                        let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
                        let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                        setTimeout(() => {
                            expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                            done();
                        });
                    });
                });
            });
            it('Hide Row option need to remove when there is no row selected', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[1].cells[0];
                let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').click();
                    setTimeout(() => {
                        helper.invoke('selectRange', ['A1:A3']);
                        let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[1].cells[0];
                        let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                        setTimeout(() => {
                            expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-55488->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to disable the paste action when the select-all is performed ->', (done: Function) => {
                const selectAl:  HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                helper.triggerMouseAction(
                    'mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null,
                    selectAl);
                helper.triggerMouseAction(
                    'mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document,
                    selectAl);
                setTimeout(() => {
                    const td: HTMLTableCellElement = helper.invoke('getCell', [1, 1]);
                    const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                    setTimeout(() => {
                        expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').classList).toContain('e-disabled');
                        expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)').classList).toContain('e-disabled');
                        done();
                    });
                });
            });
        });
        describe('EJ2-55491->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to fix the performance issue with column insert with select-all action->', (done: Function) => {
                const selectAl:  HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                helper.triggerMouseAction(
                    'mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null,
                selectAl);
                helper.triggerMouseAction(
                    'mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document,
                    selectAl);
                setTimeout(() => {
                    let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
                    let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                    setTimeout(() => {
                        expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                        done();
                    });
                });
            });
        });
        describe('EJ2CORE-607->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat(
                          { fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' },
                          'A1:H1'
                        );
                        spreadsheet.enableContextMenuItems(['Enable'], true, true);
                        spreadsheet.enableContextMenuItems(['To be show'], true, true);
                    },
                    contextMenuBeforeOpen: (args: any) => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.addContextMenuItems([{ text: 'Row Rule Conditions', id: 'condition' }, { text: 'Enable' }], 'Duplicate',false);
                        spreadsheet.addContextMenuItems([], 'Row Rule Conditions', false);
                        spreadsheet.addContextMenuItems([{ text: 'To be shown' }], 'Duplicate', true );
                        spreadsheet.enableContextMenuItems(['Enable'], true, true);
                        spreadsheet.enableContextMenuItems(['To be show'], true, true);
                        spreadsheet.removeContextMenuItems(['Hide', 'Rename', 'Protect Sheet', 'Insert'], false );
                    },
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Spreadsheet context menu items disable issue->', (done: Function) => {
                const td: HTMLTableCellElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').textContent).toBe('Row Rule Conditions');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).toContain('e-menu-item');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(5)').textContent).toBe('To be shown');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(5)').classList).toContain('e-menu-item');
                    done();
                });
            });
        });
    });
});