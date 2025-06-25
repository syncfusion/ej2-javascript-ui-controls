import { SpreadsheetModel, Spreadsheet } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, SheetModel, focus } from '../../../src/index';
import { MenuItemModel } from '@syncfusion/ej2-navigations';


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

            it('Duplicate and Protect Sheet options are disabled when adding custom items via addContextMenuItems', (done: Function) => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.getInstance().contextMenuBeforeOpen = (args: any) => {
                    helper.invoke('addContextMenuItems', [[{ text: 'Custom Item 1' }], 'Paste Special', false]);
                }
                let sheetTab: HTMLElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                let coords: DOMRect = <DOMRect>sheetTab.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTab);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').textContent).toBe('Delete');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).toContain('e-disabled');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(5)').textContent).toBe('Hide');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(5)').classList).toContain('e-disabled');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').textContent).toBe('Duplicate');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').classList).not.toContain('e-disabled');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').textContent).toBe('Protect Sheet');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).not.toContain('e-disabled');
                    done();
                });
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
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(13);
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
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(10);
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
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(11)').classList).toContain('e-disabled');
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
            helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
            (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = '123';
            (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = '123';
            helper.click('.e-protectworkbook-dlg .e-primary');
            
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
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
            expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)').classList).toContain('e-disabled');
            expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').classList).toContain('e-disabled');
            expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').classList).toContain('e-disabled');
            expect(helper.getInstance().sheets[1].name).toBe('Sheet2');
            done();
        });
    });

    describe('Apply context menu for rename sheet, sorting and filtering->', function () {
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: defaultData }] }],
            created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(function () {
            helper.invoke('destroy');
        });
        it('Apply rename sheet using context menu', (done: Function) => {
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            helper.click('#' + helper.id + '_contextmenu li:nth-child(4)');
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = 'Price Details 1';
            helper.triggerKeyNativeEvent(13, false, false, editorElem);
            expect(helper.getInstance().sheets[0].name).toBe('Price Details 1');
            done();
        });
        it('Apply descending sort using context menu', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [7, 2], false, false);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('T-Shirts');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
                expect(helper.invoke('getCell', [10, 0]).textContent).toBe('Casual Shoes');
                done();
            }, 10);
        });
        it('Apply custom sort using context menu', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [7, 3], false, false);
            setTimeout(() => {
                helper.setAnimationToNone('.e-customsort-dlg.e-dialog');
                helper.click('.e-customsort-dlg .e-primary');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                    expect(helper.invoke('getCell', [9, 0]).textContent).toBe('Sports Shoes');
                    expect(helper.invoke('getCell', [10, 0]).textContent).toBe('T-Shirts');             
                    done();
                }, 10);
            });
        });
        it('Apply re-apply filter using context menu', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(4, 0, [6, 4], false, false);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.openAndClickCMenuItem(4, 0, [6, 2], false, false);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                    helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                    helper.openAndClickCMenuItem(4, 0, [6, 1], false, false);
                    helper.click('#' + helper.id + '_sorting');
                    helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                    done();
                });
            });
        });
        it('Apply protect sheet with invalid sheet name and open hyperlink with hyperlink already applied in cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true, insertLink: true });
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                expect(spreadsheet.getActiveSheet().isProtected).toBeFalsy();
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-menu-item');
                done();
            });
        });
        it('Apply protect sheet and open hyperlink with hyperlink already applied in cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.invoke('addHyperlink', ['www.google.com', 'A1']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Price Details 1', { selectCells: true });
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(11)').classList).toContain('e-menu-item');
                    (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                    helper.invoke('unprotectSheet', ['Price Details 1']);
                    done();
                });   
            });
        });
        it('Hide column and open context menu in hidden column', (done: Function) => {
            helper.invoke('hideColumn', [1]);
            helper.invoke('selectRange', ['A1:C200']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].columns[1].hidden).toBeTruthy();
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
                let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                setTimeout(() => {
                    expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                    (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                    done();
                });
            });
        });
        it('Hide column and open context menu in hidden column by selection preveious and next column', (done: Function) => {
            helper.invoke('selectRange', ['A1:C1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                done();
            });
        });
    });

    describe('Opening context menu selection mode as none->', function () {
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: defaultData }] }], selectionSettings: { mode: 'None' },
            created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(function () {
            helper.invoke('destroy');
        });
        it('Selectionsetting mode as none to check disbaled items in cell context menu', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                done();
            });
        });
        it('Selectionsetting mode as none to check disbaled items in column header context menu', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').classList).toContain('e-disabled');
                (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                done();
            });
        });
        it('Selectionsetting mode as none to check disbaled items in row header context menu', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[0].cells[0];
            let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').classList).toContain('e-disabled');
                done();
            });
        });
        it('Selectionsetting mode as none to check disbaled items in sheet tabs context menu', (done: Function) => {
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let sheetTab: HTMLElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            let coords: DOMRect = <DOMRect>sheetTab.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTab);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(1)').classList).toContain('e-disabled');
                done();
            });
        });
    });

    describe('Checking context menu with keyboard shortcut and note ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells: [{ index: 8, value: '12' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking context menu and tab key->', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(11);
                helper.triggerKeyEvent('keydown', 27, null, false, false);
                done();
            });
        });
        it('Checking Add Note', (done: Function) => {
            const spreadsheet = helper.getInstance();
            helper.invoke('selectRange',['E1']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 4]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(9)');
                expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBe('Price');
                done();
            });
        });
        it('Checking Delete Note', (done: Function) => {
            const spreadsheet = helper.getInstance();
            helper.invoke('selectRange',['E1']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 4]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(10)');
                expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBe('Price');
                done();
            });
        });
    });
    
    describe('CR-Issues->', () => {
        describe('EJ2-51327, EJ2-55488, EJ2-55491, EJ2-62989, EJ2-909167', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-51327 - Hide Column option need to remove when there is no row selected', (done: Function) => {
                helper.invoke('selectRange', ['B1']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 1, [8], false, true);
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1:C1']);
                    let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[1];
                    let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                    setTimeout(() => {
                        helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                        expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                        done();
                    });
                });
            });
            it('EJ2-51327 - Hide Row option need to remove when there is no row selected', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(1, 0, [8], true);
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1:A3']);
                    let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[1].cells[0];
                    let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                    setTimeout(() => {
                        helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                        expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(9);
                        done();
                    });
                });
            });
            it('EJ2-55488 - Need to disable the paste action when the select-all is performed ->', (done: Function) => {
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
            it('EJ2-55491 - Need to fix the performance issue with column insert with select-all action->', (done: Function) => {
                let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[2];
                let coords: DOMRect = <DOMRect>cell.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cell);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                    done();
                });
            });
            it('removeContextMenuItems method throws script error when the removed item is not available in the list', (done: Function) => {
                helper.getInstance().contextMenuBeforeOpen = (args: any) => {
                    helper.invoke('removeContextMenuItems', [['Insert Column'], false]);
                }
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu')).not.toBeUndefined();
                    helper.getInstance().contextMenuBeforeOpen = null;
                    done();
                });
            });
            it('EJ2-909167 Context Menu is not triggered when freeze panes are applied with merged cells. ->', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('merge', ['A1:F3']);
                helper.invoke('merge', ['A6:A10']);
                spreadsheet.freezePanes(7,3);
                setTimeout(() => {
                    let td: HTMLElement = helper.invoke('getCell', [8, 4]);
                    const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                    td = document.elementFromPoint(coords.x,coords.y) as HTMLElement;
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                    setTimeout(() => {
                        expect(helper.getElements('#' + helper.id + '_contextmenu li').length).toBe(11);
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
    describe('Testing context menu on select all button', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking context menu by triggering it on select all button', (done: Function) => {
            const selectAll: HTMLButtonElement = helper.getElement('#' + helper.id + '_select_all') as HTMLButtonElement;
            helper.triggerMouseAction(
                'mousedown', { x: selectAll.getBoundingClientRect().left + 1, y: selectAll.getBoundingClientRect().top + 1 }, null,
                selectAll);
            helper.triggerMouseAction(
                'mouseup', { x: selectAll.getBoundingClientRect().left + 1, y: selectAll.getBoundingClientRect().top + 1 }, document,
                selectAll);
            setTimeout(() => {
                helper.triggerMouseAction('contextmenu', { x: selectAll.getBoundingClientRect().top + 1, y: selectAll.getBoundingClientRect().top + 1 }, null, selectAll);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').classList).toContain('e-disabled');
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)').classList).toContain('e-disabled');
                    done();
                });
            });
        });
    });
    describe('Testing on context menu items for row and column header cell', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('To get the context menu items for a row header cell', (done: Function) => {
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[0].cells[0];
            const items: MenuItemModel[] = helper.getInstance().contextMenuModule.getDataSource('RowHeader', cell);
            setTimeout(() => {
                expect(items.length).toBe(8);
                expect(items[5].text).toBe('Insert Row');
                expect(items[6].text).toBe('Delete Row');
                expect(items[7].text).toBe('Hide Row');
                done();
            });
        });
        it('To get the context menu items for a column header cell', (done: Function) => {
            let cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[0];
            const items: MenuItemModel[] = helper.getInstance().contextMenuModule.getDataSource('ColumnHeader', cell);
            setTimeout(() => {
                expect(items.length).toBe(8);
                expect(items[5].text).toBe('Insert Column');
                expect(items[6].text).toBe('Delete Column');
                expect(items[7].text).toBe('Hide Column');
                done();
            });
        });
        it('To display context menu options for a row without clicking on the row header cell', (done: Function) => {
            helper.invoke('selectRange', ['A1:CV1']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').textContent).toBe('Insert Row');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').textContent).toBe('Delete Row');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').textContent).toBe('Hide Row');
                done();
            });
        });
        it('To display context menu options for a column without clicking on the column header cell', (done: Function) => {
            helper.invoke('selectRange', ['A1:A100']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').textContent).toBe('Insert Column');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').textContent).toBe('Delete Column');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(8)').textContent).toBe('Hide Column');
                done();
            });
        });
    });

    describe('EJ2-931381', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note Option after enabling readonly mode for cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
            const td: HTMLTableCellElement = helper.invoke('getCell', [1, 1]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                done();
            });
        });
        it('Checking Add Note Option after enabling readonly mode for a row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, '11:14', 0);
            const td: HTMLTableCellElement = helper.invoke('getCell', [11, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                done();
            });
        });
        it('Checking Add Note Option after enabling readonly option for a column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, 'I:I', 0);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 8]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                done();
            });
        });
    });
    describe('Checking public methods in spreadsheet ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }], enableKeyboardNavigation: false,
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('EJ2-899869 - Navigation works on context menus when setting keyboard navigation to disabled', (done: Function) => {
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            const menu: HTMLElement = document.getElementById('spreadsheet_contextmenu');
            expect(menu).toBeTruthy();
            focus(menu);
            const wrapper: Element = document.querySelector('.e-spreadsheet-contextmenu.e-contextmenu-wrapper');
            helper.triggerKeyNativeEvent(38, false, false, menu, 'keyup', false, wrapper);
            helper.triggerKeyNativeEvent(40, false, false, menu, 'keyup', false, wrapper);
            expect(menu.querySelector('.e-menu-item.e-focused')).toBeNull();
            done();
        });
    });
    describe('EJ2-878041: allowDelete Issue ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                allowDelete: false,
                sheets: [{ ranges: [{ dataSource: defaultData }] },{index: 1, name: 'Inserted Sheet',ranges: [{ dataSource: defaultData }] },{index: 2, name: 'Inserted Sheet2',ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Delete option should be disabled', (done: Function) => {
            const sheetTab: HTMLTableCellElement = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            const coords: DOMRect = <DOMRect>sheetTab.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTab);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).toContain('e-disabled');
                done();
            }, 100);
        });
    });

    describe('Spreadsheet ContextMenu Events', () => {
        let spreadsheet: Spreadsheet;
        let contextMenuBeforeOpenCalled: boolean = false;
        let contextMenuItemSelectCalled: boolean = false;
        let contextMenuBeforeCloseCalled: boolean = false;
        let contextMenuBeforeOpenArgs: any;
        let contextMenuBeforeCloseArgs: any;
        let contextMenuItemSelectArgs: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            spreadsheet = helper.getInstance();
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('ContextMenuBeforeOpen,ContextMenuBeforeClose and ContextMenuItemSelect event trigger', (done: Function) => {
            spreadsheet.contextMenuBeforeOpen = (args: any) => {
                contextMenuBeforeOpenCalled = true;
                contextMenuBeforeOpenArgs = args.name;
            };
            spreadsheet.contextMenuItemSelect = (args: any) => {
                contextMenuItemSelectCalled = true;
                contextMenuItemSelectArgs = args.name;
            };
            spreadsheet.contextMenuBeforeClose = (args: any) => {
                contextMenuBeforeCloseCalled = true;
                contextMenuBeforeCloseArgs = args.name;
            };
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.setAnimationToNone(`#${helper.id}_contextmenu`);
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            expect(contextMenuBeforeOpenCalled).toBeTruthy();
            expect(contextMenuBeforeOpenArgs).toBe('contextMenuBeforeOpen');
            const menuPopup: HTMLElement = document.querySelector('.e-spreadsheet-contextmenu');
            expect(menuPopup).not.toBeNull();
            const copyItem: HTMLElement = document.getElementById('spreadsheet_cmenu_copy');
            copyItem.click();
            expect(contextMenuItemSelectCalled).toBeTruthy();
            expect(contextMenuItemSelectArgs).toBe('contextMenuItemSelect');
            expect(contextMenuBeforeCloseCalled).toBeTruthy();
            expect(contextMenuBeforeCloseArgs).toBe('contextMenuBeforeClose');
            spreadsheet.contextMenuBeforeOpen = undefined;
            spreadsheet.contextMenuBeforeClose = undefined;
            spreadsheet.contextMenuItemSelect = undefined;
            done();
        });
        it('ContextMenuBeforeOpen when args.cancel is set to true', (done: Function) => {
            contextMenuBeforeOpenCalled = false;
            spreadsheet.contextMenuBeforeOpen = (args: any) => {
                contextMenuBeforeOpenCalled = true;
                args.cancel = true;
            };
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.setAnimationToNone(`#${helper.id}_contextmenu`);
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            expect(contextMenuBeforeOpenCalled).toBeTruthy();
            spreadsheet.contextMenuBeforeOpen = undefined;
            done();
        });
    });
});