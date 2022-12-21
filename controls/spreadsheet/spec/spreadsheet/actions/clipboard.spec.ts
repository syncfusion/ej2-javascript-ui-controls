import { Spreadsheet, SpreadsheetModel, CellSaveEventArgs, RowModel, SheetModel, getCell } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { createElement, EventHandler } from '@syncfusion/ej2-base';
import { getRangeAddress } from "../../../src/index";

/**
 *  Clipboard test cases
 */
describe('Clipboard ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI Interaction ->', () => {
        describe('', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy pasting cells with increased font size does not increase row height', (done: Function) => {
                helper.invoke('cellFormat', [{ fontSize: '20pt' }, 'A2:B4']);
                helper.invoke('copy', ['A2:B4']).then(() => {
                    helper.invoke('paste', ['D5']);
                    expect(helper.invoke('getRow', [4]).style.height).toBe('35px');
                    expect(helper.invoke('getRow', [5]).style.height).toBe('35px');
                    expect(helper.invoke('getRow', [6]).style.height).toBe('35px');
                    const sheet: SheetModel = helper.invoke('getActiveSheet');
                    expect(sheet.rows[4].height).toBe(35);
                    expect(sheet.rows[5].height).toBe(35);
                    expect(sheet.rows[6].height).toBe(35);
                    expect(getCell(4, 3, sheet).style.fontSize).toBe('20pt');
                    expect(getCell(5, 4, sheet).style.fontSize).toBe('20pt');
                    expect(getCell(6, 3, sheet).style.fontSize).toBe('20pt');
                    done();
                });
            });
        });
    });

    describe('Paste Method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Cut/paste the Merged cells->', (done: Function) => {
            helper.invoke('merge', [getRangeAddress([12, 0, 14, helper.getInstance().sheets[0].colCount - 1])]);
            expect(helper.getInstance().sheets[0].rows[12].cells[0].rowSpan).toBe(3);
            expect(helper.getInstance().sheets[0].rows[12].cells[0].colSpan).toBe(100);
            helper.invoke('cut', ['A13']).then(() => {
                helper.invoke('paste', ['A18']);
                expect(helper.getInstance().sheets[0].rows[17].cells[0].rowSpan).toBe(3);
                expect(helper.getInstance().sheets[0].rows[17].cells[0].colSpan).toBe(100);
                done();
            });
        });

        it('Copy/paste the Merged cells->', (done: Function) => {
            helper.invoke('copy', ['A18']).then(() => {
                helper.invoke('paste', ['A22']);
                expect(helper.getInstance().sheets[0].rows[21].cells[0].rowSpan).toBe(3);
                expect(helper.getInstance().sheets[0].rows[21].cells[0].colSpan).toBe(100);
                done();
            });
        });

        it('Copy and paste in Merged cells->', (done: Function) => {
            helper.invoke('merge', ['N2:N5']);
            helper.invoke('selectRange', ['N2']);
            helper.invoke('copy', ['H1']).then(() => {
                helper.invoke('paste', ['N2']);
                expect(helper.getInstance().sheets[0].rows[1].cells[13].value.toString()).toBe('Profit');
                done();
            });
        });

        it('Cut/paste the wrap applied cells->', (done: Function) => {
            helper.edit('A1', 'Item Name');
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.wrap('A1', true);
            expect(helper.invoke('getCell', [0,0]).classList).toContain('e-wraptext');
            helper.invoke('cut', ['A1']).then(() => {
                helper.invoke('paste', ['B1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[1].value.toString()).toBe('Item Name');
                expect(helper.invoke('getCell', [0,1]).classList).toContain('e-wraptext');
                done();
            });
        });

        it('Copy/paste the wrap applied cells->', (done: Function) => {
            helper.invoke('copy', ['B1']).then(() => {
                helper.invoke('paste', ['A1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value.toString()).toBe('Item Name');
                expect(helper.invoke('getCell', [0,0]).classList).toContain('e-wraptext');
                expect(helper.invoke('getCell', [0,1]).classList).toContain('e-wraptext');
                done();
            });
        });

        it('Cut/paste the conditional formatting highligted cells->', (done: Function) => {
            helper.invoke('selectRange', ['H2:H11']);
            helper.getInstance().workbookConditionalFormattingModule.setCFRule({ cfModel: { type: 'BlueDataBar', range: 'H2:H11' }, isAction: true });
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            helper.invoke('cut', ['H2:H11']).then(() => {
                helper.invoke('paste', ['I2']);
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [9, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                done();
            });
        });

        it('Copy/paste the conditional formatting highligted cells->', (done: Function) => {
            helper.invoke('selectRange', ['I2:I11']);
            expect(helper.invoke('getCell', [1, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [9, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            helper.invoke('copy', ['I2:I11']).then(() => {
                helper.invoke('paste', ['H2']);
                expect(helper.invoke('getCell', [1, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [9, 8]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
                expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                done();
            });
        });

        it('Cut/paste the Filtered cell values->', (done: Function) => {
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).toContain('e-filtered');
                helper.invoke('cut', ['E1:E11']).then(() => {
                    helper.invoke('paste', ['J1']);
                    expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toEqual('Price');
                    expect(helper.getInstance().sheets[0].rows[5].cells[9].value).toEqual(10);
                    expect(helper.getInstance().sheets[0].rows[7].cells[9].value).toEqual(10);
                    expect(helper.getInstance().sheets[0].rows[8].cells[9].value).toEqual(10);
                    expect(helper.getInstance().sheets[0].rows[10].cells[9].value).toEqual(10);
                    done();
                });
            });
        });

        it('Copy/paste the Filtered cell values->', (done: Function) => {
            helper.invoke('copy', ['F1:F11']).then(() => {
                helper.invoke('paste', ['K1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toEqual('Amount');
                expect(helper.getInstance().sheets[0].rows[1].cells[10].value).toEqual(300);
                expect(helper.getInstance().sheets[0].rows[2].cells[10].value).toEqual(200);
                expect(helper.getInstance().sheets[0].rows[3].cells[10].value).toEqual(310);
                expect(helper.getInstance().sheets[0].rows[4].cells[10].value).toEqual(500);
                done();
            });
        });
    });

    describe('Paste Method - II>', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Cut/Paste for Sorted Cells->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.sort({ containsHeader: true}, 'A1:A11');
            setTimeout(() => {
                helper.invoke('cut', ['A1:A11']).then(() => {
                    helper.invoke('paste', ['I1']);
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toEqual('Item Name');
                    expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toEqual('Casual Shoes');
                    expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toEqual('Cricket Shoes');
                    expect(helper.getInstance().sheets[0].rows[9].cells[8].value).toEqual('Sports Shoes');
                    expect(helper.getInstance().sheets[0].rows[10].cells[8].value).toEqual('T-Shirts');
                    done();
                });
            }, 10);
        });

        it('Copy/Paste for Sorted Cells->', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.sort({ containsHeader: true}, 'H1:H11');
            setTimeout(() => {
                helper.invoke('copy', ['H1:H11']).then(() => {
                    helper.invoke('paste', ['J1']);
                    expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toEqual('Profit');
                    expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toEqual(10);
                    expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toEqual(14);
                    expect(helper.getInstance().sheets[0].rows[9].cells[9].value).toEqual(70);
                    expect(helper.getInstance().sheets[0].rows[10].cells[9].value).toEqual(166);
                    done();
                });
            }, 10);
        });

        it('Cut/Paste Unique Formula applied Cells->', (done: Function) => {
            helper.edit('K1', '=UNIQUE(E1:E11)');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].formula).toEqual('=UNIQUE(E1:E11)');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toEqual('Price');
            expect(helper.getInstance().sheets[0].rows[1].cells[10].value).toEqual('20');
            expect(helper.getInstance().sheets[0].rows[2].cells[10].value).toEqual('30');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].value).toEqual('15');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].value).toEqual('10');
            helper.invoke('cut', ['K1:K5']).then(() => {
                helper.invoke('paste', ['L1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[11].formula).toEqual('=UNIQUE(E1:E11)');
                expect(helper.getInstance().sheets[0].rows[0].cells[11].value).toEqual('Price');
                expect(helper.getInstance().sheets[0].rows[1].cells[11].value).toEqual('20');
                expect(helper.getInstance().sheets[0].rows[2].cells[11].value).toEqual('30');
                expect(helper.getInstance().sheets[0].rows[3].cells[11].value).toEqual('15');
                expect(helper.getInstance().sheets[0].rows[4].cells[11].value).toEqual('10');
                done();
            });
        });

        it('Copy/Paste Unique Formula applied Cells->', (done: Function) => {
            helper.edit('K1', '=UNIQUE(E1:E11)');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].formula).toEqual('=UNIQUE(E1:E11)');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toEqual('Price');
            expect(helper.getInstance().sheets[0].rows[1].cells[10].value).toEqual('20');
            expect(helper.getInstance().sheets[0].rows[2].cells[10].value).toEqual('30');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].value).toEqual('15');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].value).toEqual('10');
            helper.invoke('copy', ['K1:K5']).then(() => {
                helper.invoke('paste', ['M1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[12].formula).toEqual('=UNIQUE(G1:G11)');
                expect(helper.getInstance().sheets[0].rows[0].cells[12].value).toEqual('Discount');
                expect(helper.getInstance().sheets[0].rows[1].cells[12].value).toEqual('1');
                expect(helper.getInstance().sheets[0].rows[2].cells[12].value).toEqual('5');
                expect(helper.getInstance().sheets[0].rows[3].cells[12].value).toEqual('7');
                expect(helper.getInstance().sheets[0].rows[4].cells[12].value).toEqual('11');
                expect(helper.getInstance().sheets[0].rows[9].cells[12].value).toEqual('12');
                expect(helper.getInstance().sheets[0].rows[10].cells[12].value).toEqual('9');
                done();
            });
        });
    });

    describe('Paste Method - III', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {  }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Copy and Paste-Values for alt+wrap applied Cells->', (done: Function) => {
            helper.edit('A1', 'Sync \n fusion');
            expect(helper.invoke('getCell', [0, 0]).classList).toContain('e-wraptext');
            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Sync \n fusion');
            helper.invoke('copy', ['A1']).then(() => {
                helper.invoke('paste', ['B2', 'Values']);
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('Sync \n fusion');
                expect(helper.invoke('getCell', [1, 1]).classList).toContain('e-alt-unwrap');
                done();
            });
        });

        it('Cut and Paste Full Row with Increased Row Height->', (done: Function) => {
            helper.invoke('setRowHeight', [40, 12]);
            expect(helper.getInstance().sheets[0].rows[12].height).toBe(40);
            helper.invoke('cut', [getRangeAddress([12, 0, 12, helper.getInstance().sheets[0].colCount - 1])]).then(() => {
                helper.invoke('paste', ['A14']);
                expect(helper.getInstance().sheets[0].rows[12].height).toBe(20);
                expect(helper.getInstance().sheets[0].rows[13].height).toBe(40);
                done();
            });
        });

        it('Copy and Paste Full Row with Increased Row Height->', (done: Function) => {
            helper.invoke('copy', [getRangeAddress([13, 0, 13, helper.getInstance().sheets[0].colCount - 1])]).then(() => {
                helper.invoke('paste', ['A15']);
                expect(helper.getInstance().sheets[0].rows[13].height).toBe(40);
                expect(helper.getInstance().sheets[0].rows[14].height).toBe(40);
                done();
            });
        });

        it('Copy date Formatted cell->', (done: Function) => {
            helper.invoke('copy', ['B5']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                expect(helper.invoke('getCell', [4, 1]).textContent).toBe('11/21/2014');
                expect(helper.getInstance().sheets[0].rows[4].cells[1].value).toEqual('41964');
                done();
            });
        });

        it('Insert Column between two Copied Cell->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[2].value).toBe('Time');
            helper.invoke('copy', ['B1:C1']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.invoke('insertColumn', [2]);
                expect(helper.getInstance().sheets[0].rows[0].cells[2]).toBeNull();
                expect(helper.getInstance().sheets[0].rows[0].cells[3].value).toBe('Time');
                done();
            });
        });

        it('Insert Row above Copied Cell->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
            helper.invoke('copy', ['A2']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.invoke('insertRow', [2]);
                expect(helper.getInstance().sheets[0].rows[2]).toEqual({});
                expect(helper.getInstance().sheets[0].rows[3].cells[0].value).toBe('Sports Shoes');
                done();
            });
        });

        it('Insert Row between Copied Cell->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[4].cells[0].value).toBe('Formal Shoes');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toBe('Sandals & Floaters');
            helper.invoke('copy', ['A5:A6']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.invoke('insertRow', [5]);
                expect(helper.getInstance().sheets[0].rows[5]).toEqual({});
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toBe('Sandals & Floaters');
                done();
            });
        });

        it('Insert Row in Copied Cell->', (done: Function) => {
            helper.invoke('selectRange', ['A9']);
            expect(helper.getInstance().sheets[0].rows[8].cells[0].value).toBe('Sneakers');
            helper.invoke('copy', ['A9']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(8, 0, [6, 1], true);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[8]).toEqual({});
                    expect(helper.getInstance().sheets[0].rows[9].cells[0].value).toBe('Sneakers');
                    done(); 
                });
            });
        });

        it('Apply Copy in One Sheet and Insert Row/Column in another Sheet->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Profit');
            helper.invoke('selectRange', ['Sheet1!D4']);
            helper.invoke('copy', ['Sheet1!D4']).then(function (){
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.invoke('selectRange', ['I1']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 8, [6, 1], false, true);
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                    expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('Profit');
                    done(); 
                });
            });
        });
    });

    describe('Copy Chart/Image and Paste', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {  }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Copy Image and Paste->', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'D3', isPublic: true });
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":300,"width":400,"top":40,"left":192}]');
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                helper.invoke('copy').then(() => {
                    helper.invoke('paste', ['M1']);
                    expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[12].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_2","height":300,"width":400,"top":0,"left":768}]');
                    EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                    done();
                });
            });
        });
        it('Copy Chart and Paste->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5',  }]]);
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                helper.triggerMouseAction( 'mousedown', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, Chart, Chart);
                helper.triggerMouseAction( 'mouseup', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, document, Chart);
                setTimeout(() => {
                    helper.invoke('copy').then(() => {
                        helper.invoke('paste', ['M20']);
                        done();
                    });
                });
            });
        });
    });

    describe('Apply copy Freeze Pane applied cells', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 3, frozenColumns: 3, selectedRange: 'C3' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Apply copy before Freezed Row and Freezed Column', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            helper.invoke('copy', ['C3']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                done();
            });   
        }); 
        it('Apply copy after Freezed Row and before Freezed Column', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.invoke('copy', ['C4']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                done();
            });
        });
        it('Apply copy after Freezed Column and before Freezed Row', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.invoke('copy', ['D3']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                done();
            });
        });
        it('Apply copy after Freezed Column and before & after Freezed Row', (done: Function) => {
            helper.invoke('selectRange', ['D3:D4']);
            helper.invoke('copy', ['D3:D4']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                done();
            });
        });
        it('Apply copy after Freezed ROw & before and after Freezed Column', (done: Function) => {
            helper.invoke('selectRange', ['D4:C4']);
            helper.invoke('copy', ['D4:C4']).then(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                done();
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('F163240, FB23869, EJ2-59226 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Paste behaviour erroneous after cut', (done: Function) => {
                helper.invoke('selectRange', ['A1:D5']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toEqual('Item Name');
                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('15');
                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Formal Shoes');
                expect(spreadsheet.sheets[0].rows[2].cells[2].value).toEqual('0.2475925925925926');
                setTimeout((): void => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('selectRange', ['A2']);
                        setTimeout((): void => {
                            helper.invoke('paste', ['Sheet1!A2:A2']);
                            setTimeout((): void => {
                                expect(spreadsheet.sheets[0].rows[0].cells[0]).toBeNull();
                                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('');
                                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('20');
                                expect(helper.invoke('getCell', [4, 3]).textContent).toEqual('20');
                                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Sports Shoes');
                                expect(helper.invoke('getCell', [3, 0]).textContent).toEqual('Sports Shoes');
                                expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toEqual('0.4823148148148148');
                                done();
                            });
                        });
                    });
                });
            });

            it('Paste values only for formula is not working', (done: Function) => {
                helper.edit('I1', '=SUM(F2:F8)');
                helper.invoke('copy', ['I1']).then(() => {
                    helper.invoke('paste', ['I2', 'Values']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 8]).textContent).toBe('2700');
                        expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBeUndefined();
                        done();
                    });
                });
            });

            it('When we copy the values with empty cell, it pasted to additional range with new values', (done: Function) => {
                helper.edit('H3', '=SUM(F3:G3)');
                helper.invoke('copy', ['H3:I3']).then(() => {
                    helper.invoke('paste', ['I3']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toEqual('');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toBe('');
                });
                helper.invoke('copy', ['G3:G3']).then(() => {
                    helper.invoke('paste', ['H3']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[7].value).not.toEqual('');
                    expect(helper.invoke('getCell', [2, 7]).textContent).not.toBe('');
                    done();
                });
            });
        });
        describe('F162960 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: '100' }, { value: '25' }, { value: '1001' }] }, { cells: [{ value: '100' },
                    { value: '25' }, { value: '1001' }] }], selectedRange: 'A1:B2' }],
                    created: (): void => helper.getInstance().setRowHeight(45)
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Row height not persistent after cut/paste', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                expect(spreadsheet.sheets[0].rows[3]).toBeUndefined();
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['Sheet1!A4:A4']);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                            expect(helper.invoke('getRow', [0, 0]).style.height).toEqual('45px');
                            expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toEqual('100');
                            done();
                        });
                    });
                });
            });
        });
        describe('I299870, I298549, I296802 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'Value' }] }], selectedRange: 'A1' }],
                    cellSave: (): void => {
                        (helper.getInstance() as Spreadsheet).insertRow([{ index: 1, cells: [{ value: 'Added' }] }]);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Trigger the cellSave event for paste action and while insertRow inn actionComplete script error throws', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[4].cells[0].value).toEqual('Value');
                            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('Added');
                            done();
                        });
                    });
                });
            });
        });
        describe('I301708 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'C2' }],
                    created: (): void => {
                        (helper.getInstance() as Spreadsheet).setBorder({ border: '1px solid #000' }, 'C2');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Border copy paste issue (copy the border and paste it in adjacent cells, border removed)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let dataSourceChangedFunction: () => void = jasmine.createSpy('dataSourceChanged');
                spreadsheet.dataSourceChanged = dataSourceChangedFunction;
                spreadsheet.dataBind();
                expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [0, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['B2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            //expect(dataSourceChangedFunction).toHaveBeenCalled();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.border).toBeUndefined();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderLeft).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderTop).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderRight).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderBottom).toEqual('1px solid #000');
                            expect(helper.invoke('getCell', [1, 0]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [0, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            done();
                        });
                    });
                });
            });
        });

        describe('I329167, I328868 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ index: 5, value: '10' }, { value: '11' }, { value: '8' }] }, { cells: [{ index: 5,
                    formula: '=IF(F1>10,"Pass","Fail")' }, { index: 7, value: '10' }] }, { cells: [{ index: 7, formula: '=SUM(H1:H2)' }] }],
                    selectedRange: 'F2' }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy Paste functions with Formula applied cells issue', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['G2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[1].cells[5].formula).toEqual('=IF(F1>10,"Pass","Fail")');
                            expect(spreadsheet.sheets[0].rows[1].cells[6].value).toEqual('Pass');
                            expect(spreadsheet.sheets[0].rows[1].cells[6].formula).toEqual('=IF(G1>10,"Pass","Fail")');
                            helper.invoke('selectRange', ['H3']);
                            done();
                        });
                    });
                });
            });
            it('Copy a formula from one cell to another (onto multiple cells), it shows the correct result only for the final row', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['I3:I5']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[2].cells[8].formula).toEqual('=SUM(I1:I2)');
                            expect(spreadsheet.sheets[0].rows[3].cells[8].formula).toEqual('=SUM(I2:I3)');
                            expect(spreadsheet.sheets[0].rows[4].cells[8].formula).toEqual('=SUM(I3:I4)');
                            done();
                        });
                    });
                });
            });
        });
        describe('SF-358133 ->', () => {
            let count: number = 0;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'C2', ranges: [{ startCell: 'C1', dataSource: [{ 'start': '2/14/2014', 'end': '6/11/2014' }] }] }],
                    cellSave: (args: CellSaveEventArgs): void => {
                        count++;
                        if (count === 1) { // Pasted cell details
                            expect(args.address).toEqual('Sheet1!D2');
                            expect(args.value as any).toEqual(41684);
                            expect(args.oldValue).toEqual('6/11/2014');
                            expect(args.displayText).toEqual('2/14/2014');
                        }
                        if (count === 2) { // Cut cell details
                            expect(args.address).toEqual('Sheet1!C2');
                            expect(args.value).toEqual('');
                            expect(args.oldValue).toEqual('2/14/2014');
                            expect(args.displayText).toEqual('');
                        }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cut / paste cell save event arguments are not proper', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[2].value).toEqual('41684');
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[2]])).toEqual('2/14/2014');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toEqual('41801');
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[3]])).toEqual('6/11/2014');
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['D2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[1].cells[2]).toBeNull();
                            expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toEqual(41684);
                            expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[3]])).toEqual('2/14/2014');
                            done();
                        });
                    });
                });
            });
        });

        // describe('SF-355018 ->', () => {
        //     beforeAll((done: Function) => {
        //         dataSource();
        //         model = {
        //             sheets: [{ ranges: [{ dataSource: virtualData.slice(0, 10000) }] }]
        //         };
        //         helper.initializeSpreadsheet(model, done);
        //     });
        //     afterAll(() => {
        //         helper.invoke('destroy');
        //     });
        //     it('Performance issue on pasting 10k cells', (done: Function) => {
        //         helper.invoke('selectRange', ['A1:A10001']);
        //         helper.invoke('copy').then(() => {
        //             helper.invoke('selectRange', ['B1']);
        //             let time: number = Date.now();
        //             helper.invoke('paste');
        //             setTimeout(() => {
        //                 expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Name');
        //                 expect(Date.now() - time).toBeLessThan(4000);
        //                 time = Date.now();
        //                 helper.invoke('getCell', [1000000, 0]);
        //                 expect(Date.now() - time).toBeLessThan(10);
        //                 done();
        //             });
        //         });
        //     });
        // });

        describe('EJ2-56500 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy indicator size and position does not change after row height and column width changes', (done: Function) => {
                helper.invoke('copy', ['C4:E7']).then(() => {
                    setTimeout((): void => {
                        helper.invoke('setRowHeight', [50, 0]);
                        const elem: HTMLElement = helper.getElementFromSpreadsheet('.e-copy-indicator');
                        expect(elem.style.top).toBe('89px');
                        helper.invoke('setRowHeight', [50, 4]);
                        expect(elem.style.height).toBe('111px');
                        helper.invoke('setColWidth', [100, 0]);
                        expect(elem.style.left).toBe('163px');
                        helper.invoke('setColWidth', [100, 3]);
                        expect(elem.style.width).toBe('229px');
                        done();
                    }, 50);
                });
            });
            it('Copy paste the wrap cell changes height of the copy indicator', (done: Function) => {
                helper.invoke('wrap', ['A6']);
                helper.invoke('copy', ['A6']).then(() => {
                    helper.invoke('selectRange', ['A11']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        const elem: HTMLElement = helper.getElementFromSpreadsheet('.e-copy-indicator');
                        expect(elem.style.top).toBe('159px');
                        expect(elem.style.height).toBe('39px');
                        expect(helper.invoke('getCell', [10, 0]).textContent).toBe('Flip- Flops & Slippers');
                        done();
                    });
                });
            });
            it('EJ2-60701 -> Merge not working while cut paste the selected column contains merged cells', (done: Function) => {
                helper.invoke('merge', ['A5:B7']);
                helper.invoke('cut', ['A1:C100']).then(() => {
                    helper.invoke('selectRange', ['M1']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        const sheet: SheetModel = helper.getInstance().sheets[0];
                        expect(sheet.rows[4].cells[0]).toBeNull();
                        expect(sheet.rows[4].cells[1]).toBeNull();
                        expect(sheet.rows[5].cells[0]).toBeNull();
                        expect(sheet.rows[5].cells[1]).toBeNull();
                        expect(sheet.rows[4].cells[12].rowSpan).toBe(3);
                        expect(sheet.rows[4].cells[12].colSpan).toBe(2);
                        done();
                    });
                });
            });
        });
        describe('EJ2-56522 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('While copy paste the merge cell with all borders, the left border is missing in pasted cell', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.setBorder({ borderLeft: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderRight: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderTop: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderBottom: '1px solid #e0e0e0' }, 'A1:B2');
                helper.invoke('selectRange', ['A1:B2']);
                helper.invoke('copy').then((): void => {
                    setTimeout((): void => {
                        helper.invoke('paste', ['A4:A4', "Formats"]);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[3].cells[0].style.borderLeft).toBe('1px solid #e0e0e0');
                            expect(spreadsheet.sheets[0].rows[4].cells[0].style.borderLeft).toBe('1px solid #e0e0e0');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-56649 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        conditionalFormats: [
                            { type: "ContainsText", cFColor: "RedFT", value: 'shoes', range: 'A2:A11' },
                            { type: "DateOccur", cFColor: "YellowFT", value: '7/22/2014', range: 'B2:B11' },
                            { type: "GreaterThan", cFColor: "GreenFT", value: '11:26:32 AM', range: 'C2:C11' },
                            { type: "LessThan", cFColor: "RedF", value: '20', range: 'D2:D11' },
                        ],
                        ranges: [{ dataSource: defaultData }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy and paste didnt work properly with conditional formatting after save and load the spreadsheet as JSON', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let td: HTMLElement = helper.invoke('getCell', [1, 0]);
                expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(td.style.color).toBe('rgb(156, 0, 85)');
                td = helper.invoke('getCell', [4, 0]);
                expect(td.style.backgroundColor).toBe('');
                expect(td.style.color).toBe('');
                helper.invoke('copy', ['A2:A11']).then(() => {
                    helper.invoke('selectRange', ['H2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        let td: HTMLElement = helper.invoke('getCell', [1, 7]);
                        expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
                        expect(td.style.color).toBe('rgb(156, 0, 85)');
                        done();
                    });
                });
            });
        });
        describe('SF-367525, SF-367519 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('External copy and paste cell model with style creation - copied from PowerPoint', (done: Function) => {
                const tableStr: string = '<style>col{mso-width-source:auto;}td{color:windowtext;vertical-align:bottom;border:none;}' +
                '.oa1{border:1.0pt solid black;vertical-align:top;}</style>' +
                '<table><tbody>' +
                '<tr height="42" style="height:20.93pt">' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single">' +
                        '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-weight:bold;font-style:italic;">115</span>' +
                    '</s></p></td>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single">' +
                        '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-weight:bold;font-style:italic;">313</span>' +
                    '</s></p></td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single"><u style="text-underline:single">' +
                        '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-style:italic;"">225</span></u></s></p>' +
                    '</td>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single"><u style="text-underline:single">' +
                        '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-style:italic;">406</span></u></s></p>' +
                    '</td>' +
                '</tr>' +
                '</tbody></table>';
                const tableCont: Element = createElement('span', { innerHTML: tableStr });
                const spreadsheet: any = helper.getInstance();
                let rows: RowModel[] = [];
                spreadsheet.clipboardModule.generateCells(tableCont, rows);
                expect(rows.length).toBe(2);
                expect(rows[0].cells.length).toBe(2);
                expect(rows[0].cells[0].value as any).toBe(115);
                let style: string = '{"verticalAlign":"top","textAlign":"left","fontSize":"18pt","fontFamily":"Calibri","color":"#2E75B6",'
                + '"fontWeight":"bold","fontStyle":"italic","textDecoration":"line-through","borderBottom":"1.33px solid black",' +
                '"borderTop":"1.33px solid black","borderLeft":"1.33px solid black","borderRight":"1.33px solid black"}';
                expect(JSON.stringify(rows[0].cells[0].style)).toBe(style);
                expect(rows[0].cells[1].value as any).toBe(313);
                expect(JSON.stringify(rows[0].cells[1].style)).toBe(style);
                expect(rows[1].cells.length).toBe(2);
                expect(rows[1].cells[0].value as any).toBe(225);
                style = '{"verticalAlign":"top","textAlign":"left","textDecoration":"underline line-through","fontSize":"18pt",' +
                '"fontFamily":"Calibri","color":"#2E75B6","fontStyle":"italic","borderBottom":"1.33px solid black",' +
                '"borderTop":"1.33px solid black","borderLeft":"1.33px solid black","borderRight":"1.33px solid black"}';
                expect(JSON.stringify(rows[1].cells[0].style)).toBe(style);
                expect(rows[1].cells[1].value as any).toBe(406);
                expect(JSON.stringify(rows[1].cells[1].style)).toBe(style);
                done();
            });
        });
        describe('EJ2-53129, EJ2-53620, EJ2-55119, EJ2-54233 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-53129 - Need to provide the paste option while the dialog is open->', (done: Function) => {
                var spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['A1:B5']);
                helper.triggerKeyNativeEvent(70, true);
                setTimeout(function () {
                    var dialog = helper.getElement('.e-findtool-dlg.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    helper.invoke('copy', ['A1:B5']).then(() => {
                        helper.invoke('paste', ['J1']);
                        expect(spreadsheet.sheets[0].rows[0].cells[9].value.toString()).toEqual('Item Name');
                        expect(spreadsheet.sheets[0].rows[4].cells[9].value.toString()).toEqual('Sandals & Floaters');
                        helper.triggerKeyNativeEvent(27);
                        expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).toBeNull();
                        done();
                    });
                }, 100);
            });
            it('EJ2-53620 - Cut and copy issue in spreadsheet->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets[0].topLeftCell = 'AZ1'
                spreadsheet.dataBind();
                setTimeout(() => {
                    helper.invoke('selectRange', ['AZ1:AZ200']);
                    helper.invoke('cut').then(function () {
                        helper.invoke('selectRange', ['A1']);
                        helper.invoke('paste', ['Sheet1!A1:A1']);
                        helper.invoke('goTo', ['A1']);
                        setTimeout(function () {
                            expect(helper.getInstance().sheets[0].rows[0].cells[0].textContent).toBeUndefined();
                            done();
                        });
                    });
                }); 
            });
            it('EJ2-55119 - Action Begin is not triggered on Undo in Coluimn Cut Paste->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
                const actionBegin: any = spreadsheet.actionBegin;
                const actionComplete: any = spreadsheet.actionComplete;
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'clipboard') { actionBeginCalled = true; }
                },
                spreadsheet.actionComplete = (args: any): void => {
                    if (args.action === 'clipboard') { actionCompleteCalled = true; }
                }
                expect(actionBeginCalled).toBeFalsy();
                expect(actionCompleteCalled).toBeFalsy();
                helper.invoke('selectRange', ['B1:B200']);
                helper.invoke('cut', ['B1:B200']).then(function () {
                    helper.invoke('insertColumn', [2, 2]);
                    helper.invoke('selectRange', ['C1']);
                    helper.invoke('paste', ['C1']);
                    expect(helper.invoke('getCell', [0, 2]).textContent).toBe('Date');
                    helper.getElement('#' + helper.id + '_undo').click();
                    expect(actionBeginCalled).toBeTruthy();
                    expect(actionCompleteCalled).toBeTruthy();
                    expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Date');
                    spreadsheet.actionBegin = actionBegin;
                    spreadsheet.actionComplete = actionComplete;
                    done();
                });
            });
            it('EJ2-54233 - Events not triggered in uniformity when Copy paste->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
                const actionBegin: any = spreadsheet.actionBegin;
                const actionComplete: any = spreadsheet.actionComplete;
                const cellSave: any = spreadsheet.cellSave;
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'clipboard') { actionBeginCalled = true; }
                },
                spreadsheet.actionComplete = (args: any): void => {
                    if (args.action === 'clipboard') { actionCompleteCalled = true; }
                },
                spreadsheet.cellSave = (args: CellSaveEventArgs): void => {
                    expect(args.address).toEqual('Sheet1!H2');
                    expect(args.oldValue).toEqual('1');
                    expect(args.value as any).toEqual('Discount');
                }
                expect(actionBeginCalled).toBeFalsy();
                expect(actionCompleteCalled).toBeFalsy();
                helper.invoke('copy', ['H1']).then(function () {
                    helper.invoke('paste', ['H2']);
                    expect(actionBeginCalled).toBeTruthy();
                    expect(actionCompleteCalled).toBeTruthy();
                    expect(helper.invoke('getCell', [1, 7]).textContent).toBe('Discount');
                    spreadsheet.actionBegin = actionBegin;
                    spreadsheet.actionComplete = actionComplete;
                    spreadsheet.cellSave = cellSave;
                    done();
                });
            });
        });
        describe('EJ2-55989->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A2' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' },'A1:H1');
                        spreadsheet.cellFormat({ backgroundColor: 'rgba(241, 23, 9, 0.4)' },'A1:A10');
                        spreadsheet.cellFormat({ backgroundColor: '#B3DFFF' }, 'B1:B10');
                    },
                    actionBegin(args: any) {
                        if (args.action === 'clipboard') {
                          args.args.eventArgs.type = 'Values';
                        }
                    }
                }
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cannot prevent pasting format using actionBegin while using Ctrl+V shortcut->', (done: Function) => {
                helper.invoke('copy', ['A2']).then(function () {
                    helper.invoke('selectRange', ['B2']);
                    helper.invoke('paste', ['B2']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 1]).textContent).toBe('Casual Shoes');
                        expect(helper.getInstance().sheets[0].rows[1].cells[1].style.backgroundColor).toBe('#B3DFFF');
                        done();
                    });
                });
            });
        }); 
    });
    describe('EJ2-58124 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData
                    }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('copy the unique formula and paste same sheet', (done: Function) => {
            helper.getInstance().selectRange('I1:I1')
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = '=UNIQUE(D2:D6)';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toBe('=UNIQUE(D2:D6)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('10');
                    done();
                });
            });
            it('copying unique formula to another range', (done: Function) => {
                helper.invoke('copy', ['I1:I4']).then(() => {
                    helper.invoke('selectRange', ['J2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('30');
                        done();
                    });
                });
            });
            it('copying unique formula to another value containing range', (done: Function) => {
                helper.invoke('selectRange', ['I2:I4']);
                helper.invoke('copy', ['I1:I4']).then(() => {
                    helper.invoke('selectRange', ['F2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[1].cells[5].value).toBe('#SPILL!');
                        done();
                    });
                });
            });
            it('copy the unique formula and paste without spill', (done: Function) => {
                helper.getInstance().selectRange('I7:I7');
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '=UNIQUE(D4:D7)';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toBe('=UNIQUE(D4:D7)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('10');
                    helper.invoke('selectRange', ['I7:I10']);
                    helper.invoke('copy', ['I7:I10']).then(() => {
                        helper.invoke('selectRange', ['E7']);
                        helper.invoke('paste');
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].rows[6].cells[5].value).toBe('Formal Shoes');
                            done();
                        });
                    });
                    done();
                });
            });
        });
});