import { Spreadsheet, setCellFormat } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';

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
                checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['39px', '127px', '21px', '65px'], true);
                checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['39px', '127px', '141px', '321px'], true);
                done();
            });
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

    describe('CR-Issues ->', () => {
        describe('I316931, I31444 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ index: 2, cells: [{ value: 'Welcome to Spreadsheet!!!', wrap: true }] }], selectedRange: 'D4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selected cells misaligned from grid lines', (done: Function) => {
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
                        }, 10);
                    }, 10);
                });
            });
        });
        describe('I300950 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ index: 1, cells: [{ value: 'foo bar foo bar \r\n foo bar foo bar' }] }] }] }, done);
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
                });
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
        describe('I308987, F162287 ->', () => {
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
        });
    });
});