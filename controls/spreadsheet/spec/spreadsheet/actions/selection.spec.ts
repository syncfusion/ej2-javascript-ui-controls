import { Spreadsheet, setCellFormat, SheetModel, onContentScroll } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { EventHandler } from "@syncfusion/ej2-base";

export function checkPosition(ele: HTMLElement, pos: string[], isRtl?: boolean) {
    expect(ele.style.top).toBe(pos[0]);
    expect(isRtl ? ele.style.right : ele.style.left).toBe(pos[1]);
    expect(ele.style.height).toBe(pos[2]);
    expect(ele.style.width).toBe(pos[3]);
}

describe('Selection ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        // beforeAll((done: Function) => {
        //     helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'B2' }] }, done);
        // });
        // afterAll(() => {
        //     helper.invoke('destroy');
        // });
        // it('', (done: Function) => {
        //     let actEle: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
        //     let selEle: HTMLElement = helper.getElementFromSpreadsheet('.e-selection');
        //     // Initial selection
        //     checkPosition(actEle, ['19px', '63px', '21px', '65px']);
        //     expect(selEle.classList).toContain('e-hide');
        //     expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[0].classList).toContain('e-prev-highlight');
        //     expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[1].classList).toContain('e-highlight');
        //     expect(helper.getRowHeaderElement().querySelectorAll('tr')[0].classList).toContain('e-prev-highlight');
        //     expect(helper.getRowHeaderElement().querySelectorAll('tr')[1].children[0].classList).toContain('e-highlight');

        //     // Range selection
        //     helper.invoke('selectRange', ['C3:G9']);
        //     expect(helper.getInstance().sheets[0].activeCell).toBe('C3');
        //     expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:G9');
        //     expect(selEle.classList).not.toContain('e-hide');
        //     expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
        //     expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[6].classList).toContain('e-highlight');
        //     expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
        //     expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[8].classList).toContain('e-highlight');
        //     setTimeout(() => {
        //         checkPosition(actEle, ['39px', '127px', '21px', '65px']);
        //         checkPosition(selEle, ['39px', '127px', '141px', '321px']);

        //         // Reverse range selection
        //         helper.invoke('selectRange', ['G9:C3']);
        //         expect(helper.getInstance().sheets[0].activeCell).toBe('G9');
        //         expect(helper.getInstance().sheets[0].selectedRange).toBe('G9:C3');
        //         setTimeout(() => {
        //             //checkPosition(actEle, ['159px', '383px', '21px', '65px']);
        //             checkPosition(selEle, ['39px', '127px', '141px', '321px']);
        //             done();
        //         });
        //     });
        // });

        // it('Multi range', (done: Function) => {
        //     let actEle: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
        //     let selEle: HTMLElement = helper.getElementFromSpreadsheet('.e-selection');

        //     helper.invoke('selectRange', ['C3 G5:L10 O2:P3']);
        //     expect(helper.getInstance().sheets[0].activeCell).toBe('O2');
        //     expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:C3 G5:L10 O2:P3');

        //     setTimeout(() => { 
        //         checkPosition(actEle, ['19px', '895px', '21px', '65px']);
        //         checkPosition(selEle, ['39px', '127px', '21px', '65px']);
        //         let multiSelElems: HTMLElement[] = helper.getElements('.e-multi-range');
        //         checkPosition(multiSelElems[0], ['79px', '383px', '121px', '385px']);
        //         checkPosition(multiSelElems[1], ['19px', '895px', '41px', '129px']);
        //         let hdrTds: HTMLElement[] = helper.getRowHeaderElement().querySelectorAll('.e-highlight') as any;
        //         expect(hdrTds[0].textContent).toBe('2');
        //         expect(hdrTds[2].textContent).toBe('5');
        //         expect(hdrTds.length).toBe(8);
        //         hdrTds = helper.getColHeaderElement().querySelectorAll('.e-highlight') as any;
        //         expect(hdrTds[0].textContent).toBe('C');
        //         expect(hdrTds[2].textContent).toBe('H');
        //         expect(hdrTds.length).toBe(9);

        //         // Check header highlight removes correctly or not and duplicate selection element removes or not
        //         helper.invoke('selectRange', ['D1']);
        //         expect(helper.getElements('.e-multi-range').length).toBe(0);
        //         expect(helper.getRowHeaderElement().querySelectorAll('.e-highlight').length).toBe(1);
        //         expect(helper.getColHeaderElement().querySelectorAll('.e-highlight').length).toBe(1);
        //         done();
        //     });
        // });
    });

    describe('UI Interaction ->', () => {
        // beforeAll((done: Function) => {
        //     helper.initializeSpreadsheet({}, done);
        // });
        // afterAll(() => {
        //     helper.invoke('destroy');
        // });

        // it('Multi selection', (done: Function) => {
        //     let td: HTMLElement = helper.invoke('getCell', [3, 5]);
        //     let coords: ClientRect = td.getBoundingClientRect();
        //     helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td, true);
        //     expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1 F4:F4');
        //     setTimeout(() => {
        //         checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['59px', '319px', '21px', '65px']);
        //         td = helper.invoke('getCell', [7, 8]);
        //         coords = td.getBoundingClientRect();
        //         helper.triggerMouseAction('mousemove', { x: coords.left, y: coords.top }, document, td, true, true);
        //         helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td, true);
        //         setTimeout(() => {
        //             checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['59px', '319px', '21px', '65px']);
        //             checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['0px', '0px', '20px', '64px']);
        //             let multiSelElems: HTMLElement[] = helper.getElements('.e-multi-range');
        //             checkPosition(multiSelElems[0], ['59px', '319px', '101px', '257px']);
        //             let hdrTds: HTMLElement[] = helper.getRowHeaderElement().querySelectorAll('.e-highlight') as any;
        //             expect(hdrTds[0].textContent).toBe('1');
        //             expect(hdrTds[1].textContent).toBe('4');
        //             expect(hdrTds.length).toBe(6);
        //             hdrTds = helper.getColHeaderElement().querySelectorAll('.e-highlight') as any;
        //             expect(hdrTds[0].textContent).toBe('A');
        //             expect(hdrTds[1].textContent).toBe('F');
        //             expect(hdrTds.length).toBe(5);

        //             // Check header highlight removes correctly or not and duplicate selection element removes or not
        //             td = helper.invoke('getCell', [1, 10]);
        //             coords = td.getBoundingClientRect();
        //             helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
        //             setTimeout(() => {
        //                 helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
        //                 setTimeout(() => {
        //                     expect(helper.getElements('.e-multi-range').length).toBe(0);
        //                     expect(helper.getRowHeaderElement().querySelectorAll('.e-highlight').length).toBe(1);
        //                     expect(helper.getColHeaderElement().querySelectorAll('.e-highlight').length).toBe(1);
        //                     done();
        //                 });
        //             });
        //         }, 10); // 10 milli seconds for test case failure in headless chrome
        //     });
        // });
    });

    describe('RTL ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ enableRtl: true }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Public method checking', (done: Function) => {
            // Range selection
            helper.invoke('selectRange', ['C3:G9']);
            expect(helper.getInstance().sheets[0].activeCell).toBe('C3');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:G9');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[6].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[8].classList).toContain('e-highlight');
            setTimeout(() => {
                // checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['39px', '127px', '21px', '65px'], true);
                // checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['39px', '127px', '141px', '321px'], true);
                done();
            }, 10);
        });
        
        // Commented since facing issue

        // it('UI interaction', (done: Function) => {
        //     let td: HTMLElement = helper.invoke('getCell', [3, 5]);
        //     let coords: ClientRect = td.getBoundingClientRect();
        //     helper.triggerMouseAction('mousedown', { x: coords.right, y: coords.top }, null, td);
        //     expect(helper.getInstance().sheets[0].selectedRange).toBe('F4:F4');
        //     setTimeout(() => {
        //         checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['59px', '319px', '21px', '65px'], true);
        //         helper.triggerMouseAction('mouseup', { x: coords.right, y: coords.top }, document, td);
        //         done();
        //     }, 0);
        // });
    });

    describe('Selection with freezepanes ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Resize the frozen row with active cell in frozen row ', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2,2);
            setTimeout((): void => {
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[1].cells[0];
                    const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                    const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
                    helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 7, offsetY: 7 }, spreadsheet.element, rowHdr);
                    helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 7, offsetY: 7 }, document, rowHdr);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[2].height).toBe(26);
                        done();
                    });
                }, 100);
            }, 100);
        }); 
        it('Selection with mouse event and ctrl selection', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            setTimeout(() => {
                const cell: HTMLElement = helper.invoke('getCell', [1, 2]);
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true, ctrlKey: true });
                cell.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true, ctrlKey: true });
                cell.dispatchEvent(e);
                e = new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true, ctrlKey: true });
                cell.dispatchEvent(e);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].selectedRange).toBe('B2:B2 A1:A1');
                    done();
                });
            }, 100);
        });
        it('Select all with freeze pane applied', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
            helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
            helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
            setTimeout((): void => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV100');
                done();
            }, 100);
        }); 
        // it('Resize the column by selecting whole column->', (done: Function) => {
            // const spreadsheet: Spreadsheet = helper.getInstance();
            // spreadsheet.unfreezePanes(0);
            // setTimeout(() => {
                // helper.invoke('selectRange', ['C1:C200']);
                // const colHdr: HTMLElement = helper.invoke('getCell', [null, 3, helper.invoke('getColHeaderTable').rows[0]]);
                // const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                // const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                // helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                // helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                // setTimeout(() => {
                    // expect(spreadsheet.sheets[0].columns[2].width).toBe(84);
                    // done();
                // });
            // });
        // });
        it('Select all with select locked cells as false', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unfreezePanes(0);
            setTimeout(() => {
                const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                helper.triggerMouseAction('mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null, selectAl);
                helper.triggerMouseAction('mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document, selectAl);
                setTimeout(() => {
                    helper.switchRibbonTab(4);
                    helper.click('#' + helper.id + '_protect');
                    setTimeout(() => {
                        helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                        (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                        helper.click('.e-protect-dlg .e-primary');
                        setTimeout(() => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV100');
                            helper.invoke('selectRange', ['C3']);
                            done();
                        });
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Selection with select locked cells as false', (done: Function) => {
            const cell: HTMLElement = helper.invoke('getCell', [1, 3]);
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            cell.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            cell.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            cell.dispatchEvent(e);
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV100');
                done();
            }, 100);
        });
        it('Selection with selectunlocked cells as true in protect sheet dialog and select unlocked cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('lockCells', ['B2:B5', false]);
            helper.invoke('selectRange', ['B2']);
            setTimeout(() => {
                const cell: HTMLElement = helper.invoke('getCell', [1, 1]);
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                cell.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                cell.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                cell.dispatchEvent(e);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('B2:B2');
                    done();
                });
            }, 100);
        });
        it('Navigate to other cell selection with select locked cells as false and select unlocked cells as false checking', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Sheet1');
            setTimeout(() => {
                helper.switchRibbonTab(4);
                helper.click('#' + helper.id + '_protect');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                    (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                    (document.getElementsByClassName('e-frame e-icons')[2] as HTMLElement).click();
                    helper.click('.e-protect-dlg .e-primary');
                    setTimeout(() => {
                        helper.invoke('selectRange', ['A1']);
                        helper.triggerKeyNativeEvent(40);
                        setTimeout(() => {
                            expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                            done();
                        });
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Apply autofill using ctrl + selection in mouse event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Sheet1');
            setTimeout(() => {
                helper.invoke('selectRange', ['A1']);
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                let td: HTMLElement = helper.invoke('getCell', [1, 0]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom, ctrlKey: true });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1, ctrlKey: true  });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Item Name');
                    done();
                });
            });
        });
        it('Check the selection with the frozen column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A1']);
            spreadsheet.freezePanes(0, 2);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(0, 0, [9]);
                setTimeout(() => {
                    const rowHeaderCell: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
                    helper.triggerMouseAction('mousedown', { x: rowHeaderCell.getBoundingClientRect().left + 1, y: rowHeaderCell.getBoundingClientRect().top + 1 }, null, rowHeaderCell);
                    helper.triggerMouseAction('mouseup', { x: rowHeaderCell.getBoundingClientRect().left + 1, y: rowHeaderCell.getBoundingClientRect().top + 1 }, document, rowHeaderCell);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV1');
                        done();
                    });
                });
            });
        });
        it('Formula reference selection with frozen column', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.invoke('startEdit');
            setTimeout((): void => {
                helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '=', refreshCurPos: true, refreshEditorElem: true });
                let cell: HTMLElement = helper.invoke('getCell', [1, 3]);
                helper.triggerMouseAction(
                    'mousedown', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null,
                    cell);
                helper.triggerMouseAction(
                    'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, document,
                    cell);
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + '_edit').textContent).toEqual('=D2');
                    helper.invoke('endEdit');
                    done();
                });
            }, 100);
        });
        it('EJ2-931208 - Selection highlight not updated properly during autofill on merged cells under freeze pane', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.invoke('freezePanes', [4, 3]);
            setTimeout((): void => {
                expect(helper.getInstance().sheets[0].frozenRows).toBe(4);
                expect(helper.getInstance().sheets[0].frozenColumns).toBe(3);
                helper.invoke('merge', ['C1:D1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[2].colSpan).toBe(2);
                expect(helper.getInstance().sheets[0].rows[0].cells[3].colSpan).toBe(-1);
                const helper1: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
                helper.invoke('selectRange', ['C1:D7']);
                expect(helper1.getElementFromSpreadsheet('.e-column-header .e-selection').style.zIndex).toBe('2');
                expect(helper1.getElementFromSpreadsheet('.e-row-header .e-selection').style.zIndex).toBe('2');
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection').style.zIndex).toBe('2');
                helper.invoke('autoFill', ['C2:C7', 'C1', 'Down', 'FillSeries']);
                expect(helper.getInstance().sheets[0].rows[6].cells[2].value).toBe('Time');
                expect(helper1.getElementFromSpreadsheet('.e-frozen-row').style.zIndex).toBe('4');
                expect(helper1.getElementFromSpreadsheet('.e-frozen-column').style.zIndex).toBe('4');
                expect(helper1.getElementFromSpreadsheet('.e-selectall-container').style.zIndex).toBe('3');
                expect(helper1.getElementFromSpreadsheet('.e-column-header .e-selection').style.zIndex).toBe('3');
                expect(helper1.getElementFromSpreadsheet('.e-row-header .e-selection').style.zIndex).toBe('3');
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection').style.zIndex).toBe('2');
                helper.invoke('Unfreeze', [0]);
                setTimeout((): void => {
                    expect(helper.getInstance().sheets[0].frozenRows).toBe(0);
                    expect(helper.getInstance().sheets[0].frozenColumns).toBe(0);
                    expect(helper1.getElementFromSpreadsheet('.e-frozen-row')).toBeNull();
                    expect(helper1.getElementFromSpreadsheet('.e-frozen-column')).toBeNull();
                    expect(helper1.getElementFromSpreadsheet('.e-selectall-container').style.zIndex).toBe('');
                    expect(helper1.getElementFromSpreadsheet('.e-column-header .e-selection')).toBeNull();
                    expect(helper1.getElementFromSpreadsheet('.e-row-header').style.zIndex).toBe('');
                    expect(helper1.getElementFromSpreadsheet('.e-row-header .e-selection')).toBeNull();
                    expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection').style.zIndex).toBe('');
                    helper.invoke('freezePanes', [4, 3]);
                    setTimeout((): void => {
                        helper.invoke('unMerge', ['C1:D7']);
                        helper.invoke('merge', ['C7:D7']);
                        helper.invoke('autoFill', ['C6:C1', 'C7', 'Up', 'FillSeries']);
                        done();
                    });
                });
            });
        });
        it('EJ2-892908 - Column selection issue on merged cell, when freeze pane is enabled', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.invoke('freezePanes', [4, 3]);
            setTimeout((): void => {
                expect(helper.getInstance().sheets[0].frozenRows).toBe(4);
                expect(helper.getInstance().sheets[0].frozenColumns).toBe(3);
                helper.invoke('merge', ['C1:D1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[2].colSpan).toBe(2);
                expect(helper.getInstance().sheets[0].rows[0].cells[3].colSpan).toBe(-1);
                helper.invoke('merge', ['A4:A5']);
                expect(helper.getInstance().sheets[0].rows[3].cells[0].rowSpan).toBe(2);
                expect(helper.getInstance().sheets[0].rows[4].cells[0].rowSpan).toBe(-1);
                const helper1: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
                expect(helper1.getElementFromSpreadsheet('.e-column-header .e-selection')).toBeNull();
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection.e-hide')).not.toBeNull();
                expect(helper1.getElementFromSpreadsheet('.e-row-header .e-selection')).toBeNull();
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection.e-hide')).not.toBeNull();
                const tableEle = document.querySelector('table.e-table.e-selectall-table') as HTMLElement;
                let colOffset: DOMRect = tableEle.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: colOffset.right , y: colOffset.y }, null, tableEle);
                helper.triggerMouseAction('mouseup', { x: colOffset.right, y: colOffset.y }, document, tableEle);
                expect(helper1.getElementFromSpreadsheet('.e-column-header .e-selection')).not.toBeNull();
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection')).not.toBeNull();
                helper.triggerMouseAction('mousedown', { x: colOffset.left , y: colOffset.bottom }, null, tableEle);
                helper.triggerMouseAction('mouseup', { x: colOffset.left, y: colOffset.bottom }, document, tableEle);
                expect(helper1.getElementFromSpreadsheet('.e-row-header .e-selection')).not.toBeNull();
                expect(helper1.getElementFromSpreadsheet('.e-sheet-content .e-selection')).not.toBeNull();
                done();
            });
        });
    });

    describe('Rtl with selection and resize ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'H1:H200' }], enableRtl: true }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autofit on column with whole column selection', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 6, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].columns[6].width).toBe(58);
                done();
            });
        });
        it('Mouse selection for chart', (done: Function) => {
            helper.invoke('selectRange', ['D6:D8']);
            helper.getInstance().spreadsheetChartModule.insertChartHandler({ action: 'column_chart', id: 'clusteredColumn', isChart: true });
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                chart.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                chart.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                chart.dispatchEvent(e);
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                setTimeout(() => {
                    expect(chart).not.toBeNull();
                    done();
                });
            });
        });
        it('Mouse selection for image', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({ options: {src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'D3', isPublic: true});
            setTimeout(() => {
                const image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay-active');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                image.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                image.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                image.dispatchEvent(e);
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                setTimeout(() => {
                    expect(image).not.toBeNull();
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I316931, I31444, EJ2-60472, EJ2-60868 ->', () => {
            let selectedRange: string;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ index: 2, cells: [{ value: 'Welcome to Spreadsheet!!!', wrap: true }, { formula: '=SUM(A1:A2)' }] }], selectedRange: 'D4' }],
                    select: (args) => {
                        selectedRange = args.range;
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selected cells misaligned from grid lines', (done: Function) => {
                helper.invoke('selectRange', ['D4']);
                const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
                const activeCell: HTMLElement = helper.getElement().querySelector('.e-active-cell');
                expect(activeCell.style.height).toEqual('21px');
                expect(activeCell.style.top).toEqual('113px');
                helper.triggerMouseAction(
                    'mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null,
                    selectAl);
                helper.triggerMouseAction(
                    'mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document,
                    selectAl);
                setTimeout(() => {
                    const inst: Spreadsheet = helper.getInstance();
                    expect(inst.sheets[0].rows[0]).toBeNull();
                    expect(helper.invoke('getRow', [0]).style.height).toEqual('20px');
                    expect(inst.sheets[0].rows[2].height).toBe(74);
                    expect(helper.invoke('getRow', [2]).style.height).toEqual('74px');
                    inst.notify(setCellFormat, { style: { border: '1px solid #000000' }, onActionUpdate: true });
                    expect(inst.sheets[0].rows[0].height).toBe(21);
                    expect(helper.invoke('getRow', [0]).style.height).toEqual('21px');
                    expect(inst.sheets[0].rows[2].height).toBe(74);
                    expect(helper.invoke('getRow', [2]).style.height).toEqual('74px');
                    helper.invoke('selectRange', ['H10']);
                    setTimeout(() => {
                        expect(activeCell.style.top).toEqual('234px');
                        helper.invoke('selectRange', ['D4']);
                        setTimeout(() => {
                            expect(activeCell.style.height).toEqual('21px');
                            expect(activeCell.style.top).toEqual('114px');
                            done();
                        }, 20);
                    }, 20);
                });
            });
            it('Selected range not updated properly when the frozen column not in the view port', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('goTo', ['AB1']);
                setTimeout((): void => {
                    spreadsheet.freezePanes(5,5);
                    setTimeout((): void => {
                        let rowHdrCell: HTMLElement = spreadsheet.element.querySelector('.e-selectall-container').querySelector('.e-row').querySelector('.e-header-cell');
                        let offset: DOMRect = rowHdrCell.getBoundingClientRect() as DOMRect;
                        helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, rowHdrCell);
                        helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, rowHdrCell);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].selectedRange).toBe('A1:CV1');
                            done();
                        });
                    });
                });
            });
            it('Select event not triggered after clicking the formula applied cells', (done: Function) => {
                helper.invoke('selectRange', ['B2']);
                helper.invoke('selectRange', ['A1']);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                    expect(selectedRange).toBe('A1:A1');
                    done();
                });
            });
            it('Cell selection issue while loading the spreadsheet with freeze pane and border ', (done: Function) => {
                helper.invoke('selectRange', ['C2']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.freezePanes(2, 2);
                    helper.invoke('cellFormat', [{ border: '3px solid #000' }, 'C2']);
                    expect(spreadsheet.sheets[0].rows[2].height).toBe(74);
                    done();
                }, 10);
            });
        });
        describe('I300950 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ index: 1, cells: [{ value: 'foo bar foo bar \r\n foo bar foo bar' }] }], selectedRange: 'A2' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue with line feed and smaul column (selection issue with "/r/n" in spreadsheet cell data)', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[1].height).toBe(74);
                    expect(helper.getElement().querySelector('.e-active-cell').style.height).toBe('75px');
                    done();
                }, 10);
            });
        });
        describe('I300737 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Selection issue with the rowCount 99 (After scrolled to 50 rows and select all selection not proper)', (done: Function) => {
            //     helper.invoke('goTo', ['A50']);
            //     setTimeout(() => {
            //         const selectAl: HTMLElement = helper.getElement('#' + helper.id + '_select_all');
            //         helper.triggerMouseAction(
            //             'mousedown', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, null,
            //             selectAl);
            //         helper.triggerMouseAction(
            //             'mouseup', { x: selectAl.getBoundingClientRect().left + 1, y: selectAl.getBoundingClientRect().top + 1 }, document,
            //             selectAl);
            //         setTimeout(() => {
            //             const selection: HTMLElement = helper.getElement().querySelector('.e-selection');
            //             let sizeMatch: boolean = helper.getElement('#' + helper.id + '_main_content').getBoundingClientRect().height ===
            //                 selection.getBoundingClientRect().height;
            //             expect(sizeMatch).toBeTruthy();
            //             sizeMatch = helper.getElement().querySelector('.e-virtualtrack').style.width === selection.style.width;
            //             expect(sizeMatch).toBeTruthy();
            //             expect(selection.style.top).toBe('0px');
            //             expect(selection.style.left).toBe('0px');
            //             done();
            //         });
            //     });
            // });
        });
        // describe('I296146 ->', () => {
        //     beforeEach((done: Function) => {
        //         helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'C3' }] }, done);
        //     });
        //     afterEach(() => {
        //         helper.invoke('destroy');
        //     });
        //     it('issue with the selectedRange updation model binding (ex: C3)', (done: Function) => {
        //         const spreadsheet: Spreadsheet = helper.getInstance();
        //         expect(spreadsheet.sheets[0].selectedRange).toBe('C3:C3');
        //         const cell: HTMLElement = helper.invoke('getCell', [2, 1]);
        //         helper.triggerMouseAction(
        //             'mousedown', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null,
        //             cell);
        //         helper.triggerMouseAction(
        //             'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, document,
        //             cell);
        //         setTimeout((): void => {
        //             expect(spreadsheet.sheets[0].selectedRange).toBe('B3:B3');
        //             helper.getElement('#' + helper.id + '_bold').click();
        //             expect(spreadsheet.sheets[0].rows[2].cells[2]).toBeUndefined();
        //             expect(spreadsheet.sheets[0].rows[2].cells[1].style.fontWeight).toBe('bold');
        //             done();
        //         });
        //     });
        // });
        describe('I308987, F162287, EJ2-935956 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Shift+arrowkey selection', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 39, null, null, true, helper.invoke('getCell', [0, 0]));
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:B1');
                    helper.triggerKeyEvent('keydown', 40, null, null, true, helper.invoke('getCell', [0, 1]));
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:B2');
                        done();
                    });
                });
            });
            it('Selection not working properly when selecting the columns with merged cells', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['A1:E1']);
                helper.invoke('merge');
                const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent');
                let headerCell: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[2];
                let offset: DOMRect = headerCell.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, headerCell);
                setTimeout((): void => {
                    headerCell = helper.invoke('getColHeaderTable').rows[0].cells[3];
                    offset = headerCell.getBoundingClientRect() as DOMRect;
                    helper.getInstance().selectionModule.mouseMoveHandler({ target: headerCell, clientX: offset.left + 1, clientY: offset.top + 1 });
                    helper.triggerMouseAction('mouseup', { x: offset.left + 10, y: offset.top + 5, offsetX: 10 }, document, colHdrPanel);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('C1:D100');
                        done();
                    });
                });
            });
        });
        describe('SF-367017 ->', () => {
            let spreadsheet: Spreadsheet; let selectAll: HTMLElement; let rowHdr: HTMLElement; let colHdr: HTMLElement;
            let content: HTMLElement; let selection: HTMLElement; let cell: HTMLElement; let offset: DOMRect;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ frozenColumns: 3, frozenRows: 3 }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('CTRL selection in freeze pane', (done: Function) => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                selectAll = helper.invoke('getSelectAllContent');
                expect(selectAll.querySelector('.e-active-cell')).not.toBeNull();
                helper.getElement().focus();
                cell = helper.invoke('getCell', [4, 4]);
                offset = cell.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, cell, true);
                helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, cell, true);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1 E5:E5');
                    expect(selectAll.querySelector('.e-active-cell')).toBeNull();
                    selection = selectAll.querySelector('.e-selection');
                    expect(selection).not.toBeNull();
                    expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                    content = helper.invoke('getMainContent');
                    selection = content.querySelector('.e-selection');
                    expect(selection.classList.contains('e-hide')).toBeFalsy();
                    expect(selection.classList.contains('e-multi-range')).toBeFalsy();
                    cell = helper.invoke('getCell', [5, 0]);
                    offset = cell.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, cell, true);
                    helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, cell, true);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1 E5:E5 A6:A6');
                        rowHdr = helper.invoke('getRowHeaderContent');
                        selection = rowHdr.querySelector('.e-selection');
                        expect(selection).not.toBeNull();
                        expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                        expect(selectAll.querySelector('.e-multi-range')).not.toBeNull();
                        expect(rowHdr.querySelector('.e-active-cell')).not.toBeNull();
                        done();
                    });
                });
            });
            it('Column and row ctrl selection', (done: Function) => {
                cell = helper.invoke('getColHeaderTable').rows[0].cells[0];
                offset = cell.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, cell, true);
                helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, cell, true);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1 E5:E5 A6:A6 D1:D100');
                    expect(rowHdr.querySelector('.e-active-cell')).toBeNull();
                    colHdr = helper.invoke('getColumnHeaderContent');
                    expect(colHdr.querySelector('.e-active-cell')).not.toBeNull();
                    selection = colHdr.querySelector('.e-selection');
                    expect(selection).not.toBeNull();
                    expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                    selection = content.querySelector('.e-selection:last-child');
                    expect(selection).not.toBeNull();
                    expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                    expect(rowHdr.querySelector('.e-multi-range')).not.toBeNull();
                    cell = helper.invoke('getRowHeaderTable').rows[0].cells[0];
                    offset = cell.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, cell, true);
                    helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, cell, true);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1 E5:E5 A6:A6 D1:D100 A4:CV4');
                        expect(colHdr.querySelector('.e-active-cell')).toBeNull();
                        expect(rowHdr.querySelector('.e-active-cell')).not.toBeNull();
                        const selectionCol: NodeListOf<HTMLElement> = rowHdr.querySelectorAll('.e-selection');
                        expect(selectionCol.length).toBe(2);
                        selection = selectionCol[1];
                        expect(content.querySelectorAll('.e-multi-range').length).toBe(2);
                        selection = content.querySelector('.e-selection:last-child');
                        expect(selection).not.toBeNull();
                        expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                        done();
                    });
                });
            });
            it('Refreshing selection using selectRange method and removing multi range selection', (done: Function) => {
                helper.invoke('selectRange', [spreadsheet.sheets[0].selectedRange]);
                setTimeout((): void => {
                    expect(rowHdr.querySelector('.e-active-cell')).not.toBeNull();
                    selection = selectAll.querySelector('.e-selection');
                    expect(selection).not.toBeNull();
                    expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                    selection = colHdr.querySelector('.e-selection');
                    expect(selection).not.toBeNull();
                    expect(selection.classList.contains('e-multi-range')).toBeTruthy();
                    expect(rowHdr.querySelectorAll('.e-multi-range').length).toBe(2);
                    expect(content.querySelectorAll('.e-multi-range').length).toBe(2);
                    cell = helper.invoke('getCell', [6, 4]);
                    offset = cell.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, cell);
                    helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 1 }, document, cell);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].activeCell).toBe('E7');
                        expect(spreadsheet.sheets[0].selectedRange).toBe('E7:E7');
                        expect(rowHdr.querySelector('.e-active-cell')).toBeNull();
                        expect(selectAll.querySelectorAll('.e-multi-range').length).toBe(0);
                        expect(colHdr.querySelectorAll('.e-multi-range').length).toBe(0);
                        expect(rowHdr.querySelectorAll('.e-multi-range').length).toBe(0);
                        expect(content.querySelectorAll('.e-multi-range').length).toBe(0);
                        expect(content.querySelector('.e-selection').classList.contains('e-hide')).toBeTruthy();
                        done();
                    });
                });
            });
            it('SF-402213 => Multirange column selection and scrolling', (done: Function) => {
                helper.invoke('selectRange', ['B1:B100 C1:C100 D1:D100 E1:E100 A3:CV3']);
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    const sheet: SheetModel = spreadsheet.sheets[0];
                    expect(sheet.selectedRange).toBe('B1:B100 C1:C100 D1:D100 E1:E100 A3:CV3');
                    const sheetPanel: HTMLElement = document.getElementById(`${helper.id}_sheet_panel`);
                    expect(sheetPanel.getElementsByClassName('e-selection').length).toBe(10);
                    helper.invoke('getScrollElement').scrollLeft = 4953;
                    spreadsheet.notify(onContentScroll, { scrollTop: 0, scrollLeft: 4953 });
                    setTimeout(() => {
                        //expect(sheet.selectedRange.includes('A3:CV3')).toBeFalsy();
                        expect(sheetPanel.getElementsByClassName('e-selection').length).toBe(10);
                        done();
                    });
                });
            });
        });
        describe('I300950 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rowCount: 10, colCount: 7 }], scrollSettings: { isFinite: true } }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selection issue while moving the selection to active cell on double clicking the formula bar', (done: Function) => {
                helper.invoke('goTo', ['F5']); // While double click in formula bar, the goTo method will invoked in source.
                expect(helper.getElement('#' + helper.id + ' .e-scroller').scrollLeft).toBe(0);
                done();
            });
        });
        describe('EJ2-52984->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'Romona Heaslip\nHi\noy\nhello' }] }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it(' setRowHeight is not working properly for data with \n->', (done: Function) => {
                helper.invoke('setRowHeight', [20]);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].height).toBe(20);
                    expect(helper.getElement().querySelector('.e-active-cell').style.height).toBe('20px');
                    done();
                }, 20);
            });
        });
        describe('EJ2-51718->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'OrderID' }, { value: 'RequiredStartDate' }, { value: 'RequiredStartTime' }, { value: 'RequiredFinishDate' }, { value: 'RequiredFinishTime' },{ value: 'planningNotes' }] },
                    { cells: [{ value: '10250' }, { value: '15/02/1998' }, { value: '2/20/2020' }, { value: '25/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] },
                    { cells: [{ value: '10251' }, { value: '16/02/1998' }, { value: '10/10/2010' }, { value: '30/02/1998' }, { value: '1:10:00 PM' },{ value: '' }] },
                    { cells: [{ value: '10252' }, { value: '17/02/1998' }, { value: '10/10/2010' }, { value: '20/02/1998' }, { value: '1:10:00 PM' },{ value: '' }] },
                    { cells: [{ value: '10253' }, { value: '18/02/1998' }, { value: '10/10/2010' }, { value: '23/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] },
                    { cells: [{ value: '10254' }, { value: '19/02/1998' }, { value: '10/10/2010' }, { value: '24/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to fix row header misalignment issue and row height issue during scrolling->', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'or', operator: 'equal', value: '10250' }], 'A1:E1']);
                setTimeout(() => {
                    helper.invoke('goTo', ['A100']);
                    setTimeout(() => {
                        helper.invoke('goTo', ['A1']);
                        setTimeout(() => {
                            let cellEle: HTMLElement = helper.getElements('.e-active-cell')[0];
                            let selectionEle: HTMLElement = helper.getElements('.e-selection')[0];
                            expect(cellEle.style.height).toEqual(selectionEle.style.height);
                            done();
                        });
                    });
                });
            });
        });
        describe('Range selection issue in protect sheet locked cell ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rowCount: 50, colCount: 50 }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('In protect sheet check the select range is working on locked cell', (done: Function) => {
                helper.invoke('lockCells', ['D1:E11', false]);
                helper.switchRibbonTab(4);
                helper.click('#' + helper.id + '_protect');
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    const sheet: SheetModel = spreadsheet.sheets[0];
                    helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                    (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                    helper.click('.e-protect-dlg .e-primary');
                    helper.invoke('selectRange', ['D1:D11 E1:E11 F1:F11']);
                    expect(sheet.selectedRange).toBe('D1:D11 E1:E11');
                    done();
                })
            });
            it('In protect sheet the check select range is working contain both locked and unlocked cell', (done: Function) => {
                helper.invoke('lockCells', ['A1:B100', false]);
                helper.invoke('lockCells', ['C1:C100', true]);
                helper.invoke('lockCells', ['D1:D100', false]);
                helper.switchRibbonTab(4);
                helper.click('#' + helper.id + '_protect');
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    const sheet: SheetModel = spreadsheet.sheets[0];
                    helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                    (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                    helper.click('.e-protect-dlg .e-primary');
                    helper.invoke('selectRange', ['A1:D11']);
                    expect(sheet.selectedRange).toBe('A1:D11');
                    done();
                })
            });
            it('In protect sheet check the Shift+arrowkey selection is working on locked cell', (done: Function) => {
                helper.invoke('lockCells', ['A1:Z1', false]);
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.switchRibbonTab(4);
                helper.click('#' + helper.id + '_protect');
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    const sheet: SheetModel = spreadsheet.sheets[0];
                    helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                    (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                    helper.click('.e-protect-dlg .e-primary');
                    helper.getElement().focus();
                    helper.triggerKeyEvent('keydown', 39, null, null, true, helper.invoke('getCell', [0, 0]));
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:B1');
                        helper.triggerKeyEvent('keydown', 40, null, null, true, helper.invoke('getCell', [0, 1]));
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].selectedRange).toBe('A1:B1');
                            done();
                        });
                    })
                })
            });
        });

        describe('EJ2-946612->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] , frozenRows: 3, frozenColumns: 3, activeCell: 'D100'}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Column selection does not work properly after vertical scrolling in a sheet with frozen rows ->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let verticalContent: Element = spreadsheet.getMainContent().parentElement;
                expect(verticalContent.scrollTop).toBe(0);
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                helper.invoke('goTo', ['D100']);
                setTimeout((): void => {
                    const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent');
                    let headerCell: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[0];
                    let offset: DOMRect = headerCell.getBoundingClientRect() as DOMRect;
                    expect(spreadsheet.sheets[0].selectedRange).toBe('D100:D100');
                    verticalContent = spreadsheet.getMainContent().parentElement;
                    expect(verticalContent.scrollTop).toBe(1920);
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 1 }, null, headerCell);
                    setTimeout((): void => {
                        headerCell = helper.invoke('getColHeaderTable').rows[0].cells[2];
                        offset = headerCell.getBoundingClientRect() as DOMRect;
                        helper.getInstance().selectionModule.mouseMoveHandler({ target: headerCell, clientX: offset.left + 1, clientY: offset.top + 1 });
                        helper.triggerMouseAction('mouseup', { x: offset.left + 10, y: offset.top + 5, offsetX: 10 }, document, colHdrPanel);
                        setTimeout((): void => {
                            //expect(spreadsheet.sheets[0].selectedRange).toBe('D1:F132');
                            expect(verticalContent.scrollTop).toBe(1920);
                            done();
                        });
                    });
                });
            });
        });
    });
    describe('EJ2-958789 -> Script error occurs when performing autofill outside the viewport', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Script error should not occurs when performing autofill outside the viewport', (done: Function) => {
            helper.invoke('selectRange', ['G8']);
            expect(helper.getInstance().sheets[0].rows[7].cells[6].value).toBe(3);
            const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
            const startCell = helper.invoke('getCell', [7, 6]);
            const startCoords = startCell.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: startCoords.right + 1, y: startCoords.bottom + 1 }, null, autoFill);
            helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: startCoords.right + 1, clientY: startCoords.bottom + 1200 });
            helper.triggerMouseAction('mouseup', { x: startCoords.right + 1, y: startCoords.bottom + 1200 }, document, autoFill);
            setTimeout(() => {
                const finalValue = helper.getInstance().sheets[0].rows[67].cells[6].value;
                expect(finalValue).toBe(63);
                done();
            });
        });
    });
    describe('Spreadsheet Ctrl+Click with Single Mode', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                selectionSettings: { mode: 'Single' },
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }],
                        selectedRange: 'A1'
                    }
                ]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('should deselect previous and select only the clicked cell using Ctrl+Click in Single mode', (done: Function): void => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.selectionSettings.mode).toBe('Single');
            helper.invoke('selectRange', ['A1']);
            expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
            const cell: HTMLElement = helper.invoke('getCell', [0, 2]);
            const rect: ClientRect = cell.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: rect.left + 2, y: rect.top + 2 }, null, cell, true);
            helper.triggerMouseAction('mouseup', { x: rect.left + 2, y: rect.top + 2 }, document, cell, true);
            setTimeout((): void => {
                const selEle: HTMLElement = helper.getElementFromSpreadsheet('.e-selection');
                expect(selEle).not.toBeNull();
                expect(spreadsheet.sheets[0].selectedRange).toBe('C1:C1');
                expect(spreadsheet.sheets[0].activeCell).toBe('C1');
                const actEle: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
                const autoEle: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                expect(actEle.style.height).toBe('20px');
                checkPosition(actEle, ['0px', '127px', '20px', '65px']);
                expect(autoEle.classList).not.toContain('e-hide');
                expect(selEle.classList).toContain('e-hide');
                const colHeaders: NodeListOf<HTMLElement> = helper.getColHeaderElement().querySelectorAll('.e-header-cell');
                const rowHeader: HTMLElement = helper.getRowHeaderElement().querySelectorAll('tr')[0].children[0] as HTMLElement;
                expect(colHeaders[1].classList).toContain('e-prev-highlight');
                expect(colHeaders[2].classList).toContain('e-highlight');
                expect(rowHeader.classList).toContain('e-highlight');
                done();
            }, 50);
        });
    });     
});
