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
            }, 200);
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
                }, 200);
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
                    expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
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
    
    describe('CR-Issues->', () => {
        describe('EJ2-51327, EJ2-55488, EJ2-55491, EJ2-62989', () => {
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