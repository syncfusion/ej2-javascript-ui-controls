import { getRangeAddress, Spreadsheet } from "../../../src/index";
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Spreadsheet cell navigation module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('Keyboard Navigations-I ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Sheet rename cancel by Space Button', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            helper.triggerKeyNativeEvent(32, false, false, helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename'));
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename')).not.toBeNull();
            done();
        });
        it('Ctrl + Shift + Home Button with Vertical Scrolling', (done: Function) => {
            helper.invoke('goTo', ['H80']);
            setTimeout(() => {
                helper.invoke('selectRange', ['H100']);
                helper.triggerKeyNativeEvent(36, true, true);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H100:A1');
                    done();
                }, 20);
            });
        });
        it('Ctrl + Shift + Home Button with Horizontal Scrolling', (done: Function) => {
            helper.invoke('goTo', ['AG5']);
            setTimeout(() => {
                helper.invoke('selectRange', ['AI5']);
                helper.triggerKeyNativeEvent(36, true, true);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('AI5:A1');
                    done(); 
                }, 20);
            });
        });
        it('Home Button', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(36);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A5');
                done();
            }, 20);
        });
        it('Ctrl + Home Button', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(36, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            }, 20);
        });
        it('Ctrl + End Button', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            helper.triggerKeyNativeEvent(35, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H11:H11');
                done();
            }, 20);
        });
        it('Shift + Space Button for Row Selection', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            helper.triggerKeyNativeEvent(32, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:CY5');
                done();
            });
        });
        it('Ctrl + Space Button for Column Selection', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            helper.triggerKeyNativeEvent(32, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C1:C105');
                done();
            });
        });
        it('Ctrl + Shift + Down Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.triggerKeyNativeEvent(40, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H1:H11');
                done();
            });
        });
        it('Ctrl + Shift + Right Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.triggerKeyNativeEvent(39, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:H5');
                done();
            });
        });
        it('Ctrl + Shift + Up Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['C11']);
            helper.triggerKeyNativeEvent(38, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C11:C1');
                done();
            });
        });
        it('Ctrl + Shift + Left Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(37, true, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:A5');
                done();
            });
        });
        it('Ctrl + Down Arrow Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.triggerKeyNativeEvent(40, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H11:H11');
                done();
            }, 20);
        });
        it('Ctrl + Right Arrow Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.triggerKeyNativeEvent(39, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:H5');
                done();
            }, 20);
        });
        it('Ctrl + Up Arrow Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['C11']);
            helper.triggerKeyNativeEvent(38, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C1:C1');
                done();
            }, 20);
        });
        it('Ctrl + Left Arrow Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(37, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A5');
                done();
            }, 20);
        });
        it('Ctrl + Down Arrow Button with scrolling for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            helper.triggerKeyNativeEvent(40, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H100:H100');
                done();
            }, 20);
        });
        it('Ctrl + Right Arrow Button with scrolling for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            helper.triggerKeyNativeEvent(39, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('CV11:CV11');
                done();
            }, 20);
        });

        it('Ctrl + Down Arrow Button with empty cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H10']);
            helper.triggerKeyNativeEvent(46);
            helper.triggerKeyNativeEvent(40, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H11:H11');
                done();
            }, 20);
        });
        it('Ctrl + Up Arrow Button with empty cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H10']);
            helper.triggerKeyNativeEvent(38, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H9:H9');
                done();
            }, 20);
        });
        it('Ctrl + Left Arrow Button with empty cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H10']);
            helper.triggerKeyNativeEvent(37, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('G10:G10');
                done();
            }, 20);
        });
        it('Ctrl + Right Arrow Button with empty cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['F10']);
            helper.triggerKeyNativeEvent(46);
            helper.triggerKeyNativeEvent(39, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('G10:G10');
                done();
            }, 20);
        });
        it('Shift + Up Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A1');
                done();
            }, 20);
        });
        it('Shift + Up Arrow Button in TopLeft Cell for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            }, 20);
        });
        it('Shift + Up Arrow Button in Merged Cell for Selection', (done: Function) => {
            helper.invoke('merge', ['E5:E6']);
            helper.invoke('selectRange', ['E5']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('E6:E4');
                done();
            }, 20);
        });
        it('Shift + Down Arrow Button in Merged Cell for Selection', (done: Function) => {
            helper.invoke('selectRange', ['F6:F5']);
            helper.invoke('merge', ['F6:F5']);
            helper.triggerKeyNativeEvent(40, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('F5:F7');
                done();
            }, 20);
        });
        it('Shift + Right Arrow Button with Merged cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['D7:C7']);
            helper.invoke('merge', ['D7:C7']);  
            helper.triggerKeyNativeEvent(39, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C7:E7');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['B5']);
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B5:A5');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button in First Column Left Cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A5');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button with Merged cell for Navigation', (done: Function) => {
            helper.invoke('merge', ['C8:D8']);
            helper.invoke('selectRange', ['C8']);
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D8:B8');
                done();
            }, 20);
        });
        it('Left Arrow Button in TopLeftCell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Shift + Enter Button in TopLeftCell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(13, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Shift + Enter Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(13, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            }, 20);
        });
        it('Tab key with Column Merged cell for Navigation', (done: Function) => {
            helper.invoke('merge', ['A3:B3']);
            helper.invoke('selectRange', ['A3']);
            helper.triggerKeyNativeEvent(9);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:C3');
                done();
            }, 10);
        });
        it('Down arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('hideRow', [2]);
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A4:A4');
                done();
            }, 10);
        });
        it('Shift + Down arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(40, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:B4');
                done();
            }, 10);
        });
        it('Up arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                done();
            }, 20);
        });
        it('Shift + Up arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B4:A2');
                done();
            }, 20);
        });
        it('Up arrow Button with Hidden Row in Top Most Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.invoke('hideRow', [0]);
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                done();
            }, 10);
        });
        it('Right arrow Button with Hidden Column for Navigation', (done: Function) => {
            helper.invoke('hideColumn', [2]);
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
                done();
            }, 10);
        });
        it('Left arrow Button with Hidden Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 20);
        });
        it('Left arrow Button with Hidden Column in Top Most Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.invoke('hideColumn', [0]);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Page Down Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(34);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A27:A27');
                done();
            }, 50);
        });
        it('Page Up Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(33);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            }, 10);
        });

        it('Shift + Page Up Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(33, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            }, 10);
        });
        it('Shift + Page Down Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(34, false, true);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A31');
                done();
            }, 50);
        });
    });

    describe('Keyboard Navigation with Locked and Unlocked cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], 
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.protectSheet(
                        'Sheet1', { selectCells: true, selectUnLockedCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        
        it('Right arrow Button in Last used column Cell for Navigation', (done: Function) => {
            helper.invoke('lockCells', ['B2:D5', false]);
            helper.invoke('selectRange', ['H11']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Right arrow Button in Last used Row Cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A11']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Right arrow Button in next to Last used Row Cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A12']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Left arrow Button Last used column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H1']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D5:D5');
                done();
            }, 10);
        });
        it('Down arrow Button in Last used Range Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Down arrow Button in Next to Last used Range Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Up arrow Button in Next to Last used Range Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A11']);
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D5:D5');
                done();
            }, 10);
        });
    });

    describe('CR-Issues ->', () => {
        describe('F164825 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ allowScrolling: false }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Cell navigation does not work without scrolling', (done: Function) => {
                helper.getElement().focus();
                helper.triggerKeyNativeEvent(39);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
                helper.triggerKeyNativeEvent(40);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                helper.triggerKeyNativeEvent(37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                helper.triggerKeyNativeEvent(38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });

        describe('I348582, EJ2-60424 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ isProtected: true, protectSettings: { selectCells: true } }] }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Shift selection on whole row makes scroll right even it is in viewport', (done: Function) => {
                helper.invoke('selectRange', [getRangeAddress([4, 0, 4, helper.getInstance().sheets[0].colCount - 1])]);
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 40, null, false, true);
                expect(helper.getContentElement().parentElement.scrollLeft).toBe(0);
                done();
            });

            it('Pressing left/up key on 0th column/row throws script error on protected sheet', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.triggerKeyEvent('keydown', 37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                helper.triggerKeyEvent('keydown', 38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        describe('SF-360092 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ index: 3, value: '20', validation: { ignoreBlank: true, inCellDropDown: true,
                        operator: 'Between', type: 'List', value1: '10,20,30', value2: '' } }] }], selectedRange: 'D1:D1' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell navigation occurs while selecting cell template dropdown items', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(cell.firstElementChild.classList.contains('e-validation-list')).toBeTruthy();
                const ddl: HTMLElement = cell.getElementsByClassName('e-ddl')[0] as HTMLElement;
                ddl.focus();
                helper.getInstance('#' + helper.id + 'listValid').showPopup();
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.triggerKeyEvent('keydown', 40, null, false, true, ddl);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.getElement('#' + helper.id + 'listValid_popup .e-list-item').click();
                expect(document.activeElement.classList.contains('e-spreadsheet')).toBeTruthy();
                done();
            });
        });

        describe('EJ2-59225 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rowCount: 3, colCount: 3, selectedRange: 'B2:C3' }], scrollSettings: { isFinite: true } }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The spreadsheet selection moves away from the spreadsheet table when we move it with the keyboard', (done: Function) => {
                const selectionEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-selection');
                const autofillEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-autofill');
                const table: HTMLElement = helper.invoke('getContentTable');
                const height: number = table.offsetHeight; const width: number = table.offsetWidth;
                const instance: any = helper.getInstance();
                const checkFn: Function = (): void => {
                    expect(instance.sheets[0].selectedRange).toBe('B2:C3');
                    expect(parseInt(selectionEle.style.height, 10)).toBeLessThan(height);
                    expect(parseInt(autofillEle.style.top, 10)).toBeLessThan(height);
                    expect(parseInt(selectionEle.style.width, 10)).toBeLessThan(width);
                    expect(parseInt(autofillEle.style.left, 10)).toBeLessThan(width);
                };
                checkFn()
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, true);
                setTimeout(() => {
                    checkFn();
                    helper.triggerKeyEvent('keydown', 40, null, false, true);
                    setTimeout(() => {
                        checkFn();
                        done();
                    });
                });
            });
        });
        describe('EJ2-59905 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rowCount: 10, colCount: 26, selectedRange: 'A10:A10', rows: [{ index: 4, hidden: true }, { index: 5, hidden: true }, { index: 6, hidden: true }] }], height: 300, scrollSettings: { isFinite: true }} , done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Keyboard selection issue in finite mode', (done: Function) => {
                const instance: any = helper.getInstance();
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, false);
                setTimeout(() => {
                    expect(instance.sheets[0].selectedRange).toBe('B10:B10');
                    done();
                }, 50);
            });
        });
    });
    describe('EJ2-60990 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ showHeaders: false ,rowCount: 5 , selectedRange: 'C4:C4'}], scrollSettings: { isFinite: true } }, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('When showheader is false and in finite mode, Keyboard navigation is not working - bottom', (done: Function) => {
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C5:C5');
                done();
            }, 50);
        });
        it('When showheader is false and in finite mode, Keyboard navigation is not working - right', (done: Function) => {
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C4:C4');
                done();
            }, 50);
        });
    });
});
